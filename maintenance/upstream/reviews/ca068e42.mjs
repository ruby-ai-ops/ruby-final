// Reviewed catch-up through ca068e42. The upstream deploy workflow only
// consolidates its Slack failure notification steps; Ruby excludes all
// upstream workflows. Daily automation still stops on any workflow change.
import { createSyncCandidate } from '../sync.mjs';

const target = 'ca068e42baca4efb9c8acab3a8112547cd5552e3';
const reviewedWorkflowChanges = new Map([
  ['.github/workflows/deploy.yml', {
    before: '100644:ff73d39e3f89b46a732564e3ee2a117d4e22fa3c651643f61922ed9495422fdc',
    after: '100644:f96266f9a1bac1663c37663b59d049c55b323bbfc8b813871900fd443704a492',
  }],
]);

const result = createSyncCandidate(process.cwd(), target, {
  reviewedWorkflowChanges,
});
process.stdout.write(JSON.stringify(result) + '\n');
