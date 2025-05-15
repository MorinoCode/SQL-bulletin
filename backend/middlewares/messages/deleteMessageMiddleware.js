import db from "../../configs/db.js";

const deleteMessageMiddleware = async (req, res, next) => {
  const { message_id } = req.params;

  if (!message_id) {
    return res.status(400).json({ message: "Meddelande-id krävs för att ta bort ett meddelande." });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // Kontrollera om meddelandet finns
    const isMessageExist = await client.query("SELECT * FROM messages WHERE id = $1", [message_id]);

    if (isMessageExist.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Meddelandet hittades inte." });
    }

    // Radera kopplingar i message_channels först
    await client.query("DELETE FROM message_channels WHERE message_id = $1", [message_id]);

    // Radera själva meddelandet
    const result = await client.query("DELETE FROM messages WHERE id = $1 RETURNING *", [message_id]);

    if (result.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(500).json({ message: "Det gick inte att radera meddelandet." });
    }

    await client.query("COMMIT");

    res.status(200).json({ message: "Meddelandet togs bort.", deletedMessage: result.rows[0] });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

export default deleteMessageMiddleware;
