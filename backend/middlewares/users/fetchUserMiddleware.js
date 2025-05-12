import db from "../../configs/db.js";

// Middleware för att hämta alla registrerade användare
const fetchUsersMiddleware = async (req, res, next) => {
  try {
    // Hämta alla användare från databasen
    const result = await db.query("SELECT * FROM users");

    // Om inga användare finns, skicka ett tydligt meddelande
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Det finns inga registrerade användare." });
    }

    // Skicka tillbaka listan av användare som JSON
    return res.status(200).json(result.rows);
  } catch (err) {
    // Vid fel, skicka vidare till global felhantering
    next(err);
  }
};

export default fetchUsersMiddleware;
