const config = require('./Config.json')
const express = require('express'),
app = express();

app	    
.use(express.json())
.use(express.urlencoded({ extended: true }))
.use("/", require("./website/index"))
.use(function(req, res, next)
{
	res.status(404).send("ERROR 404");
});

let server = app.listen(config.website.port, () => {
    console.log("Web Started \nIP: " + config.website.mainurl + "\nPort: " + server.address().port);
});