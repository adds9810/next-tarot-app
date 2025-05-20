import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { card, questionType, question } = body;

  // 필수 항목 확인
  if (!card || !questionType) {
    return NextResponse.json(
      { error: "card와 questionType은 필수입니다." },
      { status: 400 }
    );
  }

  // 질문이 없는 경우 안전한 기본값 설정
  const safeQuestion =
    question || (questionType === "custom" ? "질문 내용 없음" : "오늘의 운세");

  // 프롬프트 구성
  const prompt =
    questionType === "today"
      ? `오늘의 카드 "${card}"를 기준으로, 사용자의 하루를 별들이 속삭이듯 감성적으로 예측해주세요.

  - "${card}"의 상징을 활용해 오늘의 에너지와 주의할 점, 기대할 점을 조언해주세요.
  - 문장은 전체 3~5줄 이내로 구성하고, 마지막은 희망적이거나 위로가 되는 말로 마무리해주세요.
  - 전체 톤은 별이 하늘에서 속삭이는 듯한 서정적이고 몽환적인 스타일로 써주세요.`
      : `사용자의 질문은 "${question}"이고, 선택된 타로 카드는 "${card}"입니다.

  - "${question}"에 대해 명확하게 답변해주세요. (예: 구직운, 인간관계, 결정 등)
  - "${card}"의 의미와 상징을 질문과 연결해서 해석해주세요.
  - 현실적인 조언을 한 줄 이상 포함해주세요.
  - 전체는 3~5줄 이내의 감성적이고 부드러운 문장으로 작성해주세요.
  - 마지막 문장은 별들이 건네는 듯한 희망의 속삭임으로 마무리해주세요.`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
    });

    const result = completion.choices?.[0]?.message?.content;
    if (!result) {
      return NextResponse.json(
        { error: "OpenAI 응답이 비어 있습니다." },
        { status: 500 }
      );
    }

    return NextResponse.json({ fortune: result });
  } catch (error) {
    console.error("OpenAI 오류:", error);
    return NextResponse.json(
      { error: "운세 생성에 실패했습니다." },
      { status: 500 }
    );
  }
}