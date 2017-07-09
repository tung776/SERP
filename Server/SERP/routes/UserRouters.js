import express, {Router} from 'express';
const UserRouters = Router();
import validateInput from '../validators/SignupValidator';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';

UserRouters.post('/signup',  (req, res, next) => {
    const { username, email, password, passwordConfirm, gender, role, phone } = req.body;
    const user = { username, email, password, gender, phone, role }
    const {errors, isValid} = validateInput(req.body);
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
    // res.json({ username, email, password, passwordConfirm, gender, role, phone });
});

UserRouters.post('/login', (req, res, next)=> {
    console.log('go here!!!!');
});

// AuthRoutes.get('/logout', userController.getLogout);

// AuthRoutes.get('/profile', isAuthenticated, userController.getProfile);

export {UserRouters};