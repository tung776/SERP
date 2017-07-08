import express, {Router} from 'express';
const UserRouters = Router();

UserRouters.post('/signup',  (req, res, next) => {
    const {username, email, password, passportConfirm, gender} = req.body;
    res.json({username, email, password, gender});
});

UserRouters.post('/login', (req, res, next)=> {
    console.log('go here!!!!');
});

// AuthRoutes.get('/logout', userController.getLogout);

// AuthRoutes.get('/profile', isAuthenticated, userController.getProfile);

export {UserRouters};