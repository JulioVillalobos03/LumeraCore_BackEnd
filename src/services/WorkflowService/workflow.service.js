import {db} from '../../config/db.js';

export async function canTransition(
  workflowId,
  fromStateId,
  toStateId
) {
  const [rows] = await db.query(
    `
    SELECT 1
    FROM workflow_transitions
    WHERE workflow_id = ?
    AND from_state_id = ?
    AND to_state_id = ?
    `,
    [workflowId, fromStateId, toStateId]
  );

  return rows.length > 0;
}
