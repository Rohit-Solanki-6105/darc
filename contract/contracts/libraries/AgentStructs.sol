// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library AgentStructs {

    struct Agent {
        uint256 id;
        address developer;
        string name;
        string metadataURI;
        bool isPublic;
        bool payPerTask;
        uint256 price;
        uint256 taskPrice;
        uint256 maxClients;
        uint256 clients;
        bool active;
    }

}