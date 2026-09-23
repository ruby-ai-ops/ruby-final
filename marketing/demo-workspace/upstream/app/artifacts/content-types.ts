import type { ArtifactKind } from '../demo-scenarios';
export type RebuiltContent = { kind: ArtifactKind; summary: string; explanation: string; intro: string; actions: [string, string, string]; prompt?: string };
