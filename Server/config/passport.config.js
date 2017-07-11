import passport from "passport";
import {Strategy as passportLocal } from "passport-local";
import userModel from '../models/userModel';

    // var upload = multer({ dest: 'uploads/' });
export default function() {
    
    //hàm được gọi khi xác thực thành công để lưu thông tin user vào session
    passport.serializeUser(function(user, done){
        done(null, user._id);
    });
    //hàm được gọi bởi passport.session .
    //Giúp ta lấy dữ liệu user dựa vào thông tin lưu trên session và gắn vào req.user
    passport.deserializeUser(function(id, done){
        userModel.findById({_id: id},function(err, user){
             done(err, user)
        });
    });
    
    passport.use('local.login', new passportLocal({
        usernameField: "email",
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done){
        console.log("go local.login")
        console.log(req, email, password)
        try{
            const user = await userModel.findOne({email: email});
            if(!user) {
                return done(null, false, req.flash('errors', 'no user found'));
            }
            if(!user.comparePassword(password)){
                return done(null, false, req.flash('errors', 'password is not correct!'));
            }
            return done(null, user);
        }
        catch(err){
            console.log(err);
            done(err);
        }
    }));
    
        
    passport.use("local.register", new passportLocal({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, async function(req, email, password, done){
        console.log("go local.register");
        //kiểm tra email và password
        req.checkBody('email', "không đúng định dạng email!")
            .notEmpty()
            .isEmail();
        req.checkBody('password', "Mật khẩu cần nhiều hơn 4 ký tự!")
            .notEmpty()
            .isLength({min:4});
        req.checkBody('name', "name is required")
            .notEmpty();
        
        var errors = req.validationErrors();
        console.log(errors);
        var messages = [];
        if(errors) {
            errors.forEach(function(error){
                messages.push(error.msg);
            });
            return done(null, false, req.flash('errors', messages));
        }
        try{
            const user = await userModel.findOne({
                email: email,
            });
            if(user) {
                return done(null, false, req.flash( "errors", "email đã được sử dụng. Nếu bạn đã đăng ký bạn hãy đăng nhập" ));
            }
            const newUser = new userModel();
            newUser.email = email;
            newUser.profile.name = req.body.name;
            newUser.profile.picture = newUser.avatar(200);
            // console.log( req.files);
              newUser.address = req.body.address;
            newUser.phone = req.body.phone;
            newUser.gender = req.body.gender;
            newUser.birthday = req.body.birthday;
            newUser.password = password;
            //console.log(newUser);
            await newUser.save();
            await req.logIn(newUser, (err)=>{ 
                        if(err) {
                            console.log(err);
                            return done(err);
                            
                        }
                        return done(null, newUser);
                        
                    });
        }
        catch(err){
            console.log(err);
            done(err);
        }
    }));
}
