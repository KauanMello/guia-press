const express = require("express")
const router = express.Router()
const User = require("./User")


router.get("/admin/users", (request, response) => {
    response.send("listagem de usuarios")
})

router.get("/admin/users/create", (request, response) => {
    response.render("admin/users/create")
})

module.exports = router
