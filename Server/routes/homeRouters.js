import express from 'express';
const IndexRouter = express.Router();

/* GET home page. */
IndexRouter.get('/', function(req, res, next) {
  res.render('index-dev');
});

export {IndexRouter};
