const mongoose = require("mongoose");

const BlacklistSchema = mongoose.Schema({
  token: { type: String, requried: true },
});

const Blacklist = mongoose.model("blacklist", BlacklistSchema);

module.exports = { Blacklist };