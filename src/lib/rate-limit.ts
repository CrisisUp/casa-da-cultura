import { NextResponse } from "next/server";

const rateLimitMap = new Map<string, { count: number; lastReset: number }>();

const LIMIT = 100; // max requests
const WINDOW_MS = 60 * 1000; // per 1 minute

export function rateLimit(ip: string): boolean {
  const now = Date.now();
  const tokenData = rateLimitMap.get(ip);

  if (!tokenData) {
    rateLimitMap.set(ip, { count: 1, lastReset: now });
    return true;
  }

  if (now - tokenData.lastReset > WINDOW_MS) {
    tokenData.count = 1;
    tokenData.lastReset = now;
    return true;
  }

  if (tokenData.count >= LIMIT) {
    return false;
  }

  tokenData.count++;
  return true;
}
