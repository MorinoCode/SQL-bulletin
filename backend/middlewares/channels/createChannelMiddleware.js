import channelsValidator from "../../validator/channelValidator.js";
import db from "../../configs/db.js";

const createChannelMiddleware = async (req, res, next) => {
  const { name } = req.body;
  const { user_id } = req.params;

  try {
    if (!name || !user_id) {
      return res
        .status(400)
        .json({ message: "namn och användarens id är obligatorisk" });
    }

    const isNameUserIdValid = await channelsValidator({ name, user_id });
    if (isNameUserIdValid != true) {
      return res.status(400).json(isNameUserIdValid);
    }

    const isUserExist = await db.query(
      "SELECT id FROM users WHERE id = $1 ",
      [user_id]
    );
    
    if (isUserExist.rows.length == 0) {
      return res
        .status(400)
        .json({ message: " Detta användar id finns inte i DB" });
    }

    const isChannelExist = await db.query(
      "SELECT name FROM channels where name = $1 ",
      [name]
    );
   
    if (isChannelExist.rows.length != 0) {
      return res
        .status(400)
        .json({ message: " Detta kanal namn finns redan i DB" });
    }

    const newChannel = await db.query(
      "INSERT INTO channels (name , user_id) VALUES( $1 , $2 ) RETURNING * ",
      [name, user_id]
    );
    const createdChannel = newChannel.rows[0];

    res.status(201).json({ message: "Ny kanal skapade", createdChannel });
  } catch (err) {
    next(err);
  }
};

export default createChannelMiddleware;
