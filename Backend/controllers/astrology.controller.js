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
Aap ek experienced Jyotishi ho aur sirf astrology se related info hi dete ho.  
Niche diye gaye user details ke basis par unhe prediction do.  
Answer hamesha Hinglish mein ho, sirf 1–2 logical lines mein aur clear bullet points (•) format mein likho.  
Agar question astrology se related nahi hai, toh politely bolo:  
"Sorry, main sirf astrology related questions ka answer deta hoon."

User Details:  
Naam: ${name}  
Janm Tithi: ${dob}  
Janm Samay: ${birthTime}  
Janm Sthaan: ${birthPlace}  
Prashn: ${question}  

Kripya answer short, logical aur useful rakho.  
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
