import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import { AppError } from "../../utils/AppError.js";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";

/**
 * Crear producto
 */
export async function createProduct(companyId, data) {
  if (!data.name) {
    throw new AppError("PRODUCT_NAME_REQUIRED");
  }

  if (data.price == null) {
    throw new AppError("PRODUCT_PRICE_REQUIRED");
  }

  if (Number(data.price) < 0) {
    throw new AppError("PRODUCT_INVALID_PRICE");
  }

  const id = uuid();

  await db.query(
    `INSERT INTO products 
     (id, company_id, name, sku, price, description, status)
     VALUES (?, ?, ?, ?, ?, ?, 'active')`,
    [
      id,
      companyId,
      data.name,
      data.sku || null,
      data.price,
      data.description || null,
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

/**
 * Listar productos
 */
export async function getProducts(companyId) {
  const [rows] = await db.query(
    `SELECT * FROM products WHERE company_id = ?`,
    [companyId]
  );
  return rows;
}

/**
 * Obtener producto
 */
export async function getProduct(companyId, productId) {
  const [[product]] = await db.query(
    `SELECT * FROM products WHERE id = ? AND company_id = ?`,
    [productId, companyId]
  );

  if (!product) {
    throw new AppError("PRODUCT_NOT_FOUND", 404);
  }

  const customFields = await CustomFieldService.getValues({
    companyId,
    entity: "products",
    entityId: productId,
  });

  return { ...product, custom_fields: customFields };
}

/**
 * Actualizar producto
 */
export async function updateProduct(companyId, productId, data) {
  const [[exists]] = await db.query(
    `SELECT id FROM products WHERE id = ? AND company_id = ?`,
    [productId, companyId]
  );

  if (!exists) {
    throw new AppError("PRODUCT_NOT_FOUND", 404);
  }

  if (data.price != null && Number(data.price) < 0) {
    throw new AppError("PRODUCT_INVALID_PRICE");
  }

  await db.query(
    `
    UPDATE products SET
      name = COALESCE(?, name),
      sku = COALESCE(?, sku),
      price = COALESCE(?, price),
      description = COALESCE(?, description)
    WHERE id = ? AND company_id = ?
    `,
    [
      data.name,
      data.sku,
      data.price,
      data.description,
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

/**
 * Cambiar status
 */
export async function changeProductStatus(companyId, productId, status) {
  const [[exists]] = await db.query(
    `SELECT id FROM products WHERE id = ? AND company_id = ?`,
    [productId, companyId]
  );

  if (!exists) {
    throw new AppError("PRODUCT_NOT_FOUND", 404);
  }

  if (!["active", "inactive"].includes(status)) {
    throw new AppError("PRODUCT_INVALID_STATUS");
  }

  await db.query(
    `UPDATE products SET status = ?
     WHERE id = ? AND company_id = ?`,
    [status, productId, companyId]
  );
}
