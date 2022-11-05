# express-pureip
A middleware to get IP Address properly in mixed (IPV4 + IPV6) Network
##  Installation

``` npm install express-pureip ```

This will install express-pureip middleware in your project. You can also use other package manager as per your convinience.
## Usage

``` app=express() ```
``` app.use(require("express-pureip"))```

The above code will add clientIP variable in your request parameter. You can use it as a string in your project.

Example code below will return json shwoing IP Address to visitor

``` app.get("/",(req,res)=>{ res.json({"Your IP Address":req.clientIP})})```