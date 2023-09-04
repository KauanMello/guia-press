const express = require("express")
const router = express.Router()
const slugify = require("slugify")
const Article = require("./Article")
const CategoryModel = require("../categories/Category")

router.get("/admin/articles", (request, response) => {
    Article.findAll({
        include: [{model: CategoryModel}]
        include: [{model: CategoryModel}],
        limit: 5
    }).then((articles) => {
        response.render("admin/articles/index", { articles: articles })
        Article.count().then((count) => {
            response.render("admin/articles/index", { articles: articles, count: count })
        })
    })
})

router.get("/admin/articles/new", (request, response) => {
    CategoryModel.findAll().then((categories) => {
        response.render("admin/articles/new", { categories: categories })
    })
})

router.get("/admin/article/edit/:id", (request, response) => {
    var id = request.params.id
    if (isNaN(id)) {
        response.render("/admin/articles")
    }
    CategoryModel.findAll().then((categories) => {
        Article.findByPk(id).then((article) => {
            if (article != undefined ) {
                response.render("admin/articles/edit", { article: article, categories: categories})
            }else{
                response.redirect("admin/articles")
            }
        }).catch((err) => {
            response.redirect("admin/articles")
        })

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

router.post("/article/update", (request, response) => {
    var id = request.body.id
    var title = request.body.title
    var body = request.body.body
    var category = request.body.category

    Article.update({
        title: title,
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }).then(() => {
        response.redirect("/admin/articles")
        console.log("editado");
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

router.get("/articles/page/:num", (request, response) => {
    var page = request.params.num
    var offset
    if (isNaN(page) || page == 1) {
        offset = 0
    } else {
        offset = parseInt(page - 1) * 5
    }

    Article.findAndCountAll({
        limit: 5,
        offset: offset
    }).then((articles) => {

        var next = true;
        if (offset + 5 >= articles.count) {
            next = false
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        response.render("admin/articles/page", {result: result, articles: articles})
    })
})

module.exports = router
