import db from '../../configs/db.js';
import subscriptionValidator from '../../validator/subscriptionValidator.js';

const addSubscriptionMiddleware = async (req, res, next) => {
  const { user_id } = req.body;
  const { channel_id } = req.params;

  if (!channel_id || !user_id) {
    return res
      .status(400)
      .json({ message: "Kanalens ID och användarens ID är obligatoriska." });
  }

  const client = await db.connect();

  try {
    await client.query('BEGIN');

    const isSubscriptionValid = await subscriptionValidator({ channel_id, user_id });
    if (isSubscriptionValid !== true) {
      await client.query('ROLLBACK');
      return res.status(400).json(isSubscriptionValid);
    }

    const isUserExist = await client.query("SELECT id FROM users WHERE id = $1", [user_id]);
    if (isUserExist.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Detta användar-ID finns inte i databasen." });
    }

    const isChannelExist = await client.query("SELECT id FROM channels WHERE id = $1", [channel_id]);
    if (isChannelExist.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(400).json({ message: "Detta kanal-ID finns inte i databasen." });
    }

    const newSubscription = await client.query(
      "INSERT INTO subscriptions (channel_id, user_id) VALUES ($1, $2) RETURNING *",
      [channel_id, user_id]
    );

    await client.query('COMMIT');

    return res.status(201).json({
      message: "Ny prenumeration skapades.",
      subscription: newSubscription.rows[0]
    });
  } catch (err) {
    await client.query('ROLLBACK');
    next(err);
  } finally {
    client.release();
  }
};

export default addSubscriptionMiddleware;
