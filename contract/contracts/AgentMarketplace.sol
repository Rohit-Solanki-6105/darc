// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

import "./AgentRegistry.sol";
import "./AgentAccessManager.sol";
import "./libraries/AgentStructs.sol";

contract AgentMarketplace is Ownable, ReentrancyGuard {
    AgentRegistry public registry;
    AgentAccessManager public accessManager;

    uint256 public platformFee = 5;

    uint256 public platformBalance;

    mapping(uint256 => uint256) public agentEarnings;
    mapping(uint256 => uint256) public agentWithdrawn;

    mapping(address => address) public developerPayoutAddress;

    event AgentPurchased(uint256 agentId, address buyer);
    event TaskExecuted(uint256 agentId, address user);
    event SubscriptionStarted(uint256 agentId, address user, uint256 expiry);

    constructor(
        address registryAddress,
        address accessAddress
    ) Ownable(msg.sender) {
        registry = AgentRegistry(registryAddress);
        accessManager = AgentAccessManager(accessAddress);
    }

    function updatePayoutAddress(address newAddress) external {
        require(newAddress != address(0), "Invalid address");

        developerPayoutAddress[msg.sender] = newAddress;
    }

    function getPayoutAddress(address developer) public view returns (address) {
        address payout = developerPayoutAddress[developer];

        if (payout == address(0)) {
            return developer;
        }

        return payout;
    }

    function buyAgent(uint256 agentId) external payable nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.active, "Inactive agent");
        require(
            agent.paymentType == AgentStructs.PaymentType.ONE_TIME,
            "Wrong payment type"
        );

        require(msg.value >= agent.price, "Insufficient payment");

        uint256 fee = (msg.value * platformFee) / 100;
        uint256 developerAmount = msg.value - fee;

        agentEarnings[agentId] += developerAmount;
        platformBalance += fee;

        accessManager.setOwnership(msg.sender, agentId);

        emit AgentPurchased(agentId, msg.sender);
    }

    function payPerTask(uint256 agentId) external payable nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.active, "Inactive agent");
        require(
            agent.paymentType == AgentStructs.PaymentType.PAY_PER_TASK,
            "Wrong payment type"
        );

        require(msg.value >= agent.taskPrice, "Insufficient payment");

        uint256 fee = (msg.value * platformFee) / 100;
        uint256 developerAmount = msg.value - fee;

        agentEarnings[agentId] += developerAmount;
        platformBalance += fee;

        emit TaskExecuted(agentId, msg.sender);
    }

    function subscribeAgent(uint256 agentId) external payable nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.active, "Inactive agent");

        require(
            agent.paymentType == AgentStructs.PaymentType.SUBSCRIPTION,
            "Wrong payment type"
        );

        require(msg.value >= agent.subscriptionPrice, "Insufficient payment");

        uint256 fee = (msg.value * platformFee) / 100;
        uint256 developerAmount = msg.value - fee;

        agentEarnings[agentId] += developerAmount;
        platformBalance += fee;

        uint256 expiry = block.timestamp + agent.subscriptionDuration;

        accessManager.setSubscription(msg.sender, agentId, expiry);

        emit SubscriptionStarted(agentId, msg.sender, expiry);
    }

    function withdrawAgentEarnings(uint256 agentId) external nonReentrant {
        AgentStructs.Agent memory agent = registry.getAgent(agentId);

        require(agent.developer == msg.sender, "Not developer");

        uint256 amount = agentEarnings[agentId] - agentWithdrawn[agentId];

        require(amount > 0, "No earnings");

        agentWithdrawn[agentId] += amount;

        address payout = getPayoutAddress(msg.sender);

        (bool success, ) = payable(payout).call{value: amount}("");

        require(success, "Withdraw failed");
    }

    function withdrawPlatformFees() external onlyOwner nonReentrant {
        uint256 amount = platformBalance;

        require(amount > 0, "No fees");

        platformBalance = 0;

        (bool success, ) = payable(owner()).call{value: amount}("");

        require(success, "Withdraw failed");
    }

    function setPlatformFee(uint256 fee) external onlyOwner {
        platformFee = fee;
    }
}
