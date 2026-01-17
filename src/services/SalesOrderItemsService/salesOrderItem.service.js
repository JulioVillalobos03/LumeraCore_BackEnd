import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";

export async function addItem({ companyId, salesOrderId, productId, quantity, price }) {
  const id = uuid();
  const subtotal = Number(quantity) * Number(price);

  await db.query(
    `
    INSERT INTO sales_order_items
      (id, company_id, sales_order_id, product_id, quantity, price, subtotal)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    `,
    [id, companyId, salesOrderId, productId, quantity, price, subtotal]
  );

  await recalcOrderTotal({ companyId, salesOrderId });

  return { id, companyId, salesOrderId, productId, quantity, price, subtotal };
}

export async function listItems({ companyId, salesOrderId }) {
  const [rows] = await db.query(
    `
    SELECT
      soi.id,
      soi.product_id,
      p.name AS product_name,
      soi.quantity,
      soi.price,
      soi.subtotal,
      soi.created_at
    FROM sales_order_items soi
    JOIN products p ON p.id = soi.product_id
    WHERE soi.company_id = ?
      AND soi.sales_order_id = ?
    ORDER BY soi.created_at ASC
    `,
    [companyId, salesOrderId]
  );

  return rows;
}

export async function updateItem({ companyId, itemId, quantity, price }) {
  const subtotal = Number(quantity) * Number(price);

  // obtenemos order_id para recalcular total
  const [found] = await db.query(
    `SELECT sales_order_id FROM sales_order_items WHERE id = ? AND company_id = ?`,
    [itemId, companyId]
  );
  if (found.length === 0) throw new Error("Item not found");

  const salesOrderId = found[0].sales_order_id;

  await db.query(
    `
    UPDATE sales_order_items
    SET quantity = ?, price = ?, subtotal = ?
    WHERE id = ? AND company_id = ?
    `,
    [quantity, price, subtotal, itemId, companyId]
  );

  await recalcOrderTotal({ companyId, salesOrderId });

  return { itemId, quantity, price, subtotal };
}

export async function deleteItem({ companyId, itemId }) {
  const [found] = await db.query(
    `SELECT sales_order_id FROM sales_order_items WHERE id = ? AND company_id = ?`,
    [itemId, companyId]
  );
  if (found.length === 0) throw new Error("Item not found");

  const salesOrderId = found[0].sales_order_id;

  await db.query(
    `DELETE FROM sales_order_items WHERE id = ? AND company_id = ?`,
    [itemId, companyId]
  );

  await recalcOrderTotal({ companyId, salesOrderId });

  return { ok: true };
}

export async function recalcOrderTotal({ companyId, salesOrderId }) {
  const [sumRows] = await db.query(
    `
    SELECT COALESCE(SUM(subtotal), 0) AS total
    FROM sales_order_items
    WHERE company_id = ? AND sales_order_id = ?
    `,
    [companyId, salesOrderId]
  );

  const total = sumRows[0]?.total ?? 0;

  await db.query(
    `
    UPDATE sales_orders
    SET total = ?
    WHERE id = ? AND company_id = ?
    `,
    [total, salesOrderId, companyId]
  );

  return total;
}
