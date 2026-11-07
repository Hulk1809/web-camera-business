package com.progear.catalog;

import java.math.BigDecimal;
import java.net.URI;
import java.text.NumberFormat;
import java.util.Locale;
import java.util.Map;

import jakarta.servlet.http.HttpSession;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.web.csrf.CsrfToken;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.util.UriUtils;

@Controller
@ControllerAdvice
@ResponseBody
public class CatalogController {
    private static final Locale VI_VN = Locale.of("vi", "VN");
    public static final String STYLES = """
            :root { --bg:#f8fafc; --surface:#ffffff; --text:#0f172a; --muted:#475569; --border:#e2e8f0; --primary:#0284c7; --primary-dark:#0369a1; --badge-bg:#f1f5f9; --success:#15803d; --danger:#b91c1c; }
            * { box-sizing:border-box; }
            body { margin:0; font-family:system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
            header { background:#0f172a; color:#fff; padding:1rem 1.5rem; border-bottom:3px solid var(--primary); }
            .nav-wrap { max-width:1200px; margin:0 auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; }
            .brand-logo { font-size:1.35rem; font-weight:800; color:#fff; text-decoration:none; letter-spacing:-0.02em; }
            .brand-logo span { color:#38bdf8; }
            nav { display:flex; flex-wrap:wrap; align-items:center; gap:0.35rem; }
            nav a { color:#e2e8f0; text-decoration:none; font-weight:500; padding:0.4rem 0.75rem; border-radius:0.375rem; font-size:0.92rem; }
            nav a:hover, nav a:focus-visible { background:#1e293b; color:#fff; outline:2px solid #38bdf8; }
            main { max-width:1200px; margin:2rem auto; padding:0 1.5rem; min-height:70vh; }
            .hero { background:linear-gradient(135deg,#0f172a,#1e293b); color:#fff; padding:2rem; border-radius:0.75rem; margin-bottom:1.5rem; }
            .hero h1 { margin:0 0 0.5rem; font-size:1.85rem; }
            .hero p { margin:0; color:#cbd5e1; }
            .filter-bar { background:var(--surface); border:1px solid var(--border); border-radius:0.75rem; padding:1rem 1.25rem; margin-bottom:1.5rem; display:flex; flex-wrap:wrap; gap:0.75rem; align-items:end; }
            .filter-group { display:flex; flex-direction:column; gap:0.25rem; flex:1; min-width:160px; }
            .filter-group label { font-size:0.8rem; font-weight:600; color:var(--muted); }
            input, select, textarea { padding:0.5rem 0.75rem; border:1px solid var(--border); border-radius:0.5rem; font:inherit; font-size:0.92rem; background:#fff; color:var(--text); }
            .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.5rem; list-style:none; padding:0; margin:0; }
            .card { background:var(--surface); border:1px solid var(--border); border-radius:0.75rem; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; transition:transform .15s,box-shadow .15s; }
            .card:hover { transform:translateY(-2px); box-shadow:0 10px 20px -5px rgba(15,23,42,0.08); }
            .thumb { background:linear-gradient(135deg,#0f172a,#1e3a5f); color:#38bdf8; border-radius:0.5rem; height:160px; display:flex; align-items:center; justify-content:center; margin-bottom:0.85rem; overflow:hidden; }
            .thumb img { width:100%; height:100%; object-fit:cover; display:block; }
            .shelf-thumb { width:48px; height:48px; border-radius:0.375rem; object-fit:cover; background:#0f172a; display:inline-flex; align-items:center; justify-content:center; color:#38bdf8; font-size:0.7rem; overflow:hidden; }
            .badges { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem; }
            .badge { font-size:0.75rem; font-weight:600; background:var(--badge-bg); color:var(--muted); padding:0.2rem 0.6rem; border-radius:999px; white-space:nowrap; display:inline-block; }
            .badge-brand { background:#e0f2fe; color:#0369a1; }
            .badge-stock { background:#dcfce7; color:#15803d; }
            .badge-out { background:#fee2e2; color:#b91c1c; }
            .card h2 { font-size:1.15rem; margin:0 0 0.5rem; }
            .card h2 a { color:var(--text); text-decoration:none; }
            .card h2 a:hover, .card h2 a:focus-visible { color:var(--primary); text-decoration:underline; }
            .sku { font-size:0.8rem; color:var(--muted); font-family:monospace; margin-bottom:0.5rem; }
            .desc { font-size:0.9rem; color:var(--muted); margin:0 0 1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
            .price-box { border-top:1px solid var(--border); padding-top:0.75rem; display:flex; align-items:center; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; }
            .price-fmt { font-size:1.2rem; font-weight:700; color:var(--primary-dark); }
            .price-raw { font-size:0.8rem; color:var(--muted); }
            .btn { display:inline-block; background:var(--primary); color:#fff; text-decoration:none; font-weight:600; padding:0.5rem 1rem; border-radius:0.5rem; font-size:0.9rem; border:none; cursor:pointer; white-space:nowrap; }
            .btn:hover, .btn:focus-visible { background:var(--primary-dark); outline:2px solid var(--primary-dark); outline-offset:2px; }
            .btn-secondary { background:#334155; }
            .btn-danger { background:var(--danger); }
            .btn-sm { padding:0.3rem 0.65rem; font-size:0.8rem; }
            .detail-card, .panel { background:var(--surface); border:1px solid var(--border); border-radius:0.75rem; padding:1.5rem; margin-top:1rem; }
            .specs { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; background:var(--bg); padding:1.25rem; border-radius:0.5rem; border:1px solid var(--border); margin:1.5rem 0; }
            .specs dt { font-size:0.8rem; text-transform:uppercase; color:var(--muted); font-weight:600; }
            .specs dd { margin:0.25rem 0 0; font-size:1.05rem; font-weight:700; }
            .pagination { margin-top:2rem; display:flex; gap:1rem; align-items:center; }
            .empty { background:var(--surface); border:1px dashed var(--border); border-radius:0.75rem; padding:3rem; text-align:center; color:var(--muted); }
            .alert { padding:0.85rem 1rem; border-radius:0.5rem; margin-bottom:1rem; font-weight:600; background:#e0f2fe; color:#0369a1; border:1px solid #bae6fd; }
            .alert-error { background:#fee2e2; color:#b91c1c; border-color:#fecaca; }
            table { width:100%; border-collapse:collapse; margin-top:0.75rem; font-size:0.92rem; }
            th, td { text-align:left; padding:0.65rem 0.75rem; border-bottom:1px solid var(--border); vertical-align:middle; }
            th { background:var(--bg); font-weight:700; color:var(--muted); font-size:0.8rem; text-transform:uppercase; }
            .kpi-grid { display:grid; grid-template-columns:repeat(auto-fit,minmax(220px,1fr)); gap:1rem; margin:1.25rem 0; }
            .kpi-card { background:var(--surface); border:1px solid var(--border); border-left:4px solid var(--primary); border-radius:0.75rem; padding:1rem 1.25rem; }
            .kpi-card.warn { border-left-color:var(--danger); }
            .kpi-card.ok { border-left-color:var(--success); }
            .kpi-title { font-size:0.78rem; text-transform:uppercase; color:var(--muted); font-weight:700; margin:0; }
            .kpi-val { font-size:1.35rem; font-weight:800; color:var(--text); margin:0.35rem 0 0.2rem; }
            .kpi-sub { font-size:0.82rem; color:var(--muted); margin:0; }
            .bar-row { margin-bottom:0.65rem; }
            .bar-label { display:flex; justify-content:space-between; font-size:0.85rem; font-weight:600; margin-bottom:0.2rem; }
            .bar-track { background:var(--badge-bg); border-radius:999px; height:10px; overflow:hidden; }
            .bar-fill { background:linear-gradient(90deg,var(--primary),#38bdf8); height:100%; border-radius:999px; }
            .two-col { display:grid; grid-template-columns:repeat(auto-fit,minmax(340px,1fr)); gap:1rem; }
            footer { background:#0f172a; color:#94a3b8; text-align:center; padding:1.5rem; font-size:0.875rem; margin-top:3rem; }
            """;

    private static final String CAMERA_SVG = """
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
            """;

    private final Catalog catalog;

    public CatalogController(Catalog catalog) {
        this.catalog = catalog;
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<String> handleStatusException(ResponseStatusException ex, Authentication auth, CsrfToken csrf) {
        String reason = ex.getReason() != null && !ex.getReason().isBlank()
                ? ex.getReason()
                : "Yêu cầu không hợp lệ hoặc không tìm thấy dữ liệu.";
        return renderError(ex.getStatusCode(), reason, auth, csrf);
    }

    @ExceptionHandler({MethodArgumentTypeMismatchException.class, MissingServletRequestParameterException.class, IllegalArgumentException.class})
    public ResponseEntity<String> handleBadRequest(Exception ex, Authentication auth, CsrfToken csrf) {
        return renderError(HttpStatus.BAD_REQUEST, "Tham số yêu cầu không hợp lệ.", auth, csrf);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<String> handleDataIntegrity(DataIntegrityViolationException ex, Authentication auth, CsrfToken csrf) {
        return renderError(HttpStatus.CONFLICT, "Dữ liệu bị trùng lặp (SKU, Serial hoặc tên đã tồn tại) hoặc vi phạm ràng buộc hệ thống.", auth, csrf);
    }

    private static ResponseEntity<String> renderError(org.springframework.http.HttpStatusCode status, String reason, Authentication auth, CsrfToken csrf) {
        String html = document("Thông báo — ProGear Camera",
                "<div class=\"panel\"><div class=\"alert alert-error\">" + escape(reason) + "</div>"
                + "<p><a class=\"btn btn-secondary\" href=\"/products\">&larr; Quay lại trang sản phẩm</a></p></div>",
                auth, csrf);
        return ResponseEntity.status(status)
                .contentType(MediaType.parseMediaType("text/html;charset=UTF-8"))
                .body(html);
    }

    @GetMapping("/")
    public ResponseEntity<Void> home() {
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/products")).build();
    }

    @GetMapping(value = "/products", produces = MediaType.TEXT_HTML_VALUE)
    public String list(@RequestParam(defaultValue = "0") int page,
                       @RequestParam(required = false) String q,
                       @RequestParam(required = false) Long categoryId,
                       @RequestParam(required = false) Long brandId,
                       @RequestParam(required = false) String sort,
                       @RequestParam(defaultValue = "false") boolean inStock,
                       Authentication auth,
                       CsrfToken csrf) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        var products = catalog.list(page, q, categoryId, brandId, sort, inStock);
        var categories = catalog.categories();
        var brands = catalog.brands();

        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Máy ảnh và phụ kiện</h1>
                  <p>Hệ thống thiết bị nhiếp ảnh chính hãng dành cho nhiếp ảnh gia chuyên nghiệp và studio.</p>
                </section>
                <form class="filter-bar" method="get" action="/products" aria-label="Bộ lọc sản phẩm">
                  <div class="filter-group">
                    <label for="q">Tìm kiếm tên / SKU</label>
                    <input id="q" name="q" type="search" placeholder="VD: Sony A7 IV, Canon R6..." value="%s">
                  </div>
                  <div class="filter-group">
                    <label for="categoryId">Danh mục</label>
                    <select id="categoryId" name="categoryId">
                      <option value="">Tất cả danh mục</option>
                """.formatted(escape(q == null ? "" : q)));

        for (var c : categories) {
            boolean sel = categoryId != null && categoryId == c.id();
            body.append("<option value=\"").append(c.id()).append("\"").append(sel ? " selected" : "").append(">")
                    .append(escape(c.name())).append("</option>");
        }
        body.append("""
                    </select>
                  </div>
                  <div class="filter-group">
                    <label for="brandId">Thương hiệu</label>
                    <select id="brandId" name="brandId">
                      <option value="">Tất cả thương hiệu</option>
                """);
        for (var b : brands) {
            boolean sel = brandId != null && brandId == b.id();
            body.append("<option value=\"").append(b.id()).append("\"").append(sel ? " selected" : "").append(">")
                    .append(escape(b.name())).append("</option>");
        }
        String sVal = sort == null ? "" : sort;
        body.append("""
                    </select>
                  </div>
                  <div class="filter-group">
                    <label for="sort">Sắp xếp</label>
                    <select id="sort" name="sort">
                      <option value="">Mặc định</option>
                      <option value="price_asc"%s>Giá thấp đến cao</option>
                      <option value="price_desc"%s>Giá cao đến thấp</option>
                      <option value="newest"%s>Mới lên kệ</option>
                    </select>
                  </div>
                  <label style="display:flex;align-items:center;gap:0.4rem;font-size:0.88rem;font-weight:600;padding-bottom:0.45rem">
                    <input type="checkbox" name="inStock" value="true"%s> Còn hàng
                  </label>
                  <div>
                    <button class="btn" type="submit">Lọc sản phẩm</button>
                    <a class="btn btn-secondary" href="/products">Xóa lọc</a>
                  </div>
                </form>
                """.formatted(
                "price_asc".equals(sVal) ? " selected" : "",
                "price_desc".equals(sVal) ? " selected" : "",
                "newest".equals(sVal) ? " selected" : "",
                inStock ? " checked" : ""));

        if (products.isEmpty()) {
            body.append("<div class=\"empty\" role=\"status\"><p>Chưa có sản phẩm.</p></div>");
        } else {
            body.append("<ul class=\"grid\" aria-label=\"Danh sách sản phẩm\">");
            products.stream().limit(50).forEach(p -> appendProductCard(body, p, csrf));
            body.append("</ul>");
        }
        var filterTail = new StringBuilder();
        if (q != null && !q.isBlank()) filterTail.append("&q=").append(escape(UriUtils.encodeQueryParam(q, java.nio.charset.StandardCharsets.UTF_8)));
        if (categoryId != null && categoryId > 0) filterTail.append("&categoryId=").append(categoryId);
        if (brandId != null && brandId > 0) filterTail.append("&brandId=").append(brandId);
        if (sort != null && !sort.isBlank()) filterTail.append("&sort=").append(escape(UriUtils.encodeQueryParam(sort, java.nio.charset.StandardCharsets.UTF_8)));
        if (inStock) filterTail.append("&inStock=true");

        body.append("<nav class=\"pagination\" aria-label=\"Phân trang\">");
        if (page > 0) body.append("<a class=\"btn\" href=\"/products?page=").append(page - 1).append(filterTail).append("\">Trang trước</a> ");
        if (products.size() > 50) body.append("<a class=\"btn\" href=\"/products?page=").append((long) page + 1).append(filterTail).append("\">Trang sau</a>");
        body.append("</nav>");
        return document("Sản phẩm — ProGear Camera", body.toString(), auth, csrf);
    }

    @GetMapping(value = "/products/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String detail(@PathVariable long id, Authentication auth, CsrfToken csrf) {
        var p = catalog.find(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        String stockText = p.stock() > 0 ? ("Còn hàng (" + p.stock() + " sản phẩm)") : "Hết hàng";
        var body = new StringBuilder()
                .append("<nav aria-label=\"Breadcrumb\"><a class=\"btn btn-secondary\" href=\"/products\">&larr; Danh sách sản phẩm</a></nav>")
                .append("<article class=\"detail-card\">")
                .append(isSafeImageUrl(p.imageUrl())
                        ? "<div class=\"thumb\" style=\"height:280px;max-width:480px\"><img src=\"" + escape(p.imageUrl()) + "\" alt=\"" + escape(p.name()) + "\" loading=\"lazy\"></div>"
                        : "")
                .append("<div class=\"badges\">")
                .append("<span class=\"badge badge-brand\">").append(escape(p.brand())).append("</span>")
                .append("<span class=\"badge\">").append(escape(p.category())).append("</span></div>")
                .append("<h1>").append(escape(p.name())).append("</h1>")
                .append("<dl class=\"specs\">")
                .append("<div><dt>SKU</dt><dd>").append(escape(p.sku())).append("</dd></div>")
                .append("<div><dt>Giá</dt><dd><span class=\"price-fmt\">").append(formatVnd(p.price())).append("</span> <span class=\"price-raw\">(").append(p.price().toPlainString()).append(" VND)</span></dd></div>")
                .append("<div><dt>Danh mục</dt><dd>").append(escape(p.category())).append("</dd></div>")
                .append("<div><dt>Thương hiệu</dt><dd>").append(escape(p.brand())).append("</dd></div>")
                .append("<div><dt>Tồn kho</dt><dd>").append(escape(stockText)).append("</dd></div>")
                .append("</dl><h2>Mô tả</h2><p style=\"white-space:pre-wrap\">").append(escape(p.description())).append("</p>")
                .append("<form method=\"post\" action=\"/cart/add\" style=\"margin-top:1.5rem;display:flex;gap:0.75rem;align-items:center\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"productId\" value=\"").append(p.id()).append("\">")
                .append("<label for=\"qty\">Số lượng:</label>")
                .append("<input id=\"qty\" name=\"quantity\" type=\"number\" min=\"1\" max=\"").append(Math.max(1, p.stock())).append("\" value=\"1\" style=\"width:90px\"").append(p.stock() > 0 ? "" : " disabled").append(">")
                .append("<button class=\"btn\" type=\"submit\"").append(p.stock() > 0 ? "" : " disabled style=\"opacity:0.5;cursor:not-allowed\"").append(">")
                .append(p.stock() > 0 ? "Thêm vào giỏ hàng" : "Tạm hết hàng").append("</button>")
                .append("</form></article>");

        var related = catalog.related(p.id(), p.categoryId());
        if (!related.isEmpty()) {
            body.append("<section class=\"panel\"><h2>Sản phẩm gợi ý cùng kệ</h2><ul class=\"grid\">");
            related.forEach(rp -> appendProductCard(body, rp, csrf));
            body.append("</ul></section>");
        }
        return document(p.name() + " — ProGear Camera", body.toString(), auth, csrf);
    }

    private static void appendProductCard(StringBuilder body, Catalog.Product p, CsrfToken csrf) {
        String stockBadge = p.stock() > 0
                ? "<span class=\"badge badge-stock\">Còn " + p.stock() + " SP</span>"
                : "<span class=\"badge badge-out\">Hết hàng</span>";
        String media = isSafeImageUrl(p.imageUrl())
                ? "<img src=\"" + escape(p.imageUrl()) + "\" alt=\"" + escape(p.name()) + "\" loading=\"lazy\">"
                : CAMERA_SVG;
        body.append("<li class=\"card\"><div><div class=\"thumb\">").append(media).append("</div>")
                .append("<div class=\"badges\">")
                .append("<span class=\"badge badge-brand\">").append(escape(p.brand())).append("</span>")
                .append("<span class=\"badge\">").append(escape(p.category())).append("</span>")
                .append(stockBadge).append("</div>")
                .append("<h2><a href=\"/products/").append(p.id()).append("\">").append(escape(p.name())).append("</a></h2>")
                .append("<div class=\"sku\">SKU: ").append(escape(p.sku())).append("</div>")
                .append("<p class=\"desc\">").append(escape(p.description())).append("</p></div>")
                .append("<div class=\"price-box\"><div><div class=\"price-fmt\">").append(formatVnd(p.price()))
                .append("</div><div class=\"price-raw\">").append(p.price().toPlainString()).append(" VND</div></div>")
                .append("<div style=\"display:flex;gap:0.4rem;align-items:center\">")
                .append("<a class=\"btn btn-secondary\" href=\"/products/").append(p.id()).append("\">Xem chi tiết</a>")
                .append("<form method=\"post\" action=\"/cart/add\" style=\"margin:0\">")
                .append(csrfInput(csrf))
                .append("<input type=\"hidden\" name=\"productId\" value=\"").append(p.id()).append("\">")
                .append("<input type=\"hidden\" name=\"quantity\" value=\"1\">")
                .append("<button class=\"btn\" type=\"submit\"").append(p.stock() > 0 ? "" : " disabled style=\"opacity:0.5;cursor:not-allowed\"").append(">")
                .append(p.stock() > 0 ? "Thêm vào giỏ" : "Hết hàng").append("</button></form>")
                .append("</div></div></li>");
    }

    public static boolean isSafeImageUrl(String url) {
        return url != null && !url.isBlank()
                && (url.startsWith("https://") || url.startsWith("http://") || url.startsWith("/"));
    }

    @GetMapping(value = "/warranty", produces = MediaType.TEXT_HTML_VALUE)
    public String warranty(@RequestParam(required = false) String serial, Authentication auth, CsrfToken csrf) {
        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Tra cứu bảo hành chính hãng</h1>
                  <p>Nhập mã Serial Number trên thân máy hoặc ống kính để kiểm tra thời hạn bảo hành điện tử.</p>
                </section>
                <div class="panel">
                  <form method="get" action="/warranty" style="display:flex;gap:0.75rem;flex-wrap:wrap;align-items:end">
                    <div class="filter-group">
                      <label for="serial">Số Serial (VD: SN-DEMO-WARRANTY-2027)</label>
                      <input id="serial" name="serial" type="text" required placeholder="Nhập Serial Number..." value="%s">
                    </div>
                    <button class="btn" type="submit">Tra cứu</button>
                  </form>
                """.formatted(escape(serial == null ? "" : serial)));

        if (serial != null && !serial.isBlank()) {
            var info = catalog.findWarranty(serial);
            if (info.isEmpty()) {
                body.append("<div class=\"alert alert-error\" style=\"margin-top:1rem\">Không tìm thấy thông tin bảo hành cho số serial: ")
                        .append(escape(serial)).append("</div>");
            } else {
                var w = info.get();
                body.append("<dl class=\"specs\" style=\"margin-top:1.5rem\">")
                        .append("<div><dt>Số Serial</dt><dd>").append(escape(w.serialNumber())).append("</dd></div>")
                        .append("<div><dt>Sản phẩm</dt><dd>").append(escape(w.productName())).append("</dd></div>")
                        .append("<div><dt>SKU</dt><dd>").append(escape(w.sku())).append("</dd></div>")
                        .append("<div><dt>Thương hiệu</dt><dd>").append(escape(w.brand())).append("</dd></div>")
                        .append("<div><dt>Trạng thái</dt><dd>").append(escape(w.status())).append("</dd></div>")
                        .append("<div><dt>Hạn bảo hành</dt><dd>")
                        .append(w.warrantyUntil() != null ? escape(w.warrantyUntil().toString()) : "Chưa kích hoạt")
                        .append("</dd></div></dl>");
            }
        }
        body.append("</div>");
        return document("Tra cứu bảo hành — ProGear Camera", body.toString(), auth, csrf);
    }

    public static String formatVnd(BigDecimal price) {
        NumberFormat nf = NumberFormat.getNumberInstance(VI_VN);
        nf.setMaximumFractionDigits(2);
        return nf.format(price) + " ₫";
    }

    public static String escape(String text) {
        return text == null ? "" : HtmlUtils.htmlEscape(text, "UTF-8");
    }

    public static String csrfInput(CsrfToken csrf) {
        if (csrf == null) return "";
        return "<input type=\"hidden\" name=\"" + escape(csrf.getParameterName())
                + "\" value=\"" + escape(csrf.getToken()) + "\">";
    }

    private static int currentCartCount() {
        if (RequestContextHolder.getRequestAttributes() instanceof ServletRequestAttributes sra) {
            HttpSession session = sra.getRequest().getSession(false);
            if (session != null && session.getAttribute("PROGEAR_CART") instanceof Map<?, ?> map) {
                int sum = 0;
                for (Object v : map.values()) {
                    if (v instanceof Number n && n.intValue() > 0) sum += n.intValue();
                }
                return sum;
            }
        }
        return 0;
    }

    public static String document(String title, String body, Authentication auth, CsrfToken csrf) {
        boolean loggedIn = auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal());
        boolean isAdmin = loggedIn && auth.getAuthorities().stream().anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()));
        boolean isStaff = loggedIn && auth.getAuthorities().stream().anyMatch(a -> "ROLE_STAFF".equals(a.getAuthority()) || "ROLE_ADMIN".equals(a.getAuthority()));
        int cartCount = currentCartCount();

        var nav = new StringBuilder("<nav aria-label=\"Menu chính\">")
                .append("<a href=\"/products\">Sản phẩm</a>")
                .append("<a href=\"/warranty\">Bảo hành</a>")
                .append("<a href=\"/cart\">Giỏ hàng").append(cartCount > 0 ? " (" + cartCount + ")" : "").append("</a>")
                .append("<a href=\"/orders\">Đơn hàng</a>");
        if (isStaff) {
            nav.append("<a href=\"/pos\">POS</a>");
        }
        if (isAdmin) {
            nav.append("<a href=\"/admin\">Quản trị</a>");
        }
        if (loggedIn) {
            nav.append("<a href=\"/profile\">Tài khoản (").append(escape(auth.getName())).append(")</a>")
               .append("<form method=\"post\" action=\"/logout\" style=\"display:inline;margin:0\">")
               .append(csrfInput(csrf))
               .append("<button class=\"btn btn-secondary\" type=\"submit\" style=\"padding:0.35rem 0.7rem;font-size:0.85rem\">Đăng xuất</button></form>");
        } else {
            nav.append("<a href=\"/login\">Đăng nhập</a>")
               .append("<a href=\"/register\">Đăng ký</a>");
        }
        nav.append("</nav>");

        return "<!doctype html><html lang=\"vi\"><head><meta charset=\"UTF-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>"
                + escape(title) + "</title><style>" + STYLES + "</style></head><body>"
                + "<header><div class=\"nav-wrap\"><a class=\"brand-logo\" href=\"/products\">ProGear <span>Camera</span></a>"
                + nav + "</div></header>"
                + "<main>" + body + "</main>"
                + "<footer>&copy; 2026 ProGear Camera Vietnam — Chuyên máy ảnh &amp; ống kính chính hãng.</footer>"
                + "</body></html>";
    }
}
