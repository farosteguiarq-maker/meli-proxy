export default async function handler(req, res) {
  try {
    // CORS (para que Apps Script / navegador pueda leer)
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");

    if (req.method === "OPTIONS") return res.status(200).end();

    const fullUrl = new URL(req.url, `https://${req.headers.host}`);
    const target = fullUrl.searchParams.get("url");

    if (!target) {
      return res.status(400).json({ error: "Missing url parameter. Use ?url=https%3A%2F%2F..." });
    }

    const targetUrl = new URL(target);

    // Seguridad: evitamos que sea un “open proxy”
    const allowedHosts = new Set(["api.mercadolibre.com", "httpbin.org"]);
    if (!allowedHosts.has(targetUrl.hostname)) {
      return res.status(403).json({ error: "Host not allowed", host: targetUrl.hostname });
    }

    const r = await fetch(targetUrl.toString(), {
      method: "GET",
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
        "Accept-Language": "es-AR,es;q=0.9,en;q=0.8",
      },
    });

    const text = await r.text();

    res.status(r.status);
    // Intentamos devolver JSON si lo es
    try {
      return res.json(JSON.parse(text));
    } catch {
      return res.send(text);
    }
  } catch (e) {
    return res.status(500).json({ error: String(e?.message || e) });
  }
}
