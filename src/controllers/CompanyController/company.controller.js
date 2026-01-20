import * as CompanyService from "../../services/CompanyService/company.service.js";


/**
 * POST /companies
 */
export async function create(req, res) {
  console.log("REQ.USER =>", req.user); // 👈 AÑADE ESTO
  console.log("HEADERS =>", req.headers.authorization);
  const userId = req.user.id;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ message: "name is required" });
  }

  const result = await CompanyService.createCompanyWithBootstrap({
    userId,
    name,
  });

  res.status(201).json({
    message: "Company created and bootstrap completed",
    companyId: result.companyId,
    adminRoleId: result.adminRoleId,
  });
}


/**
 * GET /companies
 */
export async function list(req, res) {
  const companies = await CompanyService.getAllCompanies();
  res.json({ companies });
}

/**
 * PATCH /companies/:id
 */
export async function update(req, res) {
  const { id } = req.params;
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "Company name is required",
    });
  }

  await CompanyService.updateCompany({ id, name });

  res.json({ message: "Company updated" });
}

/**
 * PATCH /companies/:id/status
 */
export async function changeStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status",
    });
  }

  await CompanyService.updateCompanyStatus({ id, status });

  res.json({ message: "Company status updated" });
}
