CREATE TABLE Product (
    product_id SERIAL PRIMARY KEY,
    category_id INT REFERENCES Category(category_id) ON DELETE SET NULL,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    material VARCHAR(50),
    color VARCHAR(30),
    image_url TEXT,
    quantity INTEGER DEFAULT 0
);

-- İşlevsel görünüm hangi alt tabloda kayıt varsa onun tipini yazdıran mantık:
CREATE OR REPLACE VIEW view_product_details
AS
SELECT
    p.product_id,
    c.category_name,
    CASE
        WHEN s.product_id IS NOT NULL THEN 'Scarf'
        WHEN sw.product_id IS NOT NULL THEN 'Shawl'
        WHEN b.product_id IS NOT NULL THEN 'Bonnet'
        ELSE 'General Products'
    END
    as product_type,
    p.price,
    p.material,
    p.color,
    p.quantity,
    p.image_url,
    p.category_id
FROM Product p
LEFT JOIN Category c ON p.category_id = c.category_id  -- INNER JOIN ise LEFT JOIN yap
LEFT JOIN Scarf s ON p.product_id = s.product_id
LEFT JOIN Swal sw ON p.product_id = sw.product_id
LEFT JOIN Bonnet b ON p.product_id = b.product_id;

SELECT * FROM view_product_details;




CREATE TABLE IF NOT EXISTS stock_log (
    log_id SERIAL PRIMARY KEY,
    product_id INT,
    old_quantity INT,
    new_quantity INT,
    change_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



--Trigger
CREATE OR REPLACE FUNCTION log_stock_changes()
RETURNS TRIGGER AS $$
BEGIN

    IF OLD.quantity <> NEW.quantity THEN
        INSERT INTO stock_log(product_id, old_quantity, new_quantity)
        VALUES (OLD.product_id, OLD.quantity, NEW.quantity);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

--Trigger fonksiyonunu çalıştırır
CREATE OR REPLACE TRIGGER trg_stock_history
AFTER UPDATE ON Product
FOR EACH ROW
EXECUTE FUNCTION log_stock_changes();

SELECT * FROM stock_log ORDER BY change_date DESC;






-- Stored Procedure : + butonunda çalışan prosedür
CREATE OR REPLACE PROCEDURE increase_stock(p_id INT)
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE product SET quantity = quantity + 1 WHERE product_id = p_id;
END;
$$;




-- veriyi işleyip Rapor hazırlar
CREATE OR REPLACE FUNCTION get_low_stock_report(threshold INTEGER)
RETURNS TEXT AS $$
DECLARE
 --Cursor yapısı her bir veriyi tek tek okur
    cur_stock CURSOR FOR
        SELECT material, color, quantity FROM Product WHERE quantity < threshold;
    rec RECORD;
    report TEXT := 'Critical Stock Report: ';
BEGIN

    OPEN cur_stock;

    LOOP

        FETCH cur_stock INTO rec;
        EXIT WHEN NOT FOUND;

        report := report || rec.material || ' (' || rec.color || ') Remainder: ' || rec.quantity || ' | ';
    END LOOP;

    CLOSE cur_stock;

    RETURN report;
END;
$$ LANGUAGE plpgsql;

SELECT get_low_stock_report(1);




SELECT * FROM Product;
