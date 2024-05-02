const express= require("express");
const mongoose= require("mongoose");
const methodOverride = require("method-override");
const cors= require("cors")
const app = express();
const signupUser=require("./controllers/signupUser");
const login=require("./controllers/login");
const post= require("./controllers/post");
const friendRequest= require("./controllers/friendRequest")
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/friendsbook');
     }
main().then(()=>{
    console.log(`mongo db connected`)
})
.catch((err)=>{
    console.log(`error in mongodb connection ${err}`)
});
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.use(cors({
    origin:["http://localhost:5173"]
}))
app.use("/me",(req,res)=>{
    console.log("hii it me")
    res.send("<h1>hii its me</h1>")
})
app.use(signupUser);
app.use(login);
app.use(post);
app.use(friendRequest);



let PORT=8080;
app.listen(PORT,()=>{
    console.log(`i am listening at ${PORT}`)
})