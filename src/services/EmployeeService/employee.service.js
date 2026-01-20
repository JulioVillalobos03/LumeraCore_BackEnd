import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";
import * as CustomFieldService from "../CustomFieldService/customField.service.js";
import { AppError } from "../../utils/AppError.js";

/**
 * Crear empleado
 */
export async function createEmployee(companyId, data) {
  const {
    first_name,
    last_name,
    email = null,
    phone = null,
    position = null,
    department = null,
    user_id = null,
    custom_fields = null,
  } = data;

  if (!companyId || !first_name || !last_name) {
    throw new AppError("EMPLOYEE_INVALID_INPUT");
  }

  const id = uuid();

  await db.query(
    `
    INSERT INTO employees
      (id, company_id, user_id, first_name, last_name, email, phone, position, department, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')
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

  // ✅ Guardar custom fields
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

/**
 * Listar empleados por empresa
 */
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

/**
 * Obtener empleado por ID (incluye custom fields)
 */
export async function getEmployee(companyId, employeeId) {
  const [[employee]] = await db.query(
    `
    SELECT *
    FROM employees
    WHERE id = ? AND company_id = ?
    `,
    [employeeId, companyId]
  );

  if (!employee) {
    throw new AppError("EMPLOYEE_NOT_FOUND");
  }

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

/**
 * Actualizar empleado
 */
export async function updateEmployee(companyId, employeeId, data) {
  if (!companyId || !employeeId) {
    throw new AppError("EMPLOYEE_INVALID_INPUT");
  }

  const {
    first_name,
    last_name,
    email,
    phone,
    position,
    department,
    user_id,
    custom_fields,
  } = data;

  const [result] = await db.query(
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

  if (result.affectedRows === 0) {
    throw new AppError("EMPLOYEE_NOT_FOUND");
  }

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

/**
 * Cambiar status de empleado
 */
export async function changeEmployeeStatus(companyId, employeeId, status) {
  if (!["active", "inactive"].includes(status)) {
    throw new AppError("EMPLOYEE_INVALID_INPUT");
  }

  const [result] = await db.query(
    `
    UPDATE employees
    SET status = ?
    WHERE id = ? AND company_id = ?
    `,
    [status, employeeId, companyId]
  );

  if (result.affectedRows === 0) {
    throw new AppError("EMPLOYEE_NOT_FOUND");
  }
}
