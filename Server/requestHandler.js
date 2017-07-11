// import BookModel from'./models/book';
import React from 'react';
import {renderToString} from 'react-dom/server';
import {Provider} from 'react-redux';
import {createStore,  applyMiddleware, compose} from 'redux';
import {match, RouterContext, Router, Route, IndexRoute, browserHistory} from 'react-router';
import reducers from './src/reducers';
import routes from './src/routes';
import ReduxThunk from 'redux-thunk'

export function RequestHandler (req, res){

        //b1. Tạo Redux Store trên server
        //  console.log('data = ', data);
         const store = createStore(reducers, {
             main: {}
         }, /* preloadedState, */ compose(
            applyMiddleware(ReduxThunk)
        ));
        //  const store = createStore(reducers, {
        //      'books':data
        //  });
         //b2. Nhận trạng thái khởi tạo từ store
         const initialState = JSON.stringify(store.getState())
                                    .replace(/<\/script/g, '<\\/script')
                                    .replace(/<!--/g, '<\\!--');
         
        //  console.log('initialState = ', initialState);       

        //b3. Thi hành react-router trên server và cho phép clien dc 
        //bắt các request và xác định sẽ làm gi tiếp theo
        const Routes = {
            routes: routes,
            location: req.url
        }
        // console.log('Routes = ', Routes);

        match(Routes, function(err, redirect, props){
            // console.log('props = ', props);
            if(err){
                res.status(500).send(`Đã có lỗi xuất hiện: ${err}`)
            }
            else if(redirect){
                res.status(302, redirect.pathname + redirect.search)
            }
            else if(props){
                // console.log('props = ', props);
                // console.log('go here');
                const reactComponent = renderToString(
                    <Provider store = {store}>
                        <RouterContext {...props}/>
                    </Provider>
                );
                res.status(200).render('index', { reactComponent, initialState })
            }
            else {
                const reactComponent = renderToString(
                    <Provider store = {store}>
                        
                    </Provider>
                );
                 res.status(404).send('Không tìm thấy trang bạn yêu cầu!!');
            }
        });

    
}

// export async function GetBooks(){
//   try {
//     let books = await BookModel.find({});
//     return {
//       books: books
//     };
    
//   }
//   catch(err){
//     console.log(err);
//     throw err;
//   }
// }

