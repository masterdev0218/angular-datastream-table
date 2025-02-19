// This server simulates an actual DB and routes to create, delete and get employees from a mock DB array object.
const express = require("express");
const bodyParser = require("body-parser");
const Pusher = require("pusher-js");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const shortId = require("shortid");
let mocks = require("./mocks");

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const pusher = new Pusher({
  appId: process.env.PUSHER_APPID,
  key: process.env.PUSHER_KEY,
  secret: process.env.PUSHER_SECRET,
  cluster: process.env.PUSHER_CLUSTER,
  useTLS: true,
});
Pusher.logToConsole = true;

console.log("connected to Pusher cluster", pusher.key.cluster);

app.post("/employee", (req, res) => {
  // simulate actual db save with id (using shortId) and createdAt added
  const employee = {
    id: shortId.generate(),
    createdAt: new Date().toISOString(),
    ...req.body,
  };
  mocks.push(employee); // like our db
  // trigger this update to pusher channel listeners
  try {
    pusher.trigger("employee", "new", employee);
    res.send(employee);
  } catch (err) {
    () => console.log("error: ", err);
  }
});

app.delete("/employee/:id", (req, res) => {
  const employee = mocks.find((emp) => emp.id === req.params.id);
  console.log('employee; ', employee);
  mocks = mocks.filter((emp) => emp.id !== employee.id);
  try {
    pusher.trigger("employee", "deleted", employee);
    res.send(employee);
  } catch (err) {
    () => console.log("error: ", err);
  }
});

app.get("/employee", (req, res) => {
  res.send(mocks);
});

app.listen(2000, () => console.log("Listening on port 2000"));
