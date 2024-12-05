const mongoose = require('mongoose');
const initData = require('./data.js');
const List = require("../models/listing.js");

main().then(() => {
    console.log("Connected Successfully...")
}).catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wonderlust');
}

const initDB = async () => {
    await List.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj, owner: '6741f4f7d57b04cd23a955aa' }));
    await List.insertMany(initData.data);
    console.log("data saved");
}

initDB();