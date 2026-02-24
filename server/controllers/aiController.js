const axios = require("axios");

exports.generateLesson = async (req, res) => {
  const { skill, level } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;
  if (!skill) {
    res.status(400).json({ message: "skill is required" });
    return;
  }
  if (!apiKey) {
    res.status(500).json({ message: "OPENAI_API_KEY not configured" });
    return;
  }
  try {
    const prompt = `Create a concise ${level || "beginner"} learning guide for "${skill}". Use short sections: Overview, Key Concepts, Quick Steps, Practice Exercise, and Resources. Keep it under 350 words.`;
    const isOpenRouter = apiKey.startsWith("sk-or-");
    const endpoint = isOpenRouter
      ? "https://openrouter.ai/api/v1/chat/completions"
      : "https://api.openai.com/v1/chat/completions";
    const model = isOpenRouter
      ? process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
      : process.env.OPENAI_MODEL || "gpt-4o-mini";
    const response = await axios.post(
      endpoint,
      {
        model,
        messages: [
          { role: "system", content: "You are a helpful tutor." },
          { role: "user", content: prompt }
        ],
        temperature: 0.7
      },
      {
        headers: Object.assign(
          {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json"
          },
          isOpenRouter
            ? {
                "HTTP-Referer": process.env.APP_URL || "http://localhost:5173",
                "X-Title": process.env.APP_NAME || "SkillSwap"
              }
            : {}
        )
      }
    );
    const content =
      response.data?.choices?.[0]?.message?.content || null;
    if (!content) {
      throw new Error("No content");
    }
    res.json({ lesson: content });
  } catch (error) {
    const status = error.response?.status || 500;
    const data = error.response?.data;
    const msg =
      (typeof data === "string" ? data : data?.error?.message) ||
      error.message ||
      "AI error";
    res.status(status).json({ message: msg });
  }
};
