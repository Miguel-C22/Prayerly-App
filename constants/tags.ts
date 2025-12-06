/**
 * Prayer Tag Constants
 * Maps tag names to their corresponding Ionicons
 */

export const TAG_ICONS = {
  Strength: 'fitness',
  Family: 'people',
  Guidance: 'compass',
  Health: 'medical',
  Relationships: 'heart',
  Finances: 'cash',
  Career: 'briefcase',
  General: 'hand-left',
} as const;

export type TagName = keyof typeof TAG_ICONS;
