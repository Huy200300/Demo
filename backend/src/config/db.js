const mongoose = require('mongoose');
mongoose.set('strictQuery',false);
const connect = async ()=>{
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI );
        console.log(`Database Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(error);
    }
}

module.exports = connect;