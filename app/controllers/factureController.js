/**
 * Created by Jeanphill on 17/08/2016.
 */
var Facture = require('../models/facture');
var Carnet = require('../models/carnet');

module.exports = function(router, isTokenValid) {
    router.post('/carnet/:id/facture', isTokenValid, function(req, res) {
        var facture = new Facture();

        facture.produits = req.body.produits;

        facture.save(function(err, newFacture) {
            if(err) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            Carnet.findById(req.params.id, function(err, carnet) {
                if(err || !carnet) {
                    console.log(err);
                    return res.json({
                        success: false
                    });
                }

                carnet.factures.push(newFacture);

                carnet.save(function(err) {
                    if(err) {
                        console.log(err);
                        return res.json({
                            success: false
                        });
                    }
                })
            });

            res.json({
                success: true
            });
        });
    });

    router.delete('/facture/:id', isTokenValid, function(req, res) {
        Facture.findById(req.params.id, function(err, facture) {
            if(err || !facture) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            facture.remove(function(err) {
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

    router.patch('/facture/:id', isTokenValid, function(req, res) {
        Facture.findById(req.params.id, function(err, facture) {
            if(err || !facture) {
                console.log(err);
                return res.json({
                    success: false
                });
            }

            facture.produits = req.body.produits;

            facture.save(function(err) {
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