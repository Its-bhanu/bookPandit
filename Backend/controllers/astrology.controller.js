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

    const prompt = `
आप एक अनुभवी ज्योतिषी हैं और केवल ज्योतिष से संबंधित जानकारी ही प्रदान करते हैं।
नीचे दिए गए उपयोगकर्ता के विवरण के आधार पर उन्हें भविष्यवाणी दें।
उत्तर हमेशा हिंदी में दें, केवल 1–2 तार्किक पंक्तियों में और स्पष्ट रूप से बिंदुवार (•) फ़ॉर्मेट में लिखें।
अगर प्रश्न ज्योतिष से संबंधित नहीं है, तो विनम्रतापूर्वक कहें:
"माफ़ कीजिए, मैं केवल ज्योतिष से संबंधित प्रश्नों का उत्तर देता हूँ।"

उपयोगकर्ता विवरण:
नाम: ${name}
जन्म तिथि: ${dob}
जन्म समय: ${birthTime}
जन्म स्थान: ${birthPlace}
प्रश्न: ${question}

कृपया उत्तर संक्षिप्त, तार्किक और उपयोगी रखें।
    `;

    const response = await client.chat.completions.create({
      model: "sonar-pro", // Faster model for <10s responses
      messages: [{ role: "user", content: prompt }],
      temperature: 0.5, // lower temp for more logical answers
      max_tokens: 150,  // short response for 1–2 lines
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
