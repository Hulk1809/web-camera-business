package com.progear.commerce;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;
import java.util.TreeMap;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.simple.JdbcClient;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
public class CommerceService {
    private static final Set<String> ONLINE_PAYMENT_METHODS = Set.of("COD", "BANK_TRANSFER");
    private static final Set<String> POS_PAYMENT_METHODS = Set.of("CASH", "CARD", "BANK_TRANSFER");
    private static final Set<String> ORDER_STATUSES = Set.of("PENDING_PAYMENT", "CONFIRMED", "COMPLETED", "CANCELLED");
    private static final Set<String> PAYMENT_STATUSES = Set.of("PENDING", "PAID", "REFUNDED");
    private static final Set<String> ROLES = Set.of("ROLE_CUSTOMER", "ROLE_STAFF", "ROLE_ADMIN");

    private final JdbcClient jdbc;
    private final PasswordEncoder passwordEncoder;

    public CommerceService(JdbcClient jdbc, PasswordEncoder passwordEncoder) {
        this.jdbc = jdbc;
        this.passwordEncoder = passwordEncoder;
    }

    public record AppUser(long id, String email, String fullName, String address, String role, boolean enabled) {}

    public record ProductSnapshot(long id, String name, String sku, BigDecimal price, int stock,
                                  long categoryId, long brandId, String description, boolean visible,
                                  String categoryName, String brandName) {}

    public record OrderSummary(long id, Long userId, String userEmail, String idempotencyKey,
                               String channel, String paymentMethod, String paymentStatus,
                               String status, String shippingAddress, BigDecimal totalAmount,
                               boolean stockRestored, Instant createdAt) {}

    public record OrderItemRow(long id, long orderId, long productId, String productName,
                               String sku, BigDecimal unitPrice, int quantity) {}

    public record OrderDetail(OrderSummary order, List<OrderItemRow> items, List<String> serials) {}

    public record CategoryRow(long id, String name, boolean visible) {}

    public record BrandRow(long id, String name, boolean visible) {}

    public record SerialRow(long id, long productId, String sku, String productName,
                            String serialNumber, String status, Long orderId, LocalDate warrantyUntil) {}

    public record AuditRow(long id, String actor, String action, String targetType,
                           String targetId, String details, Instant createdAt) {}

    public Optional<AppUser> findUserByEmail(String email) {
        if (email == null || email.isBlank()) return Optional.empty();
        return jdbc.sql("""
                        SELECT id, email, full_name AS fullName, address, role, enabled
                        FROM app_user
                        WHERE lower(email) = lower(btrim(:email))
                        """)
                .param("email", email)
                .query(AppUser.class)
                .optional();
    }

    public AppUser requireUser(String email) {
        return findUserByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Chưa đăng nhập"));
    }

    @Transactional
    public AppUser registerCustomer(String email, String password, String fullName, String address) {
        if (email == null || email.isBlank() || !email.contains("@")
                || password == null || password.length() < 6
                || fullName == null || fullName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thông tin đăng ký không hợp lệ");
        }
        String cleanEmail = email.trim().toLowerCase();
        if (findUserByEmail(cleanEmail).isPresent()) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email đã được đăng ký");
        }
        String cleanName = fullName.trim();
        String cleanAddr = address == null ? "" : address.trim();
        long id = jdbc.sql("""
                        INSERT INTO app_user (email, password_hash, full_name, address, role, enabled)
                        VALUES (:email, :hash, :name, :addr, 'ROLE_CUSTOMER', true)
                        RETURNING id
                        """)
                .param("email", cleanEmail)
                .param("hash", passwordEncoder.encode(password))
                .param("name", cleanName)
                .param("addr", cleanAddr)
                .query(Long.class)
                .single();
        writeAudit(cleanEmail, "USER_REGISTER", "USER", String.valueOf(id), "Registered customer " + cleanEmail);
        return new AppUser(id, cleanEmail, cleanName, cleanAddr, "ROLE_CUSTOMER", true);
    }

    @Transactional
    public void updateProfile(String email, String fullName, String address) {
        AppUser user = requireUser(email);
        if (fullName == null || fullName.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Họ tên không được để trống");
        }
        jdbc.sql("UPDATE app_user SET full_name = :name, address = :addr WHERE id = :id")
                .param("name", fullName.trim())
                .param("addr", address == null ? "" : address.trim())
                .param("id", user.id())
                .update();
        writeAudit(user.email(), "USER_PROFILE_UPDATE", "USER", String.valueOf(user.id()), "Updated profile");
    }

    public Optional<ProductSnapshot> findVisibleProduct(long id) {
        return jdbc.sql("""
                        SELECT p.id, p.name, p.sku, p.price, p.stock,
                               p.category_id AS categoryId, p.brand_id AS brandId,
                               p.description, p.visible,
                               c.name AS categoryName, b.name AS brandName
                        FROM product p
                        JOIN category c ON c.id = p.category_id
                        JOIN brand b ON b.id = p.brand_id
                        WHERE p.id = :id AND p.visible AND c.visible AND b.visible
                        """)
                .param("id", id)
                .query(ProductSnapshot.class)
                .optional();
    }

    @Transactional
    public long checkout(String userEmail, Map<Long, Integer> cartItems,
                         String idempotencyKey, String paymentMethod, String shippingAddress) {
        AppUser user = requireUser(userEmail);
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu Idempotency-Key");
        }
        String cleanKey = idempotencyKey.trim();

        var existing = jdbc.sql("""
                        SELECT id, user_id
                        FROM customer_order
                        WHERE idempotency_key = :key
                        """)
                .param("key", cleanKey)
                .query((rs, rowNum) -> Map.entry(rs.getLong("id"), rs.getLong("user_id")))
                .optional();
        if (existing.isPresent()) {
            if (existing.get().getValue() == user.id()) {
                return existing.get().getKey();
            }
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Idempotency-Key đã được sử dụng");
        }

        String method = paymentMethod == null ? "COD" : paymentMethod.trim().toUpperCase();
        if (!ONLINE_PAYMENT_METHODS.contains(method)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán không hợp lệ");
        }
        if (cartItems == null || cartItems.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Giỏ hàng trống");
        }
        String addr = (shippingAddress == null || shippingAddress.isBlank()) ? user.address() : shippingAddress.trim();
        if (addr == null || addr.isBlank()) {
            addr = "Nhận tại cửa hàng ProGear";
        }

        Map<Long, Integer> sortedCart = new TreeMap<>(cartItems);
        BigDecimal total = BigDecimal.ZERO;
        var snapshots = new java.util.ArrayList<Map.Entry<ProductSnapshot, Integer>>();

        for (var entry : sortedCart.entrySet()) {
            long productId = entry.getKey();
            int qty = entry.getValue() == null ? 0 : entry.getValue();
            if (qty <= 0) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng không hợp lệ");
            }
            ProductSnapshot prod = findVisibleProduct(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm không khả dụng"));
            int updated = jdbc.sql("""
                            UPDATE product
                            SET stock = stock - :qty
                            WHERE id = :id AND visible AND stock >= :qty
                            """)
                    .param("qty", qty)
                    .param("id", productId)
                    .update();
            if (updated == 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm " + prod.sku() + " không đủ tồn kho");
            }
            total = total.add(prod.price().multiply(BigDecimal.valueOf(qty)));
            snapshots.add(Map.entry(prod, qty));
        }

        String status = "COD".equals(method) ? "CONFIRMED" : "PENDING_PAYMENT";
        long orderId = jdbc.sql("""
                        INSERT INTO customer_order
                            (user_id, idempotency_key, channel, payment_method, payment_status, status, shipping_address, total_amount, stock_restored)
                        VALUES
                            (:userId, :key, 'ONLINE', :method, 'PENDING', :status, :addr, :total, FALSE)
                        RETURNING id
                        """)
                .param("userId", user.id())
                .param("key", cleanKey)
                .param("method", method)
                .param("status", status)
                .param("addr", addr)
                .param("total", total)
                .query(Long.class)
                .single();

        for (var item : snapshots) {
            ProductSnapshot prod = item.getKey();
            int qty = item.getValue();
            jdbc.sql("""
                            INSERT INTO order_item (order_id, product_id, product_name, sku, unit_price, quantity)
                            VALUES (:orderId, :productId, :name, :sku, :price, :qty)
                            """)
                    .param("orderId", orderId)
                    .param("productId", prod.id())
                    .param("name", prod.name())
                    .param("sku", prod.sku())
                    .param("price", prod.price())
                    .param("qty", qty)
                    .update();
        }

        writeAudit(user.email(), "ORDER_CHECKOUT", "ORDER", String.valueOf(orderId),
                "Online checkout total=" + total.toPlainString() + " method=" + method);
        return orderId;
    }

    public List<OrderSummary> listOrdersForUser(String email, boolean isAdminOrStaff) {
        AppUser user = requireUser(email);
        if (isAdminOrStaff) {
            return jdbc.sql("""
                            SELECT o.id, o.user_id AS userId, COALESCE(u.email, '') AS userEmail,
                                   o.idempotency_key AS idempotencyKey, o.channel,
                                   o.payment_method AS paymentMethod, o.payment_status AS paymentStatus,
                                   o.status, o.shipping_address AS shippingAddress,
                                   o.total_amount AS totalAmount, o.stock_restored AS stockRestored,
                                   o.created_at AS createdAt
                            FROM customer_order o
                            LEFT JOIN app_user u ON u.id = o.user_id
                            ORDER BY o.id DESC
                            """)
                    .query(OrderSummary.class)
                    .list();
        }
        return jdbc.sql("""
                        SELECT o.id, o.user_id AS userId, COALESCE(u.email, '') AS userEmail,
                               o.idempotency_key AS idempotencyKey, o.channel,
                               o.payment_method AS paymentMethod, o.payment_status AS paymentStatus,
                               o.status, o.shipping_address AS shippingAddress,
                               o.total_amount AS totalAmount, o.stock_restored AS stockRestored,
                               o.created_at AS createdAt
                        FROM customer_order o
                        LEFT JOIN app_user u ON u.id = o.user_id
                        WHERE o.user_id = :userId
                        ORDER BY o.id DESC
                        """)
                .param("userId", user.id())
                .query(OrderSummary.class)
                .list();
    }

    public OrderDetail getOrderForUser(long orderId, String email, boolean isAdminOrStaff) {
        AppUser user = requireUser(email);
        OrderSummary order = jdbc.sql("""
                        SELECT o.id, o.user_id AS userId, COALESCE(u.email, '') AS userEmail,
                               o.idempotency_key AS idempotencyKey, o.channel,
                               o.payment_method AS paymentMethod, o.payment_status AS paymentStatus,
                               o.status, o.shipping_address AS shippingAddress,
                               o.total_amount AS totalAmount, o.stock_restored AS stockRestored,
                               o.created_at AS createdAt
                        FROM customer_order o
                        LEFT JOIN app_user u ON u.id = o.user_id
                        WHERE o.id = :id
                        """)
                .param("id", orderId)
                .query(OrderSummary.class)
                .optional()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy đơn hàng"));

        if (!isAdminOrStaff && (order.userId() == null || order.userId() != user.id())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Không có quyền xem đơn hàng của người khác");
        }

        List<OrderItemRow> items = jdbc.sql("""
                        SELECT id, order_id AS orderId, product_id AS productId,
                               product_name AS productName, sku, unit_price AS unitPrice, quantity
                        FROM order_item
                        WHERE order_id = :orderId
                        ORDER BY id
                        """)
                .param("orderId", orderId)
                .query(OrderItemRow.class)
                .list();

        List<String> serials = jdbc.sql("""
                        SELECT serial_number FROM serial_unit WHERE order_id = :orderId ORDER BY id
                        """)
                .param("orderId", orderId)
                .query(String.class)
                .list();

        return new OrderDetail(order, items, serials);
    }

    @Transactional
    public void cancelOrder(long orderId, String email, boolean isAdminOrStaff) {
        OrderDetail detail = getOrderForUser(orderId, email, isAdminOrStaff);
        OrderSummary order = detail.order();
        if ("CANCELLED".equals(order.status()) && order.stockRestored()) {
            return;
        }
        if (!"PENDING_PAYMENT".equals(order.status()) && !"CONFIRMED".equals(order.status())) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Đơn hàng không thể hủy ở trạng thái " + order.status());
        }
        int updated = jdbc.sql("""
                        UPDATE customer_order
                        SET status = 'CANCELLED', stock_restored = TRUE
                        WHERE id = :id AND stock_restored = FALSE AND status IN ('PENDING_PAYMENT', 'CONFIRMED')
                        """)
                .param("id", orderId)
                .update();
        if (updated == 1) {
            for (OrderItemRow item : detail.items()) {
                jdbc.sql("UPDATE product SET stock = stock + :qty WHERE id = :pid")
                        .param("qty", item.quantity())
                        .param("pid", item.productId())
                        .update();
            }
            writeAudit(email, "ORDER_CANCEL_RESTORE_STOCK", "ORDER", String.valueOf(orderId),
                    "Cancelled order and restored stock once");
        }
    }

    @Transactional
    public long posCreateOrder(String staffEmail, String sku, int quantity,
                               String serialNumber, String paymentMethod, String idempotencyKey) {
        AppUser staff = requireUser(staffEmail);
        if (idempotencyKey == null || idempotencyKey.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thiếu Idempotency-Key");
        }
        String cleanKey = idempotencyKey.trim();
        var existing = jdbc.sql("SELECT id FROM customer_order WHERE idempotency_key = :key")
                .param("key", cleanKey)
                .query(Long.class)
                .optional();
        if (existing.isPresent()) {
            return existing.get();
        }

        if (sku == null || sku.isBlank() || quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "SKU hoặc số lượng không hợp lệ");
        }
        String method = paymentMethod == null ? "CASH" : paymentMethod.trim().toUpperCase();
        if (!POS_PAYMENT_METHODS.contains(method)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Phương thức thanh toán POS không hợp lệ");
        }

        ProductSnapshot prod = jdbc.sql("""
                        SELECT p.id, p.name, p.sku, p.price, p.stock,
                               p.category_id AS categoryId, p.brand_id AS brandId,
                               p.description, p.visible,
                               c.name AS categoryName, b.name AS brandName
                        FROM product p
                        JOIN category c ON c.id = p.category_id
                        JOIN brand b ON b.id = p.brand_id
                        WHERE UPPER(p.sku) = UPPER(btrim(:sku))
                        """)
                .param("sku", sku)
                .query(ProductSnapshot.class)
                .optional()
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Không tìm thấy SKU: " + sku));

        int updated = jdbc.sql("""
                        UPDATE product
                        SET stock = stock - :qty
                        WHERE id = :id AND stock >= :qty
                        """)
                .param("qty", quantity)
                .param("id", prod.id())
                .update();
        if (updated == 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Không đủ tồn kho cho SKU " + prod.sku());
        }

        BigDecimal total = prod.price().multiply(BigDecimal.valueOf(quantity));
        long orderId = jdbc.sql("""
                        INSERT INTO customer_order
                            (user_id, idempotency_key, channel, payment_method, payment_status, status, shipping_address, total_amount, stock_restored)
                        VALUES
                            (:userId, :key, 'POS', :method, 'PAID', 'COMPLETED', 'Bán trực tiếp tại quầy POS', :total, FALSE)
                        RETURNING id
                        """)
                .param("userId", staff.id())
                .param("key", cleanKey)
                .param("method", method)
                .param("total", total)
                .query(Long.class)
                .single();

        jdbc.sql("""
                        INSERT INTO order_item (order_id, product_id, product_name, sku, unit_price, quantity)
                        VALUES (:orderId, :productId, :name, :sku, :price, :qty)
                        """)
                .param("orderId", orderId)
                .param("productId", prod.id())
                .param("name", prod.name())
                .param("sku", prod.sku())
                .param("price", prod.price())
                .param("qty", quantity)
                .update();

        if (serialNumber != null && !serialNumber.isBlank()) {
            int snUpdated = jdbc.sql("""
                            UPDATE serial_unit
                            SET status = 'SOLD', order_id = :orderId, warranty_until = CURRENT_DATE + 365
                            WHERE UPPER(serial_number) = UPPER(btrim(:sn))
                              AND product_id = :pid
                              AND status = 'IN_STOCK'
                            """)
                    .param("orderId", orderId)
                    .param("sn", serialNumber.trim())
                    .param("pid", prod.id())
                    .update();
            if (snUpdated == 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Serial không hợp lệ hoặc đã bán: " + serialNumber);
            }
        }

        writeAudit(staff.email(), "POS_SALE", "ORDER", String.valueOf(orderId),
                "POS sale sku=" + prod.sku() + " qty=" + quantity + " serial=" + (serialNumber == null ? "" : serialNumber.trim()));
        return orderId;
    }

    @Transactional
    public long saveCategory(String actor, Long id, String name, boolean visible) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên danh mục không hợp lệ");
        }
        String cleanName = name.trim();
        long targetId;
        if (id != null && id > 0) {
            jdbc.sql("UPDATE category SET name = :name, visible = :visible WHERE id = :id")
                    .param("name", cleanName).param("visible", visible).param("id", id).update();
            targetId = id;
        } else {
            targetId = jdbc.sql("INSERT INTO category (name, visible) VALUES (:name, :visible) RETURNING id")
                    .param("name", cleanName).param("visible", visible).query(Long.class).single();
        }
        writeAudit(actor, "CATEGORY_UPSERT", "CATEGORY", String.valueOf(targetId), cleanName + " visible=" + visible);
        return targetId;
    }

    @Transactional
    public long saveBrand(String actor, Long id, String name, boolean visible) {
        if (name == null || name.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Tên thương hiệu không hợp lệ");
        }
        String cleanName = name.trim();
        long targetId;
        if (id != null && id > 0) {
            jdbc.sql("UPDATE brand SET name = :name, visible = :visible WHERE id = :id")
                    .param("name", cleanName).param("visible", visible).param("id", id).update();
            targetId = id;
        } else {
            targetId = jdbc.sql("INSERT INTO brand (name, visible) VALUES (:name, :visible) RETURNING id")
                    .param("name", cleanName).param("visible", visible).query(Long.class).single();
        }
        writeAudit(actor, "BRAND_UPSERT", "BRAND", String.valueOf(targetId), cleanName + " visible=" + visible);
        return targetId;
    }

    @Transactional
    public long saveProduct(String actor, Long id, long categoryId, long brandId,
                            String name, String sku, BigDecimal price, int stock,
                            String description, boolean visible) {
        if (name == null || name.isBlank() || sku == null || sku.isBlank()
                || price == null || price.compareTo(BigDecimal.ZERO) < 0 || stock < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Thông tin sản phẩm không hợp lệ");
        }
        String cleanName = name.trim();
        String cleanSku = sku.trim();
        String cleanDesc = description == null ? "" : description.trim();
        long targetId;
        if (id != null && id > 0) {
            jdbc.sql("""
                            UPDATE product
                            SET category_id = :cid, brand_id = :bid, name = :name, sku = :sku,
                                price = :price, stock = :stock, description = :desc, visible = :visible
                            WHERE id = :id
                            """)
                    .param("cid", categoryId)
                    .param("bid", brandId)
                    .param("name", cleanName)
                    .param("sku", cleanSku)
                    .param("price", price)
                    .param("stock", stock)
                    .param("desc", cleanDesc)
                    .param("visible", visible)
                    .param("id", id)
                    .update();
            targetId = id;
        } else {
            targetId = jdbc.sql("""
                            INSERT INTO product (category_id, brand_id, name, sku, price, stock, description, visible)
                            VALUES (:cid, :bid, :name, :sku, :price, :stock, :desc, :visible)
                            RETURNING id
                            """)
                    .param("cid", categoryId)
                    .param("bid", brandId)
                    .param("name", cleanName)
                    .param("sku", cleanSku)
                    .param("price", price)
                    .param("stock", stock)
                    .param("desc", cleanDesc)
                    .param("visible", visible)
                    .query(Long.class)
                    .single();
        }
        writeAudit(actor, "PRODUCT_UPSERT", "PRODUCT", String.valueOf(targetId),
                "sku=" + cleanSku + " price=" + price.toPlainString() + " stock=" + stock + " visible=" + visible);
        return targetId;
    }

    @Transactional
    public long addSerial(String actor, long productId, String serialNumber) {
        if (serialNumber == null || serialNumber.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số Serial không được để trống");
        }
        String cleanSn = serialNumber.trim().toUpperCase();
        long id = jdbc.sql("""
                        INSERT INTO serial_unit (product_id, serial_number, status)
                        VALUES (:pid, :sn, 'IN_STOCK')
                        RETURNING id
                        """)
                .param("pid", productId)
                .param("sn", cleanSn)
                .query(Long.class)
                .single();
        writeAudit(actor, "SERIAL_ADD", "SERIAL", cleanSn, "Added serial for product " + productId);
        return id;
    }

    @Transactional
    public void adminUpdateOrder(String actor, long orderId, String status, String paymentStatus) {
        if (status == null || !ORDER_STATUSES.contains(status)
                || paymentStatus == null || !PAYMENT_STATUSES.contains(paymentStatus)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Trạng thái không hợp lệ");
        }
        if ("CANCELLED".equals(status)) {
            int restored = jdbc.sql("""
                            UPDATE customer_order
                            SET status = 'CANCELLED', payment_status = :pstatus, stock_restored = TRUE
                            WHERE id = :id AND stock_restored = FALSE
                            """)
                    .param("pstatus", paymentStatus)
                    .param("id", orderId)
                    .update();
            if (restored == 1) {
                var items = jdbc.sql("SELECT product_id, quantity FROM order_item WHERE order_id = :id")
                        .param("id", orderId)
                        .query((rs, r) -> Map.entry(rs.getLong("product_id"), rs.getInt("quantity")))
                        .list();
                for (var item : items) {
                    jdbc.sql("UPDATE product SET stock = stock + :qty WHERE id = :pid")
                            .param("qty", item.getValue())
                            .param("pid", item.getKey())
                            .update();
                }
            } else {
                jdbc.sql("UPDATE customer_order SET status = 'CANCELLED', payment_status = :pstatus WHERE id = :id")
                        .param("pstatus", paymentStatus)
                        .param("id", orderId)
                        .update();
            }
        } else {
            jdbc.sql("UPDATE customer_order SET status = :status, payment_status = :pstatus WHERE id = :id")
                    .param("status", status)
                    .param("pstatus", paymentStatus)
                    .param("id", orderId)
                    .update();
        }
        writeAudit(actor, "ADMIN_ORDER_UPDATE", "ORDER", String.valueOf(orderId),
                "status=" + status + " paymentStatus=" + paymentStatus);
    }

    @Transactional
    public void adminUpdateUserRole(String actor, long userId, String role) {
        if (role == null || !ROLES.contains(role)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Quyền không hợp lệ");
        }
        jdbc.sql("UPDATE app_user SET role = :role WHERE id = :id")
                .param("role", role)
                .param("id", userId)
                .update();
        writeAudit(actor, "ADMIN_USER_ROLE", "USER", String.valueOf(userId), "role=" + role);
    }

    public List<CategoryRow> listAllCategories() {
        return jdbc.sql("SELECT id, name, visible FROM category ORDER BY id").query(CategoryRow.class).list();
    }

    public List<BrandRow> listAllBrands() {
        return jdbc.sql("SELECT id, name, visible FROM brand ORDER BY id").query(BrandRow.class).list();
    }

    public List<ProductSnapshot> listAllProducts() {
        return jdbc.sql("""
                        SELECT p.id, p.name, p.sku, p.price, p.stock,
                               p.category_id AS categoryId, p.brand_id AS brandId,
                               p.description, p.visible,
                               c.name AS categoryName, b.name AS brandName
                        FROM product p
                        JOIN category c ON c.id = p.category_id
                        JOIN brand b ON b.id = p.brand_id
                        ORDER BY p.id
                        """)
                .query(ProductSnapshot.class)
                .list();
    }

    public List<SerialRow> listSerials() {
        return jdbc.sql("""
                        SELECT s.id, s.product_id AS productId, p.sku, p.name AS productName,
                               s.serial_number AS serialNumber, s.status, s.order_id AS orderId,
                               s.warranty_until AS warrantyUntil
                        FROM serial_unit s
                        JOIN product p ON p.id = s.product_id
                        ORDER BY s.id DESC
                        LIMIT 50
                        """)
                .query(SerialRow.class)
                .list();
    }

    public List<AppUser> listUsers() {
        return jdbc.sql("""
                        SELECT id, email, full_name AS fullName, address, role, enabled
                        FROM app_user
                        ORDER BY id
                        """)
                .query(AppUser.class)
                .list();
    }

    public List<AuditRow> listRecentAudits() {
        return jdbc.sql("""
                        SELECT id, actor, action, target_type AS targetType,
                               target_id AS targetId, details, created_at AS createdAt
                        FROM audit_log
                        ORDER BY id DESC
                        LIMIT 40
                        """)
                .query(AuditRow.class)
                .list();
    }

    public BigDecimal totalPaidRevenue() {
        return jdbc.sql("""
                        SELECT COALESCE(SUM(total_amount), 0)
                        FROM customer_order
                        WHERE status <> 'CANCELLED'
                        """)
                .query(BigDecimal.class)
                .single();
    }

    public void writeAudit(String actor, String action, String targetType, String targetId, String details) {
        jdbc.sql("""
                        INSERT INTO audit_log (actor, action, target_type, target_id, details)
                        VALUES (:actor, :action, :type, :id, :details)
                        """)
                .param("actor", actor == null ? "system" : actor)
                .param("action", action)
                .param("type", targetType)
                .param("id", targetId)
                .param("details", details == null ? "" : details)
                .update();
    }
}
