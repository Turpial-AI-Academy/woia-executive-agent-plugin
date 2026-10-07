// Pure planning: no persistence, contacts, money, grants or receiver mutations.
export const operations = ['direction', 'view', 'exception', 'contribution', 'follow-up'];
const text = value => typeof value === 'string' && value.trim().length > 0;
export function planExecutive(input) {
  if (!input || !operations.includes(input.operation)) throw new Error('Unsupported executive operation');
  for (const key of ['organization', 'scope', 'actor', 'target', 'source_revision', 'correlation']) {
    if (!text(input[key])) throw new Error(`Missing ${key}`);
  }
  const evidence = input.evidence;
  if (!evidence || !text(evidence.owner) || !text(evidence.source) || evidence.revision !== input.source_revision || evidence.accepted !== true || evidence.fresh !== true || evidence.conflict !== false) {
    return {result: 'UNKNOWN', owner: evidence?.owner ?? null, next: 'SOURCE_OWNER_RECONCILIATION', effects: []};
  }
  const grant = input.grant;
  if (!grant || !Number.isFinite(input.evaluated_at) || !Number.isFinite(grant.valid_from) || !Number.isFinite(grant.valid_until) || input.evaluated_at < grant.valid_from || input.evaluated_at >= grant.valid_until || !text(input.current_grant_revision) || grant.revision !== input.current_grant_revision || grant.revoked !== false || grant.actor !== input.actor || grant.organization !== input.organization || grant.scope !== input.scope || grant.operation !== input.operation || grant.target !== input.target || grant.source_revision !== input.source_revision || grant.competent !== true) {
    return {result: 'BLOCKED_AUTHORITY', next: 'COMPETENT_DECISION', effects: []};
  }
  if (input.operation === 'view') {
    const indicators = input.indicators;
    if (!Array.isArray(indicators) || indicators.length === 0) throw new Error('Indicators required');
    for (const item of indicators) {
      if (!text(item.definition) || !text(item.owner) || !text(item.period) || !text(item.population) || !text(item.source) || !text(item.limitation) || item.scope !== input.scope || item.fresh !== true || !Number.isFinite(item.value)) {
        return {result: 'UNKNOWN', next: 'METRIC_OWNER_RECONCILIATION', effects: []};
      }
    }
    const comparable = indicators.every(item => item.definition === indicators[0].definition && item.period === indicators[0].period && item.population === indicators[0].population);
    return {result: 'VIEW', indicators: structuredClone(indicators), comparable, effects: [], causal_claim: false};
  }
  if (input.operation === 'contribution') {
    if (!text(input.receiver) || input.receiver === 'executive' || !text(input.outcome) || !text(input.decision_version)) throw new Error('Distinct receiver and accepted decision required');
    if (input.decision_version !== input.source_revision) return {result: 'REVALIDATE', next: 'COMPETENT_DECISION', effects: []};
    return {result: 'REQUEST_PLANNED', transport: 'WOIA_CORE', correlation: input.correlation, receiver: input.receiver, outcome: input.outcome, decision_version: input.decision_version, receiver_task_owned: true, acceptance: 'NOT_YET_ACCEPTED', completion: 'NOT_RUN', effects: []};
  }
  if (input.operation === 'follow-up') {
    if (input.premises_changed !== false) return {result: 'REVALIDATE', next: 'COMPETENT_OWNER', effects: []};
    if (!['pending', 'rejected', 'uncertain', 'satisfied'].includes(input.outcome_state)) throw new Error('Outcome state required');
    return {result: input.outcome_state === 'satisfied' && input.residuals_owned === true ? 'CLOSE_EXECUTIVE_OUTCOME' : 'CONTINUE_OWNED', next: 'CORE_DUE_WORK', effects: []};
  }
  return {result: 'BOUNDED_PLAN', operation: input.operation, owner: evidence.owner, accepted_source: evidence.source, effects: []};
}
