const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const obj2gltf = require("obj2gltf");
const fs = require("fs");
  
// let rName = (new Date()).toDateString;
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        
        cb(null, 'uploads/');
    },
  
    filename: function(req, file, cb) {
        cb(null, (file.originalname));
    }
});
  
var upload = multer({ storage: storage })
  
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
  
app.post('/', upload.array('files'), (req, res) => {
//    console.log(req.files);
var filenames = req.files.filter(function (file) {
    var ext = path.extname(file.filename);

    if(ext == '.obj') {
        // console.log(file.filename);
        // res.send(file.filename)
        return file.filename;
        // res.send(gltfConverter());
      
      }





    // return path.extname((file.filename == '.obj')? file.filename : null );
})

// console.log(filenames);


// var name = filenames.split('.').slice(0, -1).join('.');
// console.log('name');
// var Oname = filenames.toString();
// var output = path.parse(Oname).name;
// console.log(output.toString);

// function gltfConverter() {
  // for(var i=0; i<filenames.length;i++){
  //   console.log(filenames[i].filename);
  // }
  let len = filenames.length;
  // console.log(len);

  for(let i=0; i<len;i++){
    // console.log(i);
  

  let name = path.parse(filenames[i].filename).name;
  // console.log(name);
  let data;
  
obj2gltf(`./uploads/${filenames[i].filename}`).then(function (gltf) {

  data = Buffer.from(JSON.stringify(gltf));
  // console.log(`above the file ${i}`);
  fs.writeFileSync(`./uploads/${name}.gltf`, data);
  // res.send(JSON.stringify(data));
// console.log(data);
res.redirect(filenames,'/download');
// res.send("<h1>sent</h1>")
  // console.log(`below the file ${i}`)
});

}
  
// return data;
// }
    // res.redirect('/');
  // res.send(JSON.stringify(data));
  // console.log(data);
});

// app.get('/download',(req,res)=>{
//   fs.readFileSync(`./uploads/${name}.gltf`)
// })
  
app.get('/download', function(req, res){
  // Set disposition and send it.
  const file = `${__dirname}/uploads/${filenames.filename}.gltf`;

res.download(file);
});

app.listen(3000);