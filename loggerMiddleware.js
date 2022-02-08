const logger = (request, response, next) =>{
    console.log(request.method)
    next()
}

//exportar el middleware
module.exports = logger