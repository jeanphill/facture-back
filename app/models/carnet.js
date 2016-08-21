/**
 * Created by Jeanphill on 17/08/2016.
 */
var mongoose = require('mongoose');

var CarnetSchema = new mongoose.Schema({
    title: {
        type: String
    },
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        index: true
    },
    factures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Facture"
    }],
    created_at: Date
});

CarnetSchema.pre('save', function(next) {
    var now = new Date();

    if(!this.created_at) {
        this.created_at = now;
    }

    if(!this.isModified()) {
        return next();
    }
    next();
});

module.exports = mongoose.model('Carnet', CarnetSchema);