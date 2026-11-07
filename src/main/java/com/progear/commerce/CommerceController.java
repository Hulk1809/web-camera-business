package com.progear.commerce;

import static com.progear.catalog.CatalogController.csrfInput;
import static com.progear.catalog.CatalogController.document;
import static com.progear.catalog.CatalogController.escape;
import static com.progear.catalog.CatalogController.formatVnd;
import static com.progear.catalog.CatalogController.isSafeImageUrl;

import java.math.BigDecimal;
import java.net.URI;
import java.util.LinkedHashMap;
import java.util.List;
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
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@ResponseBody
public class CommerceController {
    public static final String CART_SESSION_KEY = "PROGEAR_CART";
    private final CommerceService service;

    public CommerceController(CommerceService service) {
        this.service = service;
    }

    @GetMapping(value = "/login", produces = MediaType.TEXT_HTML_VALUE)
    public String loginPage(@RequestParam(required = false) String error,
                            @RequestParam(required = false) String logout,
                            @RequestParam(required = false) String registered,
                            Authentication auth,
                            CsrfToken csrf) {
        var body = new StringBuilder("<div class=\"panel\" style=\"max-width:460px;margin:2rem auto\">")
                .append("<h1>Đăng nhập hệ thống</h1>");
        if (error != null) {
            body.append("<div class=\"alert alert-error\">Email hoặc mật khẩu không chính xác.</div>");
        }
        if (logout != null) {
            body.append("<div class=\"alert\">Bạn đã đăng xuất thành công.</div>");
        }
        if (registered != null) {
            body.append("<div class=\"alert\">Đăng ký tài khoản thành công! Vui lòng đăng nhập.</div>");
        }
        body.append("""
                <form method="post" action="/login" style="display:grid;gap:1rem">
                  %s
                  <div class="filter-group">
                    <label for="username">Email</label>
                    <input id="username" name="username" type="email" required autocomplete="username" placeholder="customer@progear.vn">
                  </div>
                  <div class="filter-group">
                    <label for="password">Mật khẩu</label>
                    <input id="password" name="password" type="password" required autocomplete="current-password">
                  </div>
                  <button class="btn" type="submit">Đăng nhập</button>
                </form>
                <p style="margin-top:1rem;font-size:0.9rem">Chưa có tài khoản? <a href="/register">Đăng ký ngay</a></p>
                </div>
                """.formatted(csrfInput(csrf)));
        return document("Đăng nhập — ProGear Camera", body.toString(), auth, csrf);
    }

    @GetMapping(value = "/register", produces = MediaType.TEXT_HTML_VALUE)
    public String registerPage(Authentication auth, CsrfToken csrf) {
        String body = """
                <div class="panel" style="max-width:520px;margin:2rem auto">
                  <h1>Đăng ký tài khoản khách hàng</h1>
                  <form method="post" action="/register" style="display:grid;gap:1rem">
                    %s
                    <div class="filter-group">
                      <label for="fullName">Họ và tên</label>
                      <input id="fullName" name="fullName" type="text" required placeholder="Nguyễn Văn A">
                    </div>
                    <div class="filter-group">
                      <label for="email">Email</label>
                      <input id="email" name="email" type="email" required placeholder="khachhang@progear.vn">
                    </div>
                    <div class="filter-group">
                      <label for="phone">Số điện thoại</label>
                      <input id="phone" name="phone" type="tel" placeholder="0909123456">
                    </div>
                    <div class="filter-group">
                      <label for="password">Mật khẩu (tối thiểu 6 ký tự)</label>
                      <input id="password" name="password" type="password" minlength="6" required>
                    </div>
                    <div class="filter-group">
                      <label for="address">Địa chỉ nhận hàng</label>
                      <input id="address" name="address" type="text" placeholder="Số nhà, đường, quận/huyện, tỉnh/thành">
                    </div>
                    <button class="btn" type="submit">Tạo tài khoản</button>
                  </form>
                </div>
                """.formatted(csrfInput(csrf));
        return document("Đăng ký — ProGear Camera", body, auth, csrf);
    }

    @PostMapping("/register")
    public ResponseEntity<Void> registerSubmit(@RequestParam String email,
                                               @RequestParam String password,
                                               @RequestParam String fullName,
                                               @RequestParam(defaultValue = "") String address,
                                               @RequestParam(defaultValue = "") String phone) {
        service.registerCustomer(email, password, fullName, address, phone);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/login?registered=1")).build();
    }

    @GetMapping(value = "/profile", produces = MediaType.TEXT_HTML_VALUE)
    public String profilePage(@RequestParam(required = false) String updated,
                              Authentication auth,
                              CsrfToken csrf) {
        var user = service.requireUser(auth.getName());
        var body = new StringBuilder("<div class=\"panel\" style=\"max-width:560px;margin:1rem auto\">")
                .append("<h1>Thông tin tài khoản</h1>");
        if (updated != null) {
            body.append("<div class=\"alert\">Đã cập nhật thông tin tài khoản.</div>");
        }
        body.append("""
                <p><strong>Email:</strong> %s &mdash; <span class="badge badge-brand">%s</span></p>
                <form method="post" action="/profile" style="display:grid;gap:1rem">
                  %s
                  <div class="filter-group">
                    <label for="fullName">Họ và tên</label>
                    <input id="fullName" name="fullName" type="text" required value="%s">
                  </div>
                  <div class="filter-group">
                    <label for="phone">Số điện thoại</label>
                    <input id="phone" name="phone" type="tel" value="%s">
                  </div>
                  <div class="filter-group">
                    <label for="address">Địa chỉ giao hàng mặc định</label>
                    <input id="address" name="address" type="text" value="%s">
                  </div>
                  <button class="btn" type="submit">Lưu thay đổi</button>
                </form>
                </div>
                """.formatted(escape(user.email()), escape(user.role()), csrfInput(csrf),
                escape(user.fullName()), escape(user.phone()), escape(user.address())));
        return document("Tài khoản — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/profile")
    public ResponseEntity<Void> updateProfile(@RequestParam String fullName,
                                              @RequestParam(defaultValue = "") String address,
                                              @RequestParam(defaultValue = "") String phone,
                                              Authentication auth) {
        service.updateProfile(auth.getName(), fullName, address, phone);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/profile?updated=1")).build();
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
        if (quantity > 0) {
            var prod = service.findVisibleProduct(productId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Sản phẩm không tồn tại hoặc đã ngừng kinh doanh"));
            if (prod.stock() <= 0) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Sản phẩm tạm hết hàng");
            }
            Map<Long, Integer> cart = getCart(session);
            int nextQty = Math.min(prod.stock(), cart.getOrDefault(productId, 0) + quantity);
            cart.put(productId, nextQty);
        }
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/cart")).build();
    }

    @PostMapping("/cart/update")
    public ResponseEntity<Void> updateCartItem(@RequestParam long productId,
                                               @RequestParam int quantity,
                                               HttpSession session) {
        Map<Long, Integer> cart = getCart(session);
        if (quantity <= 0) {
            cart.remove(productId);
        } else {
            var prodOpt = service.findVisibleProduct(productId);
            if (prodOpt.isEmpty() || prodOpt.get().stock() <= 0) {
                cart.remove(productId);
            } else {
                cart.put(productId, Math.min(prodOpt.get().stock(), quantity));
            }
        }
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/cart")).build();
    }

    @PostMapping("/cart/remove")
    public ResponseEntity<Void> removeFromCart(@RequestParam long productId, HttpSession session) {
        getCart(session).remove(productId);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/cart")).build();
    }

    @GetMapping(value = "/cart", produces = MediaType.TEXT_HTML_VALUE)
    public String viewCart(HttpSession session, Authentication auth, CsrfToken csrf) {
        Map<Long, Integer> cart = getCart(session);
        boolean loggedIn = auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal());
        var userOpt = loggedIn ? service.findUserByEmail(auth.getName()) : java.util.Optional.<CommerceService.AppUser>empty();
        String defaultAddr = userOpt.map(CommerceService.AppUser::address).orElse("");
        String defaultPhone = userOpt.map(CommerceService.AppUser::phone).orElse("");

        var body = new StringBuilder("<div class=\"panel\"><h1>Giỏ hàng của bạn</h1>");
        cart.entrySet().removeIf(e -> e.getValue() == null || e.getValue() <= 0 || service.findVisibleProduct(e.getKey()).isEmpty());
        if (cart.isEmpty()) {
            body.append("<div class=\"empty\"><p>Giỏ hàng đang trống.</p><a class=\"btn\" href=\"/products\">Tiếp tục mua sắm</a></div></div>");
            return document("Giỏ hàng — ProGear Camera", body.toString(), auth, csrf);
        }

        BigDecimal total = BigDecimal.ZERO;
        body.append("<table><thead><tr><th>Sản phẩm</th><th>SKU</th><th>Đơn giá</th><th>Số lượng</th><th>Thành tiền</th><th></th></tr></thead><tbody>");
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
                .append("<td><form method=\"post\" action=\"/cart/update\" style=\"display:inline-flex;gap:0.35rem;align-items:center;margin:0\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"productId\" value=\"").append(p.id()).append("\">")
                .append("<input name=\"quantity\" type=\"number\" min=\"0\" max=\"").append(Math.max(1, p.stock())).append("\" value=\"").append(qty).append("\" style=\"width:70px\" aria-label=\"Số lượng ").append(escape(p.name())).append("\">")
                .append("<button class=\"btn btn-secondary btn-sm\" type=\"submit\">Cập nhật</button></form></td>")
                .append("<td>").append(formatVnd(lineTotal)).append("</td>")
                .append("<td><form method=\"post\" action=\"/cart/remove\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"productId\" value=\"").append(p.id()).append("\">")
                .append("<button class=\"btn btn-danger btn-sm\" type=\"submit\">Xóa</button></form></td></tr>");
        }
        body.append("</tbody></table>")
            .append("<p style=\"text-align:right;font-size:1.25rem;font-weight:700\">Tổng cộng: ")
            .append(formatVnd(total)).append(" (").append(total.toPlainString()).append(" VND)</p>")
            .append("<h2>Thanh toán đặt hàng</h2>");
        if (!loggedIn) {
            body.append("<div class=\"alert\">Bạn đang xem giỏ hàng chưa đăng nhập. Vui lòng <a href=\"/login\"><strong>Đăng nhập</strong></a> hoặc <a href=\"/register\"><strong>Đăng ký</strong></a> trước khi xác nhận đặt hàng.</div>");
        }
        body.append("<form method=\"post\" action=\"/checkout\" style=\"display:grid;gap:0.85rem;max-width:520px\">")
            .append(csrfInput(csrf))
            .append("<input type=\"hidden\" name=\"idempotencyKey\" value=\"").append(UUID.randomUUID()).append("\">")
            .append("<div class=\"filter-group\"><label for=\"recipientPhone\">Số điện thoại người nhận</label>")
            .append("<input id=\"recipientPhone\" name=\"recipientPhone\" type=\"tel\" placeholder=\"0909123456\" value=\"").append(escape(defaultPhone)).append("\"></div>")
            .append("<div class=\"filter-group\"><label for=\"shippingAddress\">Địa chỉ nhận hàng</label>")
            .append("<input id=\"shippingAddress\" name=\"shippingAddress\" type=\"text\" required value=\"").append(escape(defaultAddr)).append("\"></div>")
            .append("<div class=\"filter-group\"><label for=\"shippingNote\">Ghi chú giao hàng</label>")
            .append("<input id=\"shippingNote\" name=\"shippingNote\" type=\"text\" placeholder=\"Giao giờ hành chính, gọi trước khi giao...\"></div>")
            .append("<div class=\"filter-group\"><label for=\"paymentMethod\">Phương thức thanh toán</label>")
            .append("<select id=\"paymentMethod\" name=\"paymentMethod\"><option value=\"COD\">Thanh toán khi nhận hàng (COD)</option>")
            .append("<option value=\"BANK_TRANSFER\">Chuyển khoản ngân hàng (VietQR)</option></select></div>")
            .append("<button class=\"btn\" type=\"submit\">Xác nhận đặt hàng</button></form></div>");
        return document("Giỏ hàng — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/checkout")
    public ResponseEntity<Void> checkout(@RequestParam(required = false) String idempotencyKey,
                                         @RequestHeader(value = "Idempotency-Key", required = false) String headerIdemKey,
                                         @RequestParam(defaultValue = "COD") String paymentMethod,
                                         @RequestParam(defaultValue = "") String shippingAddress,
                                         @RequestParam(defaultValue = "") String recipientPhone,
                                         @RequestParam(defaultValue = "") String shippingNote,
                                         @RequestParam(required = false) Long productId,
                                         @RequestParam(required = false) Integer quantity,
                                         HttpSession session,
                                         Authentication auth) {
        String effectiveKey = (idempotencyKey != null && !idempotencyKey.isBlank()) ? idempotencyKey : headerIdemKey;
        Map<Long, Integer> items;
        boolean directItems = (productId != null && quantity != null);
        if (directItems) {
            items = Map.of(productId, quantity);
        } else {
            items = new LinkedHashMap<>(getCart(session));
        }
        long orderId = service.checkout(auth.getName(), items, effectiveKey, paymentMethod, shippingAddress, recipientPhone, shippingNote);
        if (!directItems) {
            session.removeAttribute(CART_SESSION_KEY);
        }
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + orderId)).build();
    }

    private static boolean isAdminOrStaff(Authentication auth) {
        return auth != null && auth.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_STAFF".equals(a.getAuthority()));
    }

    @GetMapping(value = "/orders", produces = MediaType.TEXT_HTML_VALUE)
    public String listOrders(Authentication auth, CsrfToken csrf) {
        var orders = service.listOrdersForUser(auth.getName(), isAdminOrStaff(auth));
        var body = new StringBuilder("<div class=\"panel\"><h1>Danh sách đơn hàng</h1>");
        if (orders.isEmpty()) {
            body.append("<div class=\"empty\"><p>Chưa có đơn hàng nào.</p></div></div>");
            return document("Đơn hàng — ProGear Camera", body.toString(), auth, csrf);
        }
        body.append("<table><thead><tr><th>Mã đơn</th><th>Khách hàng</th><th>Kênh</th><th>Thanh toán</th><th>Trạng thái</th><th>Tổng tiền</th><th>Chi tiết</th></tr></thead><tbody>");
        for (var o : orders) {
            body.append("<tr><td>#").append(o.id()).append("</td>")
                .append("<td>").append(escape(o.userEmail())).append("</td>")
                .append("<td><span class=\"badge\">").append(escape(o.channel())).append("</span></td>")
                .append("<td>").append(escape(o.paymentMethod())).append(" / ").append(escape(o.paymentStatus())).append("</td>")
                .append("<td><span class=\"badge badge-brand\">").append(escape(o.status())).append("</span></td>")
                .append("<td>").append(formatVnd(o.totalAmount())).append(" (").append(o.totalAmount().toPlainString()).append(" VND)</td>")
                .append("<td><a class=\"btn btn-secondary btn-sm\" href=\"/orders/").append(o.id()).append("\">Xem</a></td></tr>");
        }
        body.append("</tbody></table></div>");
        return document("Đơn hàng — ProGear Camera", body.toString(), auth, csrf);
    }

    @GetMapping(value = "/orders/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String orderDetail(@PathVariable long id, Authentication auth, CsrfToken csrf) {
        var detail = service.getOrderForUser(id, auth.getName(), isAdminOrStaff(auth));
        var o = detail.order();
        var body = new StringBuilder("<div class=\"panel\">")
                .append("<h1>Đơn hàng #").append(o.id()).append("</h1>")
                .append("<dl class=\"specs\">")
                .append("<div><dt>Trạng thái đơn</dt><dd>").append(escape(o.status())).append("</dd></div>")
                .append("<div><dt>Thanh toán</dt><dd>").append(escape(o.paymentMethod())).append(" (").append(escape(o.paymentStatus())).append(")</dd></div>")
                .append("<div><dt>Kênh bán</dt><dd>").append(escape(o.channel())).append("</dd></div>")
                .append("<div><dt>Tổng tiền</dt><dd>").append(formatVnd(o.totalAmount())).append(" (").append(o.totalAmount().toPlainString()).append(" VND)</dd></div>")
                .append("<div><dt>Số điện thoại</dt><dd>").append(escape(o.recipientPhone() == null || o.recipientPhone().isBlank() ? "-" : o.recipientPhone())).append("</dd></div>")
                .append("<div><dt>Địa chỉ / Ghi chú</dt><dd>").append(escape(o.shippingAddress()))
                .append(o.shippingNote() != null && !o.shippingNote().isBlank() ? " (" + escape(o.shippingNote()) + ")" : "")
                .append("</dd></div></dl>");

        if ("BANK_TRANSFER".equals(o.paymentMethod()) && "PENDING".equals(o.paymentStatus()) && !"CANCELLED".equals(o.status())) {
            String qrUrl = "https://img.vietqr.io/image/VCB-0071001234567-compact2.png?amount="
                    + o.totalAmount().toBigInteger() + "&addInfo=PROGEAR%20DH%23" + o.id()
                    + "&accountName=PROGEAR%20CAMERA";
            body.append("""
                    <div class="alert" style="display:flex;flex-wrap:wrap;gap:1.25rem;align-items:center">
                      <img src="%s" alt="Mã VietQR thanh toán đơn #%d" width="160" height="160" style="border-radius:0.5rem;border:1px solid var(--border);background:#fff">
                      <div>
                        <h3 style="margin:0 0 0.35rem">Hướng dẫn Chuyển khoản Ngân hàng (VietQR)</h3>
                        <p style="margin:0.2rem 0">Ngân hàng: <strong>Vietcombank — CN TP.HCM</strong> | Số TK: <strong>0071001234567</strong></p>
                        <p style="margin:0.2rem 0">Chủ TK: <strong>CONG TY TNHH PROGEAR CAMERA VIET NAM</strong></p>
                        <p style="margin:0.2rem 0">Số tiền: <strong>%s</strong> | Nội dung chuyển khoản: <strong>PROGEAR DH#%d</strong></p>
                      </div>
                    </div>
                    """.formatted(escape(qrUrl), o.id(), formatVnd(o.totalAmount()), o.id()));
        }

        body.append("<h2>Sản phẩm trong đơn</h2>")
            .append("<table><thead><tr><th>SKU</th><th>Tên sản phẩm</th><th>Đơn giá chốt</th><th>Số lượng</th><th>Thành tiền</th></tr></thead><tbody>");
        for (var item : detail.items()) {
            BigDecimal line = item.unitPrice().multiply(BigDecimal.valueOf(item.quantity()));
            body.append("<tr><td>").append(escape(item.sku())).append("</td>")
                .append("<td>").append(escape(item.productName())).append("</td>")
                .append("<td>").append(formatVnd(item.unitPrice())).append(" (").append(item.unitPrice().toPlainString()).append(" VND)</td>")
                .append("<td>").append(item.quantity()).append("</td>")
                .append("<td>").append(formatVnd(line)).append("</td></tr>");
        }
        body.append("</tbody></table>");

        if (!detail.serials().isEmpty()) {
            body.append("<h3>Serial bảo hành gắn kèm</h3><ul>");
            for (String sn : detail.serials()) {
                body.append("<li><code>").append(escape(sn)).append("</code> — <a href=\"/warranty?serial=")
                    .append(escape(sn)).append("\">Tra cứu bảo hành</a></li>");
            }
            body.append("</ul>");
        }

        if (!"CANCELLED".equals(o.status()) && !"COMPLETED".equals(o.status())) {
            body.append("<form method=\"post\" action=\"/orders/").append(o.id()).append("/cancel\" style=\"margin-top:1.5rem\">")
                .append(csrfInput(csrf))
                .append("<button class=\"btn btn-danger\" type=\"submit\">Hủy đơn hàng &amp; Hoàn kho</button></form>");
        }
        if (auth != null && auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()))) {
            body.append("<div style=\"margin-top:1.5rem;padding-top:1rem;border-top:1px solid var(--border)\">")
                .append("<h3>Quản trị cập nhật trạng thái đơn</h3>")
                .append("<form method=\"post\" action=\"/admin/orders/").append(o.id()).append("/status\" style=\"display:flex;flex-wrap:wrap;gap:0.5rem;align-items:center\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"returnToOrder\" value=\"true\">")
                .append("<select name=\"status\" aria-label=\"Trạng thái đơn\">")
                .append("<option value=\"PENDING_PAYMENT\"").append("PENDING_PAYMENT".equals(o.status()) ? " selected" : "").append(">PENDING_PAYMENT</option>")
                .append("<option value=\"CONFIRMED\"").append("CONFIRMED".equals(o.status()) ? " selected" : "").append(">CONFIRMED</option>")
                .append("<option value=\"COMPLETED\"").append("COMPLETED".equals(o.status()) ? " selected" : "").append(">COMPLETED</option>")
                .append("<option value=\"CANCELLED\"").append("CANCELLED".equals(o.status()) ? " selected" : "").append(">CANCELLED</option>")
                .append("</select>")
                .append("<select name=\"paymentStatus\" aria-label=\"Trạng thái thanh toán\">")
                .append("<option value=\"PENDING\"").append("PENDING".equals(o.paymentStatus()) ? " selected" : "").append(">PENDING</option>")
                .append("<option value=\"PAID\"").append("PAID".equals(o.paymentStatus()) ? " selected" : "").append(">PAID</option>")
                .append("<option value=\"REFUNDED\"").append("REFUNDED".equals(o.paymentStatus()) ? " selected" : "").append(">REFUNDED</option>")
                .append("</select>")
                .append("<button class=\"btn btn-sm\" type=\"submit\">Lưu trạng thái đơn</button></form></div>");
        }
        body.append("</div>");
        return document("Đơn hàng #" + o.id() + " — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/orders/{id}/cancel")
    public ResponseEntity<Void> cancelOrder(@PathVariable long id, Authentication auth) {
        service.cancelOrder(id, auth.getName(), isAdminOrStaff(auth));
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + id)).build();
    }

    @GetMapping(value = "/pos", produces = MediaType.TEXT_HTML_VALUE)
    public String posPage(Authentication auth, CsrfToken csrf) {
        var serials = service.listSerials();
        var products = service.listAllProducts();
        var skuOptions = new StringBuilder();
        for (var p : products) {
            skuOptions.append("<option value=\"").append(escape(p.sku())).append("\">")
                    .append(escape(p.name())).append(" — Tồn: ").append(p.stock()).append(" — ").append(formatVnd(p.price()))
                    .append("</option>");
        }
        var snOptions = new StringBuilder();
        for (var s : serials) {
            if ("IN_STOCK".equals(s.status())) {
                snOptions.append("<option value=\"").append(escape(s.serialNumber())).append("\">")
                        .append(escape(s.sku())).append(" — ").append(escape(s.productName()))
                        .append("</option>");
            }
        }
        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Quầy POS Bán Hàng Trực Tiếp</h1>
                  <p>Tạo đơn tại quầy, trừ tồn kho nguyên tử và kích hoạt Serial bảo hành điện tử 365 ngày.</p>
                </section>
                <div class="panel">
                  <h2>Tạo hóa đơn POS mới</h2>
                  <form method="post" action="/pos/orders" style="display:grid;gap:1rem;max-width:560px">
                    %s
                    <input type="hidden" name="idempotencyKey" value="%s">
                    <div class="filter-group">
                      <label for="sku">Mã SKU sản phẩm</label>
                      <input id="sku" name="sku" list="pos-sku-list" type="text" required placeholder="Chọn hoặc nhập SKU (VD: SONY-A7M4-BODY)">
                      <datalist id="pos-sku-list">%s</datalist>
                    </div>
                    <div class="filter-group">
                      <label for="quantity">Số lượng</label>
                      <input id="quantity" name="quantity" type="number" min="1" value="1" required>
                    </div>
                    <div class="filter-group">
                      <label for="serialNumber">Số Serial xuất kho (tùy chọn)</label>
                      <input id="serialNumber" name="serialNumber" list="pos-sn-list" type="text" placeholder="Chọn hoặc nhập Serial sẵn kho">
                      <datalist id="pos-sn-list">%s</datalist>
                    </div>
                    <div class="filter-group">
                      <label for="paymentMethod">Phương thức thanh toán</label>
                      <select id="paymentMethod" name="paymentMethod">
                        <option value="CASH">Tiền mặt (CASH)</option>
                        <option value="CARD">Quẹt thẻ POS (CARD)</option>
                        <option value="BANK_TRANSFER">Chuyển khoản (BANK_TRANSFER)</option>
                      </select>
                    </div>
                    <div class="filter-group">
                      <label for="customerNote">Thông tin khách hàng / Ghi chú</label>
                      <input id="customerNote" name="customerNote" type="text" placeholder="Tên khách & SĐT">
                    </div>
                    <button class="btn" type="submit">Xuất hóa đơn POS</button>
                  </form>
                </div>
                <div class="panel">
                  <h2>Danh sách Serial trong kho / đã bán</h2>
                  <table><thead><tr><th>Serial</th><th>SKU</th><th>Sản phẩm</th><th>Trạng thái</th><th>Hạn bảo hành</th></tr></thead><tbody>
                """.formatted(csrfInput(csrf), UUID.randomUUID(), skuOptions, snOptions));
        for (var s : serials) {
            body.append("<tr><td><code>").append(escape(s.serialNumber())).append("</code></td>")
                .append("<td>").append(escape(s.sku())).append("</td>")
                .append("<td>").append(escape(s.productName())).append("</td>")
                .append("<td>").append(escape(s.status())).append("</td>")
                .append("<td>").append(s.warrantyUntil() != null ? escape(s.warrantyUntil().toString()) : "-").append("</td></tr>");
        }
        body.append("</tbody></table></div>");
        return document("POS Counter — ProGear Camera", body.toString(), auth, csrf);
    }

    @PostMapping("/pos/orders")
    public ResponseEntity<Void> createPosOrder(@RequestParam String sku,
                                               @RequestParam(defaultValue = "1") int quantity,
                                               @RequestParam(required = false) String serialNumber,
                                               @RequestParam(defaultValue = "CASH") String paymentMethod,
                                               @RequestParam(defaultValue = "") String customerNote,
                                               @RequestParam(required = false) String idempotencyKey,
                                               @RequestHeader(value = "Idempotency-Key", required = false) String headerIdemKey,
                                               Authentication auth) {
        String effectiveKey = (idempotencyKey != null && !idempotencyKey.isBlank()) ? idempotencyKey : headerIdemKey;
        long orderId = service.createPosOrder(auth.getName(), sku, quantity, serialNumber, paymentMethod, customerNote, effectiveKey);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/orders/" + orderId)).build();
    }

    @GetMapping(value = "/admin", produces = MediaType.TEXT_HTML_VALUE)
    public String adminPage(@RequestParam(defaultValue = "all") String range,
                            @RequestParam(required = false) Long editProductId,
                            Authentication auth,
                            CsrfToken csrf) {
        var dash = service.buildDashboard(range);
        var products = service.listAllProducts();
        var categories = service.listAllCategories();
        var brands = service.listAllBrands();
        var users = service.listUsers();
        var audits = service.listRecentAudits();
        var editingProd = editProductId != null ? service.findProductById(editProductId).orElse(null) : null;

        long cancelRatePct = dash.totalOrders() > 0 ? Math.round((dash.cancelledOrders() * 100.0) / dash.totalOrders()) : 0;

        var body = new StringBuilder("""
                <section class="hero">
                  <div style="display:flex;flex-wrap:wrap;justify-content:space-between;align-items:center;gap:1rem">
                    <div>
                      <h1>Quản trị &amp; Phân tích Kinh doanh ProGear</h1>
                      <p>Báo cáo doanh thu thực thu, kênh bán ONLINE/POS, lên kệ hàng (Merchandising), tồn kho, bảo hành và kiểm toán.</p>
                    </div>
                    <div style="display:flex;gap:0.5rem" role="group" aria-label="Bộ lọc thời gian">
                      <a class="btn %s" href="/admin?range=7d">7 ngày qua</a>
                      <a class="btn %s" href="/admin?range=30d">30 ngày qua</a>
                      <a class="btn %s" href="/admin?range=all">Toàn thời gian</a>
                    </div>
                  </div>
                </section>
                """.formatted(
                "7d".equals(dash.range()) ? "" : "btn-secondary",
                "30d".equals(dash.range()) ? "" : "btn-secondary",
                "all".equals(dash.range()) ? "" : "btn-secondary"));

        body.append("<section class=\"kpi-grid\" aria-label=\"Chỉ số kinh doanh cốt lõi\">")
            .append("<div class=\"kpi-card ok\"><p class=\"kpi-title\">Doanh thu thực thu (PAID)</p><p class=\"kpi-val\">")
            .append(formatVnd(dash.paidRevenue())).append("</p><p class=\"kpi-sub\">").append(dash.paidRevenue().toPlainString()).append(" VND — Đã thanh toán</p></div>")
            .append("<div class=\"kpi-card\"><p class=\"kpi-title\">Doanh thu chờ thu (PENDING)</p><p class=\"kpi-val\">")
            .append(formatVnd(dash.pendingRevenue())).append("</p><p class=\"kpi-sub\">").append(dash.pendingOrders().size()).append(" đơn chờ xác nhận tiền</p></div>")
            .append("<div class=\"kpi-card\"><p class=\"kpi-title\">Tổng đơn &amp; Tỷ lệ hủy</p><p class=\"kpi-val\">")
            .append(dash.activeOrders()).append(" / ").append(dash.totalOrders()).append(" đơn</p><p class=\"kpi-sub\">Đã hủy: ")
            .append(dash.cancelledOrders()).append(" đơn (").append(cancelRatePct).append("%)</p></div>")
            .append("<div class=\"kpi-card\"><p class=\"kpi-title\">Kênh bán ONLINE vs POS</p><p class=\"kpi-val\">")
            .append(dash.onlineOrders()).append(" Web / ").append(dash.posOrders()).append(" POS</p><p class=\"kpi-sub\">Web: ")
            .append(formatVnd(dash.onlineRevenue())).append(" | POS: ").append(formatVnd(dash.posRevenue())).append("</p></div>")
            .append("<div class=\"kpi-card ").append(dash.lowStockCount() > 0 ? "warn" : "ok").append("\"><p class=\"kpi-title\">Giá trị Tồn kho &amp; Sắp hết</p><p class=\"kpi-val\">")
            .append(formatVnd(dash.inventoryValue())).append("</p><p class=\"kpi-sub\">").append(dash.totalStockUnits()).append(" máy/ống kính — ")
            .append(dash.lowStockCount()).append(" SP sắp hết (&le;3)</p></div>")
            .append("<div class=\"kpi-card ok\"><p class=\"kpi-title\">Serial &amp; Bảo hành hiệu lực</p><p class=\"kpi-val\">")
            .append(dash.activeWarrantySerials()).append(" máy đang BH</p><p class=\"kpi-sub\">Serial sẵn kho: ")
            .append(dash.inStockSerials()).append(" chiếc</p></div></section>");

        body.append("<div class=\"two-col\"><div class=\"panel\"><h2>Biểu đồ doanh thu theo ngày</h2>");
        if (dash.dailyRevenues().isEmpty()) {
            body.append("<p>Chưa có dữ liệu doanh thu trong kỳ.</p>");
        } else {
            BigDecimal maxDay = dash.dailyRevenues().stream().map(CommerceService.DailyRevenue::revenue).reduce(BigDecimal.ONE, BigDecimal::max);
            if (maxDay.compareTo(BigDecimal.ZERO) <= 0) maxDay = BigDecimal.ONE;
            for (var d : dash.dailyRevenues()) {
                int pct = d.revenue().multiply(BigDecimal.valueOf(100)).divide(maxDay, 0, java.math.RoundingMode.HALF_UP).intValue();
                body.append("<div class=\"bar-row\"><div class=\"bar-label\"><span>").append(escape(d.day().toString()))
                    .append(" (").append(d.orderCount()).append(" đơn)</span><span>").append(formatVnd(d.revenue())).append("</span></div>")
                    .append("<div class=\"bar-track\"><div class=\"bar-fill\" style=\"width:").append(Math.max(4, pct)).append("%\"></div></div></div>");
            }
        }
        body.append("</div><div class=\"panel\"><h2>Top 5 Sản phẩm bán chạy nhất</h2>");
        if (dash.topProducts().isEmpty()) {
            body.append("<p>Chưa có sản phẩm bán ra trong kỳ.</p>");
        } else {
            body.append("<table><thead><tr><th>SKU</th><th>Sản phẩm</th><th>SL bán</th><th>Doanh thu</th></tr></thead><tbody>");
            for (var tp : dash.topProducts()) {
                body.append("<tr><td>").append(escape(tp.sku())).append("</td><td>").append(escape(tp.productName())).append("</td><td>")
                    .append(tp.unitsSold()).append("</td><td>").append(formatVnd(tp.revenue())).append(" (").append(tp.revenue().toPlainString()).append(" VND)</td></tr>");
            }
            body.append("</tbody></table>");
        }
        body.append("</div></div>");

        body.append("<div class=\"two-col\"><div class=\"panel\"><h2>Doanh thu theo Danh mục</h2>");
        appendGroupRevenueBars(body, dash.categoryRevenues(), dash.validRevenue());
        body.append("</div><div class=\"panel\"><h2>Doanh thu theo Thương hiệu</h2>");
        appendGroupRevenueBars(body, dash.brandRevenues(), dash.validRevenue());
        body.append("</div></div>");

        body.append("<div class=\"two-col\"><div class=\"panel\"><h2>Cảnh báo Tồn kho thấp (&le; 3) &amp; Nhập kho nhanh</h2>");
        if (dash.lowStockProducts().isEmpty()) {
            body.append("<p>Tất cả sản phẩm đều đủ tồn kho an toàn (&gt; 3).</p>");
        } else {
            body.append("<table><thead><tr><th>SKU</th><th>Sản phẩm</th><th>Tồn</th><th>Nhập kho nhanh</th></tr></thead><tbody>");
            for (var lp : dash.lowStockProducts()) {
                body.append("<tr><td>").append(escape(lp.sku())).append("</td><td>").append(escape(lp.name())).append("</td>")
                    .append("<td><span class=\"badge badge-out\">").append(lp.stock()).append("</span></td>")
                    .append("<td><form method=\"post\" action=\"/admin/products/").append(lp.id()).append("/stock\" style=\"display:flex;gap:0.35rem;margin:0\">")
                    .append(csrfInput(csrf))
                    .append("<input name=\"stock\" type=\"number\" min=\"0\" value=\"").append(lp.stock() + 10).append("\" style=\"width:75px\" aria-label=\"Tồn kho mới cho ").append(escape(lp.sku())).append("\">")
                    .append("<button class=\"btn btn-sm\" type=\"submit\">Cập nhật</button></form></td></tr>");
            }
            body.append("</tbody></table>");
        }
        body.append("</div><div class=\"panel\"><h2>Đơn chờ duyệt thanh toán / Chờ xử lý</h2>");
        if (dash.pendingOrders().isEmpty()) {
            body.append("<p>Không có đơn hàng chờ thu tiền.</p>");
        } else {
            body.append("<table><thead><tr><th>Đơn</th><th>Khách</th><th>Tổng tiền</th><th>TT</th><th>Duyệt nhanh</th></tr></thead><tbody>");
            for (var po : dash.pendingOrders()) {
                String nextStatus = "CONFIRMED".equals(po.status()) ? "COMPLETED" : "CONFIRMED";
                String btnLabel = "CONFIRMED".equals(po.status()) ? "Hoàn tất &amp; Đã thu" : "Xác nhận Đã thu tiền";
                body.append("<tr><td><a href=\"/orders/").append(po.id()).append("\">#").append(po.id()).append("</a></td>")
                    .append("<td>").append(escape(po.userEmail())).append("</td><td>").append(po.totalAmount().toPlainString()).append(" VND</td>")
                    .append("<td>").append(escape(po.paymentMethod())).append(" (").append(escape(po.status())).append(")</td>")
                    .append("<td><form method=\"post\" action=\"/admin/orders/").append(po.id()).append("/status\" style=\"margin:0\">")
                    .append(csrfInput(csrf))
                    .append("<input type=\"hidden\" name=\"status\" value=\"").append(nextStatus).append("\">")
                    .append("<input type=\"hidden\" name=\"paymentStatus\" value=\"PAID\">")
                    .append("<button class=\"btn btn-sm\" type=\"submit\">").append(btnLabel).append("</button></form></td></tr>");
            }
            body.append("</tbody></table>");
        }
        body.append("</div></div>");

        // Shelf Management / Merchandising Form & Table
        appendShelfManagementSection(body, products, categories, brands, editingProd, csrf);

        // Categories, Brands & Serials Management
        appendTaxonAndSerialSection(body, categories, brands, products, csrf);

        // Users & Audit Log
        body.append("<div class=\"panel\"><h2>Phân quyền Tài khoản (RBAC)</h2>")
            .append("<table><thead><tr><th>ID</th><th>Email</th><th>Họ tên</th><th>SĐT</th><th>Quyền hiện tại</th><th>Đổi quyền</th></tr></thead><tbody>");
        for (var u : users) {
            body.append("<tr><td>").append(u.id()).append("</td><td>").append(escape(u.email())).append("</td><td>")
                .append(escape(u.fullName())).append("</td><td>").append(escape(u.phone())).append("</td><td><span class=\"badge badge-brand\">")
                .append(escape(u.role())).append("</span></td><td>")
                .append("<form method=\"post\" action=\"/admin/users/").append(u.id()).append("/role\" style=\"display:flex;gap:0.4rem;margin:0\">")
                .append(csrfInput(csrf))
                .append("<select name=\"role\" aria-label=\"Quyền cho ").append(escape(u.email())).append("\">")
                .append("<option value=\"ROLE_CUSTOMER\"").append("ROLE_CUSTOMER".equals(u.role()) ? " selected" : "").append(">ROLE_CUSTOMER</option>")
                .append("<option value=\"ROLE_STAFF\"").append("ROLE_STAFF".equals(u.role()) ? " selected" : "").append(">ROLE_STAFF</option>")
                .append("<option value=\"ROLE_ADMIN\"").append("ROLE_ADMIN".equals(u.role()) ? " selected" : "").append(">ROLE_ADMIN</option>")
                .append("</select>")
                .append("<button class=\"btn btn-secondary btn-sm\" type=\"submit\">Cập nhật</button></form></td></tr>");
        }
        body.append("</tbody></table></div>");

        body.append("<div class=\"panel\"><h2>Nhật ký Kiểm toán (Audit Log)</h2>")
            .append("<table><thead><tr><th>Thời gian</th><th>Tác nhân</th><th>Hành động</th><th>Đối tượng</th><th>Chi tiết</th></tr></thead><tbody>");
        for (var a : audits) {
            body.append("<tr><td>").append(escape(a.createdAt().toString())).append("</td><td>").append(escape(a.actor())).append("</td>")
                .append("<td><code>").append(escape(a.action())).append("</code></td><td>").append(escape(a.targetType())).append(" #").append(escape(a.targetId())).append("</td>")
                .append("<td>").append(escape(a.details())).append("</td></tr>");
        }
        body.append("</tbody></table></div>");

        return document("Quản trị — ProGear Camera", body.toString(), auth, csrf);
    }

    private static void appendShelfManagementSection(StringBuilder body,
                                                     List<CommerceService.ProductSnapshot> products,
                                                     List<CommerceService.CategoryRow> categories,
                                                     List<CommerceService.BrandRow> brands,
                                                     CommerceService.ProductSnapshot editingProd,
                                                     CsrfToken csrf) {
        String idVal = editingProd != null ? String.valueOf(editingProd.id()) : "";
        String nameVal = editingProd != null ? editingProd.name() : "";
        String skuVal = editingProd != null ? editingProd.sku() : "";
        String priceVal = editingProd != null ? editingProd.price().toPlainString() : "";
        String stockVal = editingProd != null ? String.valueOf(editingProd.stock()) : "10";
        String imgVal = editingProd != null ? editingProd.imageUrl() : "";
        String descVal = editingProd != null ? editingProd.description() : "";
        boolean visVal = editingProd == null || editingProd.visible();

        body.append("<div class=\"panel\" id=\"shelf-form\"><h2>Quản lý Kệ hàng &amp; Lên kệ Sản phẩm (Merchandising)</h2>")
            .append("<form method=\"post\" action=\"/admin/products\" style=\"display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:0.75rem;margin-bottom:1.5rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"id\" type=\"number\" placeholder=\"ID (trống = thêm mới)\" value=\"").append(idVal).append("\">")
            .append("<input name=\"name\" type=\"text\" required placeholder=\"Tên máy ảnh / ống kính\" value=\"").append(escape(nameVal)).append("\">")
            .append("<input name=\"sku\" type=\"text\" required placeholder=\"Mã SKU\" value=\"").append(escape(skuVal)).append("\">")
            .append("<input name=\"price\" type=\"number\" step=\"0.01\" min=\"0\" required placeholder=\"Giá bán (VND)\" value=\"").append(escape(priceVal)).append("\">")
            .append("<input name=\"stock\" type=\"number\" min=\"0\" value=\"").append(stockVal).append("\" required placeholder=\"Tồn kho\">")
            .append("<select name=\"categoryId\" aria-label=\"Danh mục sản phẩm\">");
        for (var c : categories) {
            boolean sel = editingProd != null && editingProd.categoryId() == c.id();
            body.append("<option value=\"").append(c.id()).append("\"").append(sel ? " selected" : "").append(">")
                .append(escape(c.name())).append(c.visible() ? "" : " (Đang ẩn)").append("</option>");
        }
        body.append("</select><select name=\"brandId\" aria-label=\"Thương hiệu sản phẩm\">");
        for (var b : brands) {
            boolean sel = editingProd != null && editingProd.brandId() == b.id();
            body.append("<option value=\"").append(b.id()).append("\"").append(sel ? " selected" : "").append(">")
                .append(escape(b.name())).append(b.visible() ? "" : " (Đang ẩn)").append("</option>");
        }
        body.append("</select>")
            .append("<input name=\"imageUrl\" type=\"text\" placeholder=\"URL ảnh sản phẩm (https://...)\" value=\"").append(escape(imgVal)).append("\">")
            .append("<input name=\"description\" type=\"text\" placeholder=\"Mô tả thông số kỹ thuật\" value=\"").append(escape(descVal)).append("\">")
            .append("<label style=\"display:flex;align-items:center;gap:0.5rem\"><input name=\"visible\" type=\"checkbox\" value=\"true\"").append(visVal ? " checked" : "").append("> Lên kệ bán</label>")
            .append("<div style=\"display:flex;gap:0.5rem\"><button class=\"btn\" type=\"submit\">Lưu sản phẩm</button>")
            .append(editingProd != null ? "<a class=\"btn btn-secondary\" href=\"/admin\">Hủy sửa</a>" : "")
            .append("</div></form>");

        body.append("<table><thead><tr><th>Ảnh</th><th>ID</th><th>SKU</th><th>Tên sản phẩm</th><th>Danh mục / Hãng</th><th>Giá</th><th>Tồn kho</th><th>Trạng thái kệ</th><th>Thao tác kệ</th></tr></thead><tbody>");
        for (var p : products) {
            String thumb = isSafeImageUrl(p.imageUrl())
                    ? "<img class=\"shelf-thumb\" src=\"" + escape(p.imageUrl()) + "\" alt=\"" + escape(p.name()) + "\">"
                    : "<span class=\"shelf-thumb\">CAM</span>";
            String shelfBadge = p.visible()
                    ? "<span class=\"badge badge-stock\">Đang lên kệ</span>"
                    : "<span class=\"badge badge-out\">Đã hạ kệ</span>";
            body.append("<tr><td>").append(thumb).append("</td><td>").append(p.id()).append("</td><td><code>").append(escape(p.sku())).append("</code></td>")
                .append("<td>").append(escape(p.name())).append("</td>")
                .append("<td>").append(escape(p.categoryName())).append(" / ").append(escape(p.brandName())).append("</td>")
                .append("<td>").append(formatVnd(p.price())).append("</td>")
                .append("<td><form method=\"post\" action=\"/admin/products/").append(p.id()).append("/stock\" style=\"display:inline-flex;gap:0.3rem;margin:0\">")
                .append(csrfInput(csrf))
                .append("<input name=\"stock\" type=\"number\" min=\"0\" value=\"").append(p.stock()).append("\" style=\"width:70px\" aria-label=\"Sửa tồn kho ").append(escape(p.sku())).append("\">")
                .append("<button class=\"btn btn-secondary btn-sm\" type=\"submit\">Lưu kho</button></form></td>")
                .append("<td>").append(shelfBadge).append("</td>")
                .append("<td><div style=\"display:flex;gap:0.35rem;align-items:center\">")
                .append("<form method=\"post\" action=\"/admin/products/").append(p.id()).append("/shelf\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<button class=\"btn ").append(p.visible() ? "btn-secondary" : "").append(" btn-sm\" type=\"submit\">")
                .append(p.visible() ? "Hạ kệ" : "Lên kệ").append("</button></form>")
                .append("<a class=\"btn btn-secondary btn-sm\" href=\"/admin?editProductId=").append(p.id()).append("#shelf-form\">Sửa</a>")
                .append("</div></td></tr>");
        }
        body.append("</tbody></table></div>");
    }

    private static void appendTaxonAndSerialSection(StringBuilder body,
                                                    List<CommerceService.CategoryRow> categories,
                                                    List<CommerceService.BrandRow> brands,
                                                    List<CommerceService.ProductSnapshot> products,
                                                    CsrfToken csrf) {
        body.append("<div class=\"two-col\"><div class=\"panel\"><h2>Kệ Danh mục &amp; Thương hiệu</h2>")
            .append("<form method=\"post\" action=\"/admin/categories\" style=\"display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"name\" type=\"text\" required placeholder=\"Tên danh mục mới\">")
            .append("<label><input name=\"visible\" type=\"checkbox\" value=\"true\" checked> Hiển thị</label>")
            .append("<button class=\"btn btn-sm\" type=\"submit\">Lưu danh mục</button></form>")
            .append("<table><thead><tr><th>ID</th><th>Danh mục</th><th>Trạng thái</th><th>Đổi</th></tr></thead><tbody>");
        for (var c : categories) {
            body.append("<tr><td>").append(c.id()).append("</td><td>").append(escape(c.name())).append("</td><td>")
                .append(c.visible() ? "<span class=\"badge badge-stock\">Hiển thị</span>" : "<span class=\"badge badge-out\">Đang ẩn</span>")
                .append("</td><td><form method=\"post\" action=\"/admin/categories/").append(c.id()).append("/shelf\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<button class=\"btn btn-secondary btn-sm\" type=\"submit\">").append(c.visible() ? "Ẩn" : "Hiện").append("</button></form></td></tr>");
        }
        body.append("</tbody></table><hr style=\"border:none;border-top:1px solid var(--border);margin:1rem 0\">")
            .append("<form method=\"post\" action=\"/admin/brands\" style=\"display:flex;gap:0.5rem;flex-wrap:wrap;margin-bottom:0.75rem\">")
            .append(csrfInput(csrf))
            .append("<input name=\"name\" type=\"text\" required placeholder=\"Tên thương hiệu mới\">")
            .append("<label><input name=\"visible\" type=\"checkbox\" value=\"true\" checked> Hiển thị</label>")
            .append("<button class=\"btn btn-sm\" type=\"submit\">Lưu thương hiệu</button></form>")
            .append("<table><thead><tr><th>ID</th><th>Thương hiệu</th><th>Trạng thái</th><th>Đổi</th></tr></thead><tbody>");
        for (var b : brands) {
            body.append("<tr><td>").append(b.id()).append("</td><td>").append(escape(b.name())).append("</td><td>")
                .append(b.visible() ? "<span class=\"badge badge-stock\">Hiển thị</span>" : "<span class=\"badge badge-out\">Đang ẩn</span>")
                .append("</td><td><form method=\"post\" action=\"/admin/brands/").append(b.id()).append("/shelf\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<button class=\"btn btn-secondary btn-sm\" type=\"submit\">").append(b.visible() ? "Ẩn" : "Hiện").append("</button></form></td></tr>");
        }
        body.append("</tbody></table></div>");

        body.append("<div class=\"panel\"><h2>Nhập Serial Bảo hành vào kho</h2>")
            .append("<form method=\"post\" action=\"/admin/serials\" style=\"display:grid;gap:0.75rem\">")
            .append(csrfInput(csrf))
            .append("<div class=\"filter-group\"><label for=\"serialProductId\">Chọn sản phẩm</label><select id=\"serialProductId\" name=\"productId\">");
        for (var p : products) {
            body.append("<option value=\"").append(p.id()).append("\">#").append(p.id()).append(" — ")
                .append(escape(p.sku())).append(" (").append(escape(p.name())).append(")</option>");
        }
        body.append("</select></div>")
            .append("<div class=\"filter-group\"><label for=\"serialNumInput\">Mã Serial Number</label>")
            .append("<input id=\"serialNumInput\" name=\"serialNumber\" type=\"text\" required placeholder=\"VD: SN-SONY-A7M4-099\"></div>")
            .append("<button class=\"btn\" type=\"submit\">Thêm Serial</button></form></div></div>");
    }

    private static void appendGroupRevenueBars(StringBuilder body, List<CommerceService.GroupRevenue> groups, BigDecimal totalValidRevenue) {
        if (groups.isEmpty()) {
            body.append("<p>Chưa có doanh thu phát sinh.</p>");
            return;
        }
        BigDecimal denom = (totalValidRevenue != null && totalValidRevenue.compareTo(BigDecimal.ZERO) > 0) ? totalValidRevenue : BigDecimal.ONE;
        for (var g : groups) {
            int pct = g.revenue().multiply(BigDecimal.valueOf(100)).divide(denom, 0, java.math.RoundingMode.HALF_UP).intValue();
            body.append("<div class=\"bar-row\"><div class=\"bar-label\"><span>").append(escape(g.name())).append(" (").append(g.unitsSold()).append(" SP)</span><span>")
                .append(formatVnd(g.revenue())).append(" (").append(pct).append("%)</span></div>")
                .append("<div class=\"bar-track\"><div class=\"bar-fill\" style=\"width:").append(Math.max(4, pct)).append("%\"></div></div></div>");
        }
    }

    @PostMapping("/admin/products")
    public ResponseEntity<Void> saveProduct(@RequestParam(required = false) Long id,
                                            @RequestParam long categoryId,
                                            @RequestParam long brandId,
                                            @RequestParam String name,
                                            @RequestParam String sku,
                                            @RequestParam BigDecimal price,
                                            @RequestParam(defaultValue = "0") int stock,
                                            @RequestParam(defaultValue = "") String description,
                                            @RequestParam(defaultValue = "") String imageUrl,
                                            @RequestParam(defaultValue = "false") boolean visible,
                                            Authentication auth) {
        service.saveProduct(auth.getName(), id, categoryId, brandId, name, sku, price, stock, description, imageUrl, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/products/{id}/shelf")
    public ResponseEntity<Void> toggleProductShelf(@PathVariable long id, Authentication auth) {
        service.toggleProductShelf(auth.getName(), id);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/products/{id}/stock")
    public ResponseEntity<Void> updateProductStock(@PathVariable long id,
                                                   @RequestParam int stock,
                                                   Authentication auth) {
        service.adminUpdateProductStock(auth.getName(), id, stock);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/categories")
    public ResponseEntity<Void> saveCategory(@RequestParam(required = false) Long id,
                                             @RequestParam String name,
                                             @RequestParam(defaultValue = "false") boolean visible,
                                             Authentication auth) {
        service.saveCategory(auth.getName(), id, name, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/categories/{id}/shelf")
    public ResponseEntity<Void> toggleCategoryShelf(@PathVariable long id, Authentication auth) {
        service.toggleCategoryShelf(auth.getName(), id);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/brands")
    public ResponseEntity<Void> saveBrand(@RequestParam(required = false) Long id,
                                          @RequestParam String name,
                                          @RequestParam(defaultValue = "false") boolean visible,
                                          Authentication auth) {
        service.saveBrand(auth.getName(), id, name, visible);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }

    @PostMapping("/admin/brands/{id}/shelf")
    public ResponseEntity<Void> toggleBrandShelf(@PathVariable long id, Authentication auth) {
        service.toggleBrandShelf(auth.getName(), id);
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
                                                  @RequestParam(defaultValue = "false") boolean returnToOrder,
                                                  Authentication auth) {
        service.adminUpdateOrder(auth.getName(), id, status, paymentStatus);
        String target = returnToOrder ? "/orders/" + id : "/admin";
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create(target)).build();
    }

    @PostMapping("/admin/users/{id}/role")
    public ResponseEntity<Void> updateUserRole(@PathVariable long id,
                                               @RequestParam String role,
                                               Authentication auth) {
        service.adminUpdateUserRole(auth.getName(), id, role);
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/admin")).build();
    }
}
