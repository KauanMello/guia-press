const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
const Article = require("../articles/Article")

var msg = null
var msgErr = null

router.get("/admin/categories", (request, response) => {
    Category.findAll().then((categories) =>{
        response.render("admin/categories/index", {
            categories: categories,
            msg: msg,
            msgErr: msgErr
         })
        msg = null
        msgErr = null
    })
})

router.get("/admin/categories/new", (request, response) => {
    response.render("admin/categories/new")
})

router.get("/admin/categories/edit/:id", (request, response) => {
    var id = request.params.id
    if (isNaN(id)) {
        response.render("/admin/categories")
    }
    Category.findByPk(id).then((category) => {
        if (category != undefined ) {
            response.render("admin/categories/edit", { category: category })
        }else{
            response.redirect("admin/categories")
        }
    }).catch((err) => {
        response.redirect("admin/categories")
    })
})

router.post("/categories/save", (request, response) => {
    var title = request.body.title

    if (title != undefined && title != null) {
        Category.create({
            title: title,
            slug: slugify(title)
        }).then(() => {
            response.redirect("/admin/categories")
        })
    }
})

router.post("/categories/delete", (request, response) => {
    var id = request.body.id

    const relatedArticles = Article.findOne({
        where: {
            categoryId: id
        }
    });

    if (id) {
        if (!relatedArticles) {
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                response.redirect("/admin/categories")
                msg = "Excluido com sucesso"
            })
        }else{
            msgErr = "Categoria não pode ser removida pois existe um ou mais artigos relacionados a ela"
            response.redirect("/admin/categories")
        }
    }else{
        response.send("erro ao excluir categoria")
    }
})

router.post("/categories/update", (request, response) => {
    var id = request.body.id
    var title = request.body.title
    Category.update({
         title: title,
          slug: slugify(title)
        }, {
        where: {
            id: id
        }
    }).then(() => {
        response.redirect("/admin/categories")
        msg = "Alterado com sucesso"
    })
})

module.exports = router


