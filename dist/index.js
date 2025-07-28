"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.io = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_route_1 = __importDefault(require("./src/api/routes/user_route"));
const auth_middleware_1 = require("./src/api/middlewares/auth_middleware");
const auth_service_1 = require("./src/core/infrastructure/service/auth_service");
const socket_io_1 = require("socket.io");
const http_1 = require("http");
const websocket_service_1 = require("./src/core/infrastructure/service/websocket.service");
const message_logic_implementation_1 = require("./src/core/usecase/logic/message_logic_implementation");
const programs_1 = require("./src/api/programs");
const load_chat_route_1 = __importDefault(require("./src/api/routes/load_chat_route"));
const app = (0, express_1.default)();
const httpServer = (0, http_1.createServer)(app);
exports.io = new socket_io_1.Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
});
const port = process.env.port;
dotenv_1.default.config();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
let aunthentication = new auth_service_1.AuthService();
let webSocket = new websocket_service_1.WebSocketService(exports.io, programs_1.auth, programs_1.messageDb, programs_1.userDb);
let messagelogic = new message_logic_implementation_1.MessageLogic(programs_1.messageDb, webSocket, programs_1.userDb);
// socket receiver on
messagelogic.setup();
let authmiddleware = new auth_middleware_1.AuthMiddleware(programs_1.auth);
app.use("/user", user_route_1.default);
app.use("/loadChat", load_chat_route_1.default);
app.get('/', authmiddleware.authenticateJWT, (req, res) => {
    res.send('Congrats you just passed the Auth middleware test');
});
httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
