const express= require("express");
const mongoose= require("mongoose");
const methodOverride = require("method-override");
const cors= require("cors")
const app = express();
const auth = require("./controllers/auth");
const profile = require("./controllers/profile");
const post= require("./controllers/post");
const friendRequest= require("./controllers/friendRequest");
const chatMessages= require("./controllers/sockets/chatMessages");
const cookieParser = require("cookie-parser");
const {chat} = require("./controllers/sockets/chatting");
const {Server}= require("socket.io");
const http = require('http');
const server = http.createServer(app);
const file =require("./controllers/fileSystem/file")
const dotenv = require('dotenv').config();
const path = require("path")





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

app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

const uploadDir = path.join(__dirname, 'controllers/sockets/assets'); 
console.log(uploadDir)
app.use('/assets', express.static(uploadDir));

app.use(cookieParser());
app.use(chatMessages);
app.use(auth);
app.use(profile);
app.use(post);
app.use(friendRequest);

app.use(file);
chat(server);

server.listen(process.env.PORT,()=>{
    console.log("server connected to port");
})