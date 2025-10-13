module.exports.isAdmin = function (req, res, next){
    if(req.user?.role === "admin")
        return next();
    next();
}