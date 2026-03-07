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

    uint256 public platformFee = 10;// 10% Fee

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

        (bool success, ) = payable(agent.developer).call{
            value: developerAmount
        }("");

        require(success, "Payment failed");

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

        (bool success, ) = payable(agent.developer).call{
            value: developerAmount
        }("");

        require(success, "Payment failed");

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

        (bool success, ) = payable(agent.developer).call{
            value: developerAmount
        }("");

        require(success, "Payment failed");

        uint256 expiry = block.timestamp + agent.subscriptionDuration;

        accessManager.setSubscription(msg.sender, agentId, expiry);

        emit SubscriptionStarted(agentId, msg.sender, expiry);
    }

    function setPlatformFee(uint256 fee) external onlyOwner {
        platformFee = fee;
    }
}
