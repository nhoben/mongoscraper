$(document).ready(function(){

    //get reference to article container div
    var articleContainer = $(".article-container");

    //add event listeners
    $(document).on("click", ".btn.delete", handleArticleDelete);
    $(document).on("click", ".btn.notes", handleArticleNotes);
    $(document).on("click", ".btn.save", handleNoteSave);
    $(document).on("click", ".btn.note-delete", handleNoteDelete);

    //init starts things when the page is loaded

    initPage();

    function initPage(){

        articleContainer.empty();
        $.get("/api/headlines?saved=true").then(function(data){
            //if headlines, add to page
            if(data && data.length){
                renderArticles(data);            
        } else{
            //if not render no articles
            renderEmpty();
        }
    
    });
}

function renderArticles(articles){
    var articlePanels = [];
    for (var i = 0; i < articles.length; i++){
        articlePanels.push(createPanel(articles[i]));
    }

    articleContainer.append(articlePanels);
}

function createPanel (article){
    //takes single JSON object for an article or headline
    //construct JQuery element

    var panel = 
    $(["<div class='panel panel-default'>",
    "<div class= 'panel-heading'>",
    "<h3>",
    article.headline,
    "<a class ='btn btn-danger delete'>",
    "Delete From Saved",
    "</a>",
    "<a class='btn btn-info notes">Article Notes</a>",
    "</h3>",
    "</div>",
    "<div class = 'panel-body'>",
    article.summary,
    "</div",
    "</div>"
].join(""));

//attach article id to JQuery element

panel.data("_id", article._id);
//return constructed panel JQuery element
return panel;
}

function renderEmpty(){

    //render some html to the page

    var emptyAlert =
    $(["<div class='alert alert-warning text-center'>",
    "<h4> Oh no! Looks like we don't have saved articles.</h4",
    "</div>",
    "<div class='panel panel-default'>",
    "<div class ='panel-heading text-center'>",
    "<h3> Would you like to browse availablr articles?</h3>",
    "</div>",
    "<div class='panel-body text-center'>",
    "<h4><a href='/'>Browse Articles</a></h4>",
    "</div>",
    "</div>"

].join(""));
}

function renderNotesList(data){
    //handles rendering note list items
    //set up array of notes
    //set up current note available to store each notes

    var notesToRender =[];
    var currentNote;
    if (!data.notes.length){

        //if no notes, display message
        currentNote = [
            "<li class ='list-group-item'>",
            "No notes for this article yet",
            "</li>"
        ].join("";
    notesToRender.push(currentNote);
    }
    else {
        //if notes, go through each one
        for (var i = 0; i < data.notes.length; i++){
            currentNote = $([
                "<li class='list-group-item note'>",
                data.notes[i].noteText,
                "<button class = 'btn btn-danger note-delete'>x</button>",
                "</li>"
            ].join("");
            //store note id on the delete button

            currentNote.children("button").data("_id", data.notes[i]._id);

            //add current note to notes to render array
            notesToRender.push(currentNote);
        }
    }

    //append notes to render to note container

    $(".note-container").append(notesToRender);

    function handleArticleDelete(){
        //handles deleting articles and headlines

        var articlesToDelete = $(this).parents(".panel").data();
    
    $.ajax({

        method: "DELETE",
        url: "/api/headlines/" + articleToDelete._id
    }).then(function(data) {

        if (data.ok){
            initPage();
        }
    });

}

function handleArticleNotes(){

    //function handles opending notes modal and displaying notes

    var currentArticle = $(this).parents(".panel").data();
    //grab notes with this headline or article id

    $.get("/api/notes/" + currentArticle._id).then(function(data) {
        var modalText = [

            "<div class='container-fluid text-center'>",
            "<h4>Notes for article: ",
            currentArticle._id,
            "</h4>",
            "<hr />",
            "<ul class='list-group note-container'>",
            "</ul>",
            "<textarea placeholder= 'New Note' rows='4' cols='60'></textarea>",
            "<button class='btn btn-success save'>Save Note</button>",
            "</div>"
        ].join("");
        //adding formatted html to note modal
        bootbox.dialog({
            message: modalText,
            closeButton:true


        });

        var noteData = {
            _id: currentArticle._id,
            notes: data || []
        };

        $(".btn.save").data("article", noteData);

        renderNotesList(noteData);
        
    });
}

function handleNoteSave(){

    var noteData;
    var newNote = $(".bootbox-body textarea").val().trim();

    if (newNote){
        noteData = {
            _id: $(this).data("article")._id,
            noteText: newNote
        };
        $.post("/api/notes", noteData).then(function(){
            bootbox.hideAll();
        });
    }
}

function handleNoteDelete(){
    //handles deletion of notes

    var noteToDelete = $(this).data("_id");

    $.ajax({
        url:"/api/notes" + noteToDelete,
        method: "DELETE"
    }).then(function(){
        bootbox.hideAll();
    });
}




        
    });


