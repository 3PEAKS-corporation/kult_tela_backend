const app = require("./config/app")();
const config = require("./config/env");

app.create(config);
app.start();
