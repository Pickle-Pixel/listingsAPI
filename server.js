/********************************************************************************
 *  WEB422 – Assignment 1
 *  
 *  I declare that this assignment is my own work in accordance with Seneca's
 *  Academic Integrity Policy:
 *  https://www.senecapolytechnic.ca/about/policies/academic-integrity-policy.html
 *  
 *  Name: Hamzeh Muhiar | Student ID: 158248237 | Date: 02/03/2025
 *  Published URL: https://listings-api-omega.vercel.app
 ********************************************************************************/

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const db = require("./modules/listingsDB");

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// Log connection attempt
console.log("Connecting to MongoDB...");

db.initialize(process.env.MONGODB_CONN_STRING)
    .then(() => {
        console.log("OK! successfully connected to MongoDB!");
        app.listen(HTTP_PORT, () => {
            console.log(`OK! Server listening on port ${HTTP_PORT}`);
        });
    })
    .catch(err => {
        console.error("NO! Database connection failed:", err);
    });

// Routes
app.post("/api/listings", (req, res) => {
    db.addListing(req.body)
        .then(listing => res.status(201).json(listing))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/api/listings", (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const perPage = parseInt(req.query.perPage) || 10;
    const name = req.query.name || "";

    db.getAllListings(page, perPage, name)
        .then(listings => res.json(listings))
        .catch(err => res.status(500).json({ error: err.message }));
});

app.get("/api/listings/:id", (req, res) => {
    db.getListingById(req.params.id)
        .then(listing => {
            if (listing) res.json(listing);
            else res.status(404).json({ error: "Listing not found" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.put("/api/listings/:id", (req, res) => {
    db.updateListing(req.params.id, req.body)
        .then(updatedListing => {
            if (updatedListing) res.json(updatedListing);
            else res.status(404).json({ error: "Listing not found" });
        })
        .catch(err => res.status(500).json({ error: err.message }));
});

app.delete("/api/listings/:id", (req, res) => {
    db.deleteListing(req.params.id)
        .then(() => res.status(204).send())
        .catch(err => res.status(500).json({ error: err.message }));
});
