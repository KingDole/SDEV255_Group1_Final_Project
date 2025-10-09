const express = require("express");
const Course = require("./models/course");
var cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;
app.use(cors());

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();

//Render stuff
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).send("Error fetching courses");
  }
});

//Get list of all courses in the database
router.get("/courses", async (req,res) =>{
    try {
        const courses = await Course.find({})
        res.json(courses)
        console.log(courses)
    }
    catch (err) {
        console.log(err)
    }
})

//Grab a single class in the database
router.get("/courses/:id", async (req,res) => {
    try {
        const course = await Course.findById(req.params.id)
        res.json(course)
    }
    catch (err) {
        res.status(400).send("A")
    }
})

router.post("/courses", async (req,res) => {
    try {
        const course = await new Course(req.body)
        await course.save()
        res.status(201).json(course)
        res.sendStatus(204)
    }
    catch (err) {
        res.status(400).send("B")
    }
})

//update is to update an existing record/resource/database entry.. it uses a put request
router.put("/courses/:id", async(req,res) => {
    //first we need to find and update the course the front end wants us to update to do this we need to request the id of the course from the request and then find it in the database and update it
    try {
        const course = req.body
        await Course.updateOne({_id: req.params.id}, course)
    }
    catch (err) {
        res.status(400).send("C")
    }
})

router.delete("/courses/:id", function(req,res) {
    Course.deleteOne({_id: req.params.id}, function(err, result) {
        if (err) {
            res.status(400).send(err)
        }
        else if (result.n === 0) {
            res.sendStatus(404)
        }
        else {
            res.sendStatus(204)
        }
    })
})

//all requests the usually use an API start wih /api... so the url would be localhost:3000/api/courses
app.use("/api", router)
app.get("/", (req, res) => {
  res.redirect("/api/index");
});
app.listen(3000)