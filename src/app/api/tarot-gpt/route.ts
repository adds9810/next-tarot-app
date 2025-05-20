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
  const prompt = `사용자의 질문은 "${safeQuestion}"이고, 선택된 타로 카드는 "${card}"입니다.  
이 두 요소를 바탕으로, 별들이 밤하늘에서 속삭이듯 부드럽고 시적인 운세를 전해주세요.

- "${safeQuestion}"에 대한 해석과 조언이 중심이 되어야 합니다.
- "${card}"의 상징을 바탕으로 질문에 어울리는 현실적인 통찰을 주세요.
- 전체 운세는 3~5줄 이내의 감성적인 문장으로 구성해주세요.
- 마지막 문장은 희망적인 여운을 남겨주세요.

톤은 몽환적이고 서정적인 분위기를 유지하며, 사용자와 직접 대화하듯 따뜻한 말투로 써주세요.`;

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