import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
다음 타로 카드 "${card}"를 기반으로,
${
  questionType === "today"
    ? "오늘 당신에게 속삭이는 별의 운세"
    : "당신의 질문에 대해 별들이 건네는 속삭임"
}을
은유적이고 감성적인 문장으로 3~5줄 이내로 요약해줘.

카드의 상징과 현재 고민에 어울리는 **현실적인 조언**도 부드럽게 담아줘.
마지막 문장은 **희망적인 여운**으로 마무리해줘.
전체적인 어투는 **별이 밤하늘에서 속삭이듯 부드럽고 시적인 느낌**이면 좋아.
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
