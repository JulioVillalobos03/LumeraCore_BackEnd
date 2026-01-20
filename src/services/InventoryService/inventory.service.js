import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";

/**
 * Obtener inventario por empresa
 */
export async function getInventory(companyId) {
  const [rows] = await db.query(
    `
    SELECT 
      i.id,
      i.stock,
      p.id AS product_id,
      p.name,
      p.sku
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    WHERE i.company_id = ?
    `,
    [companyId]
  );

  // ⬇️ agregar custom fields por producto
  const inventoryWithCustomFields = await Promise.all(
    rows.map(async (item) => {
      const customFields = await CustomFieldService.getValues({
        companyId,
        entity: "products",
        entityId: item.product_id,
      });

      return {
        ...item,
        custom_fields: customFields,
      };
    })
  );

  return inventoryWithCustomFields;
}

export async function getInventoryById(companyId, inventoryId) {
  const [[row]] = await db.query(
    `
    SELECT 
      i.id,
      i.stock,
      p.id AS product_id,
      p.name,
      p.sku
    FROM inventory i
    JOIN products p ON p.id = i.product_id
    WHERE i.id = ? AND i.company_id = ?
    `,
    [inventoryId, companyId]
  );

  if (!row) {
    return null;
  }

  const customFields = await CustomFieldService.getValues({
    companyId,
    entity: "products",
    entityId: row.product_id,
  });

  return {
    id: row.id,
    stock: row.stock,
    product: {
      id: row.product_id,
      name: row.name,
      sku: row.sku,
      custom_fields: customFields,
    },
  };
}

/**
 * Ajustar inventario (entrada / salida)
 */
export async function adjustInventory(companyId, userId, data) {
  const {
    product_id,
    quantity,
    type,
    reference_type,
    reference_id,
    notes
  } = data;

  if (!["in", "out"].includes(type)) {
    throw new Error("Invalid movement type");
  }

  if (!product_id || !quantity) {
    throw new Error("product_id and quantity are required");
  }

  // Buscar inventario existente
  const [[inventory]] = await db.query(
    `
    SELECT id, stock
    FROM inventory
    WHERE company_id = ? AND product_id = ?
    `,
    [companyId, product_id]
  );

  let inventoryId;
  let newStock;

  if (inventory) {
    inventoryId = inventory.id;
    newStock =
      type === "in"
        ? inventory.stock + quantity
        : inventory.stock - quantity;

    if (newStock < 0) {
      throw new Error("Insufficient stock");
    }

    await db.query(
      `UPDATE inventory SET stock = ? WHERE id = ?`,
      [newStock, inventoryId]
    );
  } else {
    if (type === "out") {
      throw new Error("No inventory available");
    }

    inventoryId = uuid();
    newStock = quantity;

    await db.query(
      `
      INSERT INTO inventory (id, company_id, product_id, stock)
      VALUES (?, ?, ?, ?)
      `,
      [inventoryId, companyId, product_id, quantity]
    );
  }

  // Registrar movimiento
  await db.query(
    `
    INSERT INTO inventory_movements (
      id,
      company_id,
      inventory_id,
      product_id,
      movement_type,
      quantity,
      reference_type,
      reference_id,
      notes,
      created_by
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      uuid(),
      companyId,
      inventoryId,
      product_id,
      type,
      quantity,
      reference_type || "manual",
      reference_id || null,
      notes || null,
      userId
    ]
  );

  return {
    inventoryId,
    stock: newStock
  };
}

/**
 * Historial de movimientos
 */
export async function getMovements(companyId) {
  const [rows] = await db.query(
    `
    SELECT 
      im.id,
      im.movement_type,
      im.quantity,
      im.reference_type,
      im.reference_id,
      im.notes,
      im.created_at,
      p.name AS product_name,
      u.name AS created_by_name
    FROM inventory_movements im
    JOIN products p ON p.id = im.product_id
    LEFT JOIN users u ON u.id = im.created_by
    WHERE im.company_id = ?
    ORDER BY im.created_at DESC
    `,
    [companyId]
  );

  return rows;
}



export async function addMovement({
  companyId,
  productId,
  movementType,
  quantity,
  referenceType = null,
  referenceId = null,
  notes = null,
  userId = null,
}) {
  if (quantity <= 0) {
    throw new Error("Quantity must be greater than zero");
  }

  const id = uuid();

  await db.query(
    `
    INSERT INTO inventory_movements
      (id, company_id, product_id, movement_type, quantity, reference_type, reference_id, notes, created_by)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      companyId,
      productId,
      movementType,
      quantity,
      referenceType,
      referenceId,
      notes,
      userId,
    ]
  );

  return { id };
}

export async function getStock({ companyId, productId }) {
  const [rows] = await db.query(
    `
    SELECT
      SUM(
        CASE
          WHEN movement_type = 'in' THEN quantity
          WHEN movement_type = 'out' THEN -quantity
          WHEN movement_type = 'adjustment' THEN quantity
        END
      ) AS stock
    FROM inventory_movements
    WHERE company_id = ?
      AND product_id = ?
    `,
    [companyId, productId]
  );

  return rows[0]?.stock ?? 0;
}

export async function listMovements({ companyId, productId }) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM inventory_movements
    WHERE company_id = ?
      AND product_id = ?
    ORDER BY created_at DESC
    `,
    [companyId, productId]
  );

  return rows;
}


