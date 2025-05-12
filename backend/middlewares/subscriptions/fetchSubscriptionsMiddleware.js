import db from "../../configs/db.js";

// Middleware för att hämta alla subscriptions från databasen
const fetchSubscriptionsMiddleware = async (req, res, next) => {
  try {
    // Kör en SQL-fråga för att hämta alla rader från subscriptions-tabellen
    const result = await db.query(`
  SELECT 
    subscriptions.id, 
    users.name AS userName, 
    channels.name AS channelName,
    channels.id AS channel_id  -- <=== lägg till detta
  FROM subscriptions
  JOIN users ON subscriptions.user_id = users.id
  JOIN channels ON subscriptions.channel_id = channels.id
`);

    // Om det inte finns några subscriptions i databasen
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Det finns inga subscriptions" });
    }

    // Skicka tillbaka listan av subscriptions som JSON med status 200
    return res.status(200).json(result.rows);
  } catch (err) {
    // Logga felet för felsökning (valfritt, men bra vid utveckling)
    console.error("Fel vid hämtning av subscriptions:", err);

    // Vid fel, skicka vidare till global felhantering
    next(err);
  }
};

export default fetchSubscriptionsMiddleware;
