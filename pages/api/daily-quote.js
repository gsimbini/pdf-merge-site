// pages/api/daily-quote.js
export default async function handler(req, res) {
  try {
    const response = await fetch('https://zenquotes.io/api/today');
    if (!response.ok) throw new Error('Failed to fetch quote');

    const data = await response.json();

    if (Array.isArray(data) && data[0]?.q) {
      res.status(200).json(data[0]);
    } else {
      res.status(200).json({
        q: "Keep going — every small step counts.",
        a: "SimbaPDF"
      });
    }
  } catch (error) {
    console.error(error);
    res.status(200).json({
      q: "Success is built one PDF at a time.",
      a: "SimbaPDF"
    });
  }
}