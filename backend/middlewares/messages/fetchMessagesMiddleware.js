import db from '../../configs/db.js';

const fetchMessagesMiddleware = async (req, res, next) => {

  const fetchOrder = req.query.order === 'asc' ? 'ASC' : 'DESC'; 

  try {
    const result = await db.query(`
      SELECT * FROM messages
      ORDER BY created_at ${fetchOrder}  
    `);

    if (result.rows.length === 0) { 
      return res.status(404).json({ message: 'Inga meddelanden hittades' }); 
    }

    res.status(200).json(result.rows); 

  } catch (err) {
    next(err);
  }
};

export default fetchMessagesMiddleware;
