/**
 * AI Brain for YouTube SEO & Growth
 * Powered by Google Gemini API with smart offline fallback heuristics.
 */

export async function callGemini(prompt, systemInstruction = "", apiKey = null) {
  const key = apiKey || process.env.GEMINI_API_KEY;
  
  if (key) {
    try {
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${key}`;
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          }
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text;
      }
    } catch (err) {
      console.warn("Gemini API call failed, using intelligent rule-based engine:", err);
    }
  }

  return null; // Signals fallback to local rule-based engine
}

export async function generateViralTitles(topic, niche = "General", apiKey = null) {
  const systemPrompt = "You are the world's top YouTube Growth and Viral Algorithm Expert (like MrBeast, Colin & Samir, Paddy Galloway). Output valid JSON array of high-CTR title objects.";
  const userPrompt = `Generate 8 high-CTR YouTube titles for the topic: "${topic}" in the "${niche}" niche.
Each title must use a proven psychological formula:
1. Curiosity Gap
2. Extreme / Challenge
3. How-To / Mastery
4. Shocking Contrast
5. The Truth / Secret Exposed
6. Fast Results / Shortcut
7. Listicle / Power Numbers
8. Beginner to Pro

Return ONLY a JSON array with this structure:
[
  {
    "title": "Title text here",
    "formula": "Curiosity Gap",
    "ctrScore": 96,
    "whyItWorks": "Creates irresistible FOMO and intrigue."
  }
]`;

  const aiResult = await callGemini(userPrompt, systemPrompt, apiKey);
  if (aiResult) {
    try {
      const cleaned = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      // JSON parse fallback
    }
  }

  // Smart Offline Fallback Engine
  const cleanTopic = topic.trim();
  return [
    {
      title: `I Tested ${cleanTopic} for 30 Days (Here's The Truth)`,
      formula: "Extreme & Truth",
      ctrScore: 97,
      whyItWorks: "First-person proof + curiosity trigger that keeps viewers hooked."
    },
    {
      title: `Do NOT Use ${cleanTopic} Until You Watch This!`,
      formula: "Urgency / Warning",
      ctrScore: 94,
      whyItWorks: "Loss aversion and fear of making a mistake triggers immediate clicks."
    },
    {
      title: `How to Master ${cleanTopic} in 10 Minutes (Step-by-Step)`,
      formula: "Fast Mastery",
      ctrScore: 91,
      whyItWorks: "Promises quick, effortless results with high perceived value."
    },
    {
      title: `Why 99% of People Fail at ${cleanTopic} (And How to Fix It)`,
      formula: "Shocking Contrast",
      ctrScore: 95,
      whyItWorks: "Creates insecurity and offers the insider solution."
    },
    {
      title: `The Secret ${cleanTopic} Strategy Nobody Is Talking About`,
      formula: "Curiosity Gap",
      ctrScore: 93,
      whyItWorks: "Appeals to the desire for exclusive, hidden advantage."
    },
    {
      title: `${cleanTopic}: Beginner vs PRO (Full Comparison)`,
      formula: "Visual Contrast",
      ctrScore: 89,
      whyItWorks: "Highly satisfying progression format with high search intent."
    },
    {
      title: `7 ${cleanTopic} Mistakes You Need to Stop Making Now`,
      formula: "Power Numbers",
      ctrScore: 92,
      whyItWorks: "Actionable listicle that prompts immediate audit of current habits."
    },
    {
      title: `The Future of ${cleanTopic} Changed Forever...`,
      formula: "Trend / Breaking News",
      ctrScore: 90,
      whyItWorks: "Capitalizes on FOMO regarding industry shifts."
    }
  ];
}

export async function generateSeoPackage(topic, summary = "", apiKey = null) {
  const systemPrompt = "You are a professional YouTube SEO specialist. Produce a complete YouTube SEO metadata bundle.";
  const userPrompt = `Topic: "${topic}"\nContext: "${summary}"\n
Generate a complete YouTube SEO package including:
1. Optimized Description (with hooks, keywords, timestamps placeholders, and links placeholder)
2. 15 High-Volume Video Tags (comma separated)
3. 3 Strategic Hashtags
4. 3 Detailed Midjourney / AI Thumbnail Prompts for high CTR

Return JSON only:
{
  "description": "Full description text...",
  "tags": ["tag1", "tag2", "tag3"],
  "hashtags": ["#tag1", "#tag2", "#tag3"],
  "thumbnailPrompts": [
    { "style": "Cinematic 3D", "prompt": "...", "textOverlay": "DON'T DO THIS!" },
    { "style": "Clean Split Comparison", "prompt": "...", "textOverlay": "$0 vs $10,000" },
    { "style": "Expressive Close-Up", "prompt": "...", "textOverlay": "IT'S OVER!" }
  ]
}`;

  const aiResult = await callGemini(userPrompt, systemPrompt, apiKey);
  if (aiResult) {
    try {
      const cleaned = aiResult.replace(/```json/g, '').replace(/```/g, '').trim();
      return JSON.parse(cleaned);
    } catch (e) {
      // Fallback
    }
  }

  // High-Quality Rule-Based Fallback
  const t = topic.trim();
  return {
    description: `Everything you need to know about ${t} in 2026! In this video, we break down the most effective strategies, common pitfalls, and step-by-step techniques to get results fast.\n\n🔔 Subscribe for weekly tutorials and breakdowns!\n\n⏳ TIMESTAMPS:\n0:00 - The Biggest Mistake with ${t}\n01:45 - Core Fundamentals You Must Know\n04:12 - Step-by-Step Practical Walkthrough\n08:30 - Advanced Pro Tips & Hidden Features\n11:20 - Final Verdict & Key Takeaways\n\n📌 KEY RESOURCES & LINKS:\n- Official Guide & Assets: [Link Here]\n- Join our Community: [Link Here]\n\n#${t.replace(/\s+/g, '')} #Tutorial #YouTubeGrowth`,
    tags: [
      t,
      `${t} tutorial`,
      `how to ${t}`,
      `${t} 2026`,
      `best ${t}`,
      `${t} for beginners`,
      `${t} guide`,
      `${t} tips`,
      `${t} review`,
      `${t} explained`,
      `${t} step by step`,
      `${t} workflow`,
      `learn ${t}`,
      `${t} comparison`,
      `${t} results`
    ],
    hashtags: [`#${t.replace(/\s+/g, '')}`, `#${t.split(' ')[0]}Tutorial`, `#YouTubeGrowth`],
    thumbnailPrompts: [
      {
        style: "Ultra-High Contrast & Bold Reaction",
        prompt: `Hyper-realistic YouTube thumbnail, close-up facial expression of shock, holding a glowing futuristic device representing ${t}, dramatic lighting, 8k resolution, vibrant crimson and electric blue rim lights --ar 16:9`,
        textOverlay: "THE TRUTH!"
      },
      {
        style: "Split-Screen Before vs After",
        prompt: `Split screen YouTube thumbnail layout, left side dark and messy with big red X mark, right side glowing golden aesthetic with huge green checkmark representing ${t} success, cinematic depth of field --ar 16:9`,
        textOverlay: "10X BETTER"
      },
      {
        style: "Minimalist High-Impact Tech",
        prompt: `Sleek minimalist 3D rendering of ${t} interface floating in dark glassmorphism studio, glowing neon accents, depth blur background, clean studio aesthetic --ar 16:9`,
        textOverlay: "NEW SECRET!"
      }
    ]
  };
}

export async function generateViralHooks(topic, apiKey = null) {
  return [
    {
      type: "The Direct Value Promise",
      verbalHook: `"If you're still doing ${topic} the old way, you're wasting 80% of your time. In the next 5 minutes, I'm going to show you the exact system that changed everything..."`,
      visualHook: "Fast-paced jump cut showing the dramatic final result before rewinding back to step 1."
    },
    {
      type: "The Polarizing Question",
      verbalHook: `"Is ${topic} actually dead? Everyone is talking about this new change, but almost nobody realizes what it really means for you..."`,
      visualHook: "Screen recording of viral headlines or graphs plunging downwards, followed by bold red text on screen."
    },
    {
      type: "The Proof / High-Stakes Challenge",
      verbalHook: `"I spent the last 30 days testing every single method for ${topic} so you don't have to. Here are the 3 things that actually worked..."`,
      visualHook: "High-energy montage of testing sessions, countdown timer in the corner, and real analytics snapshots."
    }
  ];
}
