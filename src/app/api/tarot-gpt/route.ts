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
      : `사용자의 질문은 "${question}"이고, 선택한 타로 카드는 "${card}"입니다.
    아래 조건을 따라 별이 밤하늘에서 속삭이듯 감성적이고 현실감 있는 운세를 생성해주세요:
    1. "${question}"이 '언제'에 관한 질문일 경우, 타로 카드의 흐름, 상징, 수비학적 숫자, 계절감 등을 활용해 예상 시기를 반드시 언급해주세요. (예: "초여름 무렵", "2개월 이내", "가을의 초입" 등 구체적인 시간감을 주세요.)
    2. "${card}"는 질문의 시기적 맥락과 어떻게 연결되는지 설명해주세요.
    3. 운세는 3~5문장으로 구성하고, 마지막 문장은 희망적이고 감성적인 문장으로 마무리해주세요.
    4. 어투는 별이 밤하늘에서 조용히 속삭이는 듯한 몽환적이고 시적인 분위기를 유지해주세요.

    ※ 예시) '언제 취업될까요?'라는 질문에 'Six of Cups'가 나왔다면, 과거와 연결된 기회를 통해 약 1~2개월 내에 따뜻하고 익숙한 장소에서 기회가 올 수 있음을 알려주세요.`;
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