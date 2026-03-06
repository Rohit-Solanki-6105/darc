// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./libraries/AgentStructs.sol";

contract AgentRegistry is Ownable {

    using AgentStructs for AgentStructs.Agent;
    constructor() Ownable(msg.sender) {}
    uint256 public agentCount;

    mapping(uint256 => AgentStructs.Agent) private agents;

    event AgentRegistered(uint256 agentId, address developer);
    event AgentUpdated(uint256 agentId);

    function registerAgent(
        string memory name,
        string memory metadataURI,
        bool isPublic,
        bool payPerTask,
        uint256 price,
        uint256 taskPrice,
        uint256 maxClients
    ) external {

        agentCount++;

        agents[agentCount] = AgentStructs.Agent({
            id: agentCount,
            developer: msg.sender,
            name: name,
            metadataURI: metadataURI,
            isPublic: isPublic,
            payPerTask: payPerTask,
            price: price,
            taskPrice: taskPrice,
            maxClients: maxClients,
            clients: 0,
            active: true
        });

        emit AgentRegistered(agentCount, msg.sender);
    }

    function updateAgent(
        uint256 agentId,
        string memory metadataURI,
        uint256 price,
        uint256 taskPrice
    ) external {

        AgentStructs.Agent storage agent = agents[agentId];

        require(msg.sender == agent.developer, "Not developer");

        agent.metadataURI = metadataURI;
        agent.price = price;
        agent.taskPrice = taskPrice;

        emit AgentUpdated(agentId);
    }

    function getAgent(uint256 agentId)
        external
        view
        returns (AgentStructs.Agent memory)
    {
        return agents[agentId];
    }

}