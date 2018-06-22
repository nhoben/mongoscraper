$(document).ready(function(){
    var articleContainer = $(".article-container");
    $(document).on("click", ".btn.save", handleArticleSave);
    $(document).on("click", ".scrape-new", handleArticleScrape);

    //run initpage once page is ready
    initPage();

    function initPage(){

        //empty article container
       articleContainer.empty();
       $.get("/api/headlines?saved=false")
       .then(function(data) {
           //render headlines to page if they are there
           if (data && data.length){
               renderArticles(data);
           }
           else{
               //else render a message saying no articles
               renderEmpty();

           }
       });
    }

    function renderArticles(articles){
        //append HTML with article data
        //parse JSON array containing articles in db
        var articlePanels = [];

        for(var i = 0; i< articles.length; i++){
            articlePanels.push(createPanel(articles[i]));
        }
    
articleContainer.append(articlePanels);
    }

    function createPanel(article){

        var panel =
        $(["<div class='panel panel-default'>",
        "<div class ='panel-heading'>",
        "<h3>",
        article.headline,
        "<a class= 'btn btn-success save'>",
        "Save Article",
        "</a>",
        "</h3>",
        "</div>",
        "<div class ='panel-body'>",
        article.summary,
        "</div>",
        "</div>"
    ].join(""));

    //attach article id to jQuery element
    panel.data("_id", article._id);

    //return constructed panel jQuery element

    return.panel;
    }


    function renderEmpty(){

        var EmptyAlert =
        $(["div class='alert alert-warning text-center'>",
        "<h4>Oh no! Looks like there are no new articles.</h4>",
        "</div",
        "<div class ='panel panel-default'>",
        "<div class='panel-heading text-center'>",
        <h4><a class='scrape-new'>Try Scraping New Articles</a></h4>",
        <h4><a href='/saved'>Go to Saved Articles</a></h4>",
        "</div>",
        "</div>"
    ].join(""));

    //data appending to page

    articleContainer.append(emptyAlert);
    }
//function triggered when user desires to save an articles
    function handleArticleSave(){

        var articleToSave = $(this).parents(".panel").data();
        articleToSave.saved = true;
    }

$.ajax({
    method: "PATCH",
    url: "/api/headlines",
    data: articleToSave
})

.then(function(data){
    if(data.ok){
        initPage();
    }
    });
}

function handleArticleScrape(){
    //handles when user decides to scrape  new article
    $.get("/api/fetch")
    .then(function(data){

        //scrape NY times and compare articles
        initPage();
        bootbox.alert("<h3 class='text-center m-top 80'>" + data.message + "</h3>");

    });
}
});