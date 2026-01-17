import * as PurchaseService from "../../services/PurchaseService/purchase.service.js";

/**
 * POST /purchases
 */
export async function create(req, res) {
  const companyId = req.company.id;
  const userId = req.user.id;

  const result = await PurchaseService.createPurchaseOrder(
    companyId,
    userId,
    req.body
  );

  res.json({
    ok: true,
    data: result,
  });
}

/**
 * POST /purchases/:id/receive
 */
export async function receive(req, res) {
  const companyId = req.company.id;
  const userId = req.user.id;
  const purchaseOrderId = req.params.id;

  await PurchaseService.receivePurchaseOrder({
    companyId,
    purchaseOrderId,
    userId,
  });

  res.json({ ok: true });
}
