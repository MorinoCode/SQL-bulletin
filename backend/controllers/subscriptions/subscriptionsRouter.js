
import express from 'express'


import fetchSubscriptionsMiddleware from '../../middlewares/subscriptions/fetchSubscriptionsMiddleware.js'
import addSubscriptionMiddleware from '../../middlewares/subscriptions/addSubscriptionMiddleware .js'
import unsubscribeMiddleware from '../../middlewares/subscriptions/unsubscribeMiddleware.js'

const router = express.Router()

//hämta alla subscriptions
router.get('/' , fetchSubscriptionsMiddleware)

//skapa en ny subscription
router.post('/subscribe/:channel_id' , addSubscriptionMiddleware )

//avsluta prenumerationen
router.delete('/unsubscribe/:channel_id' , unsubscribeMiddleware )



export default router