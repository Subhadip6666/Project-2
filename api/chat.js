export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { messages } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages are required' });
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
        max_tokens: 1024,
        system: "You are ElectionIQ, a civic education assistant. Your only job is to help users understand how elections work — including voter registration, campaigning, voting procedures, vote counting, results, and the role of election bodies. Always explain in simple, clear language suitable for a first-time voter. If a user asks anything unrelated to elections or civic processes, politely redirect them. Never discuss specific political parties, candidates, or take any political stance.",
        messages: messages
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Anthropic API error:', errorData);
      return res.status(response.status).json({ error: 'Anthropic API error' });
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error calling Anthropic API:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
