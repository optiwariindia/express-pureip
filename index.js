const filterIP=require("./filterIP");

module.exports=async (req,res,next)=>{
    let ip=req.headers["x-forwarded-for"]||req.socket.remoteAddress||req.headers['x-real-ip']||req.connection.remoteAddress||null;
    if(!ip){
        req.clientIP=null;
        return next();
    }
    req.clientIP=filterIP(ip).join(", ");

    if (process.env.countryAPI && req.clientIP) {
        try {
            const response = await fetch(process.env.countryAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ ip: req.clientIP })
            });
            if (response.ok) {
                const data = await response.json();
                if (data && data.country) {
                    req.country = data.country;
                }
            }
        } catch (error) {
            // fail silently as per common middleware patterns for optional enhancements
        }
    }

    return next();
}