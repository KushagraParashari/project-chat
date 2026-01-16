const errorMiddleware=(err, req, res, next)=>{
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    if(err.code===11000){
        err.message = "Duplicate entry found";
        err.statusCode = 400;
    }

    if(err.name==="castError"){
        err.message = "Invalid input data";
        err.statusCode = 400;
    }
    return res.status(err.statusCode).json({
        success: false,
        message: err.message
    });
};

export { errorMiddleware };