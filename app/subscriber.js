const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const EventEmitter = require('events');
const util = require('util');

function SubscriberEventEmitter() {
  EventEmitter.call(this);
}
util.inherits(SubscriberEventEmitter, EventEmitter);

const subscriberEventEmitter = new SubscriberEventEmitter();

const ABI = {
  bombermanPlatform: [{"constant":false,"inputs":[],"name":"makeNewGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newGame","type":"address"},{"indexed":false,"name":"host","type":"address"}],"name":"NewGame","type":"event"}],
  bomberman: [{"constant":true,"inputs":[],"name":"deliveryExplosionTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"bomberman","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"round","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getAllParticipants","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"reward","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_WINNERS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"participants","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"stake","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_participantNumbers","type":"uint256"},{"name":"_stake","type":"uint256"}],"name":"openGame","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":true,"inputs":[],"name":"getAllPlayerStatus","outputs":[{"name":"","type":"address[]"},{"name":"","type":"bool[]"},{"name":"","type":"uint256[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"EXPLOSION_TIME_ROUND","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"_from","type":"address"},{"name":"_to","type":"address"}],"name":"deliver","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"endGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"gameStatus","outputs":[{"name":"","type":"uint8"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"openedTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"isExplosionTimeLeft","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"participantsLeft","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"JOIN_WAITING_TIME","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"rewardPerWinner","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"join","outputs":[],"payable":true,"stateMutability":"payable","type":"function"},{"constant":false,"inputs":[],"name":"explode","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"startNewRound","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MIN_STAKE","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"lastDeliveryman","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"cancelGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"EXPLOSION_TIME_DELIVERY","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MIN_GUESTS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"MAX_GUESTS","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"CREDIT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"alive","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"roundExplosionTime","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"host","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"readyGame","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"participantNumbers","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"}],"name":"credits","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"receiveReward","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"inputs":[{"name":"_host","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"payable":true,"stateMutability":"payable","type":"fallback"},{"anonymous":false,"inputs":[{"indexed":false,"name":"guestNumbers","type":"uint256"},{"indexed":false,"name":"stake","type":"uint256"},{"indexed":false,"name":"openedTime","type":"uint256"}],"name":"GameOpened","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"},{"indexed":false,"name":"participants","type":"uint256"}],"name":"Joined","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"closedTime","type":"uint256"}],"name":"GameCanceled","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"totalReward","type":"uint256"}],"name":"GameReady","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"currentRound","type":"uint256"}],"name":"GameReset","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"round","type":"uint256"},{"indexed":false,"name":"roundExplosionTime","type":"uint256"}],"name":"GameStarted","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"deliveryman","type":"address"},{"indexed":false,"name":"leftCredits","type":"uint256"},{"indexed":false,"name":"bomberman","type":"address"}],"name":"DeliverFailed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"from","type":"address"},{"indexed":false,"name":"to","type":"address"},{"indexed":false,"name":"deliveryman","type":"address"},{"indexed":false,"name":"deliveryExplosionTime","type":"uint256"}],"name":"BombDelivered","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"bomberman","type":"address"},{"indexed":false,"name":"deliveryman","type":"address"}],"name":"BombExploded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"participant","type":"address"}],"name":"Dead","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"round","type":"uint256"},{"indexed":false,"name":"winners","type":"uint256"},{"indexed":false,"name":"rewardPerWinner","type":"uint256"}],"name":"GameEnded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"receiver","type":"address"},{"indexed":false,"name":"rewardPerWinner","type":"uint256"}],"name":"RewardReceived","type":"event"}],
};

const bombermanPlatform = new web3.eth.Contract(ABI.bombermanPlatform, '0x56bba0957F89A5c2d4da1696139783cc0D968ACD');

const BlockNumber = require('./models/blockNumber');
const GameList = require('./models/gameList');

async function subscribe() {
  let blockNumber;

  const blockNumbers = await BlockNumber.find({id: 'bomberman'});
  if (blockNumbers.length === 0) {
    blockNumber = await web3.eth.getBlockNumber() - 50;
    if (blockNumber < 0) {
      blockNumber = 0;
    }
    const newBlockNumber = new BlockNumber({id: 'bomberman', blockNumber: blockNumber});
    await newBlockNumber.save();
  } else {
    blockNumber = blockNumbers[0].blockNumber;
  }

  bombermanPlatform.events.NewGame({
    fromBlock: blockNumber
  })
    .on('data', function(event) {
      const newGame = event.returnValues.newGame;
      const host = event.returnValues.host;
      console.log('New Game: ', newGame, host);
      const currentBlockNumber = event.blockNumber;
      const id = `${event.transactionHash}-${event.logIndex}`;
      GameList.find({id: id}).then((gameLists) => {
        if (gameLists.length === 0) {
          const newGameList = new GameList({id: id, address: newGame, host: host});
          newGameList.save().then(() => {
            subscriberEventEmitter.emit('NewGame', newGame, host);
            BlockNumber.updateOne({id: 'bomberman'}, {blockNumber: currentBlockNumber}).then(() => {
              console.log('Update Block Number to: ', currentBlockNumber);
            });
          });
        }
      });
    })
    .on('error', console.error);
}

module.exports = {subscriber: subscribe, subscriberEventEmitter};
