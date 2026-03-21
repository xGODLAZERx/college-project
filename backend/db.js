const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://admin:Swapnil_1983@project-manager.44lfvyj.mongodb.net/?appName=Project-Manager/portfolio")
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.log(err));

module.exports = mongoose;