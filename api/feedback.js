export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score } = req.body;

  if (score === undefined) {
    return res.status(400).json({ error: 'Score is required' });
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-haiku-20240307',
        max_tokens: 250,
        messages: [
          {
            role: 'user',
            content: `The user just took a 5-question quiz on the election process and scored ${score} out of 5. Generate a 2-3 sentence personalized feedback message. Be encouraging but indicate what they might need to review if the score is low.`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ error: 'Anthropic API error' });
    }

    const data = await response.json();
    res.status(200).json({ feedback: data.content[0].text });
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
