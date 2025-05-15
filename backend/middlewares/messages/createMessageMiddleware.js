import db from "../../configs/db.js";

const createMessageMiddleware = async (req, res, next) => {
  const { user_id, content, channel_ids } = req.body;

  if (!user_id || !content || !Array.isArray(channel_ids) || channel_ids.length === 0) {
    return res.status(400).json({ message: "user_id, content och minst en channel_id krävs." });
  }

  const client = await db.connect();

  try {
    await client.query("BEGIN");

    // 1. Skapa meddelandet
    const newMessage = await client.query(
      "INSERT INTO messages (user_id, content, created_at) VALUES ($1, $2, NOW()) RETURNING *",
      [user_id, content]
    );
    const message = newMessage.rows[0];

    // 2. Koppla till flera kanaler
    for (const channel_id of channel_ids) {
      await client.query(
        "INSERT INTO message_channels (message_id, channel_id, created_at) VALUES ($1, $2, NOW())",
        [message.id, channel_id]
      );
    }

    await client.query("COMMIT");

    res.status(201).json({
      message: "Meddelandet skapades och kopplades till kanaler.",
      data: message,
      channels: channel_ids,
    });
  } catch (err) {
    await client.query("ROLLBACK");
    next(err);
  } finally {
    client.release();
  }
};

export default createMessageMiddleware;
