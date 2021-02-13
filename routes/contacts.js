var express = require('express');
var router = express.Router();
let faker = require('faker/locale/es');
const { ObjectID, ReplSet } = require('mongodb');
router.use(express.json());
router.use(express.urlencoded({ extended: false }));

// Todos los contactos
router.get('/', function (req, res, next) {

    req.app.locals.db.collection("contact").find().sort({ "name": 1 }).toArray(function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.render('index', { contacts: data, title: "Página principal", section_title: "Todos los contactos" });
        }
    });
});


// Nuevo  contacto
router.get('/new', function (req, res, next) {
    res.render('new_contact', { title: "Nuevo contacto", section_title: "Nuevo contacto" });
});

router.post('/new', function (req, res, next) {
    let name = req.body.name;
    let lastname = req.body.lastname;
    let phone = req.body.phone;
    let email = req.body.email;
    let address = req.body.address;
    let zip = req.body.zip;

    req.app.locals.db.collection("contact").insertOne({ name, lastname, phone, email, address, zip }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        }
        else {
            res.redirect('/');
        }
    });
});


// Editar contacto
router.get('/edit/:id', function (req, res, next) {
    let id = new ObjectID(req.params.id);
    req.app.locals.db.collection("contact").findOne({ "_id": id }, function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        }
        else {
            res.render('edit_contact', { title: "Editar contacto", contact: data, section_title: "Editar contacto" });
        }
    });
});
router.put('/edit/:id', function (req, res, next) {
    let id = new ObjectID(req.params.id);
    let name = req.body.name;
    let lastname = req.body.lastname;
    let phone = req.body.phone;
    let email = req.body.email;
    let address = req.body.address;
    let zip = req.body.zip;

    req.app.locals.db.collection("contact").updateOne({ "_id": id }, { $set: { name, lastname, phone, email, address, zip } }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito');
        }
    });
});

// Eliminar contacto
router.delete('/:id', function (req, res, next) {
    let id = new ObjectID(req.body.id);

    req.app.locals.db.collection("contact").deleteOne({ "_id": id }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito')
        }
    });
});

// Fav
router.put('/:id/fav', function (req, res, next) {
    let id = new ObjectID(req.body.id);
    let fav = req.body.fav;

    req.app.locals.db.collection("contact").updateOne({ "_id": id }, { $set: { fav } }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito');
        }
    });
});

// Un-Fav
router.put('/:id/unfav', function (req, res, next) {
    let id = new ObjectID(req.body.id);
    let fav = req.body.fav;

    req.app.locals.db.collection("contact").updateOne({ "_id": id }, { $set: { fav } }, function (err) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.json('Exito');
        }
    });
});

// Show FAVS
router.get('/favs', function (req, res, next) {
    let fav = true;
    req.app.locals.db.collection("contact").find({ fav }).sort({ "name": 1 }).toArray(function (err, data) {
        if (err != null) {
            console.log(err);
            res.send({ mensaje: "error: " + err });
        } else {
            res.render('index', { contacts: data, title: "Contactos favoritos", section_title: "Contactos Favoritos" });
        }
    });
});

router.get('/fake/:num', function (req, res, next) {
    let name = "", lastname = "", phone = "", email = "", address = "", zip = "";

    for (let i = 0; i < +req.params.num; i++) {
        name = faker.name.firstName();
        lastname = faker.name.lastName();
        phone = faker.phone.phoneNumber();
        email = faker.internet.email();
        address = faker.address.streetAddress();
        zip = faker.address.zipCode();
        fav = false;

        req.app.locals.db.collection("contact").insertOne({ name, lastname, phone, email, address, zip, fav }, function (err) {
            if (err != null) {
                console.log(err);
                res.send({ mensaje: "error: " + err });
            }
        });
    }
    res.redirect('/contacts');
});

module.exports = router;