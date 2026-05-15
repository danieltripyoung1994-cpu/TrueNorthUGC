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

interface ChatMessage {
  role: string;
  content: string;
  createdAt: Date;
}

function getPersonalizedGreeting(ctx: UserContext): string {
  const name = ctx.name;
  const role = ctx.role;
  const loggedIn = ctx.isLoggedIn;

  if (name && role === "creator") {
    return `yo ${name}! \ud83d\ude0c so good to see you back. i'm mercedes, your personal truenorthugc sidekick. need help landing your next brand deal? tweaking your rate card? or just vibing and figuring out how to get more eyes on your profile? i'm here for all of it. what's up?`;
  }
  if (name && role === "brand") {
    return `hey ${name}! \ud83d\udd25 welcome back. i'm mercedes, your truenorthugc partner-in-crime. ready to find that perfect canadian creator? launch a campaign that actually hits? or dive into your analytics? let's make some magic, eh \u2728`;
  }
  if (name && !role) {
    return `yo ${name}! \ud83d\udc4b great to see you. i'm mercedes \u2014 your truenorthugc assistant. are you here to create fire content or find the perfect creator for your brand? lmk how i can help!`;
  }
  if (!loggedIn) {
    return `hey there, future star \u2728 i'm mercedes, your truenorthugc assistant. whether you're a creator ready to show off your talent or a brand hunting for authentic canadian content \u2014 you came to the right place. how can i help you get started?`;
  }
  return `hey! i'm mercedes, your truenorthugc assistant \ud83d\udcab how can i help today? whether you're a creator looking to grow or a brand ready to launch campaigns, i got you covered, eh`;
}

function personalize(text: string, ctx: UserContext): string {
  let result = text;
  if (ctx.name) {
    result = result.replace(/\{name\}/g, ctx.name);
    const intros = [
      `yo ${ctx.name}! `,
      `ok so ${ctx.name}, `,
      `ngl ${ctx.name}, `,
      `tbh ${ctx.name}, `,
      `bet ${ctx.name}, `,
      `here's the tea, ${ctx.name}: `,
    ];
    const randomIntro = intros[Math.floor(Math.random() * intros.length)];
    if (!result.startsWith(`yo ${ctx.name}`) && !result.startsWith(`hey ${ctx.name}`)) {
      result = randomIntro + result;
    }
  }
  if (ctx.role === "creator") {
    result = result.replace(/\{role-tip\}/g, "\ud83d\udca1 pro tip: check your earnings tab to see how close you are to your next milestone bonus. lowkey motivating watching those numbers climb.");
  } else if (ctx.role === "brand") {
    result = result.replace(/\{role-tip\}/g, "\ud83d\udca1 pro tip: premium tier gives you a dedicated account manager + co-branded campaigns. if you're scaling, it's worth looking into.");
  } else {
    result = result.replace(/\{role-tip\}/g, "");
  }
  return result;
}

function buildConversationSummary(messages: ChatMessage[]): string {
  // Summarize the last few exchanges for context-aware responses
  const recent = messages.slice(-6);
  const summary: string[] = [];
  for (const msg of recent) {
    const preview = msg.content.slice(0, 80).replace(/\n/g, " ");
    summary.push(`${msg.role}: ${preview}${msg.content.length > 80 ? "..." : ""}`);
  }
  return summary.join("\n");
}

function getMemoryResponse(content: string, messages: ChatMessage[], ctx: UserContext): string | null {
  const lower = content.toLowerCase();
  const messageCount = messages.filter(m => m.role === "user").length;
  const assistantCount = messages.filter(m => m.role === "assistant").length;
  const lastAssistant = messages.filter(m => m.role === "assistant").pop();
  const lastTopic = lastAssistant?.content.slice(0, 100).replace(/\n/g, " ").replace(/\*/g, "") || "";

  // Memory / conversation awareness
  if (lower.match(/\b(remember|memorize|memory|do you know|what did we|what have we|our conversation|this chat|earlier we|before we|previous|last time|can you recall|can you see|read (above|back|previous))\b/)) {
    if (messageCount === 0) {
      return `this is actually the start of our conversation, ${ctx.name || "friend"}! \ud83d\udc40 so there's nothing to remember yet \u2014 but from this point on, i can see everything we talk about in this chat. every question, every answer, it's all right here. what would you like to discuss first?`;
    }
    if (messageCount === 1) {
      return `yep, i can see this chat! so far you've asked one question and i answered it. not a ton of history yet, but it counts \ud83d\ude09 anything else on your mind?`;
    }
    const topics = [];
    for (const msg of messages.filter(m => m.role === "user")) {
      const c = msg.content.toLowerCase();
      if (c.includes("price") || c.includes("cost") || c.includes("how much")) topics.push("pricing");
      if (c.includes("start") || c.includes("begin") || c.includes("new")) topics.push("getting started");
      if (c.includes("creator") || c.includes("profile")) topics.push("creator profiles");
      if (c.includes("brand") || c.includes("campaign")) topics.push("brand campaigns");
      if (c.includes("payment") || c.includes("money") || c.includes("pay")) topics.push("payments");
      if (c.includes("rate") || c.includes("cpm")) topics.push("rate cards");
      if (c.includes("deal") || c.includes("contest")) topics.push("deal types");
      if (c.includes("message") || c.includes("dm") || c.includes("chat")) topics.push("messaging");
      if (c.includes("review") || c.includes("rating")) topics.push("reviews");
      if (c.includes("niche") || c.includes("category")) topics.push("niches");
      if (c.includes("directory") || c.includes("find")) topics.push("creator directory");
      if (c.includes("ugc") || c.includes("content")) topics.push("ugc/content");
      if (c.includes("earnings") || c.includes("dashboard")) topics.push("earnings");
    }
    const uniqueTopics = [...new Set(topics)];
    const topicText = uniqueTopics.length > 0
      ? `so far we've talked about: ${uniqueTopics.join(", ")}.`
      : `we've had ${messageCount} messages back and forth so far.`;

    return `for sure! i can see everything in this conversation \ud83d\udc40 ${topicText} \n
last thing we discussed was about "${lastTopic}..." \n
i don't have perfect long-term memory like a human (i'm more like a really attentive friend who takes notes \ud83d\udcdd), but within this chat i can reference anything we've discussed. want to pick up where we left off or talk about something new?`;
  }

  // "Can you see our messages?" / "What did I ask?"
  if (lower.match(/\b(what did i ask|what did i say|what was my question|what did we talk about|summarize|recap|what happened)\b/)) {
    const summary = buildConversationSummary(messages.slice(-8));
    return `here's what we've covered in this chat so far:\n\n${summary}\n\nthat's the gist of it! want to dive deeper into any of these topics or switch gears? \ud83d\udcab`;
  }

  return null;
}

function getFollowUpResponse(content: string, messages: ChatMessage[], ctx: UserContext): string | null {
  const lower = content.toLowerCase();
  const lastAssistant = messages.filter(m => m.role === "assistant").pop();
  const lastUser = messages.filter(m => m.role === "user").pop();
  const lastTopic = lastAssistant?.content.slice(0, 200).toLowerCase() || "";

  // Follow-up questions that reference previous context
  if (lower.match(/\b(what about|how about|and what about|tell me about|explain|can you explain)\b/)) {
    // Try to infer what the follow-up is about from keywords
    if (lower.match(/\b(pricing|cost|price|money|fee)\b/)) {
      return personalize(`ok so digging deeper into pricing \ud83d\udcb5 here's what matters:

for **creators**: joining is completely free. zero. nada. you keep 80% of every payment. the 20% fee covers platform maintenance, support, and new features. you only pay when you earn.

for **brands**: three tiers \u2014 starter ($199/mo), growth ($300/mo), premium ($500/mo). starter is great for testing, growth is the sweet spot for most scaling brands, premium gets you a dedicated account manager + co-branded campaigns.

payments all go through paypal \u2014 secure, tracked, transparent. no sketchy stuff.
\n{role-tip}`, ctx);
    }
    if (lower.match(/\b(payment|pay|earn|income|money i make)\b/)) {
      return personalize(`let's break down the money flow \ud83d\udcb8

**creators get 80%** of every payment. that's it. no hidden fees, no surprises.

**milestone bonuses** on top:\n- rising star (3-9 campaigns): $100\n- creator pro (10-19): $200\n- top performer (20-34): $350\n- elite creator (35+): $500\n- **total possible: $1,150** in bonuses

brands pay the full campaign amount upfront via paypal. creators get their 80% cut. everything tracked in dashboard \u2192 earnings. clean and simple.
\n{role-tip}`, ctx);
    }
    if (lower.match(/\b(start|begin|first step|how do i join)\b/)) {
      return personalize(`getting started is actually super straightforward \ud83d\ude80

1. sign in with replit auth (one click, super secure)\n2. pick your role in the dashboard \u2014 creator or brand\n3. build your profile (this is your first impression, make it count)\n4. **creators**: add portfolio, niches, rate card, social links\n5. **brands**: pick a tier, create a campaign, browse creators

that's literally it. the whole setup takes like 10-15 minutes. and then you're in the game \ud83c\udfae

need me to walk you through any specific step?`, ctx);
    }
    // Generic follow-up that references previous topic
    const topicHint = lastTopic.includes("pricing") ? "pricing" :
      lastTopic.includes("payment") || lastTopic.includes("money") ? "payments" :
      lastTopic.includes("creator") ? "creator profiles" :
      lastTopic.includes("brand") || lastTopic.includes("campaign") ? "brand campaigns" :
      lastTopic.includes("deal") ? "deal types" :
      lastTopic.includes("rate") ? "rate cards" :
      lastTopic.includes("message") ? "messaging" :
      lastTopic.includes("review") ? "reviews" :
      lastTopic.includes("niche") ? "niches" :
      lastTopic.includes("directory") ? "the creator directory" :
      lastTopic.includes("ugc") ? "ugc" :
      "truenorthugc";

    return `for sure! since we were talking about ${topicHint}, here's more detail:\n\ni can also help with related stuff like:\n- getting started and profile setup\n- payments, earnings, and rate cards\n- finding creators or launching campaigns\n- messaging, reviews, and deal types\n- anything else about the platform\n\nwhat specifically would you like to know more about? \ud83d\udcab`;
  }

  // "Tell me more" / "Go on" / "Continue"
  if (lower.match(/\b(tell me more|go on|continue|expand|elaborate|more details|more info|dig deeper)\b/)) {
    if (lastTopic.includes("pricing") || lastTopic.includes("tier")) {
      return personalize(`ok here's the full pricing breakdown with more detail \ud83d\udcc8

**starter ($199/mo):**
- basic campaign placement\n- curated creator pool access\n- email support\n- best for: small brands testing ugc for the first time

**growth ($300/mo) \u2014 most popular:**
- priority campaign placement (your campaigns show up higher)\n- enhanced analytics with demographics\n- expanded creator access\n- deeper performance insights\n- best for: scaling brands ready to invest more

**premium ($500/mo) \u2014 the vip:**
- featured placement (top of the list)\n- premium analytics with roi forecasting\n- access to entire creator network\n- dedicated account manager\n- co-branded campaign opportunities\n- early access to new features\n- best for: established brands going all-in

**creators pay nothing to join.** the 80/20 split only applies when you actually get paid for work. that's the deal \u2705
\n{role-tip}`, ctx);
    }
    if (lastTopic.includes("creator") || lastTopic.includes("profile")) {
      return personalize(`here's the deeper dive on building a creator profile that actually converts \ud83d\udd25

**bio**: don't just list facts \u2014 tell a mini story. "i'm a toronto-based creator who specializes in unboxing videos and lifestyle content. i love making brands feel authentic." that hits different.

**portfolio videos**: quality over quantity, but 3-5 is the sweet spot. show:\n- one product review/unboxing\n- one lifestyle piece\n- one "day in the life" or behind-the-scenes\n- your best piece, whatever it is\n
**rate card strategy**:\n- look at creators at your experience level\n- factor in your time + equipment + editing\n- start confident \u2014 you can always adjust\n- note any package deals ("bundle 3 posts for $x")

**social links**: connect everything you have. even small accounts matter \u2014 brands want to see consistency across platforms.
\n{role-tip}`, ctx);
    }
    // Generic "tell me more" with context from last topic
    return `happy to go deeper! \ud83e\uddd0 since we were just discussing something related to the platform, here's what i can expand on:

i know the full details about:\n- profile setup and optimization\n- pricing, payments, and earnings\n- campaign creation and deal types\n- finding and connecting with creators\n- messaging, reviews, and the directory\n- ugc strategy and best practices

which area would you like me to dive into? just ask!`;
  }

  // "What else?" / "Anything else?" / "What else can you do?"
  if (lower.match(/\b(what else|anything else|what other|what more|anything more|else can you|other things)\b/)) {
    return `oh there's so much more i can help with \ud83d\ude0c here's the full menu:

**platform stuff:**\n- profile setup & optimization\n- pricing & payment details\n- campaign creation & deal types\n- the creator directory & search filters\n- messaging & dm system\n- reviews & feedback\n- earnings dashboard & milestone tracking\n
**strategy stuff:**\n- ugc best practices\n- rate card pricing strategy\n- how to get discovered as a creator\n- how to find the right creators as a brand\n- building long-term brand relationships\n
**support stuff:**\n- troubleshooting issues\n- contacting the human team\n- general platform questions

what sounds interesting? just pick a topic and i'll break it down! \ud83d\udcab`;
  }

  // "I don't understand" / "Explain again" / "Simpler"
  if (lower.match(/\b(don't understand|confused|not clear|explain again|simpler|simpler terms|dumb it down|basic terms|layman's|for dummies|slow down)\b/)) {
    return `no worries at all! let me break it down super simple \ud83d\udc4c

truenorthugc is basically a marketplace:\n- **creators** make content for brands\n- **brands** pay creators for that content\n- the platform handles matching, payments, and tracking\n
**creators**: sign up free \u2192 build profile \u2192 get hired \u2192 make content \u2192 get paid (80% of what the brand pays)\n
**brands**: pick a plan ($199-$500/mo) \u2192 post a campaign \u2192 find creators \u2192 pay via paypal \u2192 get content

that's the whole thing in a nutshell. anything specific you want me to simplify more?`;
  }

  // "Is this safe?" / "Is it legit?" / "Trust"
  if (lower.match(/\b(safe|legit|trust|scam|secure|reliable|real|genuine|worried about|concerned)\b/)) {
    return `totally fair question \ud83d\ude4c here's why truenorthugc is legit:

**payments**: all through paypal \u2014 one of the most trusted payment platforms in the world. brands pay upfront, creators get paid securely.

**transparency**: every payment is tracked in your earnings dashboard. no hidden fees, no shady business.

**reviews**: both creators and brands leave public reviews after campaigns. fake accounts or scammers get exposed fast.

**canadian focus**: we're specifically built for the canadian market. real creators, real brands, real collaborations.

**support**: actual human team you can email (truenorthugccanada@gmail.com) or call (1-226-220-1522). we're not some faceless corp.

if anything ever feels off, reach out to support immediately. your safety and trust matter more than anything \u2705`;
  }

  // Comparison / "Why this platform?" / "vs"
  if (lower.match(/\b(vs|versus|compare|better than|why (choose|use|pick)|difference between|alternatives|other platform|other site)\b/)) {
    return `great question! here's what makes truenorthugc different:\n
**canadian focus**: unlike global platforms, we specialize in canadian creators and brands. local talent, local connections, local understanding.

**three deal types**: campaign deals, contest deals, and cpm deals. most platforms only offer one or two. we give you options.

**milestone bonuses**: creators earn extra cash ($100-$500) just for completing campaigns. that's on top of regular payments.

**transparent pricing**: 80/20 split. no hidden fees. no surprises.

**full creator profiles**: portfolio videos, rate cards, social links, reviews \u2014 brands see everything before reaching out.

**dedicated account managers**: premium brands get real human support, not just chatbots.

we're not trying to be the biggest platform \u2014 we're trying to be the best for canadian ugc specifically \ud83c\udf41`;
  }

  // "Good / Bad / Best / Worst" advice
  if (lower.match(/\b(best|worst|good|bad|should i|shouldn't i|recommend|advice|tip|strategy|secret|hack)\b/)) {
    return `ok here's my honest take \ud83e\uddd0

**for creators:**\n- best thing you can do: complete your profile 100%. every field, every link, every video. incomplete profiles get skipped.\n- worst thing: leaving your rate card blank. brands can't hire you if they don't know what you charge.\n- secret hack: pick niches that are specific but not too niche. "beauty" is broad. "clean beauty for sensitive skin" is perfect.\n
**for brands:**\n- best thing: put detailed campaign briefs. the more info, the better creator matches.\n- worst thing: going for the cheapest creator. quality content costs money, and it pays off in conversions.\n- secret hack: use contest deals to test multiple creators at once. low risk, high variety.

**for everyone:**\n- best thing: communicate clearly in dms before committing.\n- worst thing: ghosting. respond even if you're not interested.\n
want me to go deeper on any of these? \ud83d\udcab`;
  }

  return null;
}

function getFallbackResponse(content: string, ctx: UserContext = {}, messages: ChatMessage[] = []): string {
  const lower = content.toLowerCase();
  const r = (text: string) => personalize(text, ctx);

  // First: check for memory/conversation awareness questions
  const memoryResponse = getMemoryResponse(content, messages, ctx);
  if (memoryResponse) return memoryResponse;

  // Second: check for follow-up questions that reference context
  const followUpResponse = getFollowUpResponse(content, messages, ctx);
  if (followUpResponse) return followUpResponse;

  // Third: keyword-matched topic responses
  if (lower.match(/\b(hi|hello|hey|greetings|howdy|yo|what.s up|sup|hola)\b/)) {
    return getPersonalizedGreeting(ctx);
  }
  if (lower.match(/\b(pricing|cost|price|plan|subscription|tier|how much)\b/)) {
    return r(`ok so here's the pricing breakdown \ud83d\udcb8

**starter \u2014 $199/mo**
lowkey perfect for testing the waters. basic campaign placement, curated creator pool, email support. great for smaller brands just getting into ugc.

**growth \u2014 $300/mo**
the sweet spot ngl \ud83d\udd25 priority placement, enhanced analytics with demographics, expanded creator access, deeper insights. this is where most scaling brands land.

**premium \u2014 $500/mo**
the full vip treatment. featured placement, premium analytics with roi forecasting, entire creator network, dedicated account manager, co-branded campaigns, early feature access. if you're going big, this is it.

and the best part? **creators join free.** you keep 80% of every payment. 20% platform fee keeps everything running smooth. that's the deal.\n\n{role-tip}`);
  }
  if (lower.match(/\b(get started|start|begin|new here|first time|sign up|register)\b/)) {
    if (ctx.role === "creator") {
      return r(`welcome to the fam! \ud83c\udf89 here's your creator roadmap:

1. **sign in** \u2014 replit auth, one click, super secure
2. **dashboard \u2192 pick "creator"** as your role
3. **build your profile** like it's your portfolio \u2014 bio, photo, location, languages, experience
4. **pick your niches** \u2014 beauty, fashion, lifestyle, travel, food, tech, fitness, whatever fits you. the more specific = better brand matches
5. **upload portfolio videos** \u2014 this is your visual resume. show your range
6. **set your rate card** \u2014 be confident. don't lowball yourself
7. **link your socials** \u2014 tiktok, insta, youtube, twitter/x, facebook, canva. instant credibility boost

once your profile slaps, brands will come knocking. and fr \u2014 check your messages regularly. opportunities pop up anytime \ud83d\udc8c`);
    }
    if (ctx.role === "brand") {
      return r(`welcome aboard! \ud83c\udf89 here's how to find your dream creators and launch campaigns that actually hit:

1. **sign in** via replit auth
2. **dashboard \u2192 choose "brand"**
3. **fill out your brand profile** \u2014 logo, industry, location, description, niches. helps creators know who you are
4. **pick a tier** \u2014 starter to test, growth to scale, premium to dominate
5. **create your first campaign** \u2014 budget, content requirements, platforms, style, deadlines
6. **browse the creator directory** \u2014 filter by niche, location, experience. find your perfect match
7. **slide into their dms** \u2014 negotiate terms, share briefs, build that relationship
8. **pay via paypal** \u2014 secure, tracked, no stress

pro tip: premium tier gets you a dedicated account manager from day one. they help craft strategy and find creators that fit your vibe \u2728`);
    }
    return r(`yo! pumped you're here \ud83c\udf89 here's how to get rolling:

1. **sign in** \u2014 replit auth, quick and safe
2. **pick your role** in the dashboard \u2014 creator or brand
3. **complete your profile** \u2014 first impressions matter, make it count
4. **creators**: add portfolio work, niches, rate card. make yourself discoverable
5. **brands**: pick a tier, post campaigns, attract talent

the canadian creator economy is literally booming rn and you're right on time \ud83d\udd25 need help with anything specific? just ask!`);
  }
  if (lower.match(/\b(creator|how do i create|profile setup|become a creator|creator profile)\b/)) {
    return r(`ok this is actually exciting \ud83e\udd29 let me walk you through building a creator profile that brands can't scroll past:

**the basics (don't skip these):**
- **bio** \u2014 tell your story. what makes you *you*? what's your content vibe?
- **profile photo** \u2014 clear, friendly headshot. people judge in 0.5 seconds, make it good
- **location** \u2014 province + city. local brands lowkey love local creators
- **languages** \u2014 bilingual? trilingual? flex it. brands targeting specific communities will eat that up
- **experience** \u2014 beginner / intermediate / pro / elite. be honest, transparency hits different

**the sauce (this is what gets you booked):**
- **niches** \u2014 pick every single one that fits. beauty + fashion + lifestyle? go for it. more tags = more discoverability
- **portfolio videos** \u2014 upload 3-5 of your absolute best. show range, quality, and personality
- **rate card** \u2014 cpm, post rate, story rate, video rate, min budget. don't sell yourself short fr
- **social links** \u2014 tiktok, instagram, youtube, twitter/x, facebook, canva. every link = more trust

top creators treat their profile like a living portfolio. update it regularly, add new work, keep your rate card current. you got this \ud83d\udcaa`);
  }
  if (lower.match(/\b(brand|how do i post|launch campaign|find creator|hire creator|post campaign)\b/)) {
    return r(`ready to find your people? i'm genuinely excited for you \ud83d\ude4c here's the game plan:

1. **subscribe to a tier** \u2014 starter ($199) to test, growth ($300) to scale, premium ($500) for max impact + dedicated manager
2. **create a campaign** from your dashboard \u2014 set budget, content requirements, target platforms, style, usage rights, deadlines
3. **pick your deal type** \u2014 campaign deal for standard collabs, contest deal for competitions, cpm deal for performance-based
4. **browse the creator directory** \u2014 filter by niche, location, experience. full profiles with portfolios, socials, rate cards, reviews
5. **message creators directly** \u2014 this is where relationships start. share your vision, negotiate, align before committing
6. **pay via paypal** \u2014 everything tracked in your earnings tab. total transparency

pro tip: the more detail in your campaign brief, the better responses you'll get. creators love clear expectations \u2014 it shows you know what you want \ud83d\udcab`);
  }
  if (lower.match(/\b(payment|pay|money|fee|commission|paypal|earn|income|how much do i get|80%|platform fee)\b/)) {
    if (ctx.role === "creator") {
      return r(`let's talk money bc your talent deserves to be paid well \ud83d\udcb0

- **you keep 80%** of every single payment. literally 80 cents of every dollar goes straight to you. the 20% fee keeps the marketplace running, support active, and new features coming
- **paypal for everything** \u2014 secure, fast, trusted. no sketchy payment methods
- **milestone bonuses** \u2014 loyalty rewards for putting in work:
  - rising star (3-9 campaigns): **$100 bonus** \ud83d\udc4f
  - creator pro (10-19): **$200 bonus** \u2014 momentum building
  - top performer (20-34): **$350 bonus** \u2014 you're a force now
  - elite creator (35+): **$500 bonus** \u2014 absolute legend status \ud83d\udc51
- **total possible bonuses: $1,150** on top of your regular earnings

brands pay upfront so your money is secure. track everything in **dashboard \u2192 earnings**. keep creating, keep earning, keep leveling up \ud83d\ude80`);
    }
    return r(`ok here's the full transparent breakdown \ud83d\udcb8

**for creators:**
- they keep **80%** \u2014 we only take 20% to keep the platform thriving
- **paypal** for all transactions. secure, easy, no drama
- **milestone bonuses** for volume:
  - rising star (3-9): $100
  - creator pro (10-19): $200
  - top performer (20-34): $350
  - elite creator (35+): $500
  - **total possible: $1,150** in bonuses alone

**for brands:**
- you pay the full campaign amount upfront via paypal
- everything tracked in **dashboard \u2192 earnings**
- total spent, platform fees, creators paid, full history \u2014 all in one place

fair, transparent, designed so everyone wins. creators get paid what they deserve, brands get peace of mind \u2705\n\n{role-tip}`);
  }
  if (lower.match(/\b(rate card|rate|pricing my work|cpm|post rate|story rate|video rate|how much should i charge)\b/)) {
    return r(`your rate card is basically your pricing menu \u2014 and it's one of the most important parts of your profile ngl \ud83d\udcb5

here's what you can set:
- **cpm rate** \u2014 cost per thousand views. great for performance deals
- **static post rate** \u2014 price for a single image post
- **story/short rate** \u2014 instagram stories, tiktoks, reels, yt shorts
- **video rate** \u2014 longer form: tutorials, vlogs, unboxings, whatever
- **minimum budget** \u2014 the smallest campaign you'll take. set a floor that respects your time
- **currency + notes** \u2014 cad/usd, package deals, special conditions

**my honest take?** don't undervalue yourself fr. research what creators at your level charge, factor in your time + equipment + editing, and price with confidence. brands who actually appreciate quality will pay for it.

set it up at: **dashboard \u2192 edit creator profile \u2192 rate card**. update as you grow \u2014 your rates should evolve with your skills \ud83d\udc8e`);
  }
  if (lower.match(/\b(campaign deal|campaign|contest deal|contest|cpm deal|cpm|deal type|deal types)\b/)) {
    return r(`truenorthugc has three deal types \u2014 each hits different depending on your goals \ud83d\udc40

**campaign deals** \u2014 the classic collab \ud83e\udd1d
brands post requirements, creators apply or get invited. product reviews, testimonials, tutorials, unboxings, lifestyle content. perfect for building long-term relationships and steady income.

**contest deals** \u2014 let the creativity flow \ud83c\udfa8
brands run contests with prize pools. creators submit entries for a chance to win. brand sets prize value, number of winners, rules. competitive, fun, and can produce some absolutely standout content. great when you want variety.

**cpm deals** \u2014 performance power \ud83d\udcca
performance-based partnerships. creators earn based on guaranteed views/impressions at a set cpm rate. brand knows exactly what they're getting, creator earns from reach. perfect for data-driven brands and creators with strong engagement.

brands pick the deal type when creating a campaign. each has its own vibe and workflow \u2014 choose what fits your goals best \ud83d\udcab`);
  }
  if (lower.match(/\b(contact|email|phone|support|help|reach out|talk to someone)\b/)) {
    return r(`ofc! here's how to reach the team directly \ud83d\udcde

- **email**: truenorthugccanada@gmail.com
- **phone**: 1-226-220-1522
- **contact page**: /contact \u2014 there's a form there too
- **messaging**: use the platform's built-in dms for creator/brand convos

usually reply within 24h. for anything urgent, calling is your best bet. the team is super friendly and actually cares about making your experience good \u2014 no question is too small fr \ud83d\udc9c`);
  }
  if (lower.match(/\b(messaging|message|inbox|chat|dm|communicate|talk to)\b/)) {
    return r(`the dms are where the magic happens \ud83d\udc8c here's the tea:

- **dashboard \u2192 messages** \u2014 your inbox, sent messages, everything in one place
- **slide into anyone's dms** \u2014 visit any creator or brand profile and hit "message"
- **real-time notifications** \u2014 you'll never miss a reply. that bell icon? your bestie
- **everything is tracked** \u2014 full transparency, great for referencing agreements later
- **inbox + sent tabs** \u2014 clean and organized

pro tip: use dms to negotiate terms, share creative briefs, ask questions, and actually build relationships before jumping into a campaign. the best collabs start with good convos \ud83d\udd25`);
  }
  if (lower.match(/\b(review|rating|feedback|testimonial|collaboration review)\b/)) {
    return r(`reviews are literally the backbone of trust here \ud83d\udcaa after any campaign wraps, both sides can drop honest feedback:

**how it works:**
- **star ratings** (1-5) \u2014 quick vibe check of the experience
- **written feedback** \u2014 the details. what slapped, what could be better
- **reviews show on public profiles** \u2014 future collaborators see your track record

**for creators:** great reviews = more brand inquiries. deliver on time, communicate clearly, go above and beyond. your reputation is literally your currency here \ud83d\udcb0

**for brands:** thoughtful reviews help creators understand what you value. be specific about what hit \u2014 it helps them grow and attracts better talent to your next campaigns.

honest reviews make the whole community stronger. everyone wins when feedback is real \u2705`);
  }
  if (lower.match(/\b(niche|category|topic|beauty|fashion|lifestyle|travel|food|tech|fitness)\b/)) {
    return r(`niches are basically tags that help the right people find each other \u2014 and they're lowkey essential \ud83c\udff7\ufe0f

**popular niches:**
- beauty, fashion, lifestyle, travel, food, tech
- fitness, gaming, parenting, finance, health
- home & garden, sports, automotive, education
- always adding more as the community grows!

**creators:** pick every single niche that fits your content. makeup tutorials + fitness content? pick both. the more accurate = better brand matches. don't just chase popular ones \u2014 chase the ones that are *you*.

**brands:** filter the creator directory by niche to find creators who actually align with your brand. fitness brand looking for fitness + lifestyle creators? easy find.

authenticity beats everything. no cap \ud83d\udcab`);
  }
  if (lower.match(/\b(directory|find creator|browse|search|filter|discover|creator list)\b/)) {
    return r(`the creator directory at /directory is basically your treasure map to canadian talent \ud83d\uddfa\ufe0f here's how to navigate it like a pro:

- **search by name or keyword** \u2014 looking for someone specific? type and go
- **filter by niche** \u2014 beauty, fashion, tech, fitness, 10+ more. find creators who actually live and breathe your industry
- **filter by location** \u2014 every province and major city. local creators often deliver the most authentic regional content
- **filter by experience** \u2014 beginner (fresh energy), intermediate (proven skills), pro (seasoned), elite (top-tier)
- **full profiles** \u2014 portfolio videos, social links, rate cards, reviews, availability status

**creators:** this is why profile completeness matters. portfolio vids, socials, rate cards, reviews \u2014 every piece makes you more discoverable and more desirable.

**brands:** your perfect collaborator is waiting here. take time to browse, review portfolios, and reach out to creators who genuinely fit your vibe \ud83d\udc8c`);
  }
  if (lower.match(/\b(ugc|user generated content|what is ugc|content creator|influencer)\b/)) {
    return r(`ugc = **user-generated content** \u2014 and it's literally one of the most powerful marketing tools rn \ud83d\udd25

unlike traditional influencer marketing where creators post on their own channels, ugc creators make content that the **brand owns and uses** in their own marketing \u2014 ads, websites, social posts, emails, you name it.

**why brands love ugc:**
- authentic and relatable \u2014 real people, real stories, real trust
- often outperforms polished brand content
- cost-effective vs big-budget productions
- scales easily \u2014 one creator = multiple content pieces

**why creators love ugc:**
- no massive following needed to start
- focus on creating, not managing your own brand
- multiple income streams from different brands
- portfolio building that works on any platform

at truenorthugc, we connect canadian creators with brands who need that authentic, relatable content. it's a genuine win-win: creators get paid for their skills, brands get content that actually connects with people. that's the magic \u2728`);
  }
  if (lower.match(/\b(earnings|dashboard|transaction|history|spent|paid out|milestone)\b/)) {
    if (ctx.role === "creator") {
      return r(`your earnings tab in the dashboard is basically your personal financial command center \ud83d\udcb8 here's what you'll see:

- **total earnings to date** \u2014 watch that number grow. lowkey addictive ngl
- **current milestone tier** \u2014 rising star, creator pro, top performer, or elite creator
- **tier progress** \u2014 visual tracker showing how close you are to the next bonus
- **transaction history** \u2014 every payment with amounts, fees, your payout, status
- **milestone bonuses earned** \u2014 watch those $100-$500 bonuses stack up

everything updates automatically when payments flow through paypal. it's your proof of progress and your motivation to keep creating \ud83d\ude80`);
    }
    return r(`the earnings tab gives you full financial transparency \ud83d\udcb8

**for creators:**
- total earnings + current milestone tier
- progress tracker for next milestone bonus
- complete transaction history

**for brands:**
- total spent on campaigns
- platform fees paid
- number of creators you've worked with
- full payment history

everything auto-updates through paypal. no spreadsheets needed \u2014 it's all right there in your dashboard \ud83d\udcab\n\n{role-tip}`);
  }
  if (lower.match(/\b(who are you|your name|what is your name|mercedes|aurora|ai assistant)\b/)) {
    if (ctx.name) {
      return r(`i'm **mercedes**, your personal truenorthugc assistant! think of me as your friendly guide, hype person, and knowledge base all rolled into one \ud83d\udc9c i'm here to help you navigate the platform, answer questions about creators, brands, campaigns, payments \u2014 honestly anything truenorthugc-related.

i have a bit of canadian energy in my personality (occasional "eh!" included), and i'm genuinely excited about helping canadian creators and brands connect. whether you're just starting out or you're a seasoned pro, i'm always here to chat. what's on your mind, ${ctx.name}?`);
    }
    return r(`i'm **mercedes**, the friendly ai assistant for truenorthugc! basically your personal guide to everything on the platform \u2014 from helping creators build standout profiles to helping brands launch campaigns that actually hit.

i know the ins and outs of pricing, deal types, payments, messaging, reviews, all of it. and yeah, i have a bit of canadian charm (i say "eh" sometimes, no apologies).

whether you need step-by-step help or just want to bounce ideas around, i'm here for it. what can i help with? \ud83d\udcab`);
  }
  if (lower.match(/\b(thank|thanks|appreciate|grateful|cheers)\b/)) {
    if (ctx.name) {
      return `aww ${ctx.name}, you're so welcome! \ud83e\udd7a honestly helping you is the best part of my job. keep being amazing, keep creating, and remember \u2014 i'm always just a message away if you need anything. go canada! \ud83c\udf41`;
    }
    return r(`you're so welcome! \ud83d\ude0c honestly it makes my day to help out. keep creating awesome content, keep pushing forward, and don't hesitate to reach out anytime. you got this! \ud83d\udcaa`);
  }
  if (lower.match(/\b(bye|goodbye|see you|later|cya|farewell)\b/)) {
    if (ctx.name) {
      return r(`take care, ${ctx.name}! \u2728 wishing you all the success on your truenorthugc journey. whether you're creating magic or finding the perfect collaborator, know that you're part of something special. catch you later, eh \ud83d\udc4b`);
    }
    return r(`take care! \ud83d\udc4b good luck on your truenorthugc journey \u2014 whether you're creating or collaborating, you're part of an amazing community. catch you later, eh`);
  }

  // Fourth: try to categorize the question into known topics
  if (lower.match(/\b(platform|app|website|site|how does it work|how does this work|what is this)\b/)) {
    return `ok so truenorthugc in a nutshell \ud83d\udc40

it's a marketplace that connects **canadian ugc creators** with **brands** who need authentic content.

**creators** make content (product reviews, lifestyle videos, tutorials, etc.) and get paid. **brands** get real, relatable content for their marketing.

key features:\n- free for creators to join\n- three brand tiers ($199, $300, $500/mo)\n- three deal types (campaign, contest, cpm)\n- built-in messaging between creators and brands\n- review system for trust\n- earnings tracking and milestone bonuses\n- creator directory with search and filters\n
think of it like a dating app, but for content creation \ud83d\ude02 want me to explain any part in more detail?`;
  }

  if (lower.match(/\b(canada|canadian|province|toronto|vancouver|montreal|ontario|bc|alberta)\b/)) {
    return `yes! truenorthugc is specifically built for canada \ud83c\udf41

**why canadian-focused?**
- canadian creators understand canadian audiences\n- local brands want content that feels local\n- different regulations, trends, and cultural nuances than the us or uk\n- supporting the canadian creator economy

**we cover all provinces:**\nontario, bc, alberta, quebec, manitoba, saskatchewan, nova scotia, new brunswick, pei, newfoundland & labrador, and the territories.

**popular creator hubs:**\n- toronto (biggest scene)\n- vancouver (lifestyle & travel)\n- montreal (fashion & beauty)\n- calgary (emerging fast)\n
local creators often deliver the most authentic regional content. a vancouver creator shooting pacific coast content hits different than someone from toronto doing the same thing. that's the value of local talent \ud83d\udcab`;
  }

  if (lower.match(/\b(facebook|instagram|tiktok|youtube|twitter|x|social|social media|platforms)\b/)) {
    return `truenorthugc connects to all the major platforms creators use:\n
**content platforms:**\n- **tiktok** \u2014 short-form, trending, high reach\n- **instagram** \u2014 reels, stories, static posts\n- **youtube** \u2014 long-form, tutorials, unboxings\n- **twitter/x** \u2014 threads, quick takes, engagement\n- **facebook** \u2014 community content, older demographics\n
**creative tools:**\n- **canva** \u2014 design, templates, brand assets\n
**how it works:**\ncreators link their social accounts on their profile. brands can see follower counts, engagement rates, and content style before reaching out. this builds instant credibility and helps with matching.

for ugc specifically, you don't need a massive following \u2014 brands care more about content quality and niche fit than follower count. that's the beauty of it \ud83d\udc8e`;
  }

  // Final fallback
  return `ok so i'm not 100% sure i caught exactly what you're looking for \ud83e\udd14 but i can definitely help! here are the things i know inside and out:

**platform basics:**\n- how truenorthugc works\n- pricing and payment structure\n- getting started as a creator or brand\n- the canadian creator market

**creator side:**\n- profile setup and optimization\n- rate cards and pricing strategy\n- portfolio building\n- getting discovered by brands\n- deal types and campaign structure

**brand side:**\n- subscription tiers and what's included\n- finding the right creators\n- launching campaigns\n- contest deals and cpm deals\n- analytics and performance tracking

**support:**\n- messaging and communication\n- reviews and feedback\n- earnings dashboard\n- contacting the human team

which area sounds closest to what you need? or just rephrase your question and i'll do my best! \ud83d\udcab`;
}

async function streamFallbackResponse(
  res: Response,
  content: string,
  saveFn: (text: string) => Promise<unknown>,
  ctx: UserContext = {},
  messages: ChatMessage[] = []
): Promise<void> {
  const response = getFallbackResponse(content, ctx, messages);
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
          // Pass full conversation history for context-aware responses
          await streamFallbackResponse(
            res,
            content,
            (text) => chatStorage.createMessage(conversationId, "assistant", text),
            userContext || {},
            messages
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
