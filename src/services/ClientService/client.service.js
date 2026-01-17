import { v4 as uuid } from "uuid";
import { db } from "../../config/db.js";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";

export async function createClient(companyId, data) {
  const id = uuid();

  await db.execute(
    `INSERT INTO clients (
      id, company_id, name, email, phone, tax_id, address
    ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id,
      companyId,
      data.name,
      data.email || null,
      data.phone || null,
      data.tax_id || null,
      data.address || null,
    ]
  );

  // ✅ guardar custom fields (si llegan)
  if (data.custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "clients",
      entityId: id,
      values: data.custom_fields,
    });
  }

  return { id };
}

export async function getClients(companyId) {
  const [rows] = await db.execute(
    `SELECT * FROM clients WHERE company_id = ?`,
    [companyId]
  );
  return rows;
}

export async function getClient(companyId, id) {
  const [[client]] = await db.execute(
    `SELECT * FROM clients WHERE id = ? AND company_id = ?`,
    [id, companyId]
  );

  if (!client) return null;

  const customFields = await CustomFieldService.getValues({
    companyId,
    entity: "clients",
    entityId: id,
  });

  return { ...client, custom_fields: customFields };
}

export async function updateClient(id, companyId, data) {
  await db.execute(
    `UPDATE clients
     SET name = ?, email = ?, phone = ?, tax_id = ?, address = ?
     WHERE id = ? AND company_id = ?`,
    [
      data.name,
      data.email,
      data.phone,
      data.tax_id,
      data.address,
      id,
      companyId,
    ]
  );

  // ✅ actualizar custom fields (si llegan)
  if (data.custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "clients",
      entityId: id,
      values: data.custom_fields,
    });
  }
}

export async function changeStatus(id, companyId, status) {
  await db.execute(
    `UPDATE clients
     SET status = ?
     WHERE id = ? AND company_id = ?`,
    [status, id, companyId]
  );
}
