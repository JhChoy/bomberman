const express = require('express');
const router = express.Router();

const GameList = require('../models/gameList');

router.get('/:address', function(req, res, next) {
  const address = req.params.address;
  GameList.findOne({address: address}).then(game => {
    res.render('game', { title: 'Bomberman Game Room', address: game.address, host: game.host});
  });
});

module.exports = router;
