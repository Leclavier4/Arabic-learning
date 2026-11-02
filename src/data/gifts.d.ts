import type { Gift, MediaGift, RiddleGift, FactGift } from "../types";

export const MEDIA_GIFTS: MediaGift[];
export const RIDDLE_GIFTS: RiddleGift[];
export const FACT_GIFTS: FactGift[];

export function giftForDay(dayNumber: number): Gift;
