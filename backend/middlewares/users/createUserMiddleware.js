import db from '../../configs/db.js'
import userValidator from '../../validator/userValidator.js'
import bcrypt from 'bcrypt'

// Middleware för att skapa en ny användare
const createUserMiddleware = async (req, res, next) => {
  // Hämta användarnamn och lösenord från förfrågan
  const { name, password } = req.body

  // Kontrollera att både namn och lösenord har skickats med
  if (!name || !password) {
    return res.status(400).json({ message: 'Namn och lösenord är obligatoriska' })
  }

  try {
    // Validera användardata (t.ex. längd, teckenkrav etc.)
    const isValidUser = await userValidator({ name, password })

    // Om valideringen inte är godkänd, skicka felmeddelande
    if (isValidUser !== true) {
      return res.status(400).json(isValidUser)
    }

    // Kontrollera om användarnamnet redan finns i databasen
    const isUserExist = await db.query("SELECT name FROM users WHERE name = $1", [name])

    // Om användaren redan finns, stoppa och skicka felmeddelande
    if (isUserExist.rows.length !== 0) {
      return res.status(400).json({ message: 'Användaren är redan registrerad' })
    }

    // Hasha lösenordet innan det sparas i databasen
    const hashedPassword = await bcrypt.hash(password, 10)

    // Spara den nya användaren i databasen
    const newUser = await db.query(
      "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING *",
      [name, hashedPassword]
    )

    // Skicka tillbaka den nya användaren som svar
    res.status(201).json(newUser.rows[0])
  } catch (err) {
    // Vid fel, skicka vidare till felhantering
    next(err)
  }
}

export default createUserMiddleware
