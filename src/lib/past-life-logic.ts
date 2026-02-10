import { PAST_LIFE_TITLES } from "../data/titles";

/**
 * Simple hash function to generate a consistent index from a string.
 */
function hashString(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash |= 0; // Convert to 32bit integer
    }
    return Math.abs(hash);
}

export interface PastLife {
    title: string;
    year: number;
}

export function getPastLifeFromName(name: string): PastLife {
    const hash = hashString(name);

    // Select title deterministically
    const titleIndex = hash % PAST_LIFE_TITLES.length;
    const title = PAST_LIFE_TITLES[titleIndex];

    // Select year deterministically between -30000 and 2000
    // Range is 32000 years
    const yearRange = 32000;
    const rawYear = (hash % yearRange) - 30000;
    const year = rawYear;

    return { title, year };
}
