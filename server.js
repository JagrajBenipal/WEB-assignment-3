/*********************************************************************************
 *  WEB322 – Assignment 02
 *  I declare that this assignment is my own work in accordance with Seneca  Academic Policy.  No part *  of this assignment has been copied manually or electronically from any other source
 *  (including 3rd party web sites) or distributed to other students.
 *
 *  Name: Jagraj Singh Benipal   Student ID: 156374217   Date: 2 February 2023
 *
 *  Online (Cyclic) Link: https://dead-pear-angler-shoe.cyclic.app/
 *
 ********************************************************************************/


const multer = require("multer");
const cloudinary = require('cloudinary').v2
const streamifier = require('streamifier')
const express = require("express");
const app = express();
var path = require("path");
var HTTP_PORT = process.env.PORT || 8080;
const dataService = require('./data-service.js');
app.use(express.static("public"));
const upload = multer();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



cloudinary.config({
  cloud_name: "dh9b5vki5",
  api_key: "518413575469167",
  api_secret: "w6Klxstzdeip7Ysp390GWsPhOy8",
  secure: true,
});

app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/home.html"));
});

app.get("/about", (req, res) => {
  res.sendFile(path.join(__dirname, "/views/about.html"));
});

app.get("/students", (req, res) => {
  if (req.query.status) {
    dataService.getStudentsByStatus(req.query.status)
      .then((students) => {
        res.json(students);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.program) {
    dataService.getStudentsByProgramCode(req.query.program)
      .then((students) => {
        res.json(students);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else if (req.query.credential) {
    dataService.getStudentsByExpectedCredential(req.query.credential)
      .then((students) => {
        res.json(students);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  } else {
    dataService.getStudents()
      .then((students) => {
        res.json(students);
      })
      .catch((err) => {
        res.json({ message: err });
      });
  }
});

  app.get("/intlstudents", (req, res) => {
    dataService.getInternationalStudents()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json({message: err});
      });
  });

  app.get("/student/:studid", (req, res) => {
    dataService
      .getStudentById(req.params.studid)
      .then((student) => {
        if (student) {
          res.json(student);
        } else {
          res.status(404).json({ message: "Student not found" });
        }
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  });
  
  app.get("/programs", (req, res) => {
    dataService.getPrograms()
      .then(data => {
        res.json(data);
      })
      .catch(err => {
        res.json({message: err});
      });
  });

  app.get("/students/add",(req,res)=>{
    res.sendFile(path.join(__dirname,"/views/addStudent.html"))
  });

  app.post('/students/add', (req, res) => {
    dataService.addStudent(req.body)
      .then(() => {
        res.redirect('/students');
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  });
  

  app.get("/images/add",(req,res)=>{
    res.sendFile(path.join(__dirname, "/views/addImage.html"))
  })

  app.post("/images/add",(req,res)=>{
    if(req.file){
      let streamUpload = (req) => {
          return new Promise((resolve, reject) => {
              let stream = cloudinary.uploader.upload_stream(
                  (error, result) => {
                      if (result) {
                          resolve(result);
                      } else {
                          reject(error);
                      }
                  }
              );
  
              streamifier.createReadStream(req.file.buffer).pipe(stream);
          });
      };
  
      async function upload(req) {
          let result = await streamUpload(req);
          console.log(result);
          return result;
      }
  
      upload(req).then((uploaded)=>{
          processForm(uploaded.url);
      });
    }else{
      processForm("");
  }

  function processForm(imageUrl){
      
      // TODO: Process the image url on Cloudinary before redirecting to /images.
      // Note: the required "addImage" function is not created yet in data-service.js.
      // ... ...

  }

  })
  
  app.get('/images', (req, res) => {
    dataService.getImages()
      .then((images) => {
        res.json({ images });
      })
      .catch((err) => {
        res.json({ message: err });
      });
  });

app.use((req, res) => {
  res.status(404).send("Page Not Found");
});




dataService.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(`Express http server listening on port: ${HTTP_PORT}`);
    });
  })
  .catch((err) => {
    console.error(`Error initializing data: ${err}`);
  });
