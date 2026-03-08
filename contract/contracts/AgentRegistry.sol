// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/AgentStructs.sol";

contract AgentRegistry is Ownable {
    uint256 public agentCounter;

    mapping(uint256 => AgentStructs.Agent) public agents;

    event AgentRegistered(uint256 agentId, address developer);
    event AgentUpdated(uint256 agentId);

    constructor() Ownable(msg.sender) {}

    function registerAgent(
        string memory metadataURI,
        bool isPublic,
        AgentStructs.PaymentType paymentType,
        uint256 price,
        uint256 taskPrice,
        uint256 subscriptionPrice,
        uint256 subscriptionDuration,
        bool multiClient
    ) external {
        agentCounter++;

        agents[agentCounter] = AgentStructs.Agent({
            id: agentCounter,
            developer: msg.sender,
            metadataURI: metadataURI,
            active: true,
            isPublic: isPublic,
            paymentType: paymentType,
            price: price,
            taskPrice: taskPrice,
            subscriptionPrice: subscriptionPrice,
            subscriptionDuration: subscriptionDuration,
            multiClient: multiClient
        });

        emit AgentRegistered(agentCounter, msg.sender);
    }

    function updateAgent(
        uint256 agentId,
        string memory metadataURI,
        bool active
    ) external {
        AgentStructs.Agent storage agent = agents[agentId];

        require(agent.developer == msg.sender, "Not developer");

        agent.metadataURI = metadataURI;
        agent.active = active;

        emit AgentUpdated(agentId);
    }

    function getAgent(
        uint256 agentId
    ) external view returns (AgentStructs.Agent memory) {
        return agents[agentId];
    }
}
