import * as CustomFieldService from "../../services/CustomFieldService/customField.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const result = await CustomFieldService.createField(companyId, req.body);
  res.json({ ok: true, data: result });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const { entity } = req.query;
  const fields = await CustomFieldService.listFields(companyId, entity);
  res.json({ ok: true, data: fields });
}
