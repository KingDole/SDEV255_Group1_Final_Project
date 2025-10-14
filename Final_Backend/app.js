const express = require("express");
const Course = require("./models/course");
var cors = require('cors');
const jwt = require('jwt-simple');
const User = require("./models/users");
const Role = require("./models/role");

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
router.post("/users", async(req,res) =>{
    if(!req.body.username || !req.body.password) {
        return res.status(400).json({error: "Missing username or password"})
    }

    try {
        const existingUser = await User.findOne({ username: req.body.username })
        if (existingUser) {
            return res.status(409).json({ error: "Username already exists"})
        }

        const newUser = await new User({
            username: req.body.username,
            password: req.body.password,
            role: req.body.role
        })
    
        await newUser.save()
        return res.status(201).json({message: "User created successfully"})
    } 
    catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({ error: "Username already exists (duplicate key)" });
        }

        return res.status(400).json({error: "Registration Failed"})
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
            role2 = user.role
            const token = jwt.encode({username: user.username},secret)
            const auth = 1

            //respond with the token
            res.json({
                username2,
                role2,
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

//Get a list of all roles in the database
router.get("/roles", async (req,res) =>{
    try {
        const roles = await Role.find({})
        res.json(roles)
        console.log(roles)
    }
    catch (err) {
        console.log(err)
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
        const token = req.headers["x-auth"]
        const decoded = jwt.decode(token, secret)
        const user = await User.findOne({ username: decoded.username })

        if (!user || user.role !== "Teacher") {
            return res.status(403).json({ error: "Only teachers can create courses" })
        }

        const course = new Course({
            ...req.body,
        creator: user._id
        })

        await course.save()
        res.status(201).json(course)
    }
    catch (err) {
        res.status(400).json({error: err.message || "Invalid course data"})
    }
})

//Grab all courses created by the logged in Teacher
router.get("/teachers/:username/courses", async (req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username })

        if (!user || user.role !== "Teacher") {
            return res.status(403).json({ error: "Invalid teacher" })
        }

        const courses = await Course.find({ creator: user._id })
        res.json(courses)
    } catch (err) {
        res.status(500).json({ error: "Server error" })
    }
})


//update is to update an existing record/resource/database entry.. it uses a put request
router.put("/courses/:id", async(req,res) => {
    //first we need to find and update the course the front end wants us to update to do this we need to request the id of the course from the request and then find it in the database and update it
    try {
        const course = req.body
        const result = await Course.updateOne({_id: req.params.id}, course)

        if (result.matchedCount === 0) {
            return res.status(404).json({ error: "Course not found" })
        }

        res.status(200).json({ message: "Course updated" })
    }
    catch (err) {
        console.error(err)
        res.status(400).json({ error: "Failed to update course" })
    }
})

router.delete("/courses/:id", async (req,res) => {
    try {
        const result = await Course.deleteOne({ _id: req.params.id });

        if (result.deletedCount === 0) {
            return res.status(404).json({ error: "Course not found" });
        }

        res.status(200).json({ message: "Course deleted" });
    } catch (err) {
        console.error(err)
        res.status(500).json({ error: "Failed to delete course" });
    }
})

//When a student adds a class, add that to a schedule associated with that student on the database rather than 
//local storage so the information is loaded and saved properly between logouts
//Add the class to the schedule. Check that it's a valid user, is a student, and the class isn't already added.
//Limit students to 4 total classes
router.post("/users/:username/schedule", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    const courseId = req.body.courseId;

    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.role !== "Student") {
      return res.status(403).json({ error: "Only students can have a schedule" });
    }

    if (user.schedule.includes(courseId)) {
      return res.status(409).json({ error: "Course already in schedule" });
    }

    if (user.schedule.length >= 4) {
      return res.status(400).json({ error: "Course limit reached (4)" });
    }

    user.schedule.push(courseId);
    await user.save();

    res.status(200).json({ message: "Course added to schedule" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Get user's schedule for the schedule page
router.get("/users/:username/schedule", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username })
      .populate("schedule");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.schedule);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Drop classes from the schedule
router.delete("/users/:username/schedule/:courseId", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });

    if (!user) return res.status(404).json({ error: "User not found" });

    user.schedule = user.schedule.filter(id => id.toString() !== req.params.courseId);
    await user.save();

    res.status(200).json({ message: "Course removed" });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

//Direct to the index page
app.use("/api", router)
app.get("/", (req, res) => {
  res.redirect("https://kingdole.github.io/SDEV255_Group1_Final_Project/Final_Frontend/index.html");
});
console.log("Initializing server...")
app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`)
})