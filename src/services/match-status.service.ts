import { prisma } from "../lib/prisma.js";

type MatchTiming = { startsAt: Date; duration: number };

/**
 * Returns the lifecycle state determined exclusively by the scheduled time.
 * A match is ongoing from its exact start until its duration has elapsed.
 */
export function getScheduledMatchStatus(
  { startsAt, duration }: MatchTiming,
  now = new Date(),
): "ongoing" | "finished" | null {
  const start = startsAt.getTime();
  const end = start + duration * 60_000;

  if (now.getTime() >= end) return "finished";
  if (now.getTime() >= start) return "ongoing";
  return null;
}

/** Persists lifecycle changes for matches whose start/end time has passed. */
export async function refreshScheduledMatchStatuses(now = new Date()) {
  const matches = await prisma.match.findMany({
    where: { status: { in: ["open", "full", "ongoing"] } },
    select: { id: true, startsAt: true, duration: true, status: true },
  });

  const updates = matches.flatMap((match) => {
    const nextStatus = getScheduledMatchStatus(match, now);
    return nextStatus && nextStatus !== match.status
      ? [prisma.match.update({ where: { id: match.id }, data: { status: nextStatus } })]
      : [];
  });

  await Promise.all(updates);
  return updates.length;
}
