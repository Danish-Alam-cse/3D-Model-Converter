const express = require('express');
const multer = require('multer');
const path = require('path');
const app = express();
const obj2gltf = require("obj2gltf");
const fs = require("fs");
const model = require('./project/gtlf.json');
const sharp = require("sharp")

app.use(express.static('project/gltf'))
  

// model.model.map((item)=>{console.log("item ",item.name);});
// let rName = (new Date()).toDateString;
const storage = multer.diskStorage({
 
  
    destination: function(req, file, cb) {
      // console.log(file.mimetype);
      // if(file.mimetype=='.image/svg+xml'){
      //   sharp(file.originalname)
      //       .png()
      //       .toFile(`./uploads/${file.originalname}.png`)
      //       .then(function(info) {
      //       console.log(info)
      //     })
      //       .catch(function(err) {
      //       console.log(err)
      //     })

      // }
       var ext = path.extname(file.originalname);
      //  console.log(ext);
      
      // if(ext =='.obj' && ext=='.mtl') {
      //   console.log(file.originalname);
      // }
      if (ext =='.svg') {
        sharp(file.originalname)
          .png()
          .toFile(`./uploads/${file.originalname}.png`)
          .then(function(info) {
          // console.log(info)
        })
          .catch(function(err) {
          // console.log(err)
        })
            } 

        cb(null, 'uploads/');
      
    },
 
  
    filename: function(req, file, cb) {

        cb(null, (file.originalname));
        // console.log(file.originalname);
    },

   
   
    
  
});
  
var upload = multer({ storage: storage })
  
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
  

});
  
app.post('/', upload.array('files'), (req, res) => {
  //  console.log(req.files);
  //  console.log(req.body.name);
  //  console.log(req.body.id);
  //  console.log(req.body.lnglt);
  

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
  fs.writeFileSync(`./project/gltf/${name}.gltf`, data);
  // res.send(JSON.stringify(data));
// console.log(data);
// global.randomVAlue = name;
// console.log(global);

let file = `${__dirname}/project/gltf/${name}.gltf`;
let filepath = file.split('\\');
// console.log(`this is filepath ${filepath[3]}`);

// var data = {}
// data.model = []
//    var obj = {
//        id: req.body.id,
//        name :req.body.name,
//        path: file,
//        lnglt:req.body.lnglt
//    }
   
//    data.model.push(obj)
//    console.log(obj);

// fs.appendFile("./project/gtlf.json", JSON.stringify(data), function(err) {
//     if (err) throw err;
//     console.log('complete');
//     }
// );

// fs.readFile('./project/gtlf.json', 'utf-8', function(err, data) {
// 	if (err) throw err

// 	var arrayOfObjects = JSON.parse(data)
//   console.log(arrayOfObjects);
// })

// fs.readFile('./project/gtlf.json', 'utf-8', function(err, data) {
// 	if (err) throw err

// 	var arrayOfObjects = JSON.parse(data)
// 	arrayOfObjects.model.push({
//     id: req.body.id,
//     name :req.body.name,
//     path: file,
//     lnglt:req.body.lnglt
// 	})

// 	console.log(arrayOfObjects)
// })
// fs.writeFile('./project/gtlf.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
// 	if (err) throw err
// 	console.log('Done!')
// })

fs.readFile('./project/gtlf.json', 'utf-8', function(err, data) {
	if (err) throw err

	var arrayOfObjects = JSON.parse(data);
  
  // console.log(arrayOfObjects);
  // console.log(arrayOfObjects.model.name);
  let oldData = false;
  
   arrayOfObjects.model.map((item)=>{
    if(item.name===req.body.name 
      || item.id===req.body.id 
      || item.path===filepath[3] 
      || item.lnglt===req.body.lnglt) {
      // console.log("different");
      oldData = true;

      // arrayOfObjects.model.push({
      //   id: req.body.id,
      //   name :req.body.name,
      //   path: filepath[3],
      //   lnglt:req.body.lnglt
      // })

      // fs.writeFile('./project/gtlf.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
      //   if (err) throw err
      //   // console.log('Done!')
      // })
      // res.download(file);
    }
    else{
      oldData = false;
      // console.log("not inserted");
      // res.send("danishhhhhhhhhhhhh")
      // res.status(200).send({status: 0, message: "Messages available"});
    }
});
  

  if(!oldData){
    arrayOfObjects.model.push({
      id: req.body.id,
      name :req.body.name,
      path: filepath[3],
      lnglt:req.body.lnglt
    })

    fs.writeFile('./project/gtlf.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
      if (err) throw err
      // console.log('Done!')
    })
    res.download(file);
  }
  if(oldData){
    res.send("This file is already present in the json file");
  }

	// console.log(arrayOfObjects)

	// fs.writeFile('./project/gtlf.json', JSON.stringify(arrayOfObjects), 'utf-8', function(err) {
	// 	if (err) throw err
	// 	// console.log('Done!')
	// })
})


// res.redirect('/preview');
// res.redirect('/download')


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
//   res.redirect('/');
// })
// app.get('/preview',(req,res)=>{
//    res.sendFile(__dirname + '/model.html');
//  })
  
// app.get('/download', function(req, res){
//   // Set disposition and send it.
// });
// console.log();
app.listen(3000);