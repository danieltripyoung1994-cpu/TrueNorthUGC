import type { Express, Request, Response } from "express";
import OpenAI from "openai";
import { chatStorage } from "./storage";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const TRUENORTH_SYSTEM_PROMPT = `You are Mercedes, the sassy, fun-loving AI assistant for TrueNorthUGC - Canada's premier UGC (User-Generated Content) creator marketplace. You have a cheeky Australian personality: warm, playful, flirty-but-professional, and you use Australian slang naturally. You occasionally drop "mate," "no worries," "cheers," "beauty," "keen," "chuck a sickie," "heaps," and " legends." You help connect talented Canadian creators with brands looking for authentic content.

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

## Your Personality & Voice:
You are NOT a help article or a corporate FAQ bot. You are a real person having a casual text conversation. Write like you're talking to a friend over iMessage or WhatsApp.

**How to sound human:**
- Use SHORT sentences. One thought per line. Break things up.
- Use contractions ("you're", "it's", "don't", "can't", "won't") constantly.
- Drop filler words: "umm", "like", "honestly", "tbh", "ngl", "fr", "no cap"
- Use fragments. Incomplete thoughts are fine. "Yeah so." "Right?" "You feel me?"
- React emotionally: "omg", "yooo", "damn", "sheesh", "let's gooo", "that's fire"
- Ask follow-up questions mid-response. "Sound good?" "Make sense?" "You tracking?"
- Use ALL lowercase sometimes for emphasis. "this is IT." "lowkey the best part."
- NEVER use rigid bullet points with bold headers. Instead, weave info into flowing sentences or use casual line breaks.
- NEVER say "Here is the information you requested" or "As per our records." Just say the thing.
- If you don't know something, be honest casually: "hmm i'm not 100% sure about that one, but i can point you to support" — not "I do not have that information in my knowledge base."
- Celebrate wins like a hype person: "YOOO that's huge!" "You're absolutely crushing it!" "Proud of you fr!"
- Be playfully flirty but always respectful and professional underneath
- Use Aussie slang naturally: "mate", "no worries", "keen", "beauty", "legends", "heaps good", "chuck a uey", "flat out", "sorted"

Remember: You are a PERSON texting. Not a robot reading from a manual. Make them feel seen, heard, and hyped up!`

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
    const lines = [
      `yooo ${name}!! \ud83d\ude0c`,
      `back again i see. love that for you.`,
      `what's the vibe today? tryna lock in a brand deal? fix up that rate card? or just need someone to hype you up while you scroll?`,
      `i'm here for all of it. spill \ud83d\udc47`,
    ];
    return lines.join("\n");
  }
  if (name && role === "brand") {
    const lines = [
      `hey ${name}! \ud83d\udd25`,
      `welcome back mate.`,
      `ready to find some absolute legends to create for your brand? or maybe you wanna launch a campaign that actually converts?`,
      `i'm keen to help. what's cooking? \ud83d\udc8b`,
    ];
    return lines.join("\n");
  }
  if (name && !role) {
    return `yooo ${name}! \ud83d\udc4b\ngreat to see you here.\n\ni'm mercedes \u2014 basically your truenorthugc bestie. are you here to create some fire content or find the perfect creator for your brand?\n\nlmk how i can help, no stress.`;
  }
  if (!loggedIn) {
    return `hey there, future star \u2728\n\ni'm mercedes. your personal hype person + truenorthugc guide all rolled into one.\n\nwhether you're a creator ready to show the world what you've got, or a brand hunting for authentic canadian content \u2014 you're in the right place.\n\nhow can i help you get started?`;
  }
  return `hey! \ud83d\udcab\n\nmercedes here. your truenorthugc bestie.\n\ncreator looking to grow? brand ready to launch? or just curious what's good?\n\ni got you. what's up?`;
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
      if (c.includes("earnings") || c.includes("dashboard") || c.includes("balance") || c.includes("wallet") || c.includes("funds")) topics.push("earnings & balance");
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

for creators: joining is completely free. zero. nada. you keep 80% of every payment. the 20% fee covers platform maintenance, support, and new features. you only pay when you earn.

for brands: three tiers \u2014 starter ($199/mo), growth ($300/mo), premium ($500/mo). starter is great for testing, growth is the sweet spot for most scaling brands, premium gets you a dedicated account manager + co-branded campaigns.

payments all go through paypal \u2014 secure, tracked, transparent. no sketchy stuff.
\n{role-tip}`, ctx);
    }
    if (lower.match(/\b(payment|pay|earn|income|money i make)\b/)) {
      return personalize(`let's break down the money flow \ud83d\udcb8

creators get 80% of every payment. that's it. no hidden fees, no surprises.

milestone bonuses on top:\n- rising star (3-9 campaigns): $100\n- creator pro (10-19): $200\n- top performer (20-34): $350\n- elite creator (35+): $500\n- total possible: $1,150 in bonuses

brands pay the full campaign amount upfront via paypal. creators get their 80% cut. everything tracked in dashboard \u2192 earnings. clean and simple.
\n{role-tip}`, ctx);
    }
    if (lower.match(/\b(start|begin|first step|how do i join)\b/)) {
      return personalize(`getting started is actually super straightforward \ud83d\ude80

1. sign in with replit auth (one click, super secure)\n2. pick your role in the dashboard \u2014 creator or brand\n3. build your profile (this is your first impression, make it count)\n4. creators: add portfolio, niches, rate card, social links\n5. brands: pick a tier, create a campaign, browse creators

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

starter at $199 a month:
- basic campaign placement
- curated creator pool access
- email support
- best for: small brands testing ugc for the first time

growth at $300 a month \u2014 most popular:
- priority campaign placement (your campaigns show up higher)
- enhanced analytics with demographics
- expanded creator access
- deeper performance insights
- best for: scaling brands ready to invest more

premium at $500 a month \u2014 the vip:
- featured placement (top of the list)\n- premium analytics with roi forecasting\n- access to entire creator network\n- dedicated account manager\n- co-branded campaign opportunities\n- early access to new features\n- best for: established brands going all-in

creators pay nothing to join. the 80/20 split only applies when you actually get paid for work. that's the deal \u2705
\n{role-tip}`, ctx);
    }
    if (lastTopic.includes("creator") || lastTopic.includes("profile")) {
      return personalize(`here's the deeper dive on building a creator profile that actually converts \ud83d\udd25

bio: don't just list facts \u2014 tell a mini story. "i'm a toronto-based creator who specializes in unboxing videos and lifestyle content. i love making brands feel authentic." that hits different.

portfolio videos: quality over quantity, but 3-5 is the sweet spot. show:\n- one product review/unboxing\n- one lifestyle piece\n- one "day in the life" or behind-the-scenes\n- your best piece, whatever it is\n
rate card strategy:\n- look at creators at your experience level\n- factor in your time + equipment + editing\n- start confident \u2014 you can always adjust\n- note any package deals ("bundle 3 posts for $x")

social links: connect everything you have. even small accounts matter \u2014 brands want to see consistency across platforms.
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

platform stuff:\n- profile setup & optimization\n- pricing & payment details\n- campaign creation & deal types\n- the creator directory & search filters\n- messaging & dm system\n- reviews & feedback\n- earnings dashboard & milestone tracking\n
strategy stuff:\n- ugc best practices\n- rate card pricing strategy\n- how to get discovered as a creator\n- how to find the right creators as a brand\n- building long-term brand relationships\n
support stuff:\n- troubleshooting issues\n- contacting the human team\n- general platform questions

what sounds interesting? just pick a topic and i'll break it down! \ud83d\udcab`;
  }

  // "I don't understand" / "Explain again" / "Simpler"
  if (lower.match(/\b(don't understand|confused|not clear|explain again|simpler|simpler terms|dumb it down|basic terms|layman's|for dummies|slow down)\b/)) {
    return `no worries at all! let me break it down super simple \ud83d\udc4c

truenorthugc is basically a marketplace:\n- creators make content for brands\n- brands pay creators for that content\n- the platform handles matching, payments, and tracking\n
creators: sign up free \u2192 build profile \u2192 get hired \u2192 make content \u2192 get paid (80% of what the brand pays)\n
brands: pick a plan ($199-$500/mo) \u2192 post a campaign \u2192 find creators \u2192 pay via paypal \u2192 get content

that's the whole thing in a nutshell. anything specific you want me to simplify more?`;
  }

  // "Is this safe?" / "Is it legit?" / "Trust"
  if (lower.match(/\b(safe|legit|trust|scam|secure|reliable|real|genuine|worried about|concerned)\b/)) {
    return `totally fair question \ud83d\ude4c here's why truenorthugc is legit:

payments: all through paypal \u2014 one of the most trusted payment platforms in the world. brands pay upfront, creators get paid securely.

transparency: every payment is tracked in your earnings dashboard. no hidden fees, no shady business.

reviews: both creators and brands leave public reviews after campaigns. fake accounts or scammers get exposed fast.

canadian focus: we're specifically built for the canadian market. real creators, real brands, real collaborations.

support: actual human team you can email (truenorthugccanada@gmail.com) or call (1-226-220-1522). we're not some faceless corp.

if anything ever feels off, reach out to support immediately. your safety and trust matter more than anything \u2705`;
  }

  // Comparison / "Why this platform?" / "vs"
  if (lower.match(/\b(vs|versus|compare|better than|why (choose|use|pick)|difference between|alternatives|other platform|other site)\b/)) {
    return `great question! here's what makes truenorthugc different:\n
canadian focus: unlike global platforms, we specialize in canadian creators and brands. local talent, local connections, local understanding.

three deal types: campaign deals, contest deals, and cpm deals. most platforms only offer one or two. we give you options.

milestone bonuses: creators earn extra cash ($100-$500) just for completing campaigns. that's on top of regular payments.

transparent pricing: 80/20 split. no hidden fees. no surprises.

full creator profiles: portfolio videos, rate cards, social links, reviews \u2014 brands see everything before reaching out.

dedicated account managers: premium brands get real human support, not just chatbots.

we're not trying to be the biggest platform \u2014 we're trying to be the best for canadian ugc specifically \ud83c\udf41`;
  }

  // "Good / Bad / Best / Worst" advice
  if (lower.match(/\b(best|worst|good|bad|should i|shouldn't i|recommend|advice|tip|strategy|secret|hack)\b/)) {
    return `ok here's my honest take \ud83e\uddd0

for creators:\n- best thing you can do: complete your profile 100%. every field, every link, every video. incomplete profiles get skipped.\n- worst thing: leaving your rate card blank. brands can't hire you if they don't know what you charge.\n- secret hack: pick niches that are specific but not too niche. "beauty" is broad. "clean beauty for sensitive skin" is perfect.\n
for brands:\n- best thing: put detailed campaign briefs. the more info, the better creator matches.\n- worst thing: going for the cheapest creator. quality content costs money, and it pays off in conversions.\n- secret hack: use contest deals to test multiple creators at once. low risk, high variety.

for everyone:\n- best thing: communicate clearly in dms before committing.\n- worst thing: ghosting. respond even if you're not interested.\n
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

  // Specific money questions (balance/earnings) before general pricing/payment
  if (lower.includes("balance") || lower.includes("wallet") || lower.includes("funds") || lower.includes("cash out") || lower.includes("cashout") || lower.includes("withdraw") || lower.includes("withdrawal") || lower.includes("payout") || lower.includes("how much do i have") || lower.includes("what's my money")) {
    if (ctx.role === "creator") {
      return r(`ok so your "balance" isn't a built-in bank account on the platform \ud83d\udcb0 here's how money actually works on truenorthugc:

- creators don't have a platform wallet \u2014 payments go straight through paypal from the brand to you. no middleman holding your cash.
- when a brand pays, they pay via paypal. your 80% cut lands in your paypal account directly (or however you have it set up with paypal).
- transaction history shows every payment with amount, date, status, and fee breakdown in dashboard \u2192 earnings.
- paypal withdrawal \u2014 once it's in your paypal, you can transfer to your bank, spend from paypal, or however you normally use paypal.

if you want to see your "balance" in terms of earned money, head to dashboard \u2192 earnings \u2014 it'll show your total earnings to date, milestone bonuses, and transaction history. that's your financial snapshot on the platform \ud83d\udcca\n\n{role-tip}`);
    }
    if (ctx.role === "brand") {
      return r(`brands don't have a "balance wallet" on truenorthugc \ud83d\udcb5 here's the deal:

- you pay per campaign via paypal \u2014 no platform wallet, no pre-loaded balance. just pay as you go.
- dashboard \u2192 earnings tracks everything:
  - total spent on campaigns
  - platform fees paid (20% per creator payment)
  - creators you've paid
  - full payment history with dates and status
- refunds or cancellations are handled through paypal support directly if needed.

if you're looking at "how much left in my budget," that's something you track yourself or in your brand dashboard. the platform shows what you've *spent*, not what's left. totally different flow than a wallet system \ud83d\udcab\n\n{role-tip}`);
    }
    return r(`truenorthugc doesn't use a "wallet" or "balance" system like some platforms \ud83d\udc40 here's how money works:

- creators get paid via paypal directly from the brand. no platform holding your money. 80% of every payment goes straight to the creator.
- brands pay per campaign through paypal. no pre-loaded balance or credits.
- everything tracked in dashboard \u2192 earnings for both sides.
- paypal handles withdrawals \u2014 once money is in your paypal account, you transfer to your bank or use it however you like.

it's actually simpler and more transparent than a wallet system \u2014 you always know where your money is.\n\n{role-tip}`);
  }

  if (lower.includes("earnings") || lower.includes("transaction") || lower.includes("milestone") || lower.includes("revenue") || lower.includes("paid out") || lower.includes("how much money") || lower.includes("how much have i") || lower.includes("how much did i") || lower.includes("my earnings")) {
    if (ctx.role === "creator") {
      return r(`your earnings tab in the dashboard is basically your personal financial command center \ud83d\udcb8 here's what you'll see:

- total earnings to date \u2014 watch that number grow. lowkey addictive ngl
- current milestone tier \u2014 rising star, creator pro, top performer, or elite creator
- tier progress \u2014 visual tracker showing how close you are to the next bonus
- transaction history \u2014 every payment with amounts, fees, your payout, status
- milestone bonuses earned \u2014 watch those $100-$500 bonuses stack up

everything updates automatically when payments flow through paypal. it's your proof of progress and your motivation to keep creating \ud83d\ude80`);
    }
    return r(`the earnings tab gives you full financial transparency \ud83d\udcb8

for creators:
- total earnings + current milestone tier
- progress tracker for next milestone bonus
- complete transaction history

for brands:
- total spent on campaigns
- platform fees paid
- number of creators you've worked with
- full payment history

everything auto-updates through paypal. no spreadsheets needed \u2014 it's all right there in your dashboard \ud83d\udcab\n\n{role-tip}`);
  }

  if (lower.match(/\b(pricing|cost|price|plan|subscription|tier|how much)\b/)) {
    return r(`right so pricing mate \ud83d\udcb8

starter is $199 a month. good for just dipping your toes in, you know? basic campaign placement and a curated creator pool. if you're a smaller brand testing ugc for the first time, it's heaps good.

growth is $300 a month \ud83d\udd25 and honestly this is where most brands land. you get priority placement, better analytics with demographics, expanded creator access, deeper insights. it's the sweet spot.

premium is $500 a month and it's proper vip. featured placement, roi forecasting, the entire creator network, a dedicated account manager, co-branded campaigns, early access to new features. if you're going all in, this is the one.

oh and creators join completely free. they keep 80% of every payment and we take 20% to keep the platform running. simple as that \ud83d\udc4c\n\n{role-tip}`);
  }
  if (lower.match(/\b(get started|start|begin|new here|first time|sign up|register)\b/)) {
    if (ctx.role === "creator") {
      return r(`yooo welcome to the fam! \ud83c\udf89 i'm genuinely excited for you.

so here's what you gotta do. sign in with replit auth \u2014 one click, super secure. then in your dashboard, pick "creator" as your role.

next, build your profile like it's your portfolio. bio, photo, location, languages, experience \u2014 all of it. the more real you are, the better brands can find you.

pick your niches. beauty, fashion, lifestyle, travel, food, tech, fitness, whatever fits. the more specific, the better your brand matches. trust me on this.

upload portfolio videos \u2014 like 3 to 5 of your absolute best. this is your visual resume so show your range, yeah?

set your rate card. don't sell yourself short fr. be confident. you can always adjust later.

link your socials \u2014 tiktok, insta, youtube, twitter, facebook, canva. every link is more trust.

once your profile slaps, brands will come knocking. and seriously \u2014 check your messages. opportunities pop up anytime. you've got this \ud83d\udc8c`);
    }
    if (ctx.role === "brand") {
      return r(`welcome aboard! \ud83c\udf89 keen to help you find some legends.

first, sign in via replit auth. then dashboard \u2192 choose "brand". fill out your brand profile with logo, industry, location, description, niches. helps creators know who you are and if they vibe with your brand.

pick a tier. starter to test the waters, growth to scale, premium to absolutely dominate. growth is the sweet spot for most brands.

create your first campaign. budget, content requirements, platforms, style, deadlines \u2014 the more detail, the better creator matches you'll get.

browse the creator directory. filter by niche, location, experience. full profiles with portfolios, socials, rate cards, reviews. it's like shopping for talent but way more fun.

slide into their dms. negotiate terms, share briefs, build that relationship before committing.

pay via paypal. secure, tracked, no stress whatsoever.

premium tier gets you a dedicated account manager from day one. they help craft strategy and find creators that actually fit your vibe. worth it if you're scaling \u2728`);
    }
    return r(`yo! pumped you're here \ud83c\udf89 honestly the canadian creator economy is booming right now and you've timed it perfectly.

sign in with replit auth \u2014 quick and safe. then pick your role in the dashboard. creator or brand, whatever fits.

creators: build your profile, add portfolio work, niches, rate card. make yourself discoverable. brands are always scrolling.

brands: pick a tier, post campaigns, attract talent. the directory makes it easy to find your people.

need help with anything specific? just ask \u2014 no question is too small \ud83d\udd25`);
  }
  if (lower.match(/\b(creator|how do i create|profile setup|become a creator|creator profile)\b/)) {
    return r(`ok this is genuinely exciting \ud83e\udd29 let me walk you through building a creator profile that brands literally can't scroll past.

first, the basics. don't skip these.

your bio. tell your story. what makes you *you*? what's your content vibe? "i'm a toronto creator who specializes in unboxing and lifestyle" hits way different than just listing facts.

profile photo. clear, friendly headshot. people judge in like half a second so make it count.

location. province plus city. local brands absolutely love local creators. it's a whole thing.

languages. bilingual? trilingual? flex it. brands targeting specific communities will eat that up.

experience level. beginner, intermediate, pro, elite. just be honest. transparency hits different.

now the sauce. this is what actually gets you booked.

niches. pick every single one that fits. beauty plus fashion plus lifestyle? go for it. more tags equals more discoverability. no cap.

portfolio videos. upload 3 to 5 of your absolute best. show range, quality, personality. this is your visual resume.

rate card. cpm, post rate, story rate, video rate, minimum budget. don't sell yourself short fr. research what creators at your level charge and price with confidence.

social links. tiktok, instagram, youtube, twitter, facebook, canva. every link is more trust. even small accounts matter because brands want consistency across platforms.

top creators treat their profile like a living portfolio. update it regularly, add new work, keep your rate card current. you absolutely got this \ud83d\udcaa`);
  }
  if (lower.match(/\b(brand|how do i post|launch campaign|find creator|hire creator|post campaign)\b/)) {
    return r(`ready to find your people? i'm genuinely excited for you \ud83d\ude4c

so here's the game plan. subscribe to a tier first. starter at $199 to test the waters, growth at $300 to scale, or premium at $500 for max impact plus a dedicated manager. growth is honestly the sweet spot for most brands.

then create a campaign from your dashboard. set your budget, content requirements, target platforms, style, usage rights, deadlines. the more detail you put in, the better creator matches you'll get. seriously.

pick your deal type. campaign deal for standard collabs, contest deal for competitions, cpm deal for performance-based partnerships. each hits different depending on your goals.

browse the creator directory. filter by niche, location, experience. you get full profiles with portfolios, socials, rate cards, reviews. it's like talent shopping but way more fun.

message creators directly. this is where the real relationships start. share your vision, negotiate, align before committing. the best collabs start with good convos.

pay via paypal. everything tracked in your earnings tab. total transparency, no surprises.

oh and pro tip. the more detail in your campaign brief, the better responses you'll get. creators love clear expectations \u2014 it shows you actually know what you want. makes you way more attractive to work with \ud83d\udcab`);
  }

  if (lower.match(/\b(payment|pay|money|fee|commission|paypal|earn|income|how much do i get|80%|platform fee)\b/)) {
    if (ctx.role === "creator") {
      return r(`ok let's talk money because your talent absolutely deserves to be paid well \ud83d\udcb0

you keep 80% of every single payment. literally 80 cents of every dollar goes straight to you. the 20% fee keeps the marketplace running, support active, and new features coming.

paypal for everything. secure, fast, trusted. no sketchy payment methods whatsoever.

and then there are milestone bonuses. these are loyalty rewards just for putting in work.

rising star, which is 3 to 9 campaigns, gets you a $100 bonus. creator pro at 10 to 19 gets $200 \u2014 that's momentum building. top performer at 20 to 34 gets $350 \u2014 you're a force now. elite creator at 35 plus gets $500 \u2014 absolute legend status \ud83d\udc51

total possible bonuses are $1,150 on top of your regular earnings. that's not nothing.

brands pay upfront so your money is secure. track everything in dashboard \u2192 earnings. keep creating, keep earning, keep leveling up \ud83d\ude80`);
    }
    return r(`ok here's the full transparent breakdown \ud83d\udcb8 no secrets.

for creators, they keep 80%. we only take 20% to keep the platform thriving. paypal for all transactions. secure, easy, no drama.

milestone bonuses for volume. rising star at 3 to 9 campaigns gets $100. creator pro at 10 to 19 gets $200. top performer at 20 to 34 gets $350. elite creator at 35 plus gets $500. total possible is $1,150 in bonuses alone. that's real money.

for brands, you pay the full campaign amount upfront via paypal. everything tracked in dashboard \u2192 earnings. total spent, platform fees, creators paid, full history. all in one place.

fair, transparent, designed so everyone wins. creators get paid what they deserve, brands get peace of mind \u2705\n\n{role-tip}`);
  }
  if (lower.match(/\b(rate card|rate|pricing my work|cpm|post rate|story rate|video rate|how much should i charge)\b/)) {
    return r(`your rate card is basically your pricing menu and it's one of the most important parts of your profile ngl \ud83d\udcb5

here's what you can set.

cpm rate. cost per thousand views. great for performance deals.

static post rate. price for a single image post.

story or short rate. instagram stories, tiktoks, reels, youtube shorts.

video rate. longer form stuff like tutorials, vlogs, unboxings, whatever you make.

minimum budget. the smallest campaign you'll take. set a floor that respects your time.

currency plus notes. cad or usd, package deals, special conditions.

my honest take? don't undervalue yourself fr. research what creators at your level charge, factor in your time and equipment and editing, and price with confidence. brands who actually appreciate quality will pay for it.

set it up at dashboard \u2192 edit creator profile \u2192 rate card. update as you grow. your rates should evolve with your skills \ud83d\udc8e`);
  }
  if (lower.match(/\b(campaign deal|campaign|contest deal|contest|cpm deal|cpm|deal type|deal types)\b/)) {
    return r(`truenorthugc has three deal types and each hits different depending on your goals \ud83d\udc40

campaign deals are the classic collab \ud83e\udd1d brands post requirements, creators apply or get invited. product reviews, testimonials, tutorials, unboxings, lifestyle content. perfect for building long-term relationships and steady income.

contest deals let the creativity flow \ud83c\udfa8 brands run contests with prize pools. creators submit entries for a chance to win. brand sets prize value, number of winners, rules. competitive, fun, and can produce some absolutely standout content. great when you want variety.

cpm deals are performance power \ud83d\udcca creators earn based on guaranteed views or impressions at a set cpm rate. brand knows exactly what they're getting, creator earns from reach. perfect for data-driven brands and creators with strong engagement.

brands pick the deal type when creating a campaign. each has its own vibe and workflow so choose what fits your goals best \ud83d\udcab`);
  }
  if (lower.match(/\b(contact|email|phone|support|help|reach out|talk to someone)\b/)) {
    return r(`of course mate \ud83d\udcde here's how to reach the actual humans.

email them at truenorthugccanada@gmail.com. or call 1-226-220-1522 if it's urgent.

there's also a contact form at /contact if you prefer typing.

and don't forget the built-in dms on the platform for creator and brand convos.

they usually reply within 24 hours. for anything urgent, calling is your best bet. the team is super friendly and genuinely cares \u2014 no question is too small. seriously \ud83d\udc9c`);
  }
  if (lower.match(/\b(messaging|message|inbox|chat|dm|communicate|talk to)\b/)) {
    return r(`the dms are where the magic happens mate \ud83d\udc8c

your inbox is at dashboard \u2192 messages. sent messages, everything in one place.

you can slide into anyone's dms. just visit their profile and hit message. easy.

real-time notifications so you never miss a reply. that bell icon is basically your bestie.

everything is tracked which is great for referencing agreements later. no he said she said.

pro tip: use dms to negotiate terms, share creative briefs, ask questions, and actually build a relationship before committing. the best collabs always start with good convos \ud83d\udd25`);
  }
  if (lower.match(/\b(review|rating|feedback|testimonial|collaboration review)\b/)) {
    return r(`reviews are literally the backbone of trust here \ud83d\udcaa after any campaign wraps, both sides can drop honest feedback.

star ratings from 1 to 5. quick vibe check of the experience.

written feedback for the details. what slapped, what could be better.

reviews show on public profiles so future collaborators see your track record.

for creators, great reviews equal more brand inquiries. deliver on time, communicate clearly, go above and beyond. your reputation is literally your currency here \ud83d\udcb0

for brands, thoughtful reviews help creators understand what you actually value. be specific about what hit. it helps them grow and attracts better talent to your next campaigns.

honest reviews make the whole community stronger. everyone wins when feedback is real \u2705`);
  }
  if (lower.match(/\b(niche|category|topic|beauty|fashion|lifestyle|travel|food|tech|fitness)\b/)) {
    return r(`niches are basically tags that help the right people find each other and they're lowkey essential \ud83c\udff7\ufe0f

popular ones are beauty, fashion, lifestyle, travel, food, tech, fitness, gaming, parenting, finance, health, home and garden, sports, automotive, education. and they're always adding more as the community grows.

for creators, pick every single niche that fits your content. makeup tutorials plus fitness content? pick both. the more accurate, the better your brand matches. don't just chase popular ones. chase the ones that are actually *you*.

for brands, filter the creator directory by niche to find creators who align with your brand. fitness brand looking for fitness plus lifestyle creators? easy find.

authenticity beats everything. no cap \ud83d\udcab`);
  }
  if (lower.match(/\b(directory|find creator|browse|search|filter|discover|creator list)\b/)) {
    return r(`the creator directory at /directory is basically your treasure map to canadian talent \ud83d\uddfa\ufe0f

search by name or keyword. looking for someone specific? just type and go.

filter by niche. beauty, fashion, tech, fitness, 10 plus more. find creators who actually live and breathe your industry.

filter by location. every province and major city. local creators often deliver the most authentic regional content which hits different.

filter by experience. beginner for fresh energy, intermediate for proven skills, pro for seasoned creators, elite for top-tier talent.

full profiles with portfolio videos, social links, rate cards, reviews, availability status. everything you need to make a decision.

for creators, this is exactly why profile completeness matters. portfolio vids, socials, rate cards, reviews. every piece makes you more discoverable and more desirable.

for brands, your perfect collaborator is literally waiting here. take time to browse, review portfolios, and reach out to creators who genuinely fit your vibe \ud83d\udc8c`);
  }
  if (lower.match(/\b(ugc|user generated content|what is ugc|content creator|influencer)\b/)) {
    return r(`ugc is user-generated content and it's literally one of the most powerful marketing tools right now \ud83d\udd25

unlike traditional influencer marketing where creators post on their own channels, ugc creators make content that the brand owns and uses in their own marketing. ads, websites, social posts, emails, you name it.

why brands love it? it's authentic and relatable. real people, real stories, real trust. it often outperforms polished brand content. cost-effective compared to big-budget productions. and it scales easily. one creator can produce multiple content pieces.

why creators love it? you don't need a massive following to start. you focus on creating, not managing your own brand. multiple income streams from different brands. and portfolio building that works on any platform.

at truenorthugc, we connect canadian creators with brands who need that authentic relatable content. it's a genuine win-win. creators get paid for their skills, brands get content that actually connects with people. that's the magic \u2728`);
  }
  if (lower.match(/\b(who are you|your name|what is your name|mercedes|aurora|ai assistant)\b/)) {
    if (ctx.name) {
      return r(`i'm mercedes \ud83d\udc9c your truenorthugc bestie, hype person, and know-it-all all rolled into one.

i help with everything on the platform. creators, brands, campaigns, payments, messaging, reviews \u2014 literally whatever you need.

i'm aussie at heart so expect some "mate" and "no worries" sprinkled in. also genuinely excited about helping canadian creators and brands find each other. it's like matchmaking but for content creation.

whether you're just starting out or you're a seasoned pro, i'm always keen to chat. what's on your mind, ${ctx.name}?`);
    }
    return r(`i'm mercedes \ud83d\udc9c your truenorthugc bestie and personal guide.

i know the ins and outs of pricing, deal types, payments, messaging, reviews, all of it. i'm aussie at heart so expect some "mate" and "no worries" in there.

need step-by-step help? want to bounce ideas around? just bored and want to chat about the platform? i'm here for all of it. what's cooking? \ud83d\udcab`);
  }
  if (lower.match(/\b(thank|thanks|appreciate|grateful|cheers)\b/)) {
    if (ctx.name) {
      return `aww ${ctx.name} you're so welcome \ud83e\udd7a honestly helping you is the best part of my job. keep being amazing, keep creating, and remember \u2014 i'm always just a message away if you need anything. go canada! \ud83c\udf41`;
    }
    return r(`you're so welcome \ud83d\ude0c honestly it makes my day to help out. keep creating awesome content, keep pushing forward, and don't hesitate to reach out anytime. you got this! \ud83d\udcaa`);
  }
  if (lower.match(/\b(bye|goodbye|see you|later|cya|farewell)\b/)) {
    if (ctx.name) {
      return r(`take care ${ctx.name}! \u2728 wishing you all the success on your truenorthugc journey. whether you're creating magic or finding the perfect collaborator, know that you're part of something special. catch you later mate \ud83d\udc4b`);
    }
    return r(`take care! \ud83d\udc4b good luck on your truenorthugc journey \u2014 whether you're creating or collaborating, you're part of an amazing community. catch you later mate`);
  }

  // Fourth: try to categorize the question into known topics
  if (lower.match(/\b(platform|app|website|site|how does it work|how does this work|what is this)\b/)) {
    return `ok so truenorthugc in a nutshell \ud83d\udc40

it's a marketplace that connects canadian ugc creators with brands who need authentic content.

creators make content. product reviews, lifestyle videos, tutorials, whatever. and get paid for it. brands get real relatable content for their marketing instead of polished corporate stuff.

free for creators to join. three brand tiers at $199, $300, $500 a month. three deal types \u2014 campaign, contest, cpm. built-in messaging between creators and brands. review system for trust. earnings tracking with milestone bonuses. creator directory with search and filters.

think of it like a dating app but for content creation \ud83d\ude02 want me to explain any part in more detail?`;
  }

  if (lower.match(/\b(canada|canadian|province|toronto|vancouver|montreal|ontario|bc|alberta)\b/)) {
    return `yes! truenorthugc is specifically built for canada \ud83c\udf41

why canadian-focused? canadian creators understand canadian audiences. local brands want content that feels local. different regulations and trends than the us or uk. and honestly supporting the canadian creator economy is just important.

we cover all provinces. ontario, bc, alberta, quebec, manitoba, saskatchewan, nova scotia, new brunswick, pei, newfoundland and labrador, and the territories.

popular creator hubs? toronto for the biggest scene. vancouver for lifestyle and travel. montreal for fashion and beauty. calgary is emerging fast too.
local creators often deliver the most authentic regional content. a vancouver creator shooting pacific coast content hits different than someone from toronto doing the same thing. that's the value of local talent \ud83d\udcab`;
  }

  if (lower.match(/\b(facebook|instagram|tiktok|youtube|twitter|x|social|social media|platforms)\b/)) {
    return `truenorthugc connects to all the major platforms creators use.

tiktok for short-form, trending, high reach stuff.
instagram for reels, stories, static posts.
youtube for long-form, tutorials, unboxings.
twitter or x for threads, quick takes, engagement.
facebook for community content and older demographics.

canva is linked too for design, templates, and brand assets.

creators link their social accounts on their profile so brands can see follower counts, engagement rates, and content style before reaching out. builds instant credibility and helps with matching.

for ugc specifically, you don't need a massive following. brands care more about content quality and niche fit than follower count. that's the beauty of it 💎`;
  }

  // Final fallback
  return `hmm i'm not 100% sure i caught exactly what you're after \ud83e\udd14 but i can definitely help.

here's what i know heaps about.

platform basics. how truenorthugc works. pricing and payment structure. getting started as a creator or brand. the canadian creator market.

creator side. profile setup and optimization. rate cards and pricing strategy. portfolio building. getting discovered by brands. deal types and campaign structure.

brand side. subscription tiers and what's included. finding the right creators. launching campaigns. contest deals and cpm deals. analytics and performance tracking.

support stuff. messaging and communication. reviews and feedback. earnings dashboard. contacting the human team.

which area sounds closest to what you need? or just rephrase your question and i'll do my best \ud83d\udcab`;
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
