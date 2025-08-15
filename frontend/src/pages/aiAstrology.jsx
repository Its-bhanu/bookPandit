import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AstroChat() {
  const [step, setStep] = useState(0); // 0: Name, 1: DOB, 2: Time, 3: Place, 4: Chat
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [birthPlace, setBirthPlace] = useState("");
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60); // 6:30 = 390 seconds

  const chatEndRef = useRef(null);
 const navigate = useNavigate();

  useEffect(() => {
    // Start timer when chat begins
    if (step === 4 && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
    if(step === 4 && timeLeft === 0){
    alert("⏳ आपका चैट समय समाप्त हो गया है।");
    navigate('/feedback')
  }
  }, [step, timeLeft , navigate]);

  

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const handleNextStep = () => {
    if (step === 0 && !name.trim()) return alert("Please enter your name.");
    if (step === 1 && !dob) return alert("Please select your date of birth.");
    if (step === 2 && !birthTime) return alert("Please enter your birth time.");
    if (step === 3 && !birthPlace.trim()) return alert("Please enter your birth place.");

    setStep(step + 1);

    if (step === 0)
      setMessages((prev) => [...prev, { sender: "ai", text: "Great! Please share your Date of Birth." }]);
    if (step === 1)
      setMessages((prev) => [...prev, { sender: "ai", text: "Now, please tell me your Birth Time." }]);
    if (step === 2)
      setMessages((prev) => [...prev, { sender: "ai", text: "Lastly, where were you born?" }]);
    if (step === 3) {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "Perfect! Now ask me any astrology question." }
      ]);
    }
  };

  const sendMessage = async () => {
    if (!question.trim()) return;
    setMessages((prev) => [...prev, { sender: "user", text: question }]);
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:4000/api/predict", {
        name,
        dob,
        birthTime,
        birthPlace,
        question,
      });

      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: res.data.prediction }
      ]);
    } catch (err) {
      console.error(err);
      alert("Error getting prediction");
    }

    setLoading(false);
    setQuestion("");
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-purple-200 to-blue-200 p-4">
      {/* Timer */}
      {step === 4 && (
        <div className="text-center font-bold text-lg mb-2 bg-white py-2 rounded shadow">
          ⏳ Chat Time Left: {formatTime(timeLeft)}
        </div>
      )}

      <h1 className="text-3xl font-bold text-center mb-4 text-purple-800">
        🔮 AI Astrology Chat
      </h1>

      {/* Chat Box */}
      <div className="flex-1 overflow-y-auto bg-white shadow p-4 rounded-lg">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`p-3 my-2 max-w-[75%] rounded-lg ${
              msg.sender === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-green-100 text-black mr-auto"
            }`}
          >
            {msg.text.split("\n").map((line, idx) => (
              <div key={idx}>{line}</div>
            ))}
          </div>
        ))}
        {loading && (
          <div className="bg-gray-200 p-3 rounded-lg w-fit text-sm animate-pulse">
            AI is typing...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Step-based Inputs */}
      <div className="mt-4">
        {step < 4 ? (
          <>
            {step === 0 && (
              <input
                type="text"
                placeholder="Enter Name"
                className="border p-2 w-full rounded"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            )}
            {step === 1 && (
              <input
                type="date"
                className="border p-2 w-full rounded"
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            )}
            {step === 2 && (
              <input
                type="time"
                className="border p-2 w-full rounded"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
              />
            )}
            {step === 3 && (
              <input
                type="text"
                placeholder="Enter Birth Place"
                className="border p-2 w-full rounded"
                value={birthPlace}
                onChange={(e) => setBirthPlace(e.target.value)}
              />
            )}
            <button
              onClick={handleNextStep}
              className="bg-purple-600 text-white px-4 py-2 rounded mt-2 w-full"
            >
              Next
            </button>
          </>
        ) : (
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask your question..."
              className="border p-2 flex-1 rounded"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
            <button
              onClick={sendMessage}
              className="bg-blue-600 text-white px-4 py-2 rounded"
            >
              Send
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
