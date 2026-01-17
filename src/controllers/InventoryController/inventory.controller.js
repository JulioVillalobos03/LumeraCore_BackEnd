import * as InventoryService from "../../services/InventoryService/inventory.service.js";

/**
 * GET /inventory
 */
export async function list(req, res) {
  const companyId = req.company.id;
  const inventory = await InventoryService.getInventory(companyId);

  res.json({ ok: true, inventory });
}

/**
 * POST /inventory/adjust
 */
export async function adjust(req, res) {
  const companyId = req.company.id;
  const userId = req.user.id;

  const result = await InventoryService.adjustInventory(
    companyId,
    userId,
    req.body
  );

  res.json({
    ok: true,
    data: result
  });
}

/**
 * GET /inventory/movements
 */
export async function movements(req, res) {
  const companyId = req.company.id;
  const movements = await InventoryService.getMovements(companyId);

  res.json({ ok: true, movements });
}



export async function add(req, res) {
  const companyId = req.company.id;
  const userId = req.user.id;

  const {
    productId,
    movementType,
    quantity,
    referenceType,
    referenceId,
    notes,
  } = req.body;

  const movement = await InventoryService.addMovement({
    companyId,
    productId,
    movementType,
    quantity,
    referenceType,
    referenceId,
    notes,
    userId,
  });

  res.status(201).json({
    ok: true,
    movement,
  });
}

export async function stock(req, res) {
  const companyId = req.company.id;
  const { productId } = req.params;

  const stock = await InventoryService.getStock({ companyId, productId });

  res.json({
    ok: true,
    productId,
    stock,
  });
}

export async function history(req, res) {
  const companyId = req.company.id;
  const { productId } = req.params;

  const movements = await InventoryService.listMovements({
    companyId,
    productId,
  });

  res.json({
    ok: true,
    movements,
  });
}
