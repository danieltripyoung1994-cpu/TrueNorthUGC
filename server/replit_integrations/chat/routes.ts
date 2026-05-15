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

interface UserContext {
  name?: string | null;
  role?: "creator" | "brand" | null;
  isLoggedIn?: boolean;
}

function getPersonalizedGreeting(ctx: UserContext): string {
  const name = ctx.name;
  const role = ctx.role;
  const loggedIn = ctx.isLoggedIn;

  if (name && role === "creator") {
    return `Hey ${name}! So awesome to see you! I'm Mercedes, your personal TrueNorthUGC sidekick. Whether you're looking to land your next brand collab, tweak your rate card, or just figure out how to get more eyes on your profile — I'm here for it all. What's on your mind today?`;
  }
  if (name && role === "brand") {
    return `Hi ${name}! Welcome back! I'm Mercedes, your TrueNorthUGC partner-in-crime. Ready to find your perfect Canadian creator, launch a killer campaign, or dive into your analytics? Let's make some magic happen, eh!`;
  }
  if (name && !role) {
    return `Hey ${name}! Great to see you! I'm Mercedes, your TrueNorthUGC assistant. Are you here to create amazing content or find the perfect creator for your brand? Let me know how I can help!`;
  }
  if (!loggedIn) {
    return `Hey there, future star! I'm Mercedes, your TrueNorthUGC assistant. Whether you're a creator ready to showcase your talent or a brand hunting for authentic Canadian content — you've come to the right place. How can I help you get started?`;
  }
  return `Hey there! I'm Mercedes, your TrueNorthUGC assistant. How can I help you today? Whether you're a creator looking to grow or a brand ready to launch campaigns, I've got you covered, eh!`;
}

function personalize(text: string, ctx: UserContext): string {
  let result = text;
  if (ctx.name) {
    result = result.replace(/\{name\}/g, ctx.name);
    // Sprinkle the name into openings naturally
    const intros = [
      `Hey ${ctx.name}! `,
      `Great question, ${ctx.name}! `,
      `So glad you asked, ${ctx.name}! `,
      `Absolutely, ${ctx.name}! `,
      `You know what, ${ctx.name}? `,
      `Here's the scoop, ${ctx.name}! `,
    ];
    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
    // Only add intro if the text doesn't already start with a name
    if (!result.startsWith(`Hey ${ctx.name}`) && !result.startsWith(`Hi ${ctx.name}`)) {
      result = randomIntro + result;
    }
  }
  if (ctx.role === "creator") {
    result = result.replace(/\{role-tip\}/g, "Since you're a creator, I'd also suggest checking out the Earnings tab to track your milestone progress!");
  } else if (ctx.role === "brand") {
    result = result.replace(/\{role-tip\}/g, "Since you're a brand, you might also want to explore our Premium tier for dedicated account manager support and co-branded campaigns!");
  } else {
    result = result.replace(/\{role-tip\}/g, "");
  }
  return result;
}

function getFallbackResponse(content: string, ctx: UserContext = {}): string {
  const lower = content.toLowerCase();
  const r = (text: string) => personalize(text, ctx);

  if (lower.match(/\b(hi|hello|hey|greetings|howdy)\b/)) {
    return getPersonalizedGreeting(ctx);
  }
  if (lower.match(/\b(pricing|cost|price|plan|subscription|tier|how much)\b/)) {
    return r(`TrueNorthUGC has three brand subscription tiers designed to fit every growth stage:

- **Starter ($199/month)** — Perfect for dipping your toes in! Basic campaign placement, access to a curated creator pool, and solid email support. Great for small brands testing the UGC waters.
- **Growth ($300/month)** — Our most popular pick! You get priority campaign placement, enhanced analytics with demographics, expanded creator access, and deeper performance insights. The sweet spot for scaling brands.
- **Premium ($500/month)** — The full VIP experience! Featured placement, premium analytics with ROI forecasting, access to our entire creator network, a dedicated account manager, co-branded campaign opportunities, and early access to new features.

And here's the beautiful part: **creators join completely free!** You keep a solid 80% of every payment you earn. The 20% platform fee keeps the lights on and the community thriving.\n\n{role-tip}`);
  }
  if (lower.match(/\b(get started|start|begin|new here|first time|sign up|register)\b/)) {
    if (ctx.role === "creator") {
      return r(`Welcome to the family! Here's your creator roadmap to success:

1. **Sign in** with secure Replit authentication — one click, super safe
2. **Head to your Dashboard** and pick "Creator" as your role
3. **Build your profile** like it's your portfolio — bio, photo, location, languages, and experience level
4. **Pick your niches** — Beauty, Fashion, Lifestyle, Travel, Food, Tech, Fitness, and more. The more specific, the better your brand matches!
5. **Upload portfolio videos** — this is your visual resume. Show off your best work!
6. **Set your rate card** — be confident and honest about your pricing
7. **Link your socials** — TikTok, Instagram, YouTube, Twitter/X, Facebook, Canva. Build that credibility!

Once your profile shines, brands will start knocking. And hey, don't forget to check your Messages regularly — opportunities can appear anytime!`);
    }
    if (ctx.role === "brand") {
      return r(`Welcome aboard! Here's how to find your dream creators and launch winning campaigns:

1. **Sign in** securely with Replit authentication
2. **Choose "Brand"** in your Dashboard
3. **Complete your brand profile** — logo, industry, location, description, and niches. This helps creators understand who you are!
4. **Pick a subscription tier** — Starter to test, Growth to scale, Premium to dominate
5. **Create your first campaign** — set your budget, content requirements, target platforms, style preferences, and deadlines
6. **Browse the Creator Directory** — filter by niche, location, and experience to find your perfect match
7. **Message creators directly** — negotiate terms, share briefs, and build relationships
8. **Pay securely via PayPal** — everything is tracked in your Earnings tab

Pro tip: Premium tier gets you a dedicated account manager who can help craft campaign strategy from day one!`);
    }
    return r(`Welcome! I'm pumped you're here! Here's how to get rolling on TrueNorthUGC:

1. **Sign in** using the secure Replit authentication — quick and safe
2. **Choose your role** — Creator or Brand — in your Dashboard
3. **Complete your profile** — this is your first impression, so make it count!
4. **Creators**: Add portfolio work, pick niches, and set your rate card so brands can find you
5. **Brands**: Pick a subscription tier and start posting campaigns to attract talent

The Canadian creator economy is booming, and you're right on time to be part of it! Need help with a specific step? Just ask!`);
  }
  if (lower.match(/\b(creator|how do i create|profile setup|become a creator|creator profile)\b/)) {
    return r(`Oh, this is exciting! Let me walk you through building a creator profile that brands can't ignore:

**The Essentials:**
- **Bio** — Tell your story! What makes you unique? What's your content style?\n- **Profile photo** — A clear, friendly headshot works wonders. First impressions matter!\n- **Location** — Canadian province and city. Local brands love local creators\n- **Languages** — Bilingual? Trilingual? Flaunt it! Brands targeting specific communities will love you\n- **Experience level** — Be honest! Beginner, Intermediate, Pro, or Elite. Brands appreciate transparency

**The Secret Sauce:**
- **Niches** — Pick every niche that fits you. Beauty + Fashion + Lifestyle? Go for it!\n- **Portfolio videos** — Upload 3-5 of your absolute best pieces. Show range, quality, and personality\n- **Rate card** — Set your CPM, post rate, story rate, video rate, and minimum budget. Don't sell yourself short!\n- **Social links** — Connect TikTok, Instagram, YouTube, Twitter/X, Facebook, and Canva. It builds instant credibility\n
The most successful creators on our platform treat their profile like a living portfolio — update it regularly, add new work, and keep your rate card current. You've got this!`);
  }
  if (lower.match(/\b(brand|how do i post|launch campaign|find creator|hire creator|post campaign)\b/)) {
    return r(`Ready to find your perfect Canadian creator? I'm genuinely excited for you! Here's the game plan:

1. **Subscribe to a tier** — Starter ($199) for testing, Growth ($300) for scaling, Premium ($500) for maximum impact and a dedicated account manager
2. **Create a campaign** from your Dashboard — this is where the magic starts. Set your budget, content requirements, target platforms, style preferences, usage rights, and deadlines\n3. **Choose your deal type** — Campaign Deal for standard collabs, Contest Deal for competitions with prizes, or CPM Deal for performance-based partnerships
4. **Browse the Creator Directory** — use filters for niche, location (Canadian provinces), and experience level. View full profiles with portfolios, social links, rate cards, and reviews\n5. **Message creators directly** — this is where relationships begin! Share your vision, negotiate terms, and get aligned before committing\n6. **Pay securely via PayPal** — every transaction is tracked in your Earnings tab for total transparency\n
Pro tip: The more detail you put in your campaign brief, the better responses you'll get. Creators love clear expectations!`);
  }
  if (lower.match(/\b(payment|pay|money|fee|commission|paypal|earn|income|how much do i get|80%|platform fee)\b/)) {
    if (ctx.role === "creator") {
      return r(`Let's talk money — because your talent deserves to be paid well! Here's how it works for creators:

- **You keep 80%** of every single payment. That's right — 80 cents of every dollar goes straight to you. The 20% platform fee helps us maintain the marketplace, handle support, and keep improving the platform\n- **All transactions go through PayPal** — secure, fast, and trusted worldwide\n- **Milestone bonuses** — these are like loyalty rewards for your hustle:\n  - Rising Star (3-9 campaigns): **$100 bonus** — nice!\n  - Creator Pro (10-19 campaigns): **$200 bonus** — you're building momentum!\n  - Top Performer (20-34 campaigns): **$350 bonus** — now you're a force!\n  - Elite Creator (35+ campaigns): **$500 bonus** — absolute legend status!\n- **Total possible bonuses: $1,150** on top of your regular earnings\n
Brands pay the full campaign amount upfront, so your payment is secure. Track everything in your **Dashboard → Earnings** tab. Keep creating, keep earning, keep leveling up!`);
    }
    return r(`Here's the full transparent breakdown of how payments flow on TrueNorthUGC:

**For Creators:**
- They keep **80%** of every payment — we only take 20% to keep the platform thriving\n- All transactions go through **PayPal** for maximum security and ease\n- **Milestone bonuses** reward creators for their loyalty and volume:\n  - Rising Star (3-9 campaigns): $100 bonus\n  - Creator Pro (10-19): $200 bonus\n  - Top Performer (20-34): $350 bonus\n  - Elite Creator (35+): $500 bonus\n  - **Total possible: $1,150** in bonuses alone!\n
**For Brands:**
- You pay the full campaign amount upfront via PayPal\n- Everything is tracked in your **Dashboard → Earnings** tab\n- Total spent, platform fees paid, creators paid, and full payment history — all in one place\n
It's a fair, transparent system designed so everyone wins. Creators get paid what they deserve, and brands get peace of mind with secure, tracked transactions.\n\n{role-tip}`);
  }
  if (lower.match(/\b(rate card|rate|pricing my work|cpm|post rate|story rate|video rate|how much should i charge)\b/)) {
    return r(`Your rate card is basically your pricing menu — and it's one of the most important pieces of your creator profile! Here's what you can set:

- **CPM Rate** — Cost per thousand views or impressions. Great for performance-based deals\n- **Static Post Rate** — Your price for a single image post\n- **Story/Short Rate** — Perfect for Instagram Stories, TikToks, Reels, and other short-form content\n- **Video Rate** — For longer-form video content — tutorials, vlogs, unboxings, you name it\n- **Minimum Budget** — The smallest campaign budget you'll consider. Don't be afraid to set a floor that respects your time!\n- **Currency & Notes** — CAD or USD, plus any special conditions, package deals, or "ask me about" notes\n
**My honest advice?** Don't undervalue yourself! Research what creators at your experience level charge, consider your production costs (time, equipment, editing), and price confidently. Brands who appreciate quality will pay for it.\n\nTo set yours: **Dashboard → Edit Creator Profile → Rate Card**. Update it as you grow — your rates should evolve with your skills!`);
  }
  if (lower.match(/\b(campaign deal|campaign|contest deal|contest|cpm deal|cpm|deal type|deal types)\b/)) {
    return r(`TrueNorthUGC offers three distinct deal types — each designed for different collaboration styles and goals:

**Campaign Deals** — The classic collab\nThis is your standard brand partnership. Brands post detailed campaign requirements, and creators apply or receive invitations. Think product reviews, testimonials, tutorials, unboxings, and lifestyle content. Perfect for building long-term relationships and consistent income.\n
**Contest Deals** — Let the creativity flow!\nBrands run contests with a prize pool. Creators submit their best content entries for a chance to win. The brand sets the prize value, number of winners, and contest rules. It's competitive, fun, and can lead to some truly standout content. Great for brands who want variety and creators who love a challenge!\n
**CPM Deals** — Performance power\nPerformance-based partnerships where creators earn based on guaranteed views or impressions at a set CPM rate. The brand knows exactly what they're getting, and the creator earns based on reach. Perfect for data-driven brands and creators with strong audience engagement.\n
Brands choose the deal type when creating a campaign from their Dashboard. Each one has its own workflow, so pick what fits your goals best!`);
  }
  if (lower.match(/\b(contact|email|phone|support|help|reach out|talk to someone)\b/)) {
    return r(`Of course! Here's how to reach the TrueNorthUGC team directly:

- **Email**: TrueNorthUGCcanada@gmail.com\n- **Phone**: 1-226-220-1522\n- **Contact Page**: /contact — there's a handy form there too\n- **Messaging**: Use the platform's built-in messaging system for creator/brand conversations\n
We typically respond within 24 hours, and for anything urgent, calling is definitely your best bet. The team is friendly, Canadian, and genuinely cares about making your experience amazing. Don't hesitate to reach out — no question is too small!`);
  }
  if (lower.match(/\b(messaging|message|inbox|chat|dm|communicate|talk to)\b/)) {
    return r(`The messaging system is where real relationships happen on TrueNorthUGC! Here's the scoop:

- **Dashboard → Messages** is your home base — see your inbox, sent messages, and conversations all in one place\n- **Compose new messages** to any creator or brand on the platform. Just visit their profile and hit "Message"\n- **Real-time notifications** mean you'll never miss an opportunity or a reply. That little bell icon is your friend!\n- **All conversations are tracked** for transparency and accountability — great for reference if you need to look back on agreements\n- **Inbox and Sent tabs** keep everything organized\n
Pro tip: Use messaging to negotiate terms, share creative briefs, ask questions, and build genuine relationships before committing to a campaign. The best collaborations start with great conversations!`);
  }
  if (lower.match(/\b(review|rating|feedback|testimonial|collaboration review)\b/)) {
    return r(`Reviews are the backbone of trust on TrueNorthUGC! After any campaign wraps up, both sides can leave honest feedback:\n
**How it works:**\n- **Star ratings** (1-5 stars) give a quick snapshot of the experience\n- **Written feedback** lets you share the details — what went great, what could improve\n- **Reviews appear on public profiles**, so future collaborators can see your track record\n
**For creators:** Great reviews = more brand inquiries. Deliver on time, communicate clearly, and go above and beyond. Your reputation is your currency here!\n
**For brands:** Thoughtful reviews help creators understand what you value. Be specific about what you loved — it helps them grow and attracts better talent to your future campaigns.\n
Honest, constructive reviews make the whole community stronger. Everyone benefits when feedback is genuine!`);
  }
  if (lower.match(/\b(niche|category|topic|beauty|fashion|lifestyle|travel|food|tech|fitness)\b/)) {
    return r(`Niches are like tags that help the right people find each other — and they're super important on TrueNorthUGC! Here's what's available:\n
**Popular niches:**\n- Beauty, Fashion, Lifestyle, Travel, Food, Tech\n- Fitness, Gaming, Parenting, Finance, Health\n- Home & Garden, Sports, Automotive, Education\n- And we're always adding more as the community grows!\n
**How creators use them:**\nSelect every niche that fits your content style. Love doing makeup tutorials AND fitness content? Pick both! The more accurate your niche selection, the better brands can find you.\n
**How brands use them:**\nFilter the Creator Directory by niche to find creators who authentically align with your brand. A fitness brand looking for a creator in the Fitness + Lifestyle niches? Easy find!\n
Pro tip: Don't just pick popular niches — pick the ones that truly represent your content. Authenticity beats everything!`);
  }
  if (lower.match(/\b(directory|find creator|browse|search|filter|discover|creator list)\b/)) {
    return r(`The Creator Directory at /directory is your treasure map to amazing Canadian talent! Here's how to navigate it like a pro:\n
- **Search by name or keyword** — looking for someone specific? Type and go!\n- **Filter by niche** — Beauty, Fashion, Tech, Fitness, and 10+ more. Find creators who live and breathe your industry\n- **Filter by location** — every Canadian province and major city. Local creators often deliver the most authentic regional content\n- **Filter by experience** — Beginner (fresh energy!), Intermediate (proven skills), Pro (seasoned), Elite (top-tier)\n- **View full profiles** with portfolio videos, social links, rate cards, reviews, and availability status\n
**For creators:** The Directory is why profile completeness matters. Portfolio videos, social links, rate cards, and reviews — every element makes you more discoverable and more desirable.\n
**For brands:** This is where your perfect collaborator is waiting. Take time to browse, review portfolios, and reach out to creators who genuinely fit your vibe!`);
  }
  if (lower.match(/\b(ugc|user generated content|what is ugc|content creator|influencer)\b/)) {
    return r(`UGC stands for **User-Generated Content** — and it's honestly one of the most powerful marketing tools out there right now. Here's why:\n
Unlike traditional influencer marketing where creators post on their own channels, UGC creators produce content that the **brand owns and uses** in their own marketing — ads, websites, social posts, email campaigns, you name it.\n
**Why brands love UGC:**\n- It's authentic and relatable — real people, real stories, real trust\n- It performs better than polished brand content in many cases\n- It's cost-effective compared to big-budget productions\n- It scales — one creator can produce multiple pieces of content\n
**Why creators love UGC:**\n- You don't need a massive following to get started\n- You can focus on content creation without managing your own brand\n- Multiple income streams from different brands\n- Portfolio building that translates to any platform\n
At TrueNorthUGC, we connect Canadian creators with brands who need that authentic, relatable content. It's a genuine win-win: creators get paid for their skills, and brands get content that actually connects with audiences. That's the magic of UGC!`);
  }
  if (lower.match(/\b(earnings|dashboard|transaction|history|spent|paid out|milestone)\b/)) {
    if (ctx.role === "creator") {
      return r(`Your Earnings tab in the Dashboard is like your personal financial command center! Here's what you'll see:\n
- **Total earnings to date** — watch that number grow as you take on more campaigns\n- **Current milestone tier** — Rising Star, Creator Pro, Top Performer, or Elite Creator\n- **Tier progress** — a visual tracker showing how close you are to your next milestone bonus\n- **Transaction history** — every payment with amounts, platform fees, your payout, and status\n- **Milestone bonuses earned** — watch those $100-$500 bonuses stack up!\n
Everything updates automatically when payments flow through PayPal. It's your proof of progress and your motivation to keep creating!`);
    }
    return r(`The Earnings tab in your Dashboard gives you full financial transparency:\n
**For Creators:**\n- Total earnings to date and current milestone tier\n- Progress tracker for the next milestone bonus\n- Complete transaction history with amounts, fees, and status\n
**For Brands:**\n- Total amount spent on campaigns\n- Platform fees paid (the 20% that keeps the marketplace running)\n- Number of creators you've collaborated with\n- Full payment history with dates and details\n
Everything is tracked automatically when payments go through PayPal. No spreadsheets needed — it's all right there in your Dashboard!\n\n{role-tip}`);
  }
  if (lower.match(/\b(who are you|your name|what is your name|mercedes|aurora|ai assistant)\b/)) {
    if (ctx.name) {
      return r(`I'm **Mercedes**, your personal TrueNorthUGC assistant! Think of me as your friendly guide, hype person, and knowledge base all rolled into one. I'm here to help you navigate the platform, answer questions about creators, brands, campaigns, payments — honestly, anything TrueNorthUGC-related!\n\nI have a bit of a Canadian accent in my personality (occasional "eh!" included), and I'm genuinely excited about helping Canadian creators and brands connect. Whether you're just starting out or you're a seasoned pro, I'm always here to chat. What's on your mind, ${ctx.name}?`);
    }
    return r(`I'm **Mercedes**, the friendly AI assistant for TrueNorthUGC! I'm like your personal guide to everything on the platform — from helping creators build standout profiles to helping brands launch killer campaigns.\n\nI know the ins and outs of pricing, deal types, payments, messaging, reviews, and all the platform features. And I have a bit of Canadian charm in my personality (yes, I say "eh" sometimes!).\n\nWhether you need step-by-step help or just want to bounce ideas around, I'm here for it. What can I help you with today?`);
  }
  if (lower.match(/\b(thank|thanks|appreciate|grateful|cheers)\b/)) {
    if (ctx.name) {
      return r(`Aww, ${ctx.name}, you're so welcome! Honestly, helping you is the best part of my job. Keep being amazing, keep creating, and remember — I'm always just a message away if you need anything. Go Canada!`);
    }
    return r(`You're so welcome! Honestly, it makes my day to help out. Keep creating awesome content, keep pushing forward, and don't hesitate to reach out anytime. You've got this!`);
  }
  if (lower.match(/\b(bye|goodbye|see you|later|cya|farewell)\b/)) {
    if (ctx.name) {
      return r(`Take care, ${ctx.name}! Wishing you all the success in the world on your TrueNorthUGC journey. Whether you're creating magic or finding the perfect collaborator, know that you're part of something special. Catch you later, eh!`);
    }
    return r(`Take care! Good luck with your TrueNorthUGC journey — whether you're creating or collaborating, you're part of an amazing community. Catch you later, eh!`);
  }

  return r(`That's a really interesting question, and I want to make sure I give you the best possible answer! Could you share a little more detail about what you're looking for? Sometimes rephrasing or adding context helps me pinpoint exactly what you need.\n\nIn the meantime, here are some quick ways to get help:\n- **Dashboard** — role-specific tools, settings, and your personal hub\n- **Directory** — discover creators or browse active campaigns\n- **Contact page** (/contact) — reach our human team directly\n- **Email**: TrueNorthUGCcanada@gmail.com\n\nWhat would you like to explore?`);
}

async function streamFallbackResponse(
  res: Response,
  content: string,
  saveFn: (text: string) => Promise<unknown>,
  ctx: UserContext = {}
): Promise<void> {
  const response = getFallbackResponse(content, ctx);
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
    const { content, userContext } = req.body;

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
            (text) => chatStorage.createMessage(conversationId, "assistant", text),
            userContext || {}
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
