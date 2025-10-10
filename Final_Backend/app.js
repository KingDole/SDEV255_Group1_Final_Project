const express = require("express");
const Course = require("./models/course");
var cors = require('cors');
const jwt = require('jwt-simple');
const User = require("./models/users");

const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());

// Middleware that parses HTTP requests with JSON body
app.use(express.json());

const router = express.Router();
const secret = "supersecret"

//Render stuff
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (err) {
    res.status(500).send("Error fetching courses");
  }
});

//Create a new user
router.post("/user", async(req,res) =>{
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })
    
    try {
        await newUser.save()
        res.sendStatus(201)
    }
    catch(err) {
        res.status(400).send(err)
    }
})

//authenticate or log in
//post request - when you login your are creating a new 'session'
router.post("/auth", async(req,res) => {
    if(!req.body.username || !req.body.password) {
        res.status(400).json({error: "Missing username or password"})
        return
    }
    //try to find the username in the database, then see if it matches with a username and password
    //await finding a user
    let user = await User.findOne({username : req.body.username})

    if(!user) {
        res.status(401).json({error:"Bad Username"})
    }
        //check to see if the user's password matches the requests password
        else {
            if (user.password != req.body.password) {
                res.status(401).json({error: "Bad Password"})
            }
            //successful login
            else {
                //create a token that is encoded with the jwt library, and send back the username. This will be important later.
                //we also will send back as part of the token that you are currently authorized
                //we could do this with a boolean or a number value i.e. if auth = 0 you are not authorized
                //if auth = 1 you are authorized
                username2 = user.username
                const token = jwt.encode({username: user.username},secret)
                const auth = 1

                //respond with the token
                res.json({
                    username2,
                    token:token,
                    auth:auth
                })
            }
        }
    })
//check status of user with a valid token, see if it matches the front end token
router.get("/status", async(req,res) => {
    if(!req.headers["x-auth"]) {
        return res.status(401).json({error: "Missing X-Auth"})
    }
    //if x-auth contains the token
    const token = req.headers["x-auth"]
    try {
        const decoded = jwt.decode(token,secret)
        //send back all username and status fields to the user or front end
        let users = await User.find({}, "username status")
        res.json(users)
    }
    catch (ex) {
        res.status(401).json({error: "invalid jwt"})
    }
})

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
  res.redirect("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html");
});
console.log("Initializing server...")
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})