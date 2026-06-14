import Anthropic from '@anthropic-ai/sdk';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { profile, status, projection } = body as {
    profile: { name: string; sector: string; totalEmployees: number; currentEmiratis: number };
    status: { requiredEmiratis: number; gap: number };
    projection: { annualPenalty: number; nafisSubsidy: number };
  };

  const client = new Anthropic();

  const prompt = `You are a UAE Emiratisation compliance expert. Generate a practical 90-day action plan for this company:

Company: ${profile.name}
Sector: ${profile.sector}
Total Employees: ${profile.totalEmployees}
Current Emiratis: ${profile.currentEmiratis}
Required Emiratis: ${status.requiredEmiratis}
Compliance Gap: ${status.gap} positions
Annual Penalty if Not Fixed: AED ${projection.annualPenalty.toLocaleString()}
Nafis Govt. Top-Up (paid directly to Emirati employee by government): AED ${projection.nafisSubsidy.toLocaleString()}/year — this reduces the salary gap and helps attract Emirati talent

Generate a structured 90-day plan in English AND Arabic (provide English first, then Arabic translation of the plan). Include:
1. Immediate actions (Days 1-7): MOHRE portal setup, Tasdeeq registration
2. Short-term (Days 8-30): Job posting strategy, Nafis subsidy application, candidate sourcing from UAE National talent platforms
3. Medium-term (Days 31-90): Interview process, Nafis verification, MOHRE headcount update
4. Compliance checklist for next Tasdeeq audit
5. Key contacts and portals (MOHRE, Nafis, Tasdeeq)

Be specific, practical, and concise. Use bullet points. Include actual portal names and steps.`;

  const stream = await client.messages.stream({
    model: 'claude-sonnet-4-6',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const readableStream = new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === 'content_block_delta' &&
          chunk.delta.type === 'text_delta'
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });

  return new Response(readableStream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
    },
  });
}
