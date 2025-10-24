module.exports.authorize = function (req, res, next){
    if(req.user?.role === "admin")
        return next();
    
    if(req.user?.role === "operator")
        return next();

    next();
}