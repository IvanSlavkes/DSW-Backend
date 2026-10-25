import { prisma } from "../lib/prisma.js";

const REMINDER_TYPE = "match_reminder";
let checkInProgress = false;

/** Creates one in-app reminder for each user involved, about 24 hours before kickoff. */
export async function createUpcomingMatchReminders(now = new Date()) {
  if (checkInProgress) return;
  checkInProgress = true;
  try {
    const matches = await prisma.match.findMany({
      where: {
        startsAt: {
          gte: new Date(now.getTime() - 36 * 60 * 60 * 1000),
          lte: new Date(now.getTime() + 48 * 60 * 60 * 1000),
        },
      },
      include: { teams: { include: { positions: true, requests: true } } },
    });

    for (const match of matches) {
      const startsAt = match.startsAt;
      const reminderDueAt = startsAt.getTime() - 24 * 60 * 60 * 1000;
      if (
        !Number.isFinite(startsAt.getTime()) ||
        startsAt.getTime() <= now.getTime() ||
        reminderDueAt > now.getTime()
      ) continue;

      const userIds = new Set<number>([match.creatorId]);
      for (const team of match.teams) {
        for (const position of team.positions) {
          if (position.occupantId) userIds.add(position.occupantId);
        }
        for (const request of team.requests) userIds.add(request.userId);
      }

      for (const userId of userIds) {
        const existingReminder = await prisma.notification.findFirst({
          where: { userId, matchId: match.id, type: REMINDER_TYPE },
          select: { id: true },
        });
        if (existingReminder) continue;

        await prisma.notification.create({
          data: {
            userId,
            matchId: match.id,
            type: REMINDER_TYPE,
            message: `Recordatorio: mañana es ${match.name}, a las ${new Intl.DateTimeFormat("es-AR", { timeZone: "America/Argentina/Buenos_Aires", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).format(startsAt)}.`,
          },
        });
      }
    }
  } finally {
    checkInProgress = false;
  }
}
