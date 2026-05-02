export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
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
        max_tokens: 1500,
        messages: [
          {
            role: 'user',
            content: "Generate exactly 5 multiple choice questions to test a user's understanding of the election process. Base them on these topics: voter registration, candidate nomination, campaigning, voting day, vote counting, results declaration, and inauguration. Each question must have 4 options labeled A, B, C, D with exactly one correct answer. Return only a JSON array in this format: [{\"question\": \"...\", \"options\": [\"A. ...\", \"B. ...\", \"C. ...\", \"D. ...\"], \"correct\": \"A\"}]"
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
    
    // Attempt to extract the JSON array from the response text
    const textContent = data.content[0].text;
    const jsonMatch = textContent.match(/\[[\s\S]*\]/);
    
    if (jsonMatch) {
      try {
        const quizData = JSON.parse(jsonMatch[0]);
        return res.status(200).json(quizData);
      } catch (parseError) {
        console.error('JSON parse error:', parseError);
        return res.status(500).json({ error: 'Quiz generation failed. Please try again.' });
      }
    } else {
      return res.status(500).json({ error: 'Failed to extract JSON from response.' });
    }
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
