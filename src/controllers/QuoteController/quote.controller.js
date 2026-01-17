import * as QuoteService from "../../services/QuoteService/quote.service.js";

export async function create(req, res) {
  const companyId = req.company.id;
  const { client_id, items } = req.body;

  if (!client_id || !items || !items.length) {
    return res.status(400).json({
      ok: false,
      message: "client_id and items are required",
    });
  }

  const quote = await QuoteService.createQuote(companyId, req.body);

  res.status(201).json({
    ok: true,
    data: quote,
  });
}

export async function list(req, res) {
  const companyId = req.company.id;
  const quotes = await QuoteService.getQuotes(companyId);

  res.json({
    ok: true,
    data: quotes,
  });
}

export async function detail(req, res) {
  const companyId = req.company.id;
  const { id } = req.params;

  const quote = await QuoteService.getQuoteById(companyId, id);

  if (!quote) {
    return res.status(404).json({
      ok: false,
      message: "Quote not found",
    });
  }

  res.json({
    ok: true,
    data: quote,
  });
}
