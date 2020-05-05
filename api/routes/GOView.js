const express = require('express');
const router = express.Router();

const SteamUser = require('steam-user');
const GlobalOffensive = require('@yaroslav-95/globaloffensive');

let user = new SteamUser();
let csgo = new GlobalOffensive(user);
//Log in our steam user
user.logOn({
    accountName: "username",
    password: "password"
});
//When steam user logs in, start CSGO
user.on('loggedOn', () => {
    console.log("Logged in to Steam");
    user.gamesPlayed([730]);
});
csgo.on("connectedToGC", () => {
    console.log("Connected to GC!");
});

router.get('/RequestGame', (req, res, next) => {
    const match = {
        matchId: req.query['matchId'],
        outcomeId: req.query['outcomeId'],
        token: req.query['token']
    }
    res.status(200).json({
        message: 'Requested match',
        match: match
    });
});

module.exports = router;