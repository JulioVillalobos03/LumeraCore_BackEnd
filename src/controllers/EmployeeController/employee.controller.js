import * as EmployeeService from "../../services/EmployeeService/employee.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const result = await EmployeeService.createEmployee(companyId, req.body);
  res.json({ ok: true, data: result });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const employees = await EmployeeService.getEmployeesByCompany(companyId);
  res.json({ ok: true, data: employees });
}

export async function get(req, res) {
  const companyId = req.company.id;
  const { id } = req.params;

  const employee = await EmployeeService.getEmployee(companyId, id);
  if (!employee) {
    return res.status(404).json({ ok: false, message: "Employee not found" });
  }

  res.json({ ok: true, data: employee });
}

export async function update(req, res) {
  const companyId = req.company.id;
  const { id } = req.params;

  await EmployeeService.updateEmployee(companyId, id, req.body);
  res.json({ ok: true });
}

export async function changeStatus(req, res) {
  const companyId = req.company.id;
  const { id } = req.params;
  const { status } = req.body;

  await EmployeeService.changeEmployeeStatus(companyId, id, status);
  res.json({ ok: true });
}
