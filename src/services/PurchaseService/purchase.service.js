import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import * as InventoryService from "../InventoryService/inventory.service.js";

/**
 * Crear orden de compra
 */
export async function createPurchaseOrder(companyId, userId, data) {
  const { supplier_id, notes, items } = data;

  if (!supplier_id || !items || items.length === 0) {
    throw new Error("supplier_id and items are required");
  }

  const purchaseOrderId = uuid();

  await db.query(
    `
    INSERT INTO purchase_orders
      (id, company_id, supplier_id, notes, created_by)
    VALUES (?, ?, ?, ?, ?)
    `,
    [purchaseOrderId, companyId, supplier_id, notes || null, userId]
  );

  let total = 0;

  for (const item of items) {
    const subtotal = item.quantity * item.cost;
    total += subtotal;

    await db.query(
      `
      INSERT INTO purchase_order_items
        (id, purchase_order_id, product_id, quantity, cost, subtotal)
      VALUES (?, ?, ?, ?, ?, ?)
      `,
      [
        uuid(),
        purchaseOrderId,
        item.product_id,
        item.quantity,
        item.cost,
        subtotal,
      ]
    );
  }

  await db.query(
    `UPDATE purchase_orders SET total = ? WHERE id = ?`,
    [total, purchaseOrderId]
  );

  return {
    id: purchaseOrderId,
    total,
  };
}

/**
 * Aplicar inventario desde la orden de compra
 */
export async function receivePurchaseOrder({
  companyId,
  purchaseOrderId,
  userId,
}) {
  const [[order]] = await db.query(
    `
    SELECT inventory_applied
    FROM purchase_orders
    WHERE id = ? AND company_id = ?
    `,
    [purchaseOrderId, companyId]
  );

  if (!order) {
    throw new Error("Purchase order not found");
  }

  if (order.inventory_applied) {
    throw new Error("Inventory already applied");
  }

  const [items] = await db.query(
    `
    SELECT product_id, quantity
    FROM purchase_order_items
    WHERE purchase_order_id = ?
    `,
    [purchaseOrderId]
  );

  for (const item of items) {
    await InventoryService.adjustInventory(companyId, userId, {
      product_id: item.product_id,
      quantity: item.quantity,
      type: "in",
      reference_type: "purchase_order",
      reference_id: purchaseOrderId,
    });
  }

  await db.query(
    `
    UPDATE purchase_orders
    SET inventory_applied = 1,
        inventory_applied_at = NOW()
    WHERE id = ?
    `,
    [purchaseOrderId]
  );
}
