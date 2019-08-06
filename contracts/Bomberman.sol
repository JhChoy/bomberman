pragma solidity ^0.5.10;

import "@openzeppelin/contracts/math/SafeMath.sol";

contract Bomberman {
    // Events
    event GameOpened(uint256 guestNumbers, uint256 stake, uint256 openedTime);
    event Joined(address participant, uint256 participants);
    event GameCanceled(uint256 closedTime);
    event GameReady(uint256 totalReward);
    event GameReset(uint256 currentRound);
    event GameStarted(uint256 round, uint256 roundExplosionTime);
    event DeliverFailed(address from, address to, address deliveryman, uint256 leftCredits, address bomberman);
    event BombDelivered(address from, address to, address deliveryman, uint256 deliveryExplosionTime);
    event BombExploded(address bomberman, address deliveryman);
    event Dead(address participant);
    event GameEnded(uint256 round, uint256 winners, uint256 rewardPerWinner);
    event RewardReceived(address receiver, uint256 rewardPerWinner);


    // enum, structure, library
    enum State { CREATED, OPENED, READY, IN_GAME, ENDED, CANCELED }
    using SafeMath for uint256;


    // Global Constants
    uint256 public MAX_GUESTS = 20;
    uint256 public MIN_GUESTS = 3;
    uint256 public MIN_STAKE = 0.01 ether;
    uint256 public MAX_WINNERS = 2;
    uint256 public JOIN_WAITING_TIME = 1 hours;
    // for klaytn
    uint256 public EXPLOSION_TIME_DELIVERY = 30 seconds;
    uint256 public EXPLOSION_TIME_ROUND = 10 minutes;
    // for ethereum
//    uint256 public EXPLOSION_TIME_DELIVERY = 2 minutes;
//    uint256 public EXPLOSION_TIME_ROUND = 1 hours;

    uint256 public CREDIT = 10;


    // Global Variables
    address public host;
    uint256 public stake;
    uint256 public participantNumbers;

    uint256 public openedTime;
    uint256 public round;
    State public gameStatus;

    address payable[] public participants;
    mapping(address => bool) public alive;
    uint256 public participantsLeft;
    mapping(address => uint256) public credits;
    address public bomberman;
    uint256 public roundExplosionTime;
    address payable public lastDeliveryman;
    uint256 public deliveryExplosionTime;

    uint256 public reward;
    uint256 public rewardPerWinner;



    // Modifier
    modifier onlyHost() {
        require(msg.sender == host, "Not host");
        _;
    }

    modifier checkState(State _state) {
        require(gameStatus == _state, "Invalid State");
        _;
    }

    modifier onlyAlive(address _target) {
        require(alive[_target], "Not Alive");
        _;
    }


    // Constructor
    constructor(address _host) public {
        require(_host != address(0), "Zero address");
        host = _host;
        gameStatus = State.CREATED;
    }


    // fallback
    function() external payable {
        require(msg.sender == address(this), "Just for this contract");
        reward = reward.add(msg.value);
    }


    // Getter Functions
    function isExplosionTimeLeft() public view returns(bool) {
        if (block.timestamp >= roundExplosionTime) {
            return false;
        }
        if (block.timestamp >= deliveryExplosionTime) {
            return false;
        }
        return true;
    }


    // Public Functions
    function openGame(uint256 _participantNumbers, uint256 _stake) public onlyHost checkState(State.CREATED) payable {
        require(_participantNumbers >= MIN_GUESTS, "Too much _participantNumbers");
        require(_participantNumbers <= MAX_GUESTS, "Too few _participantNumbers");
        require(_stake > MIN_STAKE, "Too much _stake");

        participantNumbers = _participantNumbers;
        stake = _stake;

        gameStatus = State.OPENED;
        openedTime = block.timestamp;
        emit GameOpened(_participantNumbers, _stake, openedTime);

        join();
    }

    function join() public payable checkState(State.OPENED) {
        require(!_isContract(msg.sender), "Contract");
        require(msg.value >= stake, "Insufficient funds");
        require(!alive[msg.sender], "Already joined");
        require(participants.length < participantNumbers, "Fully joined");

        alive[msg.sender] = true;
        credits[msg.sender] = CREDIT;
        reward = reward.add(stake);
        participants.push(msg.sender);

        if (msg.value > stake) {
            msg.sender.transfer(msg.value.sub(stake));
        }

        uint256 currentParticipants = participants.length;
        emit Joined(msg.sender, currentParticipants);
    }

    function cancelGame() public checkState(State.OPENED) onlyAlive(msg.sender) {
        require(block.timestamp >= openedTime.add(JOIN_WAITING_TIME), "Should wait more to cancel");

        uint256 joinedNumber = participants.length;
        for (uint256 i = 0; i < joinedNumber; i++) {
            reward = reward.sub(stake);
            address payable participant = participants[i];

            participant.transfer(stake);
            alive[participant] = false;
        }
        gameStatus = State.CANCELED;
        emit GameCanceled(block.timestamp);
    }

    function readyGame() public onlyAlive(msg.sender) checkState(State.OPENED) {
        require(participants.length == participantNumbers, "Not ready");
        gameStatus = State.READY;
        participantsLeft = participants.length;
        emit GameReady(reward);
    }

    function startNewRound() public onlyAlive(msg.sender) checkState(State.READY) {
        round = round.add(1);
        lastDeliveryman = address(this);
        bomberman = msg.sender;
        roundExplosionTime = block.timestamp.add(EXPLOSION_TIME_ROUND);
        deliveryExplosionTime = block.timestamp.add(EXPLOSION_TIME_DELIVERY);

        gameStatus = State.IN_GAME;
        emit GameStarted(round, roundExplosionTime);
    }

    function deliver(address _from, address _to) public onlyAlive(msg.sender) onlyAlive(_from) onlyAlive(_to) checkState(State.IN_GAME) {
        if (!isExplosionTimeLeft()) {
            explode();
            return;
        }
        if (bomberman == _from) {
            bomberman = _to;
            lastDeliveryman = msg.sender;
            deliveryExplosionTime = block.timestamp.add(EXPLOSION_TIME_DELIVERY);

            emit BombDelivered(_from, _to, msg.sender, deliveryExplosionTime);
        } else {
            uint256 leftCredits = credits[msg.sender].sub(1);
            credits[msg.sender] = leftCredits;
            emit DeliverFailed(_from, _to, msg.sender, leftCredits, bomberman);

            if (leftCredits == 0) {
                _kill(msg.sender);
                if (msg.sender == bomberman) {
                    _resetGame();
                }
            }
        }
    }

    function explode() public checkState(State.IN_GAME) {
        require(!isExplosionTimeLeft(), "Explosion time left");
        emit BombExploded(bomberman, lastDeliveryman);
        _kill(bomberman);

        uint256 killReward = stake.div(2);
        reward = reward.sub(killReward);
        lastDeliveryman.transfer(killReward);

        _resetGame();
    }

    function endGame() public onlyAlive(msg.sender) checkState(State.READY) {
        require(participantsLeft < MAX_WINNERS, "Too much winners");
        rewardPerWinner = reward.div(participantsLeft);

        gameStatus = State.ENDED;
        emit GameEnded(round, participantsLeft, rewardPerWinner);
    }

    function receiveReward() public onlyAlive(msg.sender) checkState(State.ENDED) { // state
        alive[msg.sender] = false;
        msg.sender.transfer(rewardPerWinner);
        emit RewardReceived(msg.sender, rewardPerWinner);
    }

    // Private Functions
    function _isContract(address _addr) private view returns (bool isContract) {
        uint32 size;
        assembly {
            size := extcodesize(_addr)
        }
        return (size > 0);
    }

    function _kill(address _target) onlyAlive(_target) private {
        require(participantsLeft > 1, "At least 1 should be alive");

        alive[_target] = false;
        if (credits[_target] > 0) {
            credits[_target] = 0;
        }
        participantsLeft = participantsLeft.sub(1);
        emit Dead(_target);
    }

    function _resetGame() private {
        gameStatus = State.READY;
        emit GameReset(round);
    }
}
