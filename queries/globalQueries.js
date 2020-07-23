const Chat = require("../models/chats.model");
const Ent = require("../models/entreprise.model");
const Messages = require("../models/messages.model");
const MessageGroup = require("../models/messagesgroups.model");
const User = require("../models/users.model");

module.globalQueries = class {
  static getAll(data) {
    return new Promise(async (next) => {
      const user = await User.findOne({ id: data.user_id })
        .populate("chatContacts")
        .populate("favorites")
        .then((r) => r);
      await Chat.find({ $or: [{ peer: user._id }, { initiator: user._id }] })
        .populate("peer")
        .populate("initiator")
        .populate("msg")
        .then((r) => {
          if (r !== null) {
            const output = {};
            r.forEach((el, index) => {
              const id = el.initiator.id == data.user_id ? user_id : el.peer.id;
              output[id] = {};
              output[id].isPinned = el.isPinned;
              output[id].msg = el.msg;
              if (index === r.length - 1) {
                next({
                  status: true,
                  data: {
                    chats: output,
                    chatContacts: user.favorites,
                  },
                });
              }
            });
          } else {
            next({
              status: false,
              message:
                "nous n'avez aucune conversation avec un membre de l'entreprise",
            });
          }
        });
    });
  }
};
