const express = require('express');
const router = express.Router();

require('dotenv').config();

const { ShareCode } = require('globaloffensive-sharecode');

const SteamUser = require('steam-user');
const GlobalOffensive = require('@oxters168/globaloffensive');

let user = new SteamUser();
let csgo = new GlobalOffensive(user);

//Log in our steam user when server starts
SteamLoginWithEnv();

const requestGame = (match) => new Promise((resolve, reject) => {
    console.log("Requesting game details");
    csgo.requestGame(match.matchId, match.outcomeId, match.token);
    csgo.on('matchList', (body) =>
    {
        resolve(body);
    });
    user.on('error', (err) => {
        reject(err);
    });
});

router.get('/RequestGame', (req, res, next) => {
    match = {
        matchId: req.query['matchId'],
        outcomeId: req.query['outcomeId'],
        token: req.query['token']
    }
    const sharecode = req.query['sharecode'];
    if (!(sharecode == null)) {
        match = new ShareCode(sharecode).decode();
    }
    
    if (csgo._isInCSGO) {
        requestGame(match)
        .then((result) => {
            console.log(result);
            res.status(200).send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).json({ error: err });
        });
    }
    else {
        SteamLoginWithEnv();

        const error = new Error("Could not send request at this time, please try again later. If issue persists, contact support.");
        res.status(500).json({ error: error });
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
    SteamLogin(process.env.STEAM_USERNAME || "", process.env.STEAM_PASSWORD || "");
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