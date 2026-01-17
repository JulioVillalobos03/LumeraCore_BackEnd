import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";

export async function createProduct(companyId, data) {
  const id = uuid();

  await db.query(
    `INSERT INTO products 
     (id, company_id, name, sku, price, description, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      companyId,
      data.name,
      data.sku || null,
      data.price,
      data.description || null,
      data.stock || 0,
    ]
  );

  if (data.custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "products",
      entityId: id,
      values: data.custom_fields,
    });
  }

  return { id };
}

export async function getProducts(companyId) {
  const [rows] = await db.query(
    `SELECT * FROM products 
     WHERE company_id = ? AND status = 'active'`,
    [companyId]
  );
  return rows;
}

export async function getProduct(companyId, productId) {
  const [[product]] = await db.query(
    `SELECT * FROM products WHERE id = ? AND company_id = ?`,
    [productId, companyId]
  );

  if (!product) return null;

  const customFields = await CustomFieldService.getValues({
    companyId,
    entity: "products",
    entityId: productId,
  });

  return { ...product, custom_fields: customFields };
}

export async function updateProduct(companyId, productId, data) {
  await db.query(
    `UPDATE products SET
      name = ?,
      sku = ?,
      price = ?,
      description = ?,
      stock = ?
     WHERE id = ? AND company_id = ?`,
    [
      data.name,
      data.sku,
      data.price,
      data.description,
      data.stock,
      productId,
      companyId,
    ]
  );

  if (data.custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "products",
      entityId: productId,
      values: data.custom_fields,
    });
  }
}

export async function changeProductStatus(companyId, productId, status) {
  await db.query(
    `UPDATE products SET status = ?
     WHERE id = ? AND company_id = ?`,
    [status, productId, companyId]
  );
}
