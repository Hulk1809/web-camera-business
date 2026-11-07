package com.progear.commerce;

import static com.progear.catalog.CatalogController.csrfInput;
import static com.progear.catalog.CatalogController.document;
import static com.progear.catalog.CatalogController.escape;
import static com.progear.catalog.CatalogController.formatVnd;

import java.math.BigDecimal;
import java.net.URI;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.UUID;

import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;

@Controller
@ResponseBody
public class CommerceController {
    private static final String CART_SESSION_KEY = "PROGEAR_CART";
    private final CommerceService service;

    public CommerceController(CommerceService service) {
        this.service = service;
    }

    @GetMapping(value = "/login", produces = MediaType.TEXT_HTML_VALUE)
    public String loginPage(@RequestParam(required = false) String error,
                            @RequestParam(required = false) String registered,
                            Authentication auth,
                            CsrfToken csrf) {
        var body = new StringBuilder("<div class=\"panel\" style=\"max-width:480px;margin:2rem auto\"><h1>Đăng nhập hệ thống</h1>");
        if (error != null) {
            body.append("<div class=\"alert alert-error\">Email hoặc mật khẩu không chính xác.</div>");
        }
        if (registered != null) {
            body.append("<div class=\"alert\">Đăng ký thành công! Vui lòng đăng nhập.</div>");
        }
        body.append("""
                <form method="post" action="/login" style="display:flex;flex-direction:column;gap:0.85rem">
                """)
            .append(csrfInput(csrf))
            .append("""
                  <div class="filter-group">
                    <label for="username">Email</label>
                    <input id="username" name="username" type="email" required placeholder="customer@progear.vn">
                  </div>
                  <div class="filter-group">
                    <label for="password">Mật khẩu</label>
                    <input id="password" name="password" type="password" required>
                  </div>
                  <button class="btn" type="submit">Đăng nhập</button>
                </form>
                <p style="margin-top:1rem;font-size:0.9rem">Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                </div>
                """);
        return document("Đăng nhập — ProGear Camera", body.toString(), auth, csrf);
    }

    @GetMapping(value = "/register", produces = MediaType.TEXT_HTML_VALUE)
    public String registerPage(Authentication auth, CsrfToken csrf) {
        String body = """
                <div class="panel" style="max-width:520px;margin:2rem auto">
                  <h1>Đăng ký tài khoản khách hàng</h1>
                  <form method="post" action="/register" style="display:flex;flex-direction:column;gap:0.85rem">
                """ + csrfInput(csrf) + """
                    <div class="filter-group">
                      <label for="fullName">Họ và tên</label>
                      <input id="fullName" name="fullName" type="text" required>
                    </div>
                    <div class="filter-group">
                      <label for="email">Email</label>
                      <input id="email" name="email" type="email" required>
                    </div>
                    <div class="filter-group">
                      <label for="password">Mật khẩu (tối thiểu 6 ký tự)</label>
                      <input id="password" name="password" type="password" minlength="6" required>
                    </div>
                    <div class="filter-group">
                      <label for="address">Địa chỉ nhận hàng</label>
                      <input id="address" name="address" type="text" placeholder="Số nhà, đường, quận/huyện, tỉnh/thành phố">
                    </div>
                    <button class="btn" type="submit">Tạo tài khoản</button>
                  </form>
                </div>
                """;
        return document("Đăng ký — ProGear Camera", body, auth, csrf);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerSubmit(@RequestParam String email,
                                               @RequestParam String password,
                                               @RequestParam String fullName,
                                               @RequestParam(defaultValue = "") String address) {
        service.registerCustomer(email, password, fullName, address);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/login?registered=1")).build();
    }

    @GetMapping(value = "/profile", produces = MediaType.TEXT_HTML_VALUE)
    public String profilePage(@RequestParam(required = false) String saved,
                              Authentication auth,
                              CsrfToken csrf) {
        var user = service.requireUser(auth.getName());
        var body = new StringBuilder("<div class=\"panel\" style=\"max-width:600px;margin:1.5rem auto\"><h1>Thông tin tài khoản</h1>");
        if (saved != null) {
            body.append("<div class=\"alert\">Đã cập nhật thông tin cá nhân.</div>");
        }
        body.append("<form method=\"post\" action=\"/profile\" style=\"display:flex;flex-direction:column;gap:0.85rem\">")
            .append(csrfInput(csrf))
            .append("<div class=\"filter-group\"><label>Email</label><input type=\"email\" disabled value=\"")
            .append(escape(user.email())).append("\"></div>")
            .append("<div class=\"filter-group\"><label>Vai trò</label><input type=\"text\" disabled value=\"")
            .append(escape(user.role())).append("\"></div>")
            .append("<div class=\"filter-group\"><label for=\"fullName\">Họ và tên</label><input id=\"fullName\" name=\"fullName\" type=\"text\" required value=\"")
            .append(escape(user.fullName())).append("\"></div>")
            .append("<div class=\"filter-group\"><label for=\"address\">Địa chỉ giao hàng mặc định</label><input id=\"address\" name=\"address\" type=\"text\" value=\"")
            .append(escape(user.address())).append("\"></div>")
            .append("<button class=\"btn\" type=\"submit\">Lưu thay đổi</button></form></div>");
        return document("Tài khoản — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestParam String fullName,
                                              @RequestParam(defaultValue = "") String address,
                                              Authentication auth) {
        service.updateProfile(auth.getName(), fullName, address);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/profile?saved=1")).build();
    }

    @SuppressWarnings("unchecked")
    private Map<Long, Integer> getCart(HttpSession session) {
        Map<Long, Integer> cart = (Map<Long, Integer>) session.getAttribute(CART_SESSION_KEY);
        if (cart == null) {
            cart = new LinkedHashMap<>();
            session.setAttribute(CART_SESSION_KEY, cart);
        }
        return cart;
    }

    @PostMapping("/cart/add")
    public ResponseEntity<Void> addToCart(@RequestParam long productId,
                                          @RequestParam(defaultValue = "1") int quantity,
                                          HttpSession session) {
        if (quantity <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Số lượng phải lớn hơn 0");
        }
        service.findVisibleProduct(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại"));
        Map<Long, Integer> cart = getCart(session);
        cart.merge(productId, quantity, Integer::sum);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/cart")).build();
    }

    @PostMapping("/cart/remove")
    public ResponseEntity<Void> removeFromCart(@RequestParam long productId, HttpSession session) {
        getCart(session).remove(productId);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/cart")).build();
    }

    @GetMapping(value = "/cart", produces = MediaType.TEXT_HTML_VALUE)
    public String viewCart(HttpSession session, Authentication auth, CsrfToken csrf) {
        var user = service.requireUser(auth.getName());
        Map<Long, Integer> cart = getCart(session);
        var body = new StringBuilder("<h1>Giỏ hàng của bạn</h1>");
        if (cart.isEmpty()) {
            body.append("<div class=\"empty\"><p>Giỏ hàng đang trống.</p><a class=\"btn\" href=\"/products\">Tiếp tục mua sắm</a></div>");
            return document("Giỏ hàng — ProGear Camera", body.toString(), auth, csrf);
        }
        BigDecimal total = BigDecimal.ZERO;
        body.append("<div class=\"panel\"><table><thead><tr><th>Sản phẩm</th><th>SKU</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead><tbody>");
        for (var entry : cart.entrySet()) {
            var prodOpt = service.findVisibleProduct(entry.getKey());
            if (prodOpt.isEmpty()) continue;
            var p = prodOpt.get();
            int qty = entry.getValue();
            BigDecimal lineTotal = p.price().multiply(BigDecimal.valueOf(qty));
            total = total.add(lineTotal);
            body.append("<tr><td><a href=\"/products/").append(p.id()).append("\">").append(escape(p.name())).append("</a></td>")
                .append("<td>").append(escape(p.sku())).append("</td>")
                .append("<td>").append(formatVnd(p.price())).append(" (").append(p.price().toPlainString()).append(" VND)</td>")
                .append("<td>").append(qty).append("</td>")
                .append("<td><strong>").append(formatVnd(lineTotal)).append("</strong></td>")
                .append("<td><form method=\"post\" action=\"/cart/remove\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"productId\" value=\"").append(p.id()).append("\">")
                .append("<button class=\"btn btn-danger\" type=\"submit\">Xóa</button></form></td></tr>");
        }
        body.append("</tbody></table>")
            .append("<p style=\"text-align:right;font-size:1.25rem;font-weight:700\">Tổng cộng: ")
            .append(formatVnd(total)).append(" (").append(total.toPlainString()).append(" VND)</p>")
            .append("<h2>Thanh toán đặt hàng</h2>")
            .append("<form method=\"post\" action=\"/checkout\" style=\"display:grid;gap:0.85rem;max-width:520px\">")
            .append(csrfInput(csrf))
            .append("<input type=\"hidden\" name=\"idempotencyKey\" value=\"").append(UUID.randomUUID()).append("\">")
            .append("<div class=\"filter-group\"><label for=\"shippingAddress\">Địa chỉ nhận hàng</label>")
            .append("<input id=\"shippingAddress\" name=\"shippingAddress\" type=\"text\" required value=\"").append(escape(user.address())).append("\"></div>")
            .append("<div class=\"filter-group\"><label for=\"paymentMethod\">Phương thức thanh toán</label>")
            .append("<select id=\"paymentMethod\" name=\"paymentMethod\"><option value=\"COD\">Thanh toán khi nhận hàng (COD)</option>")
            .append("<option value=\"BANK_TRANSFER\">Chuyển khoản ngân hàng</option></select></div>")
            .append("<button class=\"btn\" type=\"submit\">Xác nhận đặt hàng</button></form></div>");
        return document("Giỏ hàng — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(@RequestParam(required = false) String idempotencyKey,
                                         @RequestHeader(value = "Idempotency-Key", required = false) String headerKey,
                                         @RequestParam(defaultValue = "COD") String paymentMethod,
                                         @RequestParam(defaultValue = "") String shippingAddress,
                                         @RequestParam(required = false) Long productId,
                                         @RequestParam(defaultValue = "1") int quantity,
                                         HttpSession session,
                                         Authentication auth) {
        String key = (idempotencyKey != null && !idempotencyKey.isBlank()) ? idempotencyKey : headerKey;
        Map<Long, Integer> items = new LinkedHashMap<>(getCart(session));
        if (items.isEmpty() && productId != null) {
            items.put(productId, quantity);
        }
        long orderId = service.checkout(auth.getName(), items, key, paymentMethod, shippingAddress);
        session.removeAttribute(CART_SESSION_KEY);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + orderId)).build();
    }

    @GetMapping(value = "/orders", produces = MediaType.TEXT_HTML_VALUE)
    public String listOrders(Authentication auth, CsrfToken csrf) {
        boolean isStaffOrAdmin = hasAnyRole(auth, "ROLE_ADMIN", "ROLE_STAFF");
        var orders = service.listOrdersForUser(auth.getName(), isStaffOrAdmin);
        var body = new StringBuilder("<h1>Danh sách đơn hàng</h1>");
        if (orders.isEmpty()) {
            body.append("<div class=\"empty\"><p>Chưa có đơn hàng nào.</p></div>");
        } else {
            body.append("<div class=\"panel\"><table><thead><tr><th>Mã ĐH</th><th>Kênh</th><th>Thanh toán</th><th>Trạng thái</th><th>Tổng tiền</th><th>Chi tiết</th></tr></thead><tbody>");
            for (var o : orders) {
                body.append("<tr><td>#").append(o.id()).append("</td>")
                    .append("<td>").append(escape(o.channel())).append("</td>")
                    .append("<td>").append(escape(o.paymentMethod())).append(" / ").append(escape(o.paymentStatus())).append("</td>")
                    .append("<td><span class=\"badge\">").append(escape(o.status())).append("</span></td>")
                    .append("<td>").append(formatVnd(o.totalAmount())).append(" (").append(o.totalAmount().toPlainString()).append(" VND)</td>")
                    .append("<td><a class=\"btn\" href=\"/orders/").append(o.id()).append("\">Xem</a></td></tr>");
            }
            body.append("</tbody></table></div>");
        }
        return document("Đơn hàng — ProGear Camera", body.toString(), auth, csrf);
    }

    @GetMapping(value = "/orders/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String orderDetail(@PathVariable long id, Authentication auth, CsrfToken csrf) {
        boolean isStaffOrAdmin = hasAnyRole(auth, "ROLE_ADMIN", "ROLE_STAFF");
        var detail = service.getOrderForUser(id, auth.getName(), isStaffOrAdmin);
        var o = detail.order();
        var body = new StringBuilder("<div class=\"panel\"><h1>Đơn hàng #").append(o.id()).append("</h1>")
                .append("<dl class=\"specs\">")
                .append("<div><dt>Trạng thái</dt><dd>").append(escape(o.status())).append("</dd></div>")
                .append("<div><dt>Kênh bán</dt><dd>").append(escape(o.channel())).append("</dd></div>")
                .append("<div><dt>Thanh toán</dt><dd>").append(escape(o.paymentMethod())).append(" (").append(escape(o.paymentStatus())).append(")</dd></div>")
                .append("<div><dt>Tổng tiền</dt><dd>").append(formatVnd(o.totalAmount())).append(" (").append(o.totalAmount().toPlainString()).append(" VND)</dd></div>")
                .append("<div><dt>Địa chỉ giao hàng</dt><dd>").append(escape(o.shippingAddress())).append("</dd></div>")
                .append("</dl><h2>Sản phẩm trong đơn</h2>")
                .append("<table><thead><tr><th>Sản phẩm</th><th>SKU</th><th>Đơn giá snapshot</th><th>Số lượng</th></tr></thead><tbody>");
        for (var item : detail.items()) {
            body.append("<tr><td>").append(escape(item.productName())).append("</td>")
                .append("<td>").append(escape(item.sku())).append("</td>")
                .append("<td>").append(formatVnd(item.unitPrice())).append(" (").append(item.unitPrice().toPlainString()).append(" VND)</td>")
                .append("<td>").append(item.quantity()).append("</td></tr>");
        }
        body.append("</tbody></table>");
        if (!detail.serials().isEmpty()) {
            body.append("<p><strong>Serial bảo hành gắn kèm:</strong> ").append(escape(String.join(", ", detail.serials()))).append("</p>");
        }
        if ("PENDING_PAYMENT".equals(o.status()) || "CONFIRMED".equals(o.status())) {
            body.append("<form method=\"post\" action=\"/orders/").append(o.id()).append("/cancel\" style=\"margin-top:1.25rem\">")
                .append(csrfInput(csrf))
                .append("<button class=\"btn btn-danger\" type=\"submit\">Hủy đơn hàng &amp; Hoàn kho</button></form>");
        }
        body.append("</div>");
        return document("Đơn hàng #" + o.id() + " — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable long id, Authentication auth) {
        boolean isStaffOrAdmin = hasAnyRole(auth, "ROLE_ADMIN", "ROLE_STAFF");
        service.cancelOrder(id, auth.getName(), isStaffOrAdmin);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + id)).build();
    }

    @GetMapping(value = "/pos", produces = MediaType.TEXT_HTML_VALUE)
    public String posPage(Authentication auth, CsrfToken csrf) {
        var serials = service.listSerials();
        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Quầy bán hàng POS — ProGear</h1>
                  <p>Tạo hóa đơn bán trực tiếp tại cửa hàng, trừ kho nguyên tử và kích hoạt Serial bảo hành 365 ngày.</p>
                </section>
                <div class="panel">
                  <h2>Tạo đơn POS mới</h2>
                  <form method="post" action="/pos/orders" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.85rem;align-items:end">
                """)
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"idempotencyKey\" value=\"").append(UUID.randomUUID()).append("\">")
                .append("""
                    <div class="filter-group">
                      <label for="sku">Mã SKU sản phẩm</label>
                      <input id="sku" name="sku" type="text" required placeholder="VD: SONY-A7M4-BODY">
                    </div>
                    <div class="filter-group">
                      <label for="quantity">Số lượng</label>
                      <input id="quantity" name="quantity" type="number" min="1" value="1" required>
                    </div>
                    <div class="filter-group">
                      <label for="serialNumber">Số Serial (tùy chọn)</label>
                      <input id="serialNumber" name="serialNumber" type="text" placeholder="VD: SN-SONY-A7M4-001">
                    </div>
                    <div class="filter-group">
                      <label for="paymentMethod">Thanh toán</label>
                      <select id="paymentMethod" name="paymentMethod">
                        <option value="CASH">Tiền mặt (CASH)</option>
                        <option value="CARD">Thẻ (CARD)</option>
                        <option value="BANK_TRANSFER">Chuyển khoản (BANK_TRANSFER)</option>
                      </select>
                    </div>
                    <button class="btn" type="submit">Xuất hóa đơn POS</button>
                  </form>
                </div>
                <div class="panel">
                  <h2>Danh sách Serial trong kho</h2>
                  <table><thead><tr><th>Serial Number</th><th>SKU</th><th>Sản phẩm</th><th>Trạng thái</th><th>Hạn BH</th></tr></thead><tbody>
                """);
        for (var s : serials) {
            body.append("<tr><td>").append(escape(s.serialNumber())).append("</td>")
                .append("<td>").append(escape(s.sku())).append("</td>")
                .append("<td>").append(escape(s.productName())).append("</td>")
                .append("<td>").append(escape(s.status())).append("</td>")
                .append("<td>").append(s.warrantyUntil() != null ? escape(s.warrantyUntil().toString()) : "-").append("</td></tr>");
        }
        body.append("</tbody></table></div>");
        return document("POS Counter — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping({"/pos/orders", "/pos/sale", "/pos"})
    public ResponseEntity<Void> createPosOrder(@RequestParam String sku,
                                               @RequestParam(defaultValue = "1") int quantity,
                                               @RequestParam(required = false) String serialNumber,
                                               @RequestParam(defaultValue = "CASH") String paymentMethod,
                                               @RequestParam(required = false) String idempotencyKey,
                                               @RequestHeader(value = "Idempotency-Key", required = false) String headerKey,
                                               Authentication auth) {
        String key = (idempotencyKey != null && !idempotencyKey.isBlank()) ? idempotencyKey : headerKey;
        long orderId = service.posCreateOrder(auth.getName(), sku, quantity, serialNumber, paymentMethod, key);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + orderId)).build();
    }

    @GetMapping(value = "/admin", produces = MediaType.TEXT_HTML_VALUE)
    public String adminDashboard(Authentication auth, CsrfToken csrf) {
        var categories = service.listAllCategories();
        var brands = service.listAllBrands();
        var products = service.listAllProducts();
        var orders = service.listOrdersForUser(auth.getName(), true);
        var users = service.listUsers();
        var audits = service.listRecentAudits();
        var revenue = service.totalPaidRevenue();

        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Quản trị hệ thống ProGear</h1>
                  <p>Quản lý danh mục, thương hiệu, sản phẩm, tồn kho, serial, đơn hàng, phân quyền và nhật ký kiểm toán.</p>
                </section>
                <dl class="specs">
                  <div><dt>Tổng doanh thu hợp lệ</dt><dd>""").append(formatVnd(revenue)).append(" (").append(revenue.toPlainString()).append(" VND)</dd></div>")
                .append("<div><dt>Tổng số đơn hàng</dt><dd>").append(orders.size()).append("</dd></div>")
                .append("<div><dt>Tổng số sản phẩm</dt><dd>").append(products.size()).append("</dd></div>")
                .append("</dl>");

        // Product CRUD
        body.append("""
                <div class="panel">
                  <h2>Thêm / Cập nhật Sản phẩm</h2>
                  <form method="post" action="/admin/products" style="display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:0.75rem;align-items:end">
                """).append(csrfInput(csrf)).append("""
                    <div class="filter-group"><label>ID (để trống nếu thêm mới)</label><input name="id" type="number"></div>
                    <div class="filter-group"><label>Tên sản phẩm</label><input name="name" type="text" required></div>
                    <div class="filter-group"><label>SKU</label><input name="sku" type="text" required></div>
                    <div class="filter-group"><label>Giá (VND)</label><input name="price" type="number" step="0.01" min="0" required></div>
                    <div class="filter-group"><label>Tồn kho</label><input name="stock" type="number" min="0" value="10" required></div>
                    <div class="filter-group"><label>Danh mục ID</label><input name="categoryId" type="number" value="1" required></div>
                    <div class="filter-group"><label>Thương hiệu ID</label><input name="brandId" type="number" value="1" required></div>
                    <div class="filter-group"><label>Mô tả</label><input name="description" type="text"></div>
                    <div class="filter-group"><label>Hiển thị</label><select name="visible"><option value="true">Hiển thị</option><option value="false">Ẩn</option></select></div>
                    <button class="btn" type="submit">Lưu sản phẩm</button>
                  </form>
                  <table><thead><tr><th>ID</th><th>SKU</th><th>Tên</th><th>Giá</th><th>Kho</th><th>Hiển thị</th></tr></thead><tbody>
                """);
        for (var p : products) {
            body.append("<tr><td>").append(p.id()).append("</td><td>").append(escape(p.sku())).append("</td><td>")
                .append(escape(p.name())).append("</td><td>").append(p.price().toPlainString()).append(" VND</td><td>")
                .append(p.stock()).append("</td><td>").append(p.visible()).append("</td></tr>");
        }
        body.append("</tbody></table></div>");

        // Category & Brand & Serial forms
        body.append("<div class=\"panel\"><h2>Danh mục &amp; Thương hiệu &amp; Serial</h2>")
            .append("<form method=\"post\" action=\"/admin/categories\" style=\"display:flex;gap:0.5rem;margin-bottom:0.75rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"name\" placeholder=\"Tên danh mục mới\" required>")
            .append("<input type=\"hidden\" name=\"visible\" value=\"true\">")
            .append("<button class=\"btn\" type=\"submit\">Lưu danh mục</button></form>")
            .append("<form method=\"post\" action=\"/admin/brands\" style=\"display:flex;gap:0.5rem;margin-bottom:0.75rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"name\" placeholder=\"Tên thương hiệu mới\" required>")
            .append("<input type=\"hidden\" name=\"visible\" value=\"true\">")
            .append("<button class=\"btn\" type=\"submit\">Lưu thương hiệu</button></form>")
            .append("<form method=\"post\" action=\"/admin/serials\" style=\"display:flex;gap:0.5rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"productId\" type=\"number\" placeholder=\"Product ID\" required>")
            .append("<input name=\"serialNumber\" placeholder=\"Số Serial mới\" required>")
            .append("<button class=\"btn\" type=\"submit\">Thêm Serial</button></form></div>");

        // Orders management
        body.append("<div class=\"panel\"><h2>Quản lý Đơn hàng</h2><table><thead><tr><th>ID</th><th>Khách hàng</th><th>Tổng tiền</th><th>Trạng thái</th><th>Cập nhật</th></tr></thead><tbody>");
        for (var o : orders) {
            body.append("<tr><td>#").append(o.id()).append("</td><td>").append(escape(o.userEmail())).append("</td><td>")
                .append(o.totalAmount().toPlainString()).append(" VND</td><td>").append(escape(o.status())).append(" / ").append(escape(o.paymentStatus())).append("</td><td>")
                .append("<form method=\"post\" action=\"/admin/orders/").append(o.id()).append("/status\" style=\"display:flex;gap:0.4rem\">")
                .append(csrfInput(csrf))
                .append("<select name=\"status\"><option value=\"CONFIRMED\">CONFIRMED</option><option value=\"COMPLETED\">COMPLETED</option><option value=\"CANCELLED\">CANCELLED</option><option value=\"PENDING_PAYMENT\">PENDING_PAYMENT</option></select>")
                .append("<select name=\"paymentStatus\"><option value=\"PAID\">PAID</option><option value=\"PENDING\">PENDING</option><option value=\"REFUNDED\">REFUNDED</option></select>")
                .append("<button class=\"btn\" type=\"submit\">Lưu</button></form></td></tr>");
        }
        body.append("</tbody></table></div>");

        // Users management
        body.append("<div class=\"panel\"><h2>Phân quyền Người dùng</h2><table><thead><tr><th>ID</th><th>Email</th><th>Họ tên</th><th>Quyền</th><th>Đổi quyền</th></tr></thead><tbody>");
        for (var u : users) {
            body.append("<tr><td>").append(u.id()).append("</td><td>").append(escape(u.email())).append("</td><td>")
                .append(escape(u.fullName())).append("</td><td>").append(escape(u.role())).append("</td><td>")
                .append("<form method=\"post\" action=\"/admin/users/").append(u.id()).append("/role\" style=\"display:flex;gap:0.4rem\">")
                .append(csrfInput(csrf))
                .append("<select name=\"role\"><option value=\"ROLE_CUSTOMER\">ROLE_CUSTOMER</option><option value=\"ROLE_STAFF\">ROLE_STAFF</option><option value=\"ROLE_ADMIN\">ROLE_ADMIN</option></select>")
                .append("<button class=\"btn\" type=\"submit\">Cập nhật</button></form></td></tr>");
        }
        body.append("</tbody></table></div>");

        // Audit logs
        body.append("<div class=\"panel\"><h2>Nhật ký Kiểm toán (Audit Log)</h2><table><thead><tr><th>ID</th><th>Người thực hiện</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead><tbody>");
        for (var a : audits) {
            body.append("<tr><td>").append(a.id()).append("</td><td>").append(escape(a.actor())).append("</td><td>")
                .append(escape(a.action())).append("</td><td>").append(escape(a.targetType())).append("#").append(escape(a.targetId())).append("</td><td>")
                .append(escape(a.details())).append("</td></tr>");
        }
        body.append("</tbody></table></div>");

        return document("Quản trị — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<Void> saveCategory(@RequestParam(required = false) Long id,
                                             @RequestParam String name,
                                             @RequestParam(defaultValue = "true") boolean visible,
                                             Authentication auth) {
        service.saveCategory(auth.getName(), id, name, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/brands")
    public ResponseEntity<Void> saveBrand(@RequestParam(required = false) Long id,
                                          @RequestParam String name,
                                          @RequestParam(defaultValue = "true") boolean visible,
                                          Authentication auth) {
        service.saveBrand(auth.getName(), id, name, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/products")
    public ResponseEntity<Void> saveProduct(@RequestParam(required = false) Long id,
                                            @RequestParam long categoryId,
                                            @RequestParam long brandId,
                                            @RequestParam String name,
                                            @RequestParam String sku,
                                            @RequestParam BigDecimal price,
                                            @RequestParam(defaultValue = "10") int stock,
                                            @RequestParam(defaultValue = "") String description,
                                            @RequestParam(defaultValue = "true") boolean visible,
                                            Authentication auth) {
        service.saveProduct(auth.getName(), id, categoryId, brandId, name, sku, price, stock, description, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/serials")
    public ResponseEntity<Void> addSerial(@RequestParam long productId,
                                          @RequestParam String serialNumber,
                                          Authentication auth) {
        service.addSerial(auth.getName(), productId, serialNumber);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/orders/{id}/status")
    public ResponseEntity<Void> updateOrderStatus(@PathVariable long id,
                                                  @RequestParam String status,
                                                  @RequestParam(defaultValue = "PAID") String paymentStatus,
                                                  Authentication auth) {
        service.adminUpdateOrder(auth.getName(), id, status, paymentStatus);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable long id,
                                               @RequestParam String role,
                                               Authentication auth) {
        service.adminUpdateUserRole(auth.getName(), id, role);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    private static boolean hasAnyRole(Authentication auth, String... roles) {
        if (auth == null || auth.getAuthorities() == null) return false;
        for (String role : roles) {
            if (auth.getAuthorities().stream().anyMatch(a -> role.equals(a.getAuthority()))) {
                return true;
            }
        }
        return false;
    }
}
