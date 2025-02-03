const mongoose = require("mongoose");
const Listing = require("./listingSchema");

let dbConnection = null;

module.exports = {
    initialize: function (connectionString) {
        return new Promise((resolve, reject) => {
            if (dbConnection) {
                resolve();
                return;
            }
            mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
                .then(() => {
                    dbConnection = mongoose.connection;
                    resolve();
                })
                .catch((err) => reject(err));
        });
    },

    addListing: function (listingData) {
        return new Promise((resolve, reject) => {
            Listing.create(listingData)
                .then(listing => resolve(listing))
                .catch(err => reject(err));
        });
    },

    getAllListings: function (page, perPage, nameFilter) {
        return new Promise((resolve, reject) => {
            let query = nameFilter ? { name: new RegExp(nameFilter, "i") } : {};

            Listing.find(query)
                .skip((page - 1) * perPage)
                .limit(perPage)
                .then(listings => resolve(listings))
                .catch(err => reject(err));
        });
    },

    getListingById: function (id) {
        return new Promise((resolve, reject) => {
            Listing.findById(id)
                .then(listing => resolve(listing))
                .catch(err => reject(err));
        });
    },

    updateListing: function (id, listingData) {
        return new Promise((resolve, reject) => {
            Listing.findByIdAndUpdate(id, listingData, { new: true })
                .then(updatedListing => resolve(updatedListing))
                .catch(err => reject(err));
        });
    },

    deleteListing: function (id) {
        return new Promise((resolve, reject) => {
            Listing.findByIdAndDelete(id)
                .then(() => resolve())
                .catch(err => reject(err));
        });
    }
};
