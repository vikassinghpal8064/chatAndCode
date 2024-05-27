
function generateId(id1,id2){
    const id= String(id1)+String(id2);
    const arr=[...id];
    const newArr=arr.sort();
    let s="";
    for(let item in newArr){
        if(item!=','){

            s+=item;
        }
    }
  return s;
}

exports={generateId}