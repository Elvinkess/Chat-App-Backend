import  express from "express"
import  cors from "cors"
import dotenv from 'dotenv';
import userRoute from "./src/api/routes/user_route";
import { AuthMiddleware } from "./src/api/middlewares/auth_middleware";
import { AuthService } from "./src/core/infrastructure/service/auth_service";
import { IAuthService } from "./src/core/usecase/interface/services/auth_service";
import { Server } from "socket.io";
import { createServer } from "http";
import { WebSocketService } from "./src/core/infrastructure/service/websocket.service";
import { MessageLogic } from "./src/core/usecase/logic/message_logic_implementation";
import { auth, messageDb, userDb} from "./src/api/programs";
import { IMessageLogic } from "./src/core/usecase/interface/logic/message_logic";
import loadChatRoute from "./src/api/routes/load_chat_route";


const app = express();
const httpServer = createServer(app);
export const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]

  },
});


const port = process.env.port;
dotenv.config();

app.use(express.json());
app.use(cors());
let aunthentication:IAuthService = new AuthService()
let webSocket = new WebSocketService(io,auth,messageDb,userDb);
let messagelogic :IMessageLogic = new MessageLogic(messageDb,webSocket,userDb);
// socket receiver on
messagelogic.setup()




let authmiddleware  = new AuthMiddleware(auth)
app.use("/user", userRoute)
app.use("/loadChat", loadChatRoute)

app.get('/',authmiddleware.authenticateJWT, (req, res) => {
  res.send('Congrats you just passed the Auth middleware test');

});


  

httpServer.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

