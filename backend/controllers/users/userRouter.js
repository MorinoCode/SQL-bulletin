import express from 'express'

import fetchUserMiddleware from '../../middlewares/users/fetchUserMiddleware.js'
import createUserMiddleware from '../../middlewares/users/createUserMiddleware.js'
import deleteUserMiddleware from '../../middlewares/users/deleteUserMiddleware.js'
import loginUserMiddleware from '../../middlewares/users/loginUserMiddleware.js'

const router = express.Router()

//hämta alla users
router.get('/' , fetchUserMiddleware)

// skapa en ny user
router.post('/create-user' , createUserMiddleware)

// logga in 
router.post('/login' , loginUserMiddleware)


//delete en user
router.delete('/delete-user/:userId', deleteUserMiddleware)

export default router