/**
 * Created by Jeanphill on 17/08/2016.
 */
var mongoose = require('mongoose');

var FactureSchema = new mongoose.Schema({
    produits: [{
        name: String,
        price: Number
    }],
    created_at: Date
});

FactureSchema.pre('save', function(next) {
    var now = new Date();

    if(!this.created_at) {
        this.created_at = now;
    }

    if(!this.isModified()) {
        return next();
    }
    next();
});

module.exports = mongoose.model('Facture', FactureSchema);