const { BN, expectRevert, constants, ether } = require('openzeppelin-test-helpers');

const BombermanPlatform = artifacts.require('BombermanPlatform');
const Bomberman = artifacts.require('Bomberman');

contract('Bomberman Game', accounts => {
  const [owner, host, unknown, ...guests] = accounts;

  let bombermanPlatform;

  before(async () => {
    bombermanPlatform = await BombermanPlatform.new({ from: owner });
  });

  describe('A game', () => {
    let bomberman;
    let participants = [];
    it('should make a game', async () => {
      const { logs } = await bombermanPlatform.makeNewGame({from: host});
      printEvent(logs);
      bomberman = await Bomberman.at(logs[0].args.newGame);
    });

    it('should open game', async () => {
      const {logs} = await bomberman.openGame(4, ether('1'), {from: host, value: ether('1')});
      printEvent(logs);
    });

    it('should join', async () => {
      const g = guests.slice(4);
      for(let i = 0; i < g.length; i++) {
        const {logs} = await bomberman.join({from: g[i], value: ether('1')});
        printEvent(logs);
      }
      participants.push(host, ...g);
    });

    it('should be ready', async () => {
      await expectRevert(bomberman.readyGame({from: unknown}), "Not Alive");
      const {logs} = await bomberman.readyGame({from: participants[0]});
      printEvent(logs);
    });

    it('should start round', async () => {
      const {logs} = await bomberman.startNewRound({from: participants[0]});
      printEvent(logs);
    });

    it('should ', () => {

    });
  });
});


function printEvent(logs) {
  logs.forEach(log => {
    let str = `${log.event}(`;
    let trigger = false;
    Object.keys(log.args).forEach((arg) => {
      if (trigger) {
        str += `${arg}: ${log.args[arg]}, `
      }
      if (arg === '__length__') {
        trigger = true;
      }
    });
    console.log(str.slice(0, -2) + ')');
  });
}
