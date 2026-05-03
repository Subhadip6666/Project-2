export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { language = 'en' } = req.body;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `Generate exactly 5 multiple choice questions to test a user's understanding of the election process. 
            CRITICAL: Everything (questions and options) MUST be in the following language: ${language}.
            Base them on these topics: voter registration, candidate nomination, campaigning, voting day, vote counting, results declaration, and inauguration. 
            Each question must have 4 options labeled A, B, C, D with exactly one correct answer. 
            Return only a JSON array in this format: [{"question": "...", "options": ["A. ...", "B. ...", "C. ...", "D. ..."], "correct": "A"}]` }]
        }],
        generationConfig: {
          maxOutputTokens: 1500,
          temperature: 0.8,
          response_mime_type: "application/json" // Gemini supports JSON mode!
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Gemini API error:', errorData);
      return res.status(response.status).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    
    // Attempt to extract the JSON array from the response text
    const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    try {
      // Gemini JSON mode is very reliable, but let's be safe
      const quizData = JSON.parse(textContent);
      return res.status(200).json(quizData);
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      // Fallback: try to regex it if it's not perfect JSON
      const jsonMatch = textContent.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const quizData = JSON.parse(jsonMatch[0]);
        return res.status(200).json(quizData);
      }
      return res.status(500).json({ error: 'Quiz generation failed. Please try again.' });
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
