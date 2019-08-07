const express = require('express');
const router = express.Router();

const GameList = require('../models/gameList');

/* GET home page. */
router.get('/', function(req, res, next) {
  GameList.find({}).then((dBGames) => {
    const games = dBGames.map((game) => {
      return {
        address: game.address,
        host: game.host,
      }
    });
    res.render('index', { title: 'Bomberman', games: JSON.stringify(games)});
  });
});

module.exports = router;
