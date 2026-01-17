import * as SalesOrderService from '../../services/SalesOrderService/salesOrder.service.js';
import { canTransition } from '../../services/WorkflowService/workflow.service.js';

/**
 * Crear
 */
export async function create(req, res) {
  const companyId = req.company.id;
  const { clientId, workflowStateId, total, notes } = req.body;

  const order = await SalesOrderService.createSalesOrder({
    companyId,
    clientId,
    workflowStateId,
    total,
    notes
  });

  res.status(201).json({
    ok: true,
    order
  });
}

/**
 * Listar
 */
export async function list(req, res) {
  const companyId = req.company.id;

  const orders = await SalesOrderService.listSalesOrders(companyId);

  res.json({
    ok: true,
    orders
  });
}

/**
 * Cambiar estado
 */
export async function changeState(req, res) {
  const { orderId } = req.params;
  const { toStateId } = req.body;
  const companyId = req.company.id;

  const order = await SalesOrderService.getOrderForStateChange(
    orderId,
    companyId
  );

  const allowed = await canTransition(
    order.workflow_id,
    order.workflow_state_id,
    toStateId
  );

  if (!allowed) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid workflow transition'
    });
  }

  await SalesOrderService.updateOrderState(orderId, toStateId);

  res.json({
    ok: true,
    message: 'State updated'
  });
}
