export const getWeatherEmoji = (description: string): string => {
  const desc = description.toLowerCase();
  if (desc.includes("맑음") || desc.includes("clear")) return "☀️";
  if (desc.includes("구름") || desc.includes("cloud")) return "☁️";
  if (desc.includes("비") || desc.includes("rain")) return "🌧️";
  if (desc.includes("눈") || desc.includes("snow")) return "❄️";
  if (desc.includes("천둥") || desc.includes("thunder")) return "⛈️";
  if (desc.includes("안개") || desc.includes("mist")) return "🌫️";
  return "🌟";
};
