const db = require("../db");

// Create a model from the schema
const User = db.model("User", {
    username: {type: String, required: true},
    password: {type: String, required: true},
    role: {type: String, required: true},
    schedule: [{ type: db.Schema.Types.ObjectId, ref: 'Course' }]
})

module.exports = User;