const db = require("../db");

// Create a model from the schema
const Course = db.model("Course", {
   title:       { type: String, required: true },
   description: { type: String, required: true },
   subjectArea: { type: String, required: true },
   credits:     { type: Number, required: true }
});

module.exports = Course;