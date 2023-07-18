import {dbURI} from "../utils/config"

const mongoose = require('mongoose');

export async function connect(){
    // We will set more Mongo properties soon
    await mongoose.connect(dbURI).then(console.log(`Connected to Database`));
    
}