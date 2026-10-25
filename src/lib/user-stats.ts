type UserRatings = {
  ratingsGiven: { matchId: number }[];
  ratingsReceived: { matchId: number; stars: number }[];
};

export function calculateUserStats({ ratingsGiven, ratingsReceived }: UserRatings) {
  const ratingTotal = ratingsReceived.reduce((total, rating) => total + rating.stars, 0);
  const matchIds = new Set([
    ...ratingsGiven.map((rating) => rating.matchId),
    ...ratingsReceived.map((rating) => rating.matchId),
  ]);

  return {
    averageRating: ratingsReceived.length
      ? Number((ratingTotal / ratingsReceived.length).toFixed(2))
      : 0,
    matchesPlayed: matchIds.size,
  };
}

export function withUserStats<T extends UserRatings>(user: T) {
  const { ratingsGiven, ratingsReceived, ...profile } = user;
  return {
    ...profile,
    ...calculateUserStats({ ratingsGiven, ratingsReceived }),
  };
}
