import * as ClientService from "../../services/ClientService/client.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const result = await ClientService.createClient(companyId, req.body);
  res.json({ ok: true, data: result });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const clients = await ClientService.getClients(companyId);
  res.json({ ok: true, data: clients });
}

export async function get(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;

  const client = await ClientService.getClient(companyId, id);
  if (!client) return res.status(404).json({ ok: false, message: "Client not found" });

  res.json({ ok: true, data: client });
}

export async function update(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;

  await ClientService.updateClient(id, companyId, req.body);
  res.json({ ok: true });
}

export async function changeStatus(req, res) {
  const companyId = req.company.id;
  const id = req.params.id;
  const { status } = req.body;

  await ClientService.changeStatus(id, companyId, status);
  res.json({ ok: true });
}
