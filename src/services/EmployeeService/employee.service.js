import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";

export async function createEmployee(companyId, data) {
  const id = uuid();

  const {
    first_name,
    last_name,
    email = null,
    phone = null,
    position = null,
    department = null,
    user_id = null,
    custom_fields = null
  } = data;

  await db.query(
    `
    INSERT INTO employees
    (id, company_id, user_id, first_name, last_name, email, phone, position, department)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `,
    [
      id,
      companyId,
      user_id,
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
    ]
  );

  // ✅ guardar custom fields si vienen
  if (custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "employees",
      entityId: id,
      values: custom_fields,
    });
  }

  return { id };
}

export async function getEmployeesByCompany(companyId) {
  const [rows] = await db.query(
    `
    SELECT *
    FROM employees
    WHERE company_id = ?
    ORDER BY created_at DESC
    `,
    [companyId]
  );

  return rows;
}

export async function getEmployee(companyId, employeeId) {
  const [[employee]] = await db.query(
    `
    SELECT *
    FROM employees
    WHERE id = ? AND company_id = ?
    `,
    [employeeId, companyId]
  );

  if (!employee) return null;

  const customFields = await CustomFieldService.getValues({
    companyId,
    entity: "employees",
    entityId: employeeId,
  });

  return {
    ...employee,
    custom_fields: customFields,
  };
}

export async function updateEmployee(companyId, employeeId, data) {
  const {
    first_name,
    last_name,
    email,
    phone,
    position,
    department,
    user_id,
    custom_fields
  } = data;

  await db.query(
    `
    UPDATE employees
    SET
      first_name = COALESCE(?, first_name),
      last_name = COALESCE(?, last_name),
      email = COALESCE(?, email),
      phone = COALESCE(?, phone),
      position = COALESCE(?, position),
      department = COALESCE(?, department),
      user_id = COALESCE(?, user_id)
    WHERE id = ? AND company_id = ?
    `,
    [
      first_name,
      last_name,
      email,
      phone,
      position,
      department,
      user_id,
      employeeId,
      companyId,
    ]
  );

  // ✅ actualizar custom fields
  if (custom_fields) {
    await CustomFieldService.saveValues({
      companyId,
      entity: "employees",
      entityId: employeeId,
      values: custom_fields,
    });
  }
}

export async function changeEmployeeStatus(companyId, employeeId, status) {
  await db.query(
    `
    UPDATE employees
    SET status = ?
    WHERE id = ? AND company_id = ?
    `,
    [status, employeeId, companyId]
  );
}
