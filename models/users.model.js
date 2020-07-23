const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  id: { type: Number },
  id_ent: { type: mongoose.Schema.Types.ObjectId, ref: "entreprise" },
  name: {
    type: String,
  },
  email: {
    type: String,
  },
  password: {
    type: String,
  },
  chats: [{ type: mongoose.Schema.Types.ObjectId, ref: "chat" }],
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
  chatContacts: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
});

module.exports = mongoose.model("user", UserSchema);
