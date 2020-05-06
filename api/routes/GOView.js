const express = require('express');
const router = express.Router();
require('dotenv').config();

const SteamUser = require('steam-user');
const GlobalOffensive = require('@yaroslav-95/globaloffensive');

let user = new SteamUser();
let csgo = new GlobalOffensive(user);

//Log in our steam user when server starts
SteamLoginWithEnv();

router.get('/RequestGame', (req, res, next) => {
    const match = {
        matchId: req.query['matchId'],
        outcomeId: req.query['outcomeId'],
        token: req.query['token']
    }
    
    if (csgo._isInCSGO) {
        res.status(200).json({
            message: 'Requested match',
            match: match
        });
    }
    else {
        SteamLoginWithEnv();

        const error = new Error("Could not send request at this time, please try again later. If issue persists, contact support.");
        error.status = 500;
        next(error);
    }
});

function SteamLogin(username, password) {
    if (!(username === "" || password === "")) {
        user.logOn({
            accountName: username,
            password: password
        });
    }
    else {
        console.log("Skipping log in");
    }
}
function SteamLoginWithEnv() {
    SteamLogin(process.env.USERNAME || "", process.env.PASSWORD || "");
}

//When steam user logs in, start CSGO
user.on('loggedOn', () => {
    console.log("Logged in to Steam");
    user.gamesPlayed([730]);
});
csgo.on("connectedToGC", () => {
    console.log("Connected to GC");
});
user.on('error', (err) => {
    console.log(err);
});

module.exports = router;