/**
 * Created by Jeanphill on 17/08/2016.
 */
var Carnet = require('../models/carnet');
var Facture = require('../models/facture');

module.exports = function(router, isTokenValid) {
    router.post('/carnet', isTokenValid, function(req, res) {
        var carnet = new Carnet();

        carnet.title = req.body.title;
        carnet.created_by = req.user;
        carnet.factures = [];

        carnet.save(function(err) {
            if(err) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            res.json({
                success: true,
                carnet: carnet
            });
        });
    });

    router.get('/carnets', isTokenValid, function(req, res) {
        Carnet.find({ created_by: req.user }, function(err, carnets) {
           if(err || !carnets) {
               console.log(err);
               return res.json({
                   success: false
               });
           }

           res.json({
               success: true,
               carnets: carnets
           });
        });
    });

    router.get('/carnet/:id/factures', isTokenValid, function(req, res) {
        Carnet.findById(req.params.id, function(err, carnet) {
            if(err || !carnet) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            Facture.find({ _id: { "$in": carnet.factures }}, function(err, factures) {
                res.json({
                    success: true,
                    factures: factures
                });
            });

        });
    });

    router.patch('/carnet/:id', isTokenValid, function(req, res) {
        // TODO verifier si bon utilisateur req.user
        Carnet.findById(req.params.id, function(err, carnet) {
            if(err || !carnet) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            carnet.title = req.body.title;

            carnet.save(function(err) {
                if(err) {
                    console.log(err);
                    return res.json({
                        success: false
                    });
                }

                res.json({
                    success: true
                });
            });
        });
    });

    router.delete('/carnet/:id', isTokenValid, function(req, res) {
        Carnet.findById(req.params.id, function(err, carnet) {
            if(err || !carnet) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            carnet.remove(function(err) {
                if(err) {
                    console.log(err);
                    return res.json({
                        success: false
                    });
                }

                res.json({
                    success: true
                });
            });
        });
    });

}
