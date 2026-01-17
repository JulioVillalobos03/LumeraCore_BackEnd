import * as SalesQuoteService from '../../services/SalesQuoteService/salesQuote.service.js';
import { canTransition } from '../../services/WorkflowService/workflow.service.js';

export async function changeState(req, res) {
  const { quoteId } = req.params;
  const { toStateId } = req.body;
  const companyId = req.company.id;

  if (!toStateId) {
    return res.status(400).json({
      ok: false,
      message: 'toStateId is required'
    });
  }

  // 1️⃣ Obtener estado actual
  const quote = await SalesQuoteService.getQuoteForStateChange({
    quoteId,
    companyId
  });

  // 2️⃣ Validar transición
  const allowed = await canTransition(
    quote.workflow_id,
    quote.workflow_state_id,
    toStateId
  );

  if (!allowed) {
    return res.status(400).json({
      ok: false,
      message: 'Invalid workflow transition'
    });
  }

  // 3️⃣ Actualizar estado
  await SalesQuoteService.updateState({
    quoteId,
    companyId,
    toStateId
  });

  return res.json({
    ok: true,
    message: 'Quote state updated successfully'
  });
}
