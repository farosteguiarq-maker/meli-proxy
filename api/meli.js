export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing url parameter" });
  }

  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const data = await response.text();

    res.status(response.status).send(data);

  } catch (error) {
    res.status(500).json({ error: "Fetch failed", detail: error.message });
  }
}
