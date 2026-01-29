const filterIP=require("./filterIP");

module.exports=(req,res,next)=>{
    let ip=req.headers["x-forwarded-for"]||req.socket.remoteAddress||req.headers['x-real-ip']||req.connection.remoteAddress||null;
    if(!ip){
        req.clientIP=null;
        return next();
    }

    // if(ip == ip.match(/[0-9a-f\:]*/i)){
    //     req.clientIP=ip;
    //     return next();
    // }
    // let temp=ip.split(":").pop();
    req.clientIP=filterIP(ip).join(", ");
    return next();
}