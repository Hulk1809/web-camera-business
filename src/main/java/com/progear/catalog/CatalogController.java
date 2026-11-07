package com.progear.catalog;

import java.math.BigDecimal;
import java.net.URI;
import java.text.NumberFormat;
import java.util.Locale;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.util.HtmlUtils;

@Controller
@ResponseBody
public class CatalogController {
    private static final Locale VI_VN = Locale.of("vi", "VN");
    private static final String STYLES = """
            :root { --bg:#f8fafc; --surface:#ffffff; --text:#0f172a; --muted:#475569; --border:#e2e8f0; --primary:#0284c7; --primary-dark:#0369a1; --badge-bg:#f1f5f9; }
            * { box-sizing:border-box; }
            body { margin:0; font-family:system-ui,-apple-system,sans-serif; background:var(--bg); color:var(--text); line-height:1.6; }
            header { background:#0f172a; color:#fff; padding:1rem 1.5rem; border-bottom:3px solid var(--primary); }
            .nav-wrap { max-width:1200px; margin:0 auto; display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:1rem; }
            .brand-logo { font-size:1.35rem; font-weight:800; color:#fff; text-decoration:none; letter-spacing:-0.02em; }
            .brand-logo span { color:#38bdf8; }
            nav a { color:#e2e8f0; text-decoration:none; font-weight:500; padding:0.4rem 0.75rem; border-radius:0.375rem; }
            nav a:hover, nav a:focus-visible { background:#1e293b; color:#fff; outline:2px solid #38bdf8; }
            main { max-width:1200px; margin:2rem auto; padding:0 1.5rem; min-height:70vh; }
            .hero { background:linear-gradient(135deg,#0f172a,#1e293b); color:#fff; padding:2rem; border-radius:0.75rem; margin-bottom:2rem; }
            .hero h1 { margin:0 0 0.5rem; font-size:1.85rem; }
            .hero p { margin:0; color:#cbd5e1; }
            .grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(280px,1fr)); gap:1.5rem; list-style:none; padding:0; margin:0; }
            .card { background:var(--surface); border:1px solid var(--border); border-radius:0.75rem; padding:1.25rem; display:flex; flex-direction:column; justify-content:space-between; transition:transform .15s,box-shadow .15s; }
            .card:hover { transform:translateY(-2px); box-shadow:0 10px 20px -5px rgba(15,23,42,0.08); }
            .badges { display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:0.75rem; }
            .badge { font-size:0.75rem; font-weight:600; background:var(--badge-bg); color:var(--muted); padding:0.2rem 0.6rem; border-radius:999px; }
            .badge-brand { background:#e0f2fe; color:#0369a1; }
            .card h2 { font-size:1.15rem; margin:0 0 0.5rem; }
            .card h2 a { color:var(--text); text-decoration:none; }
            .card h2 a:hover, .card h2 a:focus-visible { color:var(--primary); text-decoration:underline; }
            .sku { font-size:0.8rem; color:var(--muted); font-family:monospace; margin-bottom:0.5rem; }
            .desc { font-size:0.9rem; color:var(--muted); margin:0 0 1rem; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden; }
            .price-box { border-top:1px solid var(--border); padding-top:0.75rem; display:flex; align-items:baseline; justify-content:space-between; flex-wrap:wrap; gap:0.5rem; }
            .price-fmt { font-size:1.2rem; font-weight:700; color:var(--primary-dark); }
            .price-raw { font-size:0.8rem; color:var(--muted); }
            .btn { display:inline-block; background:var(--primary); color:#fff; text-decoration:none; font-weight:600; padding:0.5rem 1rem; border-radius:0.5rem; font-size:0.9rem; }
            .btn:hover, .btn:focus-visible { background:var(--primary-dark); outline:2px solid var(--primary-dark); outline-offset:2px; }
            .detail-card { background:var(--surface); border:1px solid var(--border); border-radius:0.75rem; padding:2rem; margin-top:1rem; }
            .specs { display:grid; grid-template-columns:repeat(auto-fit,minmax(200px,1fr)); gap:1rem; background:var(--bg); padding:1.25rem; border-radius:0.5rem; border:1px solid var(--border); margin:1.5rem 0; }
            .specs dt { font-size:0.8rem; text-transform:uppercase; color:var(--muted); font-weight:600; }
            .specs dd { margin:0.25rem 0 0; font-size:1.05rem; font-weight:700; }
            .pagination { margin-top:2rem; display:flex; gap:1rem; align-items:center; }
            .empty { background:var(--surface); border:1px dashed var(--border); border-radius:0.75rem; padding:3rem; text-align:center; color:var(--muted); }
            footer { background:#0f172a; color:#94a3b8; text-align:center; padding:1.5rem; font-size:0.875rem; margin-top:3rem; }
            """;

    private final Catalog catalog;

    public CatalogController(Catalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping("/")
    public ResponseEntity<Void> home() {
        return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/products")).build();
    }

    @GetMapping(value = "/products", produces = MediaType.TEXT_HTML_VALUE)
    public String list(@RequestParam(defaultValue = "0") int page) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        var products = catalog.list(page);
        var body = new StringBuilder("""
                <section class="hero">
                  <h1>Máy ảnh và phụ kiện</h1>
                  <p>Hệ thống thiết bị nhiếp ảnh chính hãng dành cho nhiếp ảnh gia chuyên nghiệp và studio.</p>
                </section>
                """);
        if (products.isEmpty()) {
            body.append("<div class=\"empty\" role=\"status\"><p>Chưa có sản phẩm.</p></div>");
        } else {
            body.append("<ul class=\"grid\" aria-label=\"Danh sách sản phẩm\">");
            products.stream().limit(50).forEach(p -> body.append("<li class=\"card\"><div><div class=\"badges\">")
                    .append("<span class=\"badge badge-brand\">").append(escape(p.brand())).append("</span>")
                    .append("<span class=\"badge\">").append(escape(p.category())).append("</span></div>")
                    .append("<h2><a href=\"/products/").append(p.id()).append("\">").append(escape(p.name())).append("</a></h2>")
                    .append("<div class=\"sku\">SKU: ").append(escape(p.sku())).append("</div>")
                    .append("<p class=\"desc\">").append(escape(p.description())).append("</p></div>")
                    .append("<div class=\"price-box\"><div><div class=\"price-fmt\">").append(formatVnd(p.price()))
                    .append("</div><div class=\"price-raw\">").append(p.price().toPlainString()).append(" VND</div></div>")
                    .append("<a class=\"btn\" href=\"/products/").append(p.id()).append("\">Xem chi tiết</a></div></li>"));
            body.append("</ul>");
        }
        body.append("<nav class=\"pagination\" aria-label=\"Phân trang\">");
        if (page > 0) body.append("<a class=\"btn\" href=\"/products?page=").append(page - 1).append("\">Trang trước</a> ");
        if (products.size() > 50) body.append("<a class=\"btn\" href=\"/products?page=").append((long) page + 1).append("\">Trang sau</a>");
        body.append("</nav>");
        return document("Sản phẩm — ProGear Camera", body.toString());
    }

    @GetMapping(value = "/products/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String detail(@PathVariable long id) {
        var p = catalog.find(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return document(p.name() + " — ProGear Camera",
                "<nav aria-label=\"Breadcrumb\"><a class=\"btn\" href=\"/products\">&larr; Danh sách sản phẩm</a></nav>"
                + "<article class=\"detail-card\"><div class=\"badges\">"
                + "<span class=\"badge badge-brand\">" + escape(p.brand()) + "</span>"
                + "<span class=\"badge\">" + escape(p.category()) + "</span></div>"
                + "<h1>" + escape(p.name()) + "</h1>"
                + "<dl class=\"specs\">"
                + "<div><dt>SKU</dt><dd>" + escape(p.sku()) + "</dd></div>"
                + "<div><dt>Giá</dt><dd><span class=\"price-fmt\">" + formatVnd(p.price()) + "</span> <span class=\"price-raw\">(" + p.price().toPlainString() + " VND)</span></dd></div>"
                + "<div><dt>Danh mục</dt><dd>" + escape(p.category()) + "</dd></div>"
                + "<div><dt>Thương hiệu</dt><dd>" + escape(p.brand()) + "</dd></div>"
                + "</dl><h2>Mô tả</h2><p style=\"white-space:pre-wrap\">" + escape(p.description()) + "</p></article>");
    }

    private static String formatVnd(BigDecimal price) {
        NumberFormat nf = NumberFormat.getNumberInstance(VI_VN);
        nf.setMaximumFractionDigits(2);
        return nf.format(price) + " ₫";
    }

    private static String escape(String text) {
        return HtmlUtils.htmlEscape(text);
    }

    private static String document(String title, String body) {
        return "<!doctype html><html lang=\"vi\"><head><meta charset=\"UTF-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>"
                + escape(title) + "</title><style>" + STYLES + "</style></head><body>"
                + "<header><div class=\"nav-wrap\"><a class=\"brand-logo\" href=\"/products\">ProGear <span>Camera</span></a>"
                + "<nav aria-label=\"Menu chính\"><a href=\"/products\">Sản phẩm</a></nav></div></header>"
                + "<main>" + body + "</main>"
                + "<footer>&copy; 2026 ProGear Camera Vietnam — Chuyên máy ảnh &amp; ống kính chính hãng.</footer>"
                + "</body></html>";
    }
}
