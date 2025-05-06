export async function fetchWeather(city: string = "Seoul") {
  try {
    const response = await fetch(`/api/weather?city=${city}`);
    if (!response.ok) throw new Error("응답 실패");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("날씨 정보를 불러오지 못했습니다:", error);
    return null;
  }
}
