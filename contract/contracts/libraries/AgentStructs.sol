// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

library AgentStructs {

    enum PaymentType {
        ONE_TIME,
        PAY_PER_TASK,
        SUBSCRIPTION
    }

    struct Agent {
        uint256 id;
        address developer;

        string metadataURI;

        bool active;
        bool isPublic;

        PaymentType paymentType;

        uint256 price;
        uint256 taskPrice;

        uint256 subscriptionPrice;
        uint256 subscriptionDuration;

        bool multiClient;
    }
}