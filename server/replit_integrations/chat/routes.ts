import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const TRUENORTH_SYSTEM_PROMPT = `You are Mercedes, the friendly AI assistant for TrueNorthUGC - Canada's premier UGC (User-Generated Content) creator marketplace. You help connect talented Canadian creators with brands looking for authentic content.

## About TrueNorthUGC
TrueNorthUGC is a platform that connects UGC content creators with brands for collaboration opportunities. We're proudly Canadian and focus on authentic, high-quality content creation.

## Key Features You Can Help With:

### For Creators:
- **Creating a Profile**: Go to Dashboard after signing in to set up your creator profile with bio, niches, portfolio videos, and social links
- **Getting Discovered**: Add relevant niches (Beauty, Fashion, Lifestyle, Travel, Food, Tech, etc.), your location, and experience level to help brands find you
- **Portfolio**: Upload your best work to showcase your content style
- **Getting Paid**: Brands pay through PayPal. You receive 80% of payments (20% platform fee)
- **Experience Levels**: Beginner, Intermediate, Pro, Elite - be honest about your level

### For Brands:
- **Subscription Tiers**:
  - Starter ($199): Basic campaign placement, select creator pool, email support
  - Growth ($300): Priority placement, enhanced analytics, expanded creator access
  - Premium ($500): Featured placement, full creator network, dedicated account manager, co-branded campaigns
- **Creating Campaigns**: Launch campaigns with details like budget, requirements, platforms, content style, and deadlines
- **Finding Creators**: Browse the Directory, filter by niche, location, and experience level

### Getting Started:
1. Sign in with your account (uses secure Replit authentication)
2. Choose whether you're a Creator or Brand in the Dashboard
3. Fill out your profile completely - more details = more visibility
4. Creators: Add portfolio work and wait for brand inquiries
5. Brands: Subscribe to a tier and start posting campaigns

### Platform Features:
- **Messaging**: Direct communication between creators and brands
- **Reviews**: Rate and review after collaborations
- **Notifications**: Get notified of new messages and opportunities
- **Canadian Focus**: We specialize in the Canadian market with creators across all provinces

### Contact Information:
- Email: TrueNorthUGCcanada@gmail.com
- Phone: 1-226-220-1522
- Contact Page: /contact

## Your Personality:
- Be warm, helpful, and encouraging
- Use Canadian-friendly language (occasional "eh" is fine!)
- Keep responses concise but thorough
- If you don't know something specific, direct them to contact support
- Celebrate creators' successes and be supportive of their journey
- Be professional when discussing payments and business matters

Remember: You represent TrueNorthUGC's commitment to authentic Canadian content creation!`;

// ─── Smart Local Fallback ───
// When the Replit AI proxy is unavailable, Mercedes responds using keyword-matched
// knowledge base responses that stream identically to the real OpenAI stream.

function getFallbackResponse(content: string): string {
  const lower = content.toLowerCase();

  if (lower.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
    return "Hey there! I'm Mercedes, your TrueNorthUGC assistant. How can I help you today? Whether you're a creator looking to grow or a brand ready to launch campaigns, I've got you covered, eh!";
  }
  if (lower.match(/\b(pricing|cost|price|plan|subscription|tier|how much)\b/)) {
    return "TrueNorthUGC has three brand subscription tiers:\n\n- **Starter ($199)** — Basic campaign placement, select creator pool, email support\n- **Growth ($300)** — Priority placement, enhanced analytics, expanded creator access\n- **Premium ($500)** — Featured placement, full creator network, dedicated account manager, co-branded campaigns\n\nFor creators, joining is free! You keep 80% of every payment (20% platform fee).";
  }
  if (lower.match(/\b(get started|start|begin|new here|first time|sign up|register)\b/)) {
    return "Welcome! Here's how to get started:\n\n1. **Sign in** using the secure Replit authentication\n2. **Choose your role** — Creator or Brand — in your Dashboard\n3. **Complete your profile** — the more details, the more visibility you get\n4. **Creators**: Add portfolio work and niches so brands can find you\n5. **Brands**: Pick a subscription tier and start posting campaigns\n\nNeed help with a specific step? Just ask!";
  }
  if (lower.match(/\b(creator|how do i create|profile setup|become a creator|creator profile)\b/)) {
    return "Great choice! Here's how to shine as a creator:\n\n- **Fill your profile** with a bio, profile photo, location, languages, and experience level\n- **Pick niches** like Beauty, Fashion, Lifestyle, Travel, Food, Tech — these help brands find you\n- **Add portfolio videos** to showcase your style and quality\n- **Set your rate card** (CPM, post rates, story rates, video rates) so brands know your pricing\n- **Link social accounts** (TikTok, Instagram, YouTube, etc.) to build credibility\n\nThe more complete your profile, the more likely brands will reach out!";
  }
  if (lower.match(/\b(brand|how do i post|launch campaign|find creator|hire creator|post campaign)\b/)) {
    return "Ready to find amazing Canadian creators? Here's what to do:\n\n1. **Subscribe to a tier** — Starter ($199), Growth ($300), or Premium ($500)\n2. **Create a campaign** from your Dashboard with all the details: budget, content requirements, target platforms, deadlines\n3. **Browse the Directory** to discover creators by niche, location, and experience level\n4. **Message creators** directly to discuss collaboration details\n5. **Pay through PayPal** — secure, with built-in transaction tracking\n\nHigher tiers get more visibility and better analytics for your campaigns.";
  }
  if (lower.match(/\b(payment|pay|money|fee|commission|paypal|earn|income|how much do i get|80%|platform fee)\b/)) {
    return "Here's how payments work at TrueNorthUGC:\n\n- **Creators receive 80%** of every payment — the platform takes a 20% fee to keep things running\n- **All transactions go through PayPal** for security and ease\n- **Milestone bonuses** reward creators for campaign volume:\n  - Rising Star (3-9 campaigns): $100 bonus\n  - Creator Pro (10-19): $200 bonus\n  - Top Performer (20-34): $350 bonus\n  - Elite Creator (35+): $500 bonus\n\nBrands pay the full campaign amount upfront via PayPal, and creators are paid their 80% share. The Earnings tab in your Dashboard tracks everything!";
  }
  if (lower.match(/\b(rate card|rate|pricing my work|cpm|post rate|story rate|video rate|how much should i charge)\b/)) {
    return "Your rate card helps brands understand your pricing at a glance. You can set:\n\n- **CPM Rate** — Cost per thousand views/impressions\n- **Static Post Rate** — Price for a single image post\n- **Story/Short Rate** — Price for Instagram Stories or short-form content\n- **Video Rate** — Price for longer video content\n- **Minimum Budget** — The smallest campaign you'll accept\n- **Currency & Notes** — CAD/USD and any special conditions\n\nTo set yours, go to **Dashboard → Edit Creator Profile → Rate Card**. Don't undervalue yourself — be honest about your experience and quality!";
  }
  if (lower.match(/\b(campaign deal|campaign|contest deal|contest|cpm deal|cpm|deal type|deal types)\b/)) {
    return "TrueNorthUGC supports three deal types:\n\n- **Campaign Deals** — Standard brand collaborations. Brands post requirements and creators apply or are invited.\n- **Contest Deals** — Brands run contests with prize pools. Creators submit entries for a chance to win. You can set prize value, number of winners, and contest rules.\n- **CPM Deals** — Performance-based partnerships where creators earn based on guaranteed views/impressions at a set CPM rate.\n\nBrands choose the deal type when creating a campaign from their Dashboard. Each type has its own workflow suited to different goals!";
  }
  if (lower.match(/\b(contact|email|phone|support|help|reach out|talk to someone)\b/)) {
    return "You can reach the TrueNorthUGC team anytime:\n\n- **Email**: TrueNorthUGCcanada@gmail.com\n- **Phone**: 1-226-220-1522\n- **Contact Page**: /contact (there's a form there too)\n\nWe typically respond within 24 hours. For urgent issues, calling is your best bet, eh!";
  }
  if (lower.match(/\b(messaging|message|inbox|chat|dm|communicate|talk to)\b/)) {
    return "The messaging system lets creators and brands chat directly:\n\n- Go to **Dashboard → Messages** to see your inbox and sent messages\n- You can compose new messages to any creator or brand\n- Real-time notifications let you know when you have new messages\n- All conversations are tracked for transparency\n\nIt's the best way to negotiate terms, share briefs, and build relationships before committing to a campaign.";
  }
  if (lower.match(/\b(review|rating|feedback|testimonial|collaboration review)\b/)) {
    return "After a campaign wraps up, both creators and brands can leave reviews:\n\n- **Star ratings** and written feedback help build trust on the platform\n- Reviews appear on public profiles, so great work gets recognized\n- Honest reviews help others make better collaboration choices\n\nGood reviews can lead to more opportunities — so always deliver your best work and communicate clearly!";
  }
  if (lower.match(/\b(niche|category|topic|beauty|fashion|lifestyle|travel|food|tech|fitness)\b/)) {
    return "Niches help match the right creators with the right brands. Available niches include:\n\n- Beauty, Fashion, Lifestyle, Travel, Food, Tech\n- Fitness, Gaming, Parenting, Finance, Health\n- Home & Garden, Sports, Automotive, Education\n- And more!\n\nCreators can select multiple niches on their profile. Brands can filter the Directory by niche to find creators who truly fit their brand identity. The more specific your niche selection, the better your matches!";
  }
  if (lower.match(/\b(directory|find creator|browse|search|filter|discover|creator list)\b/)) {
    return "The Creator Directory at /directory is where brands discover talent:\n\n- **Search** by name or keyword\n- **Filter by niche** — find creators in your industry\n- **Filter by location** — Canadian provinces and cities\n- **Filter by experience** — Beginner, Intermediate, Pro, Elite\n- **View full profiles** with portfolios, social links, rate cards, and reviews\n\nCreators: a complete profile with portfolio videos and social links makes you much more discoverable!";
  }
  if (lower.match(/\b(ugc|user generated content|what is ugc|content creator|influencer)\b/)) {
    return "UGC stands for **User-Generated Content** — authentic content created by real people (not the brand itself) that brands can use in their marketing.\n\nUnlike traditional influencer marketing, UGC creators often aren't required to post on their own channels. Instead, they create content that the brand owns and uses in ads, websites, social media, and more.\n\nAt TrueNorthUGC, we connect Canadian creators with brands who need that authentic, relatable content. It's a win-win: creators get paid for their skills, and brands get genuine content that resonates with audiences!";
  }
  if (lower.match(/\b(earnings|dashboard|transaction|history|spent|paid out|milestone)\b/)) {
    return "The Earnings tab in your Dashboard shows all your financial activity:\n\n**For Creators:**\n- Total earnings to date\n- Current milestone tier and progress\n- Transaction history with amounts, fees, and status\n\n**For Brands:**\n- Total amount spent on campaigns\n- Platform fees paid\n- Number of creators paid\n- Full payment history\n\nEverything is tracked automatically when payments go through PayPal!";
  }
  if (lower.match(/\b(who are you|your name|what is your name|mercedes|aurora|ai assistant)\b/)) {
    return "I'm **Mercedes**, the friendly AI assistant for TrueNorthUGC! I'm here to help Canadian creators and brands make the most of the platform. Whether you need help setting up your profile, understanding pricing, launching campaigns, or anything else — just ask, eh!";
  }
  if (lower.match(/\b(thank|thanks|appreciate|grateful|cheers)\b/)) {
    return "You're so welcome! I'm always here to help. Keep creating awesome content, and don't hesitate to reach out if you need anything else. Go Canada!";
  }
  if (lower.match(/\b(bye|goodbye|see you|later|cya|farewell)\b/)) {
    return "Take care! Good luck with your TrueNorthUGC journey — whether you're creating or collaborating. Catch you later, eh!";
  }

  return "That's a great question! I want to make sure I give you the best answer. Could you share a bit more detail about what you're looking for?\n\nIn the meantime, here are some quick ways to get help:\n- Visit your **Dashboard** for role-specific tools and settings\n- Check the **Directory** to discover creators or browse campaigns\n- Use the **Contact page** (/contact) to reach our team directly\n- Email us at **TrueNorthUGCcanada@gmail.com**\n\nWhat would you like to explore?";
}

async function streamFallbackResponse(
  res: Response,
  content: string,
  saveFn: (text: string) => Promise<unknown>
): Promise<void> {
  const response = getFallbackResponse(content);
  const tokens = response.split(/(\s+)/); // keep whitespace tokens for natural streaming

  let index = 0;
  let fullResponse = "";

  await new Promise<void>((resolve) => {
    const interval = setInterval(() => {
      if (index >= tokens.length) {
        clearInterval(interval);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
        saveFn(fullResponse).then(() => resolve()).catch(() => resolve());
        return;
      }
      const token = tokens[index];
      fullResponse += token;
      res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
      index++;
    }, 16); // ~60 tokens/sec feels natural
  });
}

export function registerChatRoutes(app: Express): void {
  // Get all conversations
  app.get("/api/conversations", async (req: Request, res: Response) => {
    try {
      const conversations = await chatStorage.getAllConversations();
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ error: "Failed to fetch conversations" });
    }
  });

  // Get single conversation with messages
  app.get("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      const conversation = await chatStorage.getConversation(id);
      if (!conversation) {
        return res.status(404).json({ error: "Conversation not found" });
      }
      const messages = await chatStorage.getMessagesByConversation(id);
      res.json({ ...conversation, messages });
    } catch (error) {
      console.error("Error fetching conversation:", error);
      res.status(500).json({ error: "Failed to fetch conversation" });
    }
  });

  // Create new conversation
  app.post("/api/conversations", async (req: Request, res: Response) => {
    try {
      const { title } = req.body;
      const conversation = await chatStorage.createConversation(title || "New Chat");
      res.status(201).json(conversation);
    } catch (error) {
      console.error("Error creating conversation:", error);
      res.status(500).json({ error: "Failed to create conversation" });
    }
  });

  // Delete conversation
  app.delete("/api/conversations/:id", async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      await chatStorage.deleteConversation(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting conversation:", error);
      res.status(500).json({ error: "Failed to delete conversation" });
    }
  });

  // Send message and get AI response (streaming)
  app.post("/api/conversations/:id/messages", async (req: Request, res: Response) => {
    const conversationId = parseInt(req.params.id);
    const { content } = req.body;

    try {
      // Save user message
      await chatStorage.createMessage(conversationId, "user", content);

      // Get conversation history for context
      const messages = await chatStorage.getMessagesByConversation(conversationId);
      const chatMessages: Array<{ role: "system" | "user" | "assistant"; content: string }> = [
        { role: "system", content: TRUENORTH_SYSTEM_PROMPT },
        ...messages.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
      ];

      // Set up SSE
      res.setHeader("Content-Type", "text/event-stream");
      res.setHeader("Cache-Control", "no-cache");
      res.setHeader("Connection", "keep-alive");

      let fullResponse = "";
      let streamOk = false;

      try {
        // Stream response from OpenAI via Replit proxy
        const stream = await openai.chat.completions.create({
          model: "gpt-5-nano",
          messages: chatMessages,
          stream: true,
          max_completion_tokens: 1024,
        });

        streamOk = true;
        for await (const chunk of stream) {
          const token = chunk.choices[0]?.delta?.content || "";
          if (token) {
            fullResponse += token;
            res.write(`data: ${JSON.stringify({ content: token })}\n\n`);
          }
        }

        await chatStorage.createMessage(conversationId, "assistant", fullResponse);
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
        res.end();
      } catch (aiError: any) {
        // If AI proxy fails (401, etc.), seamlessly fall back to local knowledge base
        if (aiError.status === 401 || aiError.statusCode === 401 || !streamOk) {
          console.log("[Mercedes] AI proxy unavailable, using smart fallback for:", content.slice(0, 50));
          // Save the fallback response after streaming completes
          await streamFallbackResponse(
            res,
            content,
            (text) => chatStorage.createMessage(conversationId, "assistant", text)
          );
          return;
        }

        throw aiError;
      }
    } catch (error) {
      console.error("Error sending message:", error);
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: "Failed to send message" })}\n\n`);
        res.end();
      } else {
        res.status(500).json({ error: "Failed to send message" });
      }
    }
  });
}
