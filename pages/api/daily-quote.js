// pages/api/daily-quote.js

export default async function handler(req, res) {
  // Prevent CDN/browser caching so it can change daily on the live site
  res.setHeader(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");

  try {
    // Add a daily cache-buster to avoid upstream caching issues
    const today = new Date().toISOString().slice(0, 10); // YYYY-MM-DD
    const url = `https://zenquotes.io/api/today?d=${today}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Accept: "application/json",
        // Optional but helpful for some providers
        "User-Agent": "SimbaPDF/1.0",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch quote: ${response.status}`);
    }

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.q) {
      return res.status(200).json({
        ...data[0],
        source: "zenquotes",
        day: today,
      });
    }

    return res.status(200).json({
      q: "Keep going — every small step counts.",
      a: "SimbaPDF",
      source: "fallback-shape",
      day: today,
    });
  } catch (error) {
    console.error("daily-quote error:", error);

    const today = new Date().toISOString().slice(0, 10);

    return res.status(200).json({
      q: "Success is built one PDF at a time.",
      a: "SimbaPDF",
      source: "fallback-error",
      day: today,
    });
  }
}
