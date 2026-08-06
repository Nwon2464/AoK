export const formatStreamElapsedTime = (startedAt, now) => {
  const startedTime = new Date(startedAt).getTime();

  if (!Number.isFinite(startedTime)) return "";

  const elapsedMinutes = Math.max(0, Math.floor((now - startedTime) / 60000));
  const days = Math.floor(elapsedMinutes / 1440);
  const hours = Math.floor((elapsedMinutes % 1440) / 60);
  const minutes = elapsedMinutes % 60;

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};
