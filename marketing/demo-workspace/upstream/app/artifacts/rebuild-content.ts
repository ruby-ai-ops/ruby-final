import {harborviewContent} from './harborview/fixtures';
import {keylineContent} from './keyline/fixtures';
import {talentSpringContent} from './talentspring/fixtures';
import {cedarshieldContent} from './cedarshield/fixtures';
import {ledgerContent} from './ledger/fixtures';
import type {RebuiltContent} from './content-types';
export const rebuiltScenarioContent:Record<string,RebuiltContent>={
  ...harborviewContent,
  ...keylineContent,
  ...talentSpringContent,
  ...cedarshieldContent,
  ...ledgerContent,
};
