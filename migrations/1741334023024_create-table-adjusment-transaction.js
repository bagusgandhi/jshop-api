/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
exports.shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.up = (pgm) => {
  pgm.createExtension("uuid-ossp", { ifNotExists: true });

  // Create adjustment_transaction table
  pgm.createTable("adjustment_transaction", {
    id: {
      type: "uuid",
      primaryKey: true,
      default: pgm.func("uuid_generate_v4()"),
    },
    product_id: {
      type: "uuid",
      references: "product(id)",
      onDelete: "CASCADE",
    },
    sku: {
      type: "varchar(50)",
      notNull: true,
    },
    qty: {
      type: "integer",
      notNull: true,
    },
    amount: {
      type: "decimal(10, 2)",
      notNull: true,
      default: 0,
    },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("NOW()"),
    },
  });

  pgm.sql(`
    CREATE OR REPLACE FUNCTION calculate_amount()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.amount := (NEW.qty * (SELECT price FROM product WHERE product.sku = NEW.sku));
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;
  `);

  pgm.sql(`
    CREATE TRIGGER update_amount_before_insert
    BEFORE INSERT OR UPDATE ON adjustment_transaction
    FOR EACH ROW
    EXECUTE FUNCTION calculate_amount();
  `);
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @returns {Promise<void> | void}
 */
exports.down = (pgm) => {
  pgm.sql("DROP TRIGGER IF EXISTS update_amount_before_insert ON adjustment_transaction;");
  pgm.sql("DROP FUNCTION IF EXISTS calculate_amount;");
  pgm.dropTable("adjustment_transaction");
  pgm.dropExtension("uuid-ossp");
};
