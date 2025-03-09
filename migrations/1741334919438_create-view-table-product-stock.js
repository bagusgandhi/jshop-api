/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.sql(`
    DROP VIEW IF EXISTS product_stock;

    CREATE VIEW product_stock AS
    SELECT 
        p.id,
        p.sku,
        COALESCE(SUM(at.qty), 0) AS stock
    FROM product p
    LEFT JOIN adjustment_transaction at ON p.sku = at.sku
    GROUP BY p.id, p.sku;
`);

  pgm.sql(`
    CREATE OR REPLACE FUNCTION prevent_negative_stock()
    RETURNS TRIGGER AS $$
    DECLARE total_stock INTEGER;
    BEGIN

        IF TG_OP = 'UPDATE' THEN
            SELECT COALESCE(SUM(qty), 0) - OLD.qty
            INTO total_stock
            FROM adjustment_transaction
            WHERE product_id = NEW.product_id;
        ELSE
            SELECT COALESCE(SUM(qty), 0)
            INTO total_stock
            FROM adjustment_transaction
            WHERE product_id = NEW.product_id;
        END IF;

        IF total_stock + NEW.qty < 0 THEN
            RAISE EXCEPTION 'Stock cannot be negative or zero';
        END IF;

        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    DROP TRIGGER IF EXISTS check_stock_before_insert ON adjustment_transaction;
    DROP TRIGGER IF EXISTS check_stock_before_update ON adjustment_transaction;

    CREATE TRIGGER check_stock_before_insert
    BEFORE INSERT ON adjustment_transaction
    FOR EACH ROW
    EXECUTE FUNCTION prevent_negative_stock();

    CREATE TRIGGER check_stock_before_update
    BEFORE UPDATE ON adjustment_transaction
    FOR EACH ROW
    EXECUTE FUNCTION prevent_negative_stock();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql("DROP VIEW IF EXISTS product_stock;");
};
