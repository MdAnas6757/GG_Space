const { default: mongoose } = require("mongoose");
const mongo=require ("mongoose");
mongoose.connect("mongodb://localhost:27017/Registration", {

}).then(() => {
    console.log(`connection successful`);
}).catch((e) => {
    console.log(`no connection`);
})