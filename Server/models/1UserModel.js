const mongoose = require('mongoose');
const bcryptNode = require('bcrypt-nodejs');
import crypto from"crypto";

const schema = new mongoose.Schema({
    email: {type: String, unique: true, lowercase: true, required: true},
    password: {type: String, required: true},    
    role: {type: String, default: 'user', required: true, lowercase: true},    
    profile: {
        name: {type: String, default: ''},
        picture: {type: String, default: '/img/user-photo2.jpg'}
    },    
    phone: {type: String, default: ""},
    birthday: {type: Date, default: Date.now()},
    address: {type: String, default: ''},
    gender: { type: String, default: "man" }    
});

schema.pre('save', function(next){
    let user = this;
    if(!user.isModified('password')) return next();
    bcryptNode.genSalt(10, (err, salt)=>{
        if(err) {
            console.log(err);
            return next(err);
        }
        bcryptNode.hash(user.password, salt, null, function(err, hash){
            if(err){
                console.log(err);
                return next(err);
            }
            
            user.password = hash;
            next();
            
            
        });
    });
});

schema.methods.encryptPassword = function(password){
    return bcryptNode.hashSync(password);
};

schema.methods.comparePassword = function(password){
    console.log(bcryptNode.compareSync(password, this.password));
    return bcryptNode.compareSync(password, this.password);
};

schema.methods.avatar = function(size){
    if(!this.size) {
        size = 200;
    }
    if(!this.email){
        return 'https://gravatar.com/avatar/?s' + size + '&d=retro';
    }
    let md5 = crypto.createHash('md5').update(this.email).digest('hex');
    return 'https://gravatar.com/avatar/' + md5 + '?s=' + size +  '&d=retro';
};

const userModel = mongoose.model('Users', schema);

export default userModel;