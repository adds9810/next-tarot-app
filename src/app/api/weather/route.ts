import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = "https://api.openweathermap.org/data/2.5/weather";

export async function GET(req: NextRequest) {
  const city = req.nextUrl.searchParams.get("city") || "Seoul";

  if (!API_KEY) {
    return NextResponse.json(
      { error: "API 키가 설정되어 있지 않습니다." },
      { status: 500 }
    );
  }

  try {
    const res = await axios.get(BASE_URL, {
      params: {
        q: city,
        appid: API_KEY,
        units: "metric",
        lang: "kr",
      },
    });

    const data = res.data;

    return NextResponse.json({
      city: data.name,
      temp: Math.round(data.main.temp),
      weather: data.weather[0].main,
      description: data.weather[0].description,
    });
  } catch (error: any) {
    console.error(
      "서버에서 날씨 요청 실패:",
      error?.response?.data || error.message
    );
    return NextResponse.json(
      { error: "날씨를 불러오지 못했습니다.", details: error?.message },
      { status: 500 }
    );
  }
}
