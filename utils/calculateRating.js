export const calculateRating = (
  currentRating,
  oldNoRatings,
  newNoRatings,
  userRating,
  oldRating = 0,
) => {
  if (newNoRatings === 0) return 0;
  return (
    (Number(currentRating) * Number(oldNoRatings) +
      Number(userRating) -
      Number(oldRating)) /
    Number(newNoRatings)
  );
};
