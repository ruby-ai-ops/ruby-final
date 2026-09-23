import { existsSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

describe('Everglade font assets', () => {
  it('ships both supplied typefaces', () => {
    expect(existsSync('public/fonts/RubySerif.ttf')).toBe(true);
    expect(existsSync('public/fonts/Sohne-Regular.ttf')).toBe(true);
  });
});
