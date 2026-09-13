import { NextRequest, NextResponse } from "next/server";

// Fallback intelligent responses for agricultural queries when no external LLM key is configured
const FALLBACK_KNOWLEDGE = [
  {
    keywords: ["tomato", "tamatar", "tomatoes"],
    reply:
      "🍅 **Tomato Market Update (Andhra Pradesh):**\n- **Vijayawada Market Yard:** ₹27/kg (Modal), High buyer demand\n- **Guntur Market Yard:** ₹24/kg\n- **Tenali Mandi:** ₹22/kg\n\n💡 **Recommendation:** Vijayawada offers highest net realization today (approx. ₹25,000 net per 1,000 kg after transport). Best sell window: **Next 24–48 hours** as arrivals are projected to rise next week.",
  },
  {
    keywords: ["chilli", "mirchi", "chili"],
    reply:
      "🌶️ **Chilli Market Intelligence (Guntur Asia's Largest Yard):**\n- **Teja Super Variety:** ₹120–150/kg (Modal ₹120/kg)\n- **Vijayawada:** ₹125/kg\n- **Buyer Demand:** +14% high inflow\n\n💡 **Tip:** Maintain moisture below 10% to secure Grade A premium pricing. Certified buyers like ITC Agri and Spices India are placing active lots.",
  },
  {
    keywords: ["cotton", "patti"],
    reply:
      "🌾 **Cotton (Kapas) Price Watch:**\n- **Narasaraopet Yard:** ₹60–68/kg (Modal ₹60/kg)\n- **Vijayawada:** ₹65/kg\n- **Trend:** Steady (+4% week-on-week)\n\n💡 **Advisory:** Ginning mills in Palnadu & Krishna districts are offering direct farm-gate pickup for lots above 2,000 kg, saving you ~₹1,800 in freight.",
  },
  {
    keywords: ["onion", "pyaz", "ullipayalu"],
    reply:
      "🧅 **Onion Market Summary:**\n- **Tenali Mandi:** ₹35/kg (Red Quality)\n- **Vijayawada:** ₹38/kg\n- **Demand:** Quick daily turnover\n\n💡 **Advice:** If you have well-cured red onions, selling within 2–3 days yields top rates before Nashik fresh arrivals enter southern mandis.",
  },
  {
    keywords: ["sell", "when to sell", "sell window", "hold", "wait"],
    reply:
      "⏱️ **Smart Sell-Window Engine:**\nOur market intelligence weighs 5 key factors:\n1. Price Momentum (40%)\n2. Buyer Inflow (25%)\n3. Distance & Transport (15%)\n4. Quality Grade (10%)\n5. Buyer Reliability (10%)\n\n👉 Head to **Smart Recommendation** in your sidebar for an exact net-realization calculation for your specific lot size and farm location!",
  },
  {
    keywords: ["grade", "quality", "grade a", "moisture"],
    reply:
      "⭐ **Quality Grading Guide:**\n- **Grade A (Premium):** Uniform size, zero pest damage, optimal color. Typically commands **₹3–₹6/kg premium** over modal price.\n- **Grade B (Standard):** Minor cosmetic blemishes, normal market grade.\n- **Grade C (Economy):** Mixed sizes, best suited for local processing units.\n\n📸 *Tip:* Upload clear photos when creating your lot to attract verified buyers faster!",
  },
  {
    keywords: ["buyer", "payment", "escrow", "verified"],
    reply:
      "🛡️ **Verified Buyer Protection:**\nAll buyers on KisanMitra with the **Verified** badge undergo trade license & GST verification. Offers received via KisanMitra include guaranteed digital payment timelines and dispute resolution support.",
  },
];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message: string = (body.message || "").trim();
    const history = body.history || [];

    if (!message) {
      return NextResponse.json(
        { error: "Message content cannot be empty" },
        { status: 400 }
      );
    }

    // 1. Check for OpenAI API Key
    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const res = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: process.env.OPENAI_MODEL || "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content:
                  "You are KisanMitra Assistant, a trusted agricultural advisor for farmers in Andhra Pradesh, India. Provide concise, friendly, and highly practical advice on APMC mandi prices, selling windows, quality grading (Grade A/B/C), transport costs, and buyer negotiations. Keep responses clear and formatted with bullet points.",
              },
              ...history.slice(-6),
              { role: "user", content: message },
            ],
            temperature: 0.7,
            max_tokens: 500,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.choices?.[0]?.message?.content;
          if (reply) {
            return NextResponse.json({
              reply,
              source: "openai",
              model: data.model,
            });
          }
        }
      } catch (err) {
        console.warn("OpenAI API call failed, falling back to local engine:", err);
      }
    }

    // 2. Check for Anthropic API Key
    const anthropicKey = process.env.ANTHROPIC_API_KEY;
    if (anthropicKey) {
      try {
        const res = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": anthropicKey,
            "anthropic-version": "2023-06-01",
          },
          body: JSON.stringify({
            model: "claude-3-haiku-20240307",
            system:
              "You are KisanMitra Assistant, a trusted agricultural advisor for farmers in Andhra Pradesh, India. Help with crop prices, mandi comparisons, and harvest timing.",
            messages: [{ role: "user", content: message }],
            max_tokens: 500,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const reply = data.content?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              source: "anthropic",
            });
          }
        }
      } catch (err) {
        console.warn("Anthropic API call failed, falling back to local engine:", err);
      }
    }

    // 3. Check for Gemini API Key
    const geminiKey = process.env.GEMINI_API_KEY;
    if (geminiKey) {
      try {
        const res = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    {
                      text: `You are KisanMitra Assistant for Indian farmers. Answer this question concisely:\n${message}`,
                    },
                  ],
                },
              ],
            }),
          }
        );

        if (res.ok) {
          const data = await res.json();
          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            return NextResponse.json({
              reply,
              source: "gemini",
            });
          }
        }
      } catch (err) {
        console.warn("Gemini API call failed, falling back to local engine:", err);
      }
    }

    // 4. Fallback Knowledge Engine (Fast, offline, domain-specific)
    const lower = message.toLowerCase();
    const match = FALLBACK_KNOWLEDGE.find((item) =>
      item.keywords.some((k) => lower.includes(k))
    );

    if (match) {
      return NextResponse.json({
        reply: match.reply,
        source: "mock-engine",
      });
    }

    // Default general response
    return NextResponse.json({
      reply: `🌾 **Namaste! I am your KisanMitra Assistant.**\n\nI can help you with:\n• **Live Mandi Rates:** Ask about Tomato, Chilli, Cotton, Rice, or Onion rates\n• **Best Selling Market:** Compare Vijayawada, Guntur, and Tenali yards\n• **Net Realization:** Factoring transport costs to maximize your profit\n• **Quality Grading:** Tips to fetch Grade A premium prices\n\n*What crop or market question can I assist you with today?*`,
      source: "mock-engine",
      hint: "To enable live AI model inference, set OPENAI_API_KEY, ANTHROPIC_API_KEY, or GEMINI_API_KEY in your environment variables.",
    });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Internal server error while generating response" },
      { status: 500 }
    );
  }
}
