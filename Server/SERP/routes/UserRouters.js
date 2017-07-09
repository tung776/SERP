import express, {Router} from 'express';
const UserRouters = Router();
import commonValidation from '../validators/SignupValidator';
import bcrypt from 'bcrypt';
// import Promise from 'bluebird';
import UserModel from '../models/UserModel';
import  isEmpty from 'lodash/isEmpty';

function validateInput(data, otherValidation) {
    let { errors } = otherValidation(data);
    return UserModel.query({
        where: {email: data.email},
        orWhere: { username: data.username }
    }).fetch().then(
        user=> {
           if(user) {
                if(user.get('username') === data.username) {
                    errors.username = "Đã có người dùng khác đăng ký tên đăng nhập này, bạn hãy chọn tên đăng nhập khác"
                }
                if(user.get('email') === data.email) {
                    errors.email = "Đã có người dùng khác sử dụng email này, bạn hãy chọn email khác"
                }
           }
           
           return {
               errors,
               isValid: isEmpty(errors)
           }
        }
    )
}


UserRouters.post('/signup',  (req, res, next) => {
    const { username, email, password, passwordConfirm, gender, role, phone } = req.body;
    const user = { username, email, password, gender, phone, role }

    validateInput(req.body, commonValidation).then(
        ({errors, isValid})=> {            
            if(isValid) {
                const password_hash = bcrypt.hashSync(password, 10);
                user.password = password_hash;
                UserModel.forge(user, { hasTimestamps: true})
                    .save()
                    .then(
                        data => {
                            console.log("data = ", data);
                            res.json({ success: true, user: data})
                        }
                    )
                    .catch(                
                        err => {
                            console.log(err);
                            res.status(500).json({ error: err })
                        }
                    )
            }
            else {
                res.status(400).json(errors);
            }
        }
    );
     
});

UserRouters.post('/login', (req, res, next)=> {
    console.log('go here!!!!');
});

// AuthRoutes.get('/logout', userController.getLogout);

// AuthRoutes.get('/profile', isAuthenticated, userController.getProfile);

export {UserRouters};