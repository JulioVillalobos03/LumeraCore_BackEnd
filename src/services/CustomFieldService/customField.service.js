import { db } from "../../config/db.js";
import { v4 as uuid } from "uuid";

/**
 * Crea definición de custom field
 */
export async function createField(companyId, data) {
  const id = uuid();

  const {
    entity,
    field_key,
    label,
    field_type,
    required = false,
    options = null,
  } = data;

  if (!entity || !field_key || !label || !field_type) {
    throw new Error("entity, field_key, label and field_type are required");
  }

  await db.query(
    `
    INSERT INTO custom_fields
      (id, company_id, entity, field_key, label, field_type, required, options, active)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, 1)
    `,
    [
      id,
      companyId,
      entity,
      field_key,
      label,
      field_type,
      required ? 1 : 0,
      options ? JSON.stringify(options) : null,
    ]
  );

  return { id };
}

/**
 * Lista campos por entidad
 */
export async function listFields(companyId, entity) {
  const [rows] = await db.query(
    `
    SELECT id, entity, field_key, label, field_type, required, options, active
    FROM custom_fields
    WHERE company_id = ?
      AND (? IS NULL OR entity = ?)
      AND active = 1
    ORDER BY entity, label
    `,
    [companyId, entity || null, entity || null]
  );

  // parse options si viene
  return rows.map((r) => ({
    ...r,
    options: r.options ? JSON.parse(r.options) : null,
  }));
}

/**
 * Guarda/actualiza valores de custom fields para una entidad.
 * values ejemplo: { rfc: "XAXX...", credit_limit: 50000 }
 */
export async function saveValues({ companyId, entity, entityId, values }) {
  if (!values || typeof values !== "object") return;

  // 1) Traer definiciones de fields para esa entidad
  const [fields] = await db.query(
    `
    SELECT id, field_key, field_type
    FROM custom_fields
    WHERE company_id = ?
      AND entity = ?
      AND active = 1
    `,
    [companyId, entity]
  );

  const map = new Map(fields.map((f) => [f.field_key, f]));

  for (const [fieldKey, rawValue] of Object.entries(values)) {
    const field = map.get(fieldKey);
    if (!field) continue; // si mandan un field_key que no existe, se ignora

    const payload = normalizeByType(field.field_type, rawValue);

    // 2) Ver si ya existe un valor guardado
    const [[existing]] = await db.query(
      `
      SELECT id
      FROM custom_field_values
      WHERE company_id = ?
        AND entity = ?
        AND entity_id = ?
        AND field_id = ?
      LIMIT 1
      `,
      [companyId, entity, entityId, field.id]
    );

    if (existing) {
      await db.query(
        `
        UPDATE custom_field_values
        SET value_text = ?, value_number = ?, value_date = ?, value_boolean = ?, value_json = ?
        WHERE id = ?
        `,
        [
          payload.value_text,
          payload.value_number,
          payload.value_date,
          payload.value_boolean,
          payload.value_json,
          existing.id,
        ]
      );
    } else {
      await db.query(
        `
        INSERT INTO custom_field_values
          (id, company_id, entity, entity_id, field_id, value_text, value_number, value_date, value_boolean, value_json)
        VALUES
          (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          uuid(),
          companyId,
          entity,
          entityId,
          field.id,
          payload.value_text,
          payload.value_number,
          payload.value_date,
          payload.value_boolean,
          payload.value_json,
        ]
      );
    }
  }
}

/**
 * Obtiene valores de custom fields para una entidad.
 * Regresa objeto { field_key: value }
 */
export async function getValues({ companyId, entity, entityId }) {
  const [rows] = await db.query(
    `
    SELECT
      cf.field_key,
      cf.field_type,
      cfv.value_text,
      cfv.value_number,
      cfv.value_date,
      cfv.value_boolean,
      cfv.value_json
    FROM custom_field_values cfv
    JOIN custom_fields cf ON cf.id = cfv.field_id
    WHERE cfv.company_id = ?
      AND cfv.entity = ?
      AND cfv.entity_id = ?
      AND cf.active = 1
    `,
    [companyId, entity, entityId]
  );

  const out = {};
  for (const r of rows) {
    out[r.field_key] = denormalizeByType(r.field_type, r);
  }
  return out;
}

/** Helpers */

function normalizeByType(type, value) {
  const payload = {
    value_text: null,
    value_number: null,
    value_date: null,
    value_boolean: null,
    value_json: null,
  };

  if (value === undefined) return payload;

  switch (type) {
    case "text":
      payload.value_text = value === null ? null : String(value);
      return payload;
    case "number":
      payload.value_number = value === null ? null : Number(value);
      return payload;
    case "date":
      // espera "YYYY-MM-DD" o Date
      payload.value_date =
        value === null
          ? null
          : value instanceof Date
          ? value.toISOString().slice(0, 10)
          : String(value);
      return payload;
    case "boolean":
      payload.value_boolean =
        value === null ? null : value === true || value === 1 || value === "true";
      return payload;
    default:
      // select / json / etc
      payload.value_json = value === null ? null : JSON.stringify(value);
      return payload;
  }
}

function denormalizeByType(type, row) {
  switch (type) {
    case "text":
      return row.value_text;
    case "number":
      return row.value_number;
    case "date":
      return row.value_date;
    case "boolean":
      return row.value_boolean;
    default:
      return row.value_json ? JSON.parse(row.value_json) : null;
  }
}
