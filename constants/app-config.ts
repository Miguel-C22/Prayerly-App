/**
 * App-wide configuration constants
 */

/**
 * Threshold for switching between client-side and server-side filtering
 * Below this count: Filter client-side for instant UX
 * Above this count: Filter server-side to reduce data transfer
 */
export const PRAYER_FILTERING_THRESHOLD = 100;
