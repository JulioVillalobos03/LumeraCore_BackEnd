export function getCurrentCompany(req, res) {
  res.json({
    ok: true,
    company: req.company,
  });
}
