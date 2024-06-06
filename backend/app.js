const express= require("express");
const mongoose= require("mongoose");
const methodOverride = require("method-override");
const cors= require("cors")
const app = express();
const signupUser=require("./controllers/signupUser");
const login=require("./controllers/login");
const post= require("./controllers/post");
const friendRequest= require("./controllers/friendRequest");
const chatMessages= require("./controllers/sockets/chatMessages")
const cookieParser = require("cookie-parser");
const {chat} = require("./controllers/sockets/chatting");
const {Server}= require("socket.io");
const http = require('http');
const server = http.createServer(app);
const file =require("./controllers/fileSystem/file")
const dotenv = require('dotenv').config();






async function main() {
    await mongoose.connect(process.env.MONGODB_URL);
     }
main().then(()=>{
    console.log(`mongo db connected`)
})
.catch((err)=>{
    console.log(`error in mongodb connection ${err}`)
});
app.use(cors({
    origin:[process.env.ALLOWED_URL],
    credentials:true,
}))
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));


app.use(cookieParser());
app.use(signupUser);
app.use(login);
app.use(post);
app.use(friendRequest);
app.use(chatMessages);
app.use(file);
chat(server);


server.listen(process.env.PORT,()=>{
    console.log("server connected to port");
})