CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id INTEGER NOT NULL REFERENCES product(product_id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    price NUMERIC(10, 2) NOT NULL
);

--Trigger
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
DECLARE
    current_stock INTEGER;
BEGIN
    -- Mevcut stoğu kilitleyerek okuyoruz
    SELECT quantity INTO current_stock FROM product WHERE product_id = NEW.product_id FOR UPDATE;

    -- Stok kontrolü yap
    IF current_stock < NEW.quantity THEN
        RAISE EXCEPTION 'Insufficient stock! Available: %, Required: %', current_stock, NEW.quantity;
    END IF;

    -- Stok düşürme
    UPDATE product
    SET quantity = quantity - NEW.quantity
    WHERE product_id = NEW.product_id;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;


--Trigger fonksiyonunu çağırma
CREATE TRIGGER trg_reduce_stock_on_order
BEFORE INSERT ON order_items
FOR EACH ROW
EXECUTE FUNCTION update_product_stock();


SELECT * FROM order_items;