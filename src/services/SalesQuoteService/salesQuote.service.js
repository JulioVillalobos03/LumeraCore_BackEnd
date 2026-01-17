import { db } from "../../config/db.js";
import { canTransition } from "../WorkflowService/workflow.service.js";


/**
 * Obtiene la cotización actual
 */
export async function getQuoteForStateChange({ quoteId, companyId }) {
  const [rows] = await db.query(
    `
    SELECT 
      sq.id,
      sq.workflow_state_id,
      ws.workflow_id
    FROM sales_quotes sq
    JOIN workflow_states ws ON ws.id = sq.workflow_state_id
    WHERE sq.id = ?
    AND sq.company_id = ?
    `,
    [quoteId, companyId]
  );

  if (rows.length === 0) {
    throw new Error('Quote not found');
  }

  return rows[0];
}

/**
 * Actualiza el estado (YA SIN STATUS)
 */
export async function updateState({
  quoteId,
  companyId,
  toStateId
}) {
  const [result] = await db.query(
    `
    UPDATE sales_quotes
    SET workflow_state_id = ?
    WHERE id = ?
    AND company_id = ?
    `,
    [toStateId, quoteId, companyId]
  );

  if (result.affectedRows === 0) {
    throw new Error('Quote not updated');
  }
}


/**
 * Cambia el estado validando workflow transitions
 */
export async function changeQuoteState({
  quoteId,
  workflowId,
  fromStateId,
  toStateId,
}) {
  const allowed = await canTransition(workflowId, fromStateId, toStateId);

  if (!allowed) {
    throw new Error("Invalid workflow transition");
  }

  await db.query(
    `
    UPDATE sales_quotes
    SET workflow_state_id = ?
    WHERE id = ?
    `,
    [toStateId, quoteId]
  );

  return true;
}


