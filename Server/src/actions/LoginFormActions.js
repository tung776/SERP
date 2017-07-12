// import axios from 'axios';
// import { 
//     LOGIN_USER_FAIL,
//     LOGIN_USER_PENDING,
//     LOGIN_USER_SUCCESS,
//     LOGIN_FORM_CHANGED,
//     ADD_FLASH_MESSAGE,
//     SUCCESS_MESSAGE,
//     WARNING_MESSAGE,
//     ERROR_MESSAGE,
//     SET_CURRENT_USER,
//     LOGOUT_REQUEST
//  } from './index';
// import { browserHistory } from 'react-router';
// import {LoginValidator} from '../../../Shared/validators';
// import {setAuthorizationToken} from '../../../Shared/utils/setAuthorizationToken';
// import {SetCurrentUser} from './index';
// // import jwt from 'jsonwebtoken';

// export const LoginFormSubmit = (user) => {
//     console.log("user = ", user);
//     return (dispatch) => {
//         dispatch({
//             type: LOGIN_USER_PENDING
//         });

//         const {errors, isValid} = LoginValidator(user);
//         if(!isValid) {
//             dispatch ({
//                 type: LOGIN_USER_FAIL,
//                 payload: errors
//             })
//         } else {
//             axios.post('/api/users/login', user)
//             .then(
//                 res => {
//                     // console.log("res = ", res);
//                     dispatch({
//                         type: LOGIN_USER_SUCCESS,
//                         payload: res.data
//                     });
//                     dispatch({
//                         type: ADD_FLASH_MESSAGE,
//                         payload: { message: "Bạn đã đăng nhập thành công", TypeMessage: SUCCESS_MESSAGE }
//                     });
//                     const {token} = res.data;
                    
//                     setAuthorizationToken(token);
//                     dispatch(SetCurrentUser( user ));
                    
//                     localStorage.setItem('jwtToken', token);
//                     browserHistory.push('/');  
//                 }
//             )
//             .catch(
//                 err => {
//                     console.log("err = ", err);
//                     if(err.response) {
//                         dispatch({
//                             type: LOGIN_USER_FAIL,
//                             payload: err.response.data.error
//                         })
//                         dispatch({
//                             type: ADD_FLASH_MESSAGE,
//                             payload: { message: `Đăng nhập thất bại : ${err.response.data.error}`, TypeMessage: ERROR_MESSAGE}
//                         })
//                     }
//                     else {
//                         dispatch({
//                             type: LOGIN_USER_FAIL,
//                             payload: err
//                         })
//                         dispatch({
//                             type: ADD_FLASH_MESSAGE,
//                             payload: { message: `Đăng nhập thất bại : ${err}`, TypeMessage: ERROR_MESSAGE}
//                         })
//                     }
//                 }
//             )
//         }
        
//     }
// }

// export const logout = () => {
//     return dispatch => {
//         localStorage.removeItem('jwtToken');
//         setAuthorizationToken(false);
//         dispatch(SetCurrentUser({}));
//         dispatch({
//             type: LOGOUT_REQUEST
//         })
//     }
// }