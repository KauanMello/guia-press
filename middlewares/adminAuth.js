function adminAuth(request, response, next){
    if (request.session.user != null) {
        next()
    }else{
        response.redirect("/login")
    }
}

module.exports = adminAuth
