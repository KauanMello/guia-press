const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/dao");


const Article = require("./articles/Article")
const Category = require("./categories/Category")

app.set('view engine', 'ejs');

connection.authenticate().then(() => {
    console.log("Database connected")
}).catch((error) => {
    console.log(error)
})

app.use(bodyParser.urlencoded({extended: false}));

app.use(express.static('public'))

const categoriesController = require("./categories/CategoriesController")
app.use("/", categoriesController)

const articlesController = require("./articles/ArticlesController")
app.use("/", articlesController)

const usersController = require("./users/UsersController")
app.use("/", usersController)


app.get("/", (req, response) => {
    Article.findAll({limit: 5}).then((articles) => {
        Category.findAll().then((categories) => {
            response.render("index", {articles: articles, categories: categories})
        })
    })
})

app.get("/:slug",(request, response) => {
    var slug = request.params.slug
    Article.findOne({
        where: {
            slug
        }
    }).then((article) => {
        if (article != undefined) {
            Category.findAll().then((categories) => {
                response.render("article", {article: article, categories: categories})
            })
        }else{
            response.redirect("/")
        }
    })
} )

app.listen(3000, () => {
    console.log("Server was init")
})
