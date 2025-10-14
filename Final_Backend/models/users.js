const db = require("../db");

// Create a model from the schema
const User = db.model("User", {
    username: {type: String, require: true},
    password: {type: String, require: true},
    role: {type: String, require: true},
    schedule: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }]
})

module.exports = mongoose.model("User", userSchema);