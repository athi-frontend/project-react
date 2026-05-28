import { NUMBERMAP } from "@/constants/common";

export const DRAFT_SAVE_CONFIG = {
  DEBOUNCE_MS: NUMBERMAP.THREETHOUSAND * NUMBERMAP.TEN,
  API_ENDPOINT: '/api/v1/magic-save/draft',
} as const;

export const DRAFT_SAVE_MESSAGES = {
  SUCCESS: 'Draft saved successfully',
  ERROR: 'Failed to save draft',
  SAVING: 'Saving draft...',
} as const;
