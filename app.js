const express = require('express');
const helmet = require('helmet');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');
const authRouter = require('./routes/Auth/router');
const errorController = require('./controllers/errorController');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());

app.use(
  express.json({
    limit: '50mb',
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(compression());
app.use(mongoSanitize());

const mainRouter = express.Router();

app.use('/api/v1', mainRouter);

// After finding /api/v1
mainRouter.use('/auth', authRouter);

app.use('*', (req, res, next) => {
  return res.status(404).json({
    message: 'API is not found',
  });
});

app.use(errorController);

module.exports = app;
