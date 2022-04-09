let express = require('express');
let router = express.Router();
let BookSchema = require('../models/books');

function HandleError(response, reason, message, code){
    console.log('ERROR: ' + reason);
    response.status(code || 500).json({"error": message});
}

//Gets all the books
router.get('/', (request, response, next)=>{
    let name = request.query['name'];
    if (name){
        BookSchema
            .find({"title": name})
            .exec( (error, books) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }else{
        BookSchema
            .find()
            .exec( (error, books) =>{
                if (error){
                    response.send({"error": error});
                }else{
                    response.send(books);
                }
            });
    }
});

//Gets the book with the given id (catch error of id not found)
router.get('/:id', (request, response, next) =>{
    BookSchema
        .findById({"_id": request.params.id}, (error, result) => {
            if (error){
                response.status(500).send(error);
            }else if (result){
                response.send(result);
            }else{
                response.status(404).send({"id": request.params.id, "error": "Not Found"});
            }
        });
});

//Insert a book
router.post('/', (request, response, next) =>{
    let bookJSON = request.body;
    if (!bookJSON.author || !bookJSON.title)
        HandleError(response, 'Missing Information', 'Form Data Missing', 500);
    else{
        let book = new BookSchema({
            title: bookJSON.title,
            description: bookJSON.description,
            year: bookJSON.year || 0,
            author: bookJSON.author,
            price : bookJSON.price || 0,
            hardCover: bookJSON.hardCover || true
        });
        book.save( (error) => {
            if (error){
                response.send({"error": error});
            }else{
                response.send({"id": book.id});
            }
        });
    }
});

//Modifies a book with the given id
router.patch('/:id', (request, response, next) => {
    BookSchema
        .findById(request.params.id, (error, result) => {
            if (error) {
                response.status(500).send(error);
            }else if (result){
                if (request.body._id){
                    delete request.body._id;
                }
                for (let field in request.body){
                    result[field] = request.body[field];
                }
                result.save((error, book)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send(book);
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

//Deletes a book with the given id
router.delete('/:id', (request, response, next) => {
    BookSchema
        .findById(request.params.id, (error, result)=>{
            if (error) {
                response.status(500).send(error);
            }else if (result){
                result.remove((error)=>{
                    if (error){
                        response.status(500).send(error);
                    }
                    response.send({"deletedId": request.params.id});
                });
            }else{
                response.status(404).send({"id": request.params.id, "error":  "Not Found"});
            }
        });
});

module.exports = router;