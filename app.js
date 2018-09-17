var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
    
    // deal with post param
    var bodyParser = require('body-parser');
    app.use(bodyParser.json()); // support json encoded bodies
    app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

    // set the view engine to ejs
    app.set('view engine', 'ejs');

    var pseudo;

    app.get('/', function (req, res) {
        res.sendfile(__dirname + '/acceuil.html');
    });

    app.post('/', function(req,res){
        var PostPseudo = req.body.inputPseudo;
        var PostOnglet = req.body.inputOnglet;
        res.render('tchat', { PostPseudo:PostPseudo,PostOnglet:PostOnglet } );
    });

// var allClients = [];
io.on('connection', function (socket, pseudo) {

    // allClients.push(socket.id);

    socket.on('nouveau_client', function(pseudo,socket) {
        pseudo = ent.encode(pseudo);
        socket.broadcast.emit('nouveau_client', pseudo);
        // var i = allClients.indexOf(socket.id);
        // allClients.push(pseudo);
        // console.log('---');
        // console.log(allClients);
        // socket.broadcast.emit('listeClients',allClients);
    });

    socket.on('message', function (message, pseudo) {
        message = ent.encode(message);
        pseudo = ent.encode(pseudo);
        socket.broadcast.emit('message', {pseudo: pseudo, message: message});
    });

   //  socket.on('disconnect', function(socket,pseudo) {

   //    var i = allClients.indexOf(socket.id);
   //    allClients.splice(i, 1);
   //    console.log('---');
   //    console.log(allClients);
   //    // socket.broadcast.emit('listeClients',allClients);
   // });

});
server.listen(8080); 

