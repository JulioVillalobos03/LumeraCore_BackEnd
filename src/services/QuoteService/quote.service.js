import {db} from "../../config/db.js";
import { v4 as uuid } from "uuid";

/**
 * Crear cotización
 */
export async function createQuote(companyId, data) {
  const quoteId = uuid();
  const { client_id, items } = data;

  // Crear cotización
  await db.query(
    `
    INSERT INTO sales_quotes (id, company_id, client_id, total)
    VALUES (?, ?, ?, 0)
    `,
    [quoteId, companyId, client_id]
  );

  let total = 0;

  // Insertar items
  for (const item of items) {
    const itemId = uuid();
    const subtotal = item.quantity * item.price;
    total += subtotal;

    await db.query(
      `
      INSERT INTO sales_quote_items
      (id, quote_id, product_id, quantity, price)
      VALUES (?, ?, ?, ?, ?)
      `,
      [itemId, quoteId, item.product_id, item.quantity, item.price]
    );
  }

  // Actualizar total
  await db.query(
    `UPDATE sales_quotes SET total = ? WHERE id = ?`,
    [total, quoteId]
  );

  return { id: quoteId, total };
}

/**
 * Listar cotizaciones por empresa
 */
export async function getQuotes(companyId) {
  const [rows] = await db.query(
    `
    SELECT sq.*, c.name AS client_name
    FROM sales_quotes sq
    LEFT JOIN clients c ON c.id = sq.client_id
    WHERE sq.company_id = ?
    ORDER BY sq.created_at DESC
    `,
    [companyId]
  );

  return rows;
}

/**
 * Obtener detalle de cotización
 */
export async function getQuoteById(companyId, quoteId) {
  const [[quote]] = await db.query(
    `
    SELECT * FROM sales_quotes
    WHERE id = ? AND company_id = ?
    `,
    [quoteId, companyId]
  );

  if (!quote) return null;

  const [items] = await db.query(
    `
    SELECT sqi.*, p.name AS product_name
    FROM sales_quote_items sqi
    JOIN products p ON p.id = sqi.product_id
    WHERE sqi.quote_id = ?
    `,
    [quoteId]
  );

  quote.items = items;
  return quote;
}
