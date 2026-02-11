import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
    try {
        const { name, title, year } = await req.json();

        if (!name || !title) {
            return NextResponse.json({ error: "Name and title are required" }, { status: 400 });
        }

        const yearString = year < 0 ? `기원전 ${Math.abs(year)}년` : `서기 ${year}년`;

        const prompt = `
당신은 우주 직계 전생 술사입니다. 
유저의 이름, 전생의 직업, 출생 연도를 바탕으로 아주 구체적이고, 흥미롭고, 약간의 '병맛'과 '바이럴 포인트'가 섞인 전생 스토리를 들려주세요.

유저 이름: ${name}
전생: ${title}
활동 시기: ${yearString}

조건:
1. 문체: 장엄하고 신비로우면서도 중간중간 현대적인 유머와 어처구니없는 설정이 섞인 한국어 구어체.
2. 구성:
   - 도입: 전생의 정체와 시대적 배경 설명.
   - 핵심 사건: 전생에서 겪었던 가장 임팩트 있는 명장면이나 사건 (아주 구체적으로).
   - 나비 효과: 그 전생의 소소하거나 어이없는 행동이 현대 역사나 인류 문명에 끼친 '말도 안 되는' 거대한 영향력.
3. 분량: 400~500자 내외로 작성하되, 가독성을 위해 반드시 3~4개의 단락으로 나누고 단락 사이에는 빈 줄(Double Newline)을 넣어주세요.
4. "${name}님은 ${yearString}에 ${title}(이)었습니다."로 시작하세요.
5. 유저가 이 스토리를 보고 '이게 뭐야 ㅋㅋㅋ' 하면서 공유하고 싶게 만드세요.
`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Cost-effective for storytelling
            messages: [
                { role: "system", content: "당신은 신비로운 전생 스토리텔러입니다." },
                { role: "user", content: prompt },
            ],
            max_tokens: 500,
            temperature: 0.8,
        });

        const story = response.choices[0].message.content;

        return NextResponse.json({ story });
    } catch (error) {
        console.error("OpenAI Error:", error);
        return NextResponse.json({ error: "Failed to generate story" }, { status: 500 });
    }
}
