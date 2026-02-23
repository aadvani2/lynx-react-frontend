import { type SessionPayload } from "../types";

export interface SessionPayloadPartial extends SessionPayload { }

const SESSION_DATA_KEY = "sessionData";

export const saveServiceSession = (partialPayload: SessionPayloadPartial) => {
  try {
    const existingSession = localStorage.getItem(SESSION_DATA_KEY);
    const currentSession: SessionPayloadPartial = existingSession
      ? JSON.parse(existingSession)
      : {};
    const newSession = { ...currentSession, ...partialPayload };
    localStorage.setItem(SESSION_DATA_KEY, JSON.stringify(newSession));
  } catch (error) {
    console.error("Error saving service session to localStorage:", error);
  }
};

export const getServiceSession = (): SessionPayloadPartial | null => {
  try {
    const existingSession = localStorage.getItem(SESSION_DATA_KEY);
    return existingSession ? JSON.parse(existingSession) : null;
  } catch (error) {
    console.error("Error retrieving service session from localStorage:", error);
    return null;
  }
};

export const clearServiceSession = () => {
  try {
    localStorage.removeItem(SESSION_DATA_KEY);
  } catch (error) {
    console.error("Error clearing service session from localStorage:", error);
  }
};
