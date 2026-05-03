export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages, language = 'en' } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
  }

  try {
    const contents = messages.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }]
    }));

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        system_instruction: {
          parts: [{ text: `You are ElectionIQ, a civic education assistant. 
            CRITICAL: You MUST respond strictly in the following language: ${language}.
            Your only job is to help users understand how elections work — including voter registration, campaigning, voting procedures, vote counting, results, and the role of election bodies. 
            Always explain in simple, clear language suitable for a first-time voter. 
            Never discuss specific political parties, candidates, or take any political stance.` }]
        },
        generationConfig: {
          maxOutputTokens: 1024,
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
    
    // Extract text from Gemini response to match the expected format on frontend
    // Standardizing to a simple message object
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response.";
    
    // Return in a format the frontend expects (previously matched Anthropic structure)
    res.status(200).json({
      content: [{ text: aiText }]
    });
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
