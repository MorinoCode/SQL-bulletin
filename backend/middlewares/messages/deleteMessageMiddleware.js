import db from "../../configs/db.js";

const deleteMessageMiddleware = async (req, res, next) => {
  const { message_id } = req.params;  // Hämta meddelande-id från URL-parametrarna

  try {
    // Kontrollera om meddelande-id finns med i förfrågan
    if (!message_id) {
      return res.status(400).json({ message: "Meddelande-id krävs för att ta bort ett meddelande." });
    }

    // Kolla om meddelandet finns i databasen
    const isMessageExist = await db.query(
      "SELECT * FROM messages WHERE id = $1",  // Sök meddelandet i messages-tabellen
      [message_id]
    );

    // Om meddelandet inte finns, returnera ett 404-fel
    if (isMessageExist.rows.length === 0) {
      return res.status(404).json({ message: "Meddelandet hittades inte." });  // Meddelandet hittades inte
    }

    // Radera meddelandet från databasen
    const result = await db.query(
      "DELETE FROM messages WHERE id = $1 RETURNING *",  // Utför raderingen
      [message_id]
    );

    // Om inget meddelande raderades, returnera ett 500-fel
    if (result.rows.length === 0) {
      return res.status(500).json({ message: "Det gick inte att radera meddelandet." });  // Raderingen misslyckades
    }

    const deletedMessage = result.rows[0];  // Hämta det raderade meddelandet

    // Skicka tillbaka svar med status 200 och det raderade meddelandet
    res.status(200).json({ message: "Meddelandet togs bort.", deletedMessage });
    
  } catch (err) {
    // Om något går fel, skicka vidare felet till nästa middleware
    next(err);
  }
};

export default deleteMessageMiddleware;
