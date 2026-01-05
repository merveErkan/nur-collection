CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL REFERENCES customer(customer_id),
    approved_by_person_id INTEGER NOT NULL,
    approved_by_role VARCHAR(20) NOT NULL CHECK (approved_by_role IN ('employee', 'manager')),
    order_date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    total_amount NUMERIC(10, 2) DEFAULT 0,
    CONSTRAINT fk_order_approver
        FOREIGN KEY (approved_by_person_id) REFERENCES person(person_id)
);

--Paremetreli fonksiyon
CREATE OR REPLACE FUNCTION get_order_statistics_by_approver( p_approved_by_person_id INT)
RETURNS TABLE (
    total_order_count BIGINT,
    total_revenue NUMERIC,
    average_order_value NUMERIC,
    highest_sale_amount NUMERIC,
    lowest_sale_amount NUMERIC
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(order_id),
        COALESCE(SUM(total_amount), 0),
        COALESCE(AVG(total_amount), 0),
        COALESCE(MAX(total_amount), 0),
        COALESCE(MIN(total_amount), 0)
    FROM Orders
    WHERE approved_by_person_id = p_approved_by_person_id;
END;
$$;

SELECT * FROM get_order_statistics_by_approver(4);

SELECT * FROM orders;