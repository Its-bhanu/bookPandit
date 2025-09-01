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
नीचे दिए गए उपयोगकर्ता के विवरण के आधार पर उन्हें विस्तृत, सटीक और मित्रवत अंदाज़ में भविष्यवाणी करें।  
उत्तर हमेशा हिंदी में दें और बिंदुवार (•) फ़ॉर्मेट में स्पष्ट जानकारी दें।  

अगर प्रश्न ज्योतिष से संबंधित नहीं है, तो विनम्रतापूर्वक कहें:  
"माफ़ कीजिए, मैं केवल ज्योतिष से संबंधित प्रश्नों का उत्तर देता हूँ।"  

उपयोगकर्ता विवरण:  
नाम: ${name}  
जन्म तिथि: ${dob}  
जन्म समय: ${birthTime}  
जन्म स्थान: ${birthPlace}  
प्रश्न: ${question}  

कृपया उत्तर ज्योतिषीय आधार पर दें और यथासंभव विस्तृत व उपयोगी सुझाव शामिल करें।  
अंत में 2–3 पंक्तियों में एक सारांश या सरल सलाह भी दें ताकि उपयोगकर्ता को त्वरित मार्गदर्शन मिल सके।  

    `;

    const response = await client.chat.completions.create({
      model: "sonar-pro", // Perplexity model
      messages: [{ role: "user", content: prompt }],
      temperature: 0.7,
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
