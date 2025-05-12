import userValidator from "../../validator/userValidator.js";
import db from "../../configs/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const loginUserMiddleware = async (req, res, next) => {
  try {
    // hämta user från req.body
    const { name, password } = req.body;

    // kontrollera om user giltig
    const isUserValid = await userValidator({ name, password });

    if (isUserValid !== true) {
      return res.status(400).json({ isUserValid });
    }

    // kontrollera om user finns i DB
    const isUserExist = await db.query(
      " SELECT * FROM users WHERE name = $1 ",
      [name]
    );

    if (isUserExist.rows.length == 0) {
      return res.status(404).json({ message: "Användare finns inte" });
    }

    // Jämför password
    const isPasswordValid = await bcrypt.compare(
      password,
      isUserExist.rows[0].password
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Password stämmer inte!" });
    }
    //skapa en token
    const token = jwt.sign(
      {
        id: isUserExist.rows[0].id,
        name: isUserExist.rows[0].password,
        is_admin: isUserExist.rows[0].is_admin,
      },
      process.env.SECRET_KEY,
      {
        expiresIn: "50m",
      }
    );

    res
      .status(200)
      .json({ name, password, userId: isUserExist.rows[0].id, token });
  } catch (err) {
    //skicka error vidare till errhandling middleware
    next(err);
  }
};

export default loginUserMiddleware;
