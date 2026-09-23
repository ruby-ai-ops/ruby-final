import '@testing-library/jest-dom/vitest';
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('workspace rebuild media quality', () => {
  it('keeps all locally generated operational photographs decodable', () => {
    const files = {
      logistics: ['delta-tractor', 'delta-route-aerial', 'delta-dock-handoff', 'truck-eg-4821', 'truck-eg-4828', 'truck-eg-4835', 'dock-controls', 'dock-reroute', 'dock-recovery'],
      dairy: ['whole-milk', 'chocolate-milk'],
      harborview: ['clinic-exterior', 'reception', 'exam-room', 'diagnostic-equipment'],
      keyline: ['lakeside-exterior', 'parkview-exterior', 'millhouse-exterior', 'lakeside-interior', 'parkview-interior', 'millhouse-interior', 'inspection-leak', 'inspection-door'],
      talentspring: ['workplace-arrival', 'onboarding-workspace'],
      cedarshield: ['roof-damage', 'water-intrusion', 'vehicle-hail', 'response-staging'],
    };
    const paths = Object.entries(files).flatMap(([workspace, names]) => names.map((name) => `public/demo-${workspace}/${name}.webp`));
    expect(paths).toHaveLength(29);
    for (const path of paths) {
      const bytes = readFileSync(path);
      expect(bytes.subarray(0, 4).toString(), path).toBe('RIFF');
      expect(bytes.subarray(8, 12).toString(), path).toBe('WEBP');
    }
  });
});
