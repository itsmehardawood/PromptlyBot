export async function POST(request) {
  try {
    const { prompt } = await request.json();

    // Validate input
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return Response.json(
        { error: 'Prompt is required and cannot be empty' },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      console.error('OPENAI_API_KEY not configured');
      return Response.json(
        { error: 'AI enhancement service not available' },
        { status: 500 }
      );
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content:
              'You are an expert prompt engineer specializing in improving system prompts for business chatbots. Your goal is to make prompts clear, structured, professional, and effective.',
          },
          {
            role: 'user',
            content: `Improve the following system prompt for a business chatbot. Follow these rules:
1. Preserve the original meaning and intent
2. Make it clear, structured, and professional
3. Add guidance for tone (friendly, helpful, professional)
4. Ensure the chatbot does not hallucinate or make up information
5. Add clear instruction for handling unknown or out-of-scope queries (respond safely and honestly)
6. Keep it concise and immediately usable as a system prompt
7. Use clear, direct language

System Prompt to Improve:
"""
${prompt}
"""

Return ONLY the improved prompt, without any explanation or markdown formatting.`,
          },
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      return Response.json(
        {
          error:
            errorData.error?.message || 'Failed to optimize prompt with OpenAI',
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    const improvedPrompt =
      data.choices?.[0]?.message?.content?.trim() ||
      'Failed to generate improved prompt';

    return Response.json({ improvedPrompt });
  } catch (error) {
    console.error('Optimize prompt error:', error);
    return Response.json(
      { error: 'Failed to process prompt optimization request' },
      { status: 500 }
    );
  }
}
