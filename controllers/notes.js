var Note = require("..models/Note");
var makeDate = require("..scraper/date");

module.exports = {
    get: function(data, cb) {
        Note.find({
            _headlineId: data_id
        }, cb);
        },
        save: function(data, db){
            var newNote = {
                _headlineId: data_id,
                date:makeDate(),
                noteText: data.noteText
            };

            Note.create(newNote, function (err, doc){
                if (err){
                    console.log(err);
                }
                else{
                    console.log(doc);
                    cb(doc);
                }
            });
        },
        delete: function(data, db){
            Note.remove({
                _id: data._id
            }, cb);
            }
        };
    

