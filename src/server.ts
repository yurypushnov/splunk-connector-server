import './environment';
import express from 'express';
import bodyParser from 'body-parser';
import asyncHandler from "express-async-handler";
import Processor from './processor';

const app = express();

// middleware
app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

// endpoints
app.get('/health', (req, res) => {
  res.send({ date: +Date.now() });
});

app.post('/event', asyncHandler(async (req, res) => {
  const response = await new Processor().process(req.body, req.query && req.query.type);

  res.send({ response });
}));

app.listen(3003, () => {
  console.log('Server is listening on port 3003');
});
