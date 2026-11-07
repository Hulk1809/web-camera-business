ALTER TABLE app_user ADD COLUMN IF NOT EXISTS phone VARCHAR(30) NOT NULL DEFAULT '';
ALTER TABLE customer_order ADD COLUMN IF NOT EXISTS recipient_phone VARCHAR(30) NOT NULL DEFAULT '';
ALTER TABLE customer_order ADD COLUMN IF NOT EXISTS shipping_note TEXT NOT NULL DEFAULT '';

UPDATE app_user SET phone = '0909100100' WHERE email = 'admin@progear.vn' AND phone = '';
UPDATE app_user SET phone = '0909200200' WHERE email = 'staff@progear.vn' AND phone = '';
UPDATE app_user SET phone = '0909300300' WHERE email = 'customer@progear.vn' AND phone = '';

UPDATE product SET image_url = CASE sku
    WHEN 'SONY-A7M4-BODY'   THEN 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80'
    WHEN 'CANON-R6M2-BODY'  THEN 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?auto=format&fit=crop&w=800&q=80'
    WHEN 'FUJI-XT5-SLV'     THEN 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=80'
    WHEN 'NIKON-ZF-BODY'    THEN 'https://images.unsplash.com/photo-1452780212940-6f5c0d14d848?auto=format&fit=crop&w=800&q=80'
    WHEN 'SONY-2470-GM2'    THEN 'https://images.unsplash.com/photo-1617005082133-548c4dd27f35?auto=format&fit=crop&w=800&q=80'
    WHEN 'SIGMA-85-14-SE'   THEN 'https://images.unsplash.com/photo-1581591524425-c7e0978865fc?auto=format&fit=crop&w=800&q=80'
    WHEN 'FUJI-X100VI-BLK'  THEN 'https://images.unsplash.com/photo-1510127034890-ba27508e9f1c?auto=format&fit=crop&w=800&q=80'
    WHEN 'PD-TRIPOD-CARBON' THEN 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=800&q=80'
    ELSE image_url
END
WHERE image_url = '';
