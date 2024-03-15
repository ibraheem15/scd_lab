const express = require("express");

const app = express();

// Route for addition
app.get("/add/:num1/:num2", (req, res) => {
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  const result = num1 + num2;
  res.send(`The sum of ${num1} and ${num2} is ${result}`);
});

// Route for subtraction
app.get("/sub/:num1/:num2", (req, res) => {
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  const result = num1 - num2;
  res.send(`The difference between ${num1} and ${num2} is ${result}`);
});

// Route for multiplication
app.get("/mul/:num1/:num2", (req, res) => {
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  const result = num1 * num2;
  res.send(`The product of ${num1} and ${num2} is ${result}`);
});

// Route for division
app.get("/div/:num1/:num2", (req, res) => {
  const num1 = parseInt(req.params.num1);
  const num2 = parseInt(req.params.num2);
  const result = num1 / num2;
  res.send(`The division of ${num1} and ${num2} is ${result}`);
});

// Start the server
app.listen(3000, () => {
  console.log("Calculator app listening on port 3000");
});
