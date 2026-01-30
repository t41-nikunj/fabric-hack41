import { createLogger } from '../utils/logger';

const logger = createLogger('SportsAPI');
const API_BASE = "http://localhost:8000/api/v1";

export async function fetchSports() {
  logger.info('Fetching sports list');
  try {
    const res = await fetch(`${API_BASE}/sports`);
    if (!res.ok) {
      logger.error('Failed to fetch sports', { status: res.status });
      throw new Error("Failed to fetch sports");
    }
    const data = await res.json();
    logger.info('Sports fetched successfully', { count: data.sports?.length });
    return data;
  } catch (error) {
    logger.error('Error fetching sports', { error: error.message });
    throw error;
  }
}

export async function fetchTurfs(sportId) {
  logger.info('Fetching turfs', { sportId });
  try {
    const res = await fetch(`${API_BASE}/sports/${sportId}/turfs`);
    if (!res.ok) {
      logger.error('Failed to fetch turfs', { sportId, status: res.status });
      throw new Error("Failed to fetch turfs");
    }
    const data = await res.json();
    logger.info('Turfs fetched successfully', { sportId, count: data.turfs?.length });
    return data;
  } catch (error) {
    logger.error('Error fetching turfs', { sportId, error: error.message });
    throw error;
  }
}

export async function confirmMessage(message) {
  logger.info('Confirming message', { message });
  try {
    const res = await fetch(`${API_BASE}/sports/confirm?message=${encodeURIComponent(message)}`);
    if (!res.ok) {
      logger.error('Failed to confirm message', { status: res.status });
      throw new Error("Failed to confirm message");
    }
    const data = await res.json();
    logger.info('Message confirmed', { response: data });
    return data;
  } catch (error) {
    logger.error('Error confirming message', { error: error.message });
    throw error;
  }
}