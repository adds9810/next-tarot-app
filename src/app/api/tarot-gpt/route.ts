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
  }의 의미를 간단하고 감성적으로 요약해줘.
현재 고민에 어울릴 만한 현실적인 조언도 함께 해줘.
전체는 3~5줄이면 충분하고, 마지막은 긍정적인 말로 마무리해줘.
`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4", // 필요 시 'gpt-3.5-turbo'로 교체
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
