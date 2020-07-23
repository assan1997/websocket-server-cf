const mongoose = require('mongoose');

const connect = async () => {
    try {
        await mongoose.connect('mongodb://192.168.70.59:27017/db-chat', {
            useNewUrlParser: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('connected to mongodb');
    } catch (e) {
        console.log('err', e);
    }
}

module.exports = connect;