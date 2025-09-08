const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.PERPLEXITY_API_KEY,
  baseURL: "https://api.perplexity.ai", // Perplexity endpoint
});

exports.getAstrologyPrediction = async (req, res) => {
  try {
    const { name, dob, birthTime, birthPlace, question } = req.body;

    if (!name || !dob || !birthTime || !birthPlace || !question) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const systemPrompt = `
आप एक अनुभवी ज्योतिषी हैं और केवल ज्योतिष से संबंधित जानकारी ही प्रदान करते हैं।
आपका उत्तर हमेशा सटीक, स्पष्ट और पूरी तरह तार्किक होना चाहिए।
उत्तर हिंदी में दें और अधिकतम 1–2 पंक्तियों में ही लिखें।
अगर प्रश्न ज्योतिष से संबंधित नहीं है, तो विनम्रतापूर्वक कहें:
"माफ़ कीजिए, मैं केवल ज्योतिष से संबंधित प्रश्नों का उत्तर देता हूँ।"
    `;

    const userPrompt = `
उपयोगकर्ता विवरण:
नाम: ${name}
जन्म तिथि: ${dob}
जन्म समय: ${birthTime}
जन्म स्थान: ${birthPlace}
प्रश्न: ${question}
    `;

    const response = await client.chat.completions.create({
      model: "sonar-large", // Fast and stable model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,  // keeps answers logical & consistent
      max_tokens: 200,   // limit for short and exact response
    });

    const predictionText = response.choices[0].message.content;

    res.json({
      prediction: predictionText,
    });
  } catch (err) {
    console.error("Prediction API Error:", err);
    res.status(500).json({ error: "Something went wrong" });
  }
};
