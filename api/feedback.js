export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { score } = req.body;

  if (score === undefined) {
    return res.status(400).json({ error: 'Score is required' });
  }

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `The user just took a 5-question quiz on the election process and scored ${score} out of 5. Generate a 2-3 sentence personalized feedback message. Be encouraging but indicate what they might need to review if the score is low.` }]
        }],
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    const feedbackText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Great job taking the quiz!";
    
    res.status(200).json({ feedback: feedbackText });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
