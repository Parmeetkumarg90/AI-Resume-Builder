import { io } from "socket.io-client";
import env from "./env";

const socket = io(env.VITE_BACKEND_URL);

export default socket;