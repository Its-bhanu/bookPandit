const { GoogleGenerativeAI } = require("@google/generative-ai");
const Astrology = require("../models/astrology.model");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.generateAstrologyReport = async (req, res) => {
  const { name, birthDate, birthTime, birthPlace } = req.body;

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

   const prompt = `
आप एक अनुभवी वैदिक ज्योतिषाचार्य हैं। कृपया निम्नलिखित जन्म विवरणों के आधार पर एक विस्तृत और सटीक वैदिक ज्योतिष रिपोर्ट हिंदी में प्रदान करें।

🔹 विवरण:
- नाम: ${name}
- जन्म तिथि: ${birthDate}
- जन्म समय: ${birthTime}
- जन्म स्थान: ${birthPlace}

🔹 रिपोर्ट में निम्नलिखित बिंदुओं को शामिल करें:

1. **दोषों का विश्लेषण:**
   - क्या मांगलिक दोष है?
   - क्या कालसर्प दोष उपस्थित है?
   - क्या नाड़ी दोष या पितृ दोष है?
   - इन दोषों के प्रभाव और संभावित परिणाम क्या हो सकते हैं?

2. **योग और कुंडली की विशेषताएँ:**
   - सकारात्मक योग (जैसे गजकेसरी, बुद्धादित्य, लक्ष्मी योग आदि)
   - नकारात्मक योग या कमजोर ग्रह स्थिति
   - ग्रहों की दृष्टियाँ और गोचर का प्रभाव

3. **स्वास्थ्य संबंधी संभावनाएँ:**
   - मानसिक स्वास्थ्य की स्थिति (जैसे चिंता, अवसाद आदि)
   - शारीरिक रोगों की संभावनाएँ (जैसे त्वचा, पाचन, रक्तचाप आदि)
   - कौन से ग्रह या भाव इनसे जुड़े हैं?

4. **जीवन के प्रमुख क्षेत्र:**
   - विवाह और दांपत्य जीवन
   - करियर और आर्थिक स्थिति
   - शिक्षा, यात्रा और संतान in fully details
   - पारिवारिक संबंध और सामाजिक जीवन
5. **भविष्यवाणी और सलाह:**
   - अगले 1-2 वर्षों में क्या महत्वपूर्ण घटनाएँ हो सकती हैं?

5. **उपाय और समाधान:**
   - कौन-कौन से मंत्र जाप करने चाहिए?
   - कौन-से रत्न धारण करना लाभकारी होगा?
   - कौन-से दान और पूजा उपाय किए जाएँ?

💬 कृपया उत्तर पूरी तरह से **हिंदी भाषा** में दें। सरल, स्पष्ट और प्रामाणिक जानकारी प्रदान करें, जिससे व्यक्ति उसे आसानी से समझ और अनुसरण कर सके।

उत्तर को **सूचीबद्ध (bullet points)** और **वर्गीकृत (sections)** रूप में प्रस्तुत करें। बिना किसी अनावश्यक जानकारी के केवल वास्तविक और ज्योतिषीय दृष्टिकोण से उपयोगी सुझाव दें।
`;


    const result = await model.generateContent(prompt);
    const suggestion = result.response.text();

    const saved = await Astrology.create({
      name,
      birthDate,
      birthTime,
      birthPlace,
      suggestion,
    });

    res.status(200).json(saved);
  } catch (err) {
    console.error("Gemini AI Error:", err);
    res.status(500).json({ error: "Failed to generate astrology report." });
  }
};
