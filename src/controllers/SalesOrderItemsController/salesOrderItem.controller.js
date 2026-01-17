import * as SalesOrderItemService from "../../services/SalesOrderItemsService/salesOrderItem.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const { salesOrderId, productId, quantity, price } = req.body;

  const item = await SalesOrderItemService.addItem({
    companyId,
    salesOrderId,
    productId,
    quantity,
    price,
  });

  res.status(201).json({ ok: true, item });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const { salesOrderId } = req.params;

  const items = await SalesOrderItemService.listItems({ companyId, salesOrderId });

  res.json({ ok: true, items });
}

export async function update(req, res) {
  const companyId = req.company.id;
  const { itemId } = req.params;
  const { quantity, price } = req.body;

  const updated = await SalesOrderItemService.updateItem({
    companyId,
    itemId,
    quantity,
    price,
  });

  res.json({ ok: true, updated });
}

export async function remove(req, res) {
  const companyId = req.company.id;
  const { itemId } = req.params;

  const result = await SalesOrderItemService.deleteItem({ companyId, itemId });

  res.json(result);
}
