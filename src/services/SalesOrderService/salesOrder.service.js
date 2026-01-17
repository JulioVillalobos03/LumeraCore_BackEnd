import { db } from '../../config/db.js';
import { v4 as uuid } from 'uuid';

/**
 * Crear Sales Order
 */
export async function createSalesOrder({
  companyId,
  clientId,
  workflowStateId,
  total,
  notes
}) {
  const id = uuid();

  await db.query(
    `
    INSERT INTO sales_orders (
      id,
      company_id,
      client_id,
      workflow_state_id,
      total,
      notes
    ) VALUES (?, ?, ?, ?, ?, ?)
    `,
    [id, companyId, clientId, workflowStateId, total, notes]
  );

  return { id };
}

/**
 * Obtener Sales Orders por company
 */
export async function listSalesOrders(companyId) {
  const [rows] = await db.query(
    `
    SELECT so.*, ws.state_key
    FROM sales_orders so
    JOIN workflow_states ws ON ws.id = so.workflow_state_id
    WHERE so.company_id = ?
    ORDER BY so.created_at DESC
    `,
    [companyId]
  );

  return rows;
}

/**
 * Obtener Sales Order para cambio de estado
 */
export async function getOrderForStateChange(orderId, companyId) {
  const [rows] = await db.query(
    `
    SELECT 
      so.id,
      so.workflow_state_id,
      ws.workflow_id
    FROM sales_orders so
    JOIN workflow_states ws ON ws.id = so.workflow_state_id
    WHERE so.id = ? AND so.company_id = ?
    `,
    [orderId, companyId]
  );

  if (rows.length === 0) {
    throw new Error('Sales order not found');
  }

  return rows[0];
}

/**
 * Actualizar estado
 */
export async function updateOrderState(orderId, newStateId) {
  await db.query(
    `
    UPDATE sales_orders
    SET workflow_state_id = ?
    WHERE id = ?
    `,
    [newStateId, orderId]
  );
}
