function errorHandler(err,req,res,next){
    if(err.name==='UnauthorizedError'){
        res.status(401).json({message:"This user is not authorized"})
    }

    if(err.name === 'ValidationError'){
        res.status(401).json({message:err})
    }
}