pragma solidity ^0.5.10;

import "./Bomberman.sol";

contract BombermanPlatform {
    // Events
    event NewGame(address newGame, address host);

    function makeNewGame() public {
        Bomberman newGame = new Bomberman(msg.sender);
        emit NewGame(address(newGame), msg.sender);
    }
}
