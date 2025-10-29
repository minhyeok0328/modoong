export const formatDistance = (distance: number) =>
  distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(2)}km`;
