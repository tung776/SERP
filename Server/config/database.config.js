import mongoose from 'mongoose';
export const connectString = 'mongodb://localhost/SERP';
export const config = function(){

    mongoose.Promise = global.Promise;
        
    mongoose.connect(connectString, {
        useMongoClient: true
    })
    .then(()=>{
        console.log("database connected");
    })
    .catch(err=>{
        console.log(err);
    });
};