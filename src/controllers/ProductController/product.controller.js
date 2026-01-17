import * as ProductService from "../../services/ProductService/product.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const result = await ProductService.createProduct(companyId, req.body);
  res.json({ ok: true, data: result });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const products = await ProductService.getProducts(companyId);
  res.json({ ok: true, data: products });
}

export async function get(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;

  const product = await ProductService.getProduct(companyId, id);
  if (!product) return res.status(404).json({ ok: false, message: "Product not found" });

  res.json({ ok: true, data: product });
}

export async function update(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;

  await ProductService.updateProduct(companyId, id, req.body);
  res.json({ ok: true });
}

export async function changeStatus(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;
  const { status } = req.body;

  await ProductService.changeProductStatus(companyId, id, status);
  res.json({ ok: true });
}
