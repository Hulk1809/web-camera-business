INSERT INTO category (name, visible)
SELECT v.name, true
FROM (VALUES
    ('Máy ảnh Mirrorless'),
    ('Ống kính (Lens)'),
    ('Máy ảnh Compact'),
    ('Phụ kiện Studio & Tripod')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM category c WHERE c.name = v.name);

INSERT INTO brand (name, visible)
SELECT v.name, true
FROM (VALUES
    ('Sony'),
    ('Canon'),
    ('Fujifilm'),
    ('Nikon'),
    ('Sigma'),
    ('Peak Design')
) AS v(name)
WHERE NOT EXISTS (SELECT 1 FROM brand b WHERE b.name = v.name);

INSERT INTO product (category_id, brand_id, name, sku, price, description, visible)
SELECT c.id, b.id, v.name, v.sku, v.price, v.description, true
FROM (VALUES
    ('Máy ảnh Mirrorless', 'Sony', 'Sony Alpha A7 IV Body', 'SONY-A7M4-BODY', 54990000.00, 'Cảm biến Full-Frame Exmor R BSI CMOS 33MP, quay video 4K 60p 10-bit 4:2:2, lấy nét Real-time Eye AF cho người, động vật và chim.'),
    ('Máy ảnh Mirrorless', 'Canon', 'Canon EOS R6 Mark II Body', 'CANON-R6M2-BODY', 52990000.00, 'Cảm biến Full-Frame CMOS 24.2MP, chụp liên tiếp 40 fps màn trập điện tử, chống rung IBIS 8 stop, quay 4K60p oversampled từ 6K.'),
    ('Máy ảnh Mirrorless', 'Fujifilm', 'Fujifilm X-T5 Body (Bạc)', 'FUJI-XT5-SLV', 43490000.00, 'Cảm biến APS-C X-Trans CMOS 5 HR 40.2MP, chống rung 5 trục 7.0 stops, 19 chế độ giả lập màu phim đặc trưng Fujifilm.'),
    ('Máy ảnh Mirrorless', 'Nikon', 'Nikon Zf Body', 'NIKON-ZF-BODY', 48990000.00, 'Thiết kế hoài cổ kết hợp chip xử lý EXPEED 7, cảm biến Full-Frame 24.5MP BSI CMOS, chống rung VR 8.0 stops.'),
    ('Ống kính (Lens)', 'Sony', 'Sony FE 24-70mm f/2.8 GM II', 'SONY-2470-GM2', 47990000.00, 'Ống kính zoom tiêu chuẩn G Master thế hệ 2, gọn nhẹ nhất phân khúc (695g), 4 mô-tơ XD Linear lấy nét siêu nhanh và êm.'),
    ('Ống kính (Lens)', 'Sigma', 'Sigma 85mm f/1.4 DG DN Art (Sony E)', 'SIGMA-85-14-SE', 23990000.00, 'Ống kính chân dung chuyên nghiệp dòng Art cho máy ảnh Mirrorless Full-Frame, độ sắc nét vượt trội và bokeh mượt mà.'),
    ('Máy ảnh Compact', 'Fujifilm', 'Fujifilm X100VI', 'FUJI-X100VI-BLK', 42990000.00, 'Máy ảnh compact cao cấp ống kính 23mm f/2, cảm biến 40.2MP kèm chống rung IBIS 6.0 stops tích hợp sẵn filter ND 4-stop.'),
    ('Phụ kiện Studio & Tripod', 'Peak Design', 'Chân máy Peak Design Travel Tripod Carbon', 'PD-TRIPOD-CARBON', 14990000.00, 'Chân máy sợi carbon siêu gọn nhẹ cho nhiếp ảnh gia di chuyển nhiều, tải trọng 9.1kg, gấp gọn chỉ bằng chai nước.')
) AS v(category_name, brand_name, name, sku, price, description)
JOIN category c ON c.name = v.category_name
JOIN brand b ON b.name = v.brand_name
WHERE NOT EXISTS (SELECT 1 FROM product p WHERE p.sku = v.sku);
