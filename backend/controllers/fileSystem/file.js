const fs = require('fs');
const path = require("path");

let assetPath=path.join(__dirname,"/asset/resorce.txt");

try{
    
    fs.readFile(assetPath, 'utf8', (err, data) => {
        if (err) throw err;
        console.log(data);
    });
}catch(err){
    console.log(err);
}
let s="";
  for(let i=0;i<1000;i++){
    s+=i;
  }
  console.log(s);



