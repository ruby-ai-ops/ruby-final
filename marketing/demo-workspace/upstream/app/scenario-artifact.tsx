'use client';

import type { DemoScenario } from './demo-scenarios';
import { artifactRegistry, type ArtifactPlatform } from './artifacts/registry';

export function ScenarioArtifact({ scenario, platform }: { scenario: DemoScenario; platform: ArtifactPlatform }) {
  const Artifact = artifactRegistry[scenario.artifactId];
  if (!Artifact) return null;

  return (
    <section
      className={`scenario-artifact artifact-variant-${scenario.artifact.variant} artifact-platform-${platform}`}
      data-artifact-id={scenario.artifactId}
      aria-label={`Scenario artifact: ${scenario.copy.conversationTitle}`}
    >
      <Artifact scenario={scenario} platform={platform} />
    </section>
  );
}
