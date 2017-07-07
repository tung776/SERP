import express, {Router} from 'express';
const AuthRoutes = Router();
import passport from 'passport';

AuthRoutes.post('/register',  (req, res, next) => {
    console.log('go here!!!!!!!');
    passport.authenticate('local.register');
});

AuthRoutes.post('/login', passport.authenticate('local.login'), (req, res, next)=> {
    console.log('go here!!!!');
});

// AuthRoutes.get('/logout', userController.getLogout);

// AuthRoutes.get('/profile', isAuthenticated, userController.getProfile);

export {AuthRoutes};