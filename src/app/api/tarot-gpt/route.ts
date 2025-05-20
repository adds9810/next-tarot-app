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
    다음 조건에 따라, 별이 밤하늘에서 조용히 속삭이듯 감성적이고 현실감 있는 운세를 생성해주세요:

    1. 질문이 '언제'에 관한 내용일 경우, 타로 카드의 흐름, 상징, 수비학적 숫자, 계절감을 바탕으로 **예상 시기**를 반드시 언급해주세요.
      예: "약 2개월 이내", "늦봄에서 초여름 사이", "가을의 초입"
    2. 질문이 시기가 아닌 경우(예: 상대의 속마음, 결과, 관계 흐름 등), 카드의 의미를 활용해 **현재 상황/결과/상대 감정/가능성** 중 적절한 주제로 현실적인 조언을 제공해주세요.
    3. "${card}"가 어떻게 해당 질문과 연결되는지를 자연스럽게 설명해주세요.
    4. 문장은 3~5줄 이내로 구성하고, 마지막 문장은 감성적이고 희망적인 여운을 남겨주세요.
    5. 전체 톤은 서정적이며 별이 속삭이듯 부드러운 분위기를 유지해주세요.

    ※ 예시: '언제 취업될까요?'라는 질문에 'Six of Cups'가 나왔다면,
    "과거의 인연이나 익숙한 환경과의 재회 속에서 기회가 찾아올 수 있습니다.
    익숙한 사람이나 공간과 다시 연결되는 흐름 속에서, 약 1~2개월 이내에 따뜻한 제안을 받을 가능성이 보입니다.
    이 카드는 회복과 안정의 에너지를 전하며, 당신이 그동안 쌓아온 경험이 빛을 발할 순간이 머지않았습니다.
    그 시간을 준비하며, 마음을 다정하게 정돈해보세요."`;
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