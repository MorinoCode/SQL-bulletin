import db from '../../configs/db.js';
import unsubscriptionValidator from '../../validator/subscriptionValidator.js';

const unsubscribeMiddleware = async (req, res, next) => {
  const { user_id } = req.body;
  const { channel_id } = req.params;

  if (!channel_id || !user_id) {
    return res.status(400).json({
      message: "Kanalens ID och användarens ID är obligatoriska."
    });
  }

  try {
    // Validera att detta är en giltig prenumeration att ta bort
    const isUnsubscriptionValid = await unsubscriptionValidator({ channel_id, user_id });
    if (isUnsubscriptionValid !== true) {
      return res.status(400).json(isUnsubscriptionValid);
    }

    // Ta bort prenumerationen
    const result = await db.query(
      "DELETE FROM subscriptions WHERE channel_id = $1 AND user_id = $2 RETURNING *",
      [channel_id, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Prenumerationen hittades inte." });
    }

    res.status(200).json({
      message: "Prenumerationen har tagits bort.",
      prenumeration: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
};

export default unsubscribeMiddleware;
