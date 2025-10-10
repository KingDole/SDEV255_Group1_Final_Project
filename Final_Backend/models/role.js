const db = require("../db");

// Create a model from the schema
const Role = db.model("Role", {
   title:       { type: String, required: true },
});

module.exports = Role;