import jwt from 'jsonwebtoken';
import config from '../config/jwt';
import UserModel from '../models/UserModel';

export default (req, res, next) => {
    const authorizationHeader = req.headers['authorization'];
    console.log("authorizationHeader = ", authorizationHeader);
    let token;
    if(authorizationHeader) { 
        token = authorizationHeader.split(' ')[1];
    }

    if(token) {
        console.log(token)
        jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if(err) {
                res.status(401).json({
                    error: "Bạn cần đăng nhập để sử dụng chức này!"
                });
            } else {
                new UserModel({ id: decoded.id }).fetch().then(
                    user => {
                        console.log("user = ", user);
                        if(!user) {
                            res.status(404).json({
                                error: "Không tìm thấy người dùng"
                            })
                        }
                        req.currentUser = user;
                        next();
                    }
                )
            }
        })
    }
    else {
        res.status(403).json({
            error: 'bạn chưa đăng nhập'
        })
    }
}