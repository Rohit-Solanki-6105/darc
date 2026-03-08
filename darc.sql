create database darc;
use darc;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified BOOLEAN DEFAULT FALSE,
    mobile VARCHAR(20),
    password_hash VARCHAR(255) NOT NULL,
    status ENUM('allowed','warning','blocked') DEFAULT 'allowed',
    is_developer BOOLEAN DEFAULT FALSE,
    total_earning DECIMAL(18,8) DEFAULT 0.00000000,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE agents (
    agent_id INT AUTO_INCREMENT PRIMARY KEY,
    developer_id INT NOT NULL,
    agent_name VARCHAR(255) NOT NULL,
    description TEXT,
    task_fees DECIMAL(18,8),
    agent_price DECIMAL(18,8),
    subscription_fee DECIMAL(18,8),
    subscription_duration_days INT DEFAULT 30,
    agent_template JSON,
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_agent_developer
        FOREIGN KEY (developer_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

CREATE TABLE transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    agent_id INT NOT NULL,
    developer_id INT NOT NULL,
    client_id INT NOT NULL,
    amount DECIMAL(18,8) NOT NULL,
    platform_fee DECIMAL(18,8),
    developer_amount DECIMAL(18,8),
    tx_hash VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    CONSTRAINT fk_transaction_agent
        FOREIGN KEY (agent_id)
        REFERENCES agents(agent_id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaction_developer
        FOREIGN KEY (developer_id)
        REFERENCES users(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_transaction_client
        FOREIGN KEY (client_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);

Select * from users;
