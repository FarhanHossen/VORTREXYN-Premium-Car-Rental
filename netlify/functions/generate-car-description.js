// ── netlify/functions/generate-car-description.js ─────────────────────────────
// Netlify serverless function — replaces the Express POST /api/generate-car-description
// endpoint when the project is deployed to Netlify.
//
// Behaviour is identical to the Express version in server.js:
//   1. Receives car details from admin.html
//   2. Calls OpenAI GPT-4o-mini to write a short premium marketing description
//   3. Returns the description as plain text
//
// Environment variable required:
//   OPENAI_API_KEY — set in Netlify Site Settings → Environment Variables

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let brand, model, type, year, fuel, mileage, price;
  try {
    ({ brand, model, type, year, fuel, mileage, price } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!brand || !model) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Brand and model are required.' }) };
  }

  const userPrompt =
    `Write a short, premium car rental description (3–4 sentences) for a ` +
    `${year || ''} ${brand} ${model} ${type || ''} with ${fuel || ''} engine` +
    `${mileage ? ', ' + mileage + ' on the odometer' : ''}` +
    `${price ? ', priced at AUD $' + price + ' per day' : ''}. ` +
    `Tone: luxury, confident, enticing. No bullet points. Plain text only.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:       'gpt-4o-mini',
        messages: [
          {
            role:    'system',
            content: 'You are a luxury car rental copywriter. Write vivid, concise vehicle descriptions.'
          },
          { role: 'user', content: userPrompt }
        ],
        max_tokens:  150,
        temperature: 0.8
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error?.message || 'OpenAI error' })
      };
    }

    const description = data.choices[0].message.content.trim();

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ description })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Server error' })
    };
  }
};
