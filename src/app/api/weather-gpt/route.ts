import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { city, temp, weather, description } = await req.json();

    if (!city || !temp || !weather) {
      return NextResponse.json(
        { error: "필수 날씨 데이터가 누락되었습니다." },
        { status: 400 }
      );
    }

    const prompt = `
지금 ${city}의 날씨는 ${description}이고, 기온은 ${temp}도입니다.
이런 날씨에 어울리는 감성적이고 현실적인 메시지를 3~5줄로 요약해줘.
현실적인 조언도 포함하고, 반드시 따뜻한 말로 마무리해줘.
`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4", // 필요 시 'gpt-3.5-turbo'로 변경 가능
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ message: result });
  } catch (error) {
    console.error("OpenAI 감성 메시지 오류:", error);
    return NextResponse.json(
      { error: "감성 메시지를 생성하지 못했습니다." },
      { status: 500 }
    );
  }
}
