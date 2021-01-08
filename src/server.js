const express = require("express");
const cors = require("cors");
const listEndpoints = require("express-list-endpoints");
const examsRouter = require("./exam");
const server = express();
server.use(cors());
server.use(express.json());
server.use("/", examsRouter);
const port = process.env.PORT || 3001;

console.log(listEndpoints(server));
server.listen(port, () => console.log("server is running on port:" + port));
