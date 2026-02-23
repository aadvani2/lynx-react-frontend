import { type SessionPayload } from "../types";

/**
 * Extended SessionData with expiration metadata
 */
export interface SessionData extends SessionPayload {
    _createdAt?: number;
    _expiresAt?: number;
}

/**
 * Session time-to-live in milliseconds (30 minutes)
 * After this time, stored session data will be considered expired and automatically cleared
 */
const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes

/**
 * localStorage key for session data
 */
const SESSION_DATA_KEY = "sessionData";

/**
 * Store session data in localStorage with expiration metadata
 * @param data - Session data to store (without metadata fields)
 * @param ttlMs - Optional time-to-live in milliseconds (defaults to SESSION_TTL_MS)
 */
export function setSessionData(
    data: Omit<SessionData, "_createdAt" | "_expiresAt">,
    ttlMs: number = SESSION_TTL_MS
): void {
    try {
        const now = Date.now();
        const withMeta: SessionData = {
            ...data,
            _createdAt: now,
            _expiresAt: now + ttlMs,
        };
        localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(withMeta));
    } catch (error) {
        console.error("Error saving session data to localStorage:", error);
    }
}

/**
 * Retrieve session data from localStorage
 * Returns null if data doesn't exist, is expired, or is corrupted
 * Automatically removes expired or corrupted data
 */
export function getSessionData(): SessionData | null {
    try {
        const raw = localStorage.getItem(SESSION_DATA_KEY);
        if (!raw) return null;

        try {
            const parsed = JSON.parse(raw) as SessionData;

            // Check if data has expired
            if (parsed._expiresAt && Date.now() > parsed._expiresAt) {
                console.log("Session data expired, removing from localStorage");
                localStorage.removeItem(SESSION_DATA_KEY);
                return null;
            }

            return parsed;
        } catch (parseError) {
            // If data is corrupted, remove it
            console.error("Error parsing session data, removing corrupted data:", parseError);
            localStorage.removeItem(SESSION_DATA_KEY);
            return null;
        }
    } catch (error) {
        console.error("Error retrieving session data from localStorage:", error);
        return null;
    }
}

/**
 * Clear session data from localStorage
 */
export function clearSessionData(): void {
    try {
        localStorage.removeItem(SESSION_DATA_KEY);
    } catch (error) {
        console.error("Error clearing session data from localStorage:", error);
    }
}

/**
 * Update existing session data by merging with new partial data
 * Preserves existing data and updates only provided fields
 * Resets the expiration timer
 */
export function updateSessionData(
    partialData: Partial<Omit<SessionData, "_createdAt" | "_expiresAt">>,
    ttlMs: number = SESSION_TTL_MS
): void {
    try {
        const existing = getSessionData();
        const merged = existing ? { ...existing, ...partialData } : partialData;

        // Remove metadata fields before setting (setSessionData will add them)
        const { _createdAt, _expiresAt, ...dataWithoutMeta } = merged as SessionData;

        setSessionData(dataWithoutMeta, ttlMs);
    } catch (error) {
        console.error("Error updating session data:", error);
    }
}
