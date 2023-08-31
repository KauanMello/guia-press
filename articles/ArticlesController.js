const express = require("express")
const router = express.Router()
const slugify = require("slugify")
const Article = require("./Article")
const CategoryModel = require("../categories/Category")

router.get("/admin/articles", (request, response) => {
    Article.findAll({
        include: [{model: CategoryModel}]
    }).then((articles) => {
        response.render("admin/articles/index", { articles: articles })
    })
})

router.get("/admin/articles/new", (request, response) => {
    CategoryModel.findAll().then((categories) => {
        response.render("admin/articles/new", { categories: categories })
    })
})

router.post("/articles/save", (request, response) => {
    var title = request.body.title
    var body = request.body.body
    var category = request.body.category

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category
    }).then(() => {
        response.redirect("/admin/articles")
    })
})

router.post("/articles/delete", (request, response) => {
    var id = request.body.id
    if (id) {
        Article.destroy({
            where: {
                id: id
            }
        }).then(() => {
            response.redirect("/admin/articles")
        })
    }
})

module.exports = router
