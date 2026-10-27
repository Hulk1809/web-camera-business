package com.progear.catalog;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
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
    private final Catalog catalog;

    public CatalogController(Catalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping(value = "/products", produces = MediaType.TEXT_HTML_VALUE)
    public String list(@RequestParam(defaultValue = "0") int page) {
        if (page < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST);
        }
        var products = catalog.list(page);
        var body = new StringBuilder("<h1>Máy ảnh và phụ kiện</h1><ul>");
        products.stream().limit(50).forEach(p -> body.append("<li><a href=\"/products/")
                .append(p.id()).append("\">").append(escape(p.name())).append("</a> — ")
                .append(p.price().toPlainString()).append(" VND</li>"));
        body.append("</ul>");
        if (products.isEmpty()) body.append("<p>Chưa có sản phẩm.</p>");
        if (page > 0) body.append("<a href=\"/products?page=").append(page - 1).append("\">Trang trước</a> ");
        if (products.size() > 50) body.append("<a href=\"/products?page=").append((long) page + 1).append("\">Trang sau</a>");
        return document("Sản phẩm", body.toString());
    }

    @GetMapping(value = "/products/{id}", produces = MediaType.TEXT_HTML_VALUE)
    public String detail(@PathVariable long id) {
        var p = catalog.find(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        return document(p.name(), "<a href=\"/products\">Danh sách sản phẩm</a><h1>" + escape(p.name())
                + "</h1><dl><dt>SKU</dt><dd>" + escape(p.sku())
                + "</dd><dt>Giá</dt><dd>" + p.price().toPlainString()
                + " VND</dd><dt>Danh mục</dt><dd>" + escape(p.category())
                + "</dd><dt>Thương hiệu</dt><dd>" + escape(p.brand())
                + "</dd></dl><h2>Mô tả</h2><p style=\"white-space:pre-wrap\">" + escape(p.description()) + "</p>");
    }

    private static String escape(String text) {
        return HtmlUtils.htmlEscape(text);
    }

    private static String document(String title, String body) {
        return "<!doctype html><html lang=\"vi\"><head><meta charset=\"UTF-8\">"
                + "<meta name=\"viewport\" content=\"width=device-width,initial-scale=1\"><title>"
                + escape(title) + "</title></head><body><main>" + body + "</main></body></html>";
    }
}
