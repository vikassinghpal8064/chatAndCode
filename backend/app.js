// need to update the cors origin later -------------
const express= require("express");
const mongoose= require("mongoose");
const methodOverride = require("method-override");
const cors= require("cors")
const app = express();
const fs = require('fs');
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
const file =require("./controllers/fileSystem/file");
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

app.options('*', cors()); // Enable preflight requests for all routes

// Middleware to set headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', process.env.ALLOWED_URL);
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
// app.use(express.static(path.join(__dirname, '../frontend/build')));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));

// const uploadDir = path.join(__dirname, 'controllers/sockets/assets'); 
// app.use('/assets', express.static(uploadDir));
// Use /tmp directory for serverless environment
const uploadDir = path.join('/tmp', 'assets');
app.use('/assets', express.static(uploadDir));

// Ensure the directory exists
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

app.use(cookieParser());
app.use(chatMessages);
app.use(auth);
app.use(profile);
app.use(post);
app.use(friendRequest);
app.use(file);
chat(server);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

server.listen(process.env.PORT,()=>{
    console.log("server connected to port");
})