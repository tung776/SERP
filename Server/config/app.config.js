
import compression from 'compression'
import morgan from 'morgan';
import bodyParser from 'body-parser';
import express from 'express';
import ejs from 'ejs';
import ejsMate from 'ejs-mate';
import cookieParser from 'cookie-parser';
import expressSession from 'express-session';
// import expressFlash from 'express-flash';
import passport from 'passport';
import expressValidator from "express-validator";
// const connectMongo = require('connect-mongo')(expressSession);
import path from 'path';
import webpack from 'webpack';
import webpackMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from '../webpack.config.dev.js';

export const config = function(app){
 
/**
 * webpack middleware for dev
 */
// debugger;
    if(process.env.APP_ENV == 'development') {
        const complier = webpack(webpackConfig);
        app.use(webpackMiddleware(complier, {
            hot:true,
            noInfo: true, 
            reload:true,
            publicPath: webpackConfig.output.publicPath,
            contentBase: '/'
        }));
        app.use(webpackHotMiddleware(complier));
        app.use(morgan('dev'));
    }
    else {
        app.use(compression());
    }
/**
 * webpack middleware for dev
 */
    app.set('view engine', 'ejs');
    app.engine('ejs', ejsMate);
    app.use(express.static(path.resolve('Server/public')));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(cookieParser());
    app.use(expressSession({
        secret: "son cat tuong serp",
        resave: true,
        saveUninitialized: true,
        // store: new connectMongo({url: connectString, autoReconnect: true})//Tham khảo tại: https://github.com/jdesboeufs/connect-mongo
        
    }));
    // app.use(expressFlash());
    app.use(passport.initialize());//middleware được gọi ở từng request, kiểm tra session lấy ra passport.user nếu chưa có thì tạo rỗng.
    app.use(passport.session()); //middleware sử dụng kịch bản Passport , sử dụng session lấy thông tin user rồi gắn vào req.user.
    app.use(expressValidator());
    
    app.set('views', path.resolve('Server/views'));
     
    
};
