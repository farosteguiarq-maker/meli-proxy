api/meli.js
export default async function handler(req, res) {
  try {
    const url = req.query.url;

    if (!url) {
      res.statusCode = 400;
      res.end("Missing url parameter");
      return;
    }

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json"
      }
    });

    const text = await response.text();

    res.statusCode = response.status;
    res.end(text);

  } catch (err) {
    res.statusCode = 500;
    res.end("Server error: " + err.message);
  }
}
