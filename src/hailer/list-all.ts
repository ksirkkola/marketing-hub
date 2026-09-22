import { Activity, HailerApi } from '@hailer/app-sdk';

/**
 * Fetches every activity across a set of phases for a workflow, capping page size at
 * 200 (larger limits silently return [] in production — see hailer-app-builder skill).
 * Stamps `currentPhase` since it's unreliable coming back from list().
 */
export async function listAllPhases(
  hailer: HailerApi,
  workflowId: string,
  phaseIds: string[],
  pageSize = 200,
): Promise<Activity[]> {
  const all: Activity[] = [];

  for (const phaseId of phaseIds) {
    let skip = 0;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const page = await hailer.activity.list(workflowId, phaseId, { limit: pageSize, skip });
      all.push(...page.map(a => ({ ...a, currentPhase: a.currentPhase || phaseId })));
      if (page.length < pageSize) break;
      skip += pageSize;
      if (skip > 50000) break;
    }
  }

  return all;
}
