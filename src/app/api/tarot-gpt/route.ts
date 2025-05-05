import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

// OpenAI 초기화
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST 요청 처리
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { card, questionType } = body;

  if (!card || !questionType) {
    return NextResponse.json(
      { error: "card와 questionType은 필수입니다." },
      { status: 400 }
    );
  }

  const prompt = `
다음 타로 카드 "${card}"를 기반으로 ${
    questionType === "today" ? "오늘의 운세" : "사용자의 질문에 대한 운세"
  }를 감성적이면서도 현실적인 3~5줄로 요약해줘.
반드시 긍정적인 메시지로 마무리해줘.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // 필요 시 'gpt-3.5-turbo'로 교체 가능
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices[0].message.content;
    return NextResponse.json({ fortune: result });
  } catch (error) {
    console.error("OpenAI 오류:", error);
    return NextResponse.json(
      { error: "운세 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}
