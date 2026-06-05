import type { Express } from "express";
import { storage } from "./storage";

export function registerSEORoutes(app: Express) {
  // Dynamic sitemap.xml
  app.get("/sitemap.xml", async (req, res) => {
    try {
      const baseUrl = "https://www.truenorthugc.com";
      const today = new Date().toISOString().split("T")[0];

      // Static pages
      const staticUrls = [
        { url: "/", priority: "1.0", changefreq: "weekly" },
        { url: "/creators", priority: "0.9", changefreq: "daily" },
        { url: "/campaigns", priority: "0.9", changefreq: "daily" },
        { url: "/brands", priority: "0.8", changefreq: "daily" },
        { url: "/pricing", priority: "0.8", changefreq: "monthly" },
        { url: "/contact", priority: "0.7", changefreq: "monthly" },
        { url: "/launch", priority: "0.6", changefreq: "monthly" },
      ];

      // Programmatic SEO pages
      const cities = ["toronto", "vancouver", "montreal", "calgary", "edmonton", "ottawa", "winnipeg"];
      const niches = ["fitness", "beauty", "tech", "travel", "food", "fashion", "lifestyle", "gaming"];
      const programmaticUrls = [
        ...cities.map((city) => ({
          url: `/city/${city}`,
          priority: "0.7",
          changefreq: "weekly",
        })),
        ...niches.map((niche) => ({
          url: `/niche/${niche}`,
          priority: "0.7",
          changefreq: "weekly",
        })),
      ];

      // Creator profiles
      const creators = await storage.getCreators();
      const creatorUrls = creators.map((c) => ({
        url: `/creators/${c.handle}`,
        priority: "0.6",
        changefreq: "weekly",
      }));

      // Brand profiles
      const brands = await storage.getBrands();
      const brandUrls = brands.map((b) => ({
        url: `/brands/${b.id}`,
        priority: "0.6",
        changefreq: "weekly",
      }));

      const allUrls = [...staticUrls, ...programmaticUrls, ...creatorUrls, ...brandUrls];

      const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${baseUrl}${u.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>`;

      res.setHeader("Content-Type", "application/xml");
      res.send(xml);
    } catch (error) {
      console.error("[sitemap] Error generating sitemap:", error);
      res.status(500).send("Error generating sitemap");
    }
  });

  // Programmatic SEO landing pages data endpoint
  app.get("/api/seo-data/:slug", async (req, res) => {
    const slug = req.params.slug;

    const cityData: Record<string, { name: string; province: string; population: string; description: string }> = {
      toronto: { name: "Toronto", province: "Ontario", population: "6.2M", description: "Canada's largest city and hub for content creators, influencers, and digital marketing." },
      vancouver: { name: "Vancouver", province: "British Columbia", population: "2.6M", description: "West Coast creative hub with thriving film, lifestyle, and tech creator communities." },
      montreal: { name: "Montreal", province: "Quebec", population: "4.3M", description: "Bilingual creative capital with unique fashion, food, and arts scene." },
      calgary: { name: "Calgary", province: "Alberta", population: "1.6M", description: "Growing creator economy in fitness, outdoor, and Western lifestyle content." },
      edmonton: { name: "Edmonton", province: "Alberta", population: "1.1M", description: "Emerging tech and gaming creator hub with strong community support." },
      ottawa: { name: "Ottawa", province: "Ontario", population: "1.4M", description: "Government and tech-adjacent creators with strong lifestyle content." },
      winnipeg: { name: "Winnipeg", province: "Manitoba", population: "0.8M", description: "Up-and-coming creator scene with affordable living costs." },
    };

    const nicheData: Record<string, { name: string; description: string; keywords: string[] }> = {
      fitness: { name: "Fitness", description: "Workout, wellness, and healthy lifestyle content creators.", keywords: ["gym", "workout", "wellness", "health"] },
      beauty: { name: "Beauty", description: "Makeup, skincare, and fashion content creators.", keywords: ["makeup", "skincare", "cosmetics", "fashion"] },
      tech: { name: "Tech", description: "Technology reviews, tutorials, and gadget content creators.", keywords: ["gadgets", "reviews", "tutorials", "apps"] },
      travel: { name: "Travel", description: "Travel, adventure, and destination content creators.", keywords: ["adventure", "destinations", "hotels", "explore"] },
      food: { name: "Food", description: "Food, cooking, and restaurant review content creators.", keywords: ["cooking", "recipes", "restaurants", "foodie"] },
      fashion: { name: "Fashion", description: "Style, clothing, and trend content creators.", keywords: ["style", "clothing", "outfits", "trends"] },
      lifestyle: { name: "Lifestyle", description: "General lifestyle, vlog, and day-in-the-life content creators.", keywords: ["vlog", "day-in-life", "home", "routine"] },
      gaming: { name: "Gaming", description: "Gaming, esports, and streamer content creators.", keywords: ["esports", "streaming", "gameplay", "reviews"] },
    };

    if (cityData[slug]) {
      return res.json({
        type: "city",
        ...cityData[slug],
        slug,
      });
    }

    if (nicheData[slug]) {
      return res.json({
        type: "niche",
        ...nicheData[slug],
        slug,
      });
    }

    res.status(404).json({ message: "SEO page not found" });
  });
}
