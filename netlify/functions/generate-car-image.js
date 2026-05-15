// ── netlify/functions/generate-car-image.js ───────────────────────────────────
// Netlify serverless function — replaces the Express POST /api/generate-car-image
// endpoint when the project is deployed to Netlify.
//
// Behaviour is identical to the Express version in server.js:
//   1. Receives car details (brand, model, type, year, fuel) from admin.html
//   2. Calls OpenAI DALL-E 3 to generate a professional automotive photo
//   3. Compresses the 1024×1024 PNG to a 900×600 JPEG using sharp
//   4. Returns the image as a base64 data URL for storage in Firestore
//
// Environment variable required:
//   OPENAI_API_KEY — set in Netlify Site Settings → Environment Variables

const sharp = require('sharp');

exports.handler = async (event) => {
  // Only accept POST requests
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let brand, model, type, year, fuel;
  try {
    ({ brand, model, type, year, fuel } = JSON.parse(event.body || '{}'));
  } catch {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON body' }) };
  }

  if (!brand || !model) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Brand and model are required.' }) };
  }

  const prompt =
    `Professional automotive photography of a ${year || ''} ${brand} ${model}, ` +
    `${type || 'car'}, ${fuel || ''} engine. ` +
    `Luxury car rental studio shot, three-quarter front angle, dramatic dark background ` +
    `with subtle gradient, high-end automotive magazine style, ultra-realistic, 8k quality, ` +
    `no text, no watermarks.`;

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model:           'dall-e-3',
        prompt,
        n:               1,
        size:            '1024x1024',
        response_format: 'b64_json'
      })
    });

    const data = await openaiRes.json();

    if (!openaiRes.ok) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: data.error?.message || 'OpenAI error' })
      };
    }

    const rawBuffer = Buffer.from(data.data[0].b64_json, 'base64');

    const compressed = await sharp(rawBuffer)
      .resize(900, 600, { fit: 'cover', position: 'center' })
      .jpeg({ quality: 82 })
      .toBuffer();

    const dataUrl = 'data:image/jpeg;base64,' + compressed.toString('base64');

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageUrl: dataUrl })
    };

  } catch (e) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e.message || 'Server error' })
    };
  }
};
