import express, {Router} from 'express';
const UserRouters = Router();
import validateInput from '../validators/SignupValidator';

UserRouters.post('/signup',  (req, res, next) => {
    const { username, email, password, passwordConfirm, gender, role, phone } = req.body;
    const {errors, isValid} = validateInput(req.body);
    if(isValid) {
        res.json({ success: true });
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