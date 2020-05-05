const express = require('express');
const app = express();
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

//POST request thing
app.use((req, res, next) => {
    res.status(200).json({
        message: 'It Works'
    });
});

module.exports = app;