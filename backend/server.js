import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import usersRouter from './controllers/users/userRouter.js'
import channelsRouter from './controllers/channels/channelsRouter.js'
import subscriptionsRouter from './controllers/subscriptions/subscriptionsRouter.js'
import messageRouter from './controllers/messages/messagesRouter.js'
import errorHandlerMiddleware from "../../../Node.js/Swing notes API/backend/middleware/errorHandlerMiddleware.js";

dotenv.config();

const port = process.env.PORT || 8090;

const app = express();
app.use(express.json())

// Tillåt alla domäner (för utveckling)
app.use(cors());

// Routes

// Users Router
app.use('/users' , usersRouter)

//channels Router
app.use('/channels' , channelsRouter)

//subscriptions Router
app.use('/subscriptions',subscriptionsRouter)

//messages Router
app.use('/messages',messageRouter)


// Global error handler
app.use(errorHandlerMiddleware);

app.listen(port, () => {
  console.log(`✅ connected to the port${port}`);
});
