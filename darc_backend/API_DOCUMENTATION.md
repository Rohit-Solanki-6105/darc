# DARC Backend API Documentation

## Overview
DARC (Decentralized Agent Marketplace) is a Django REST API for managing agents, users, transactions, and reviews.

## Installation & Setup

### Prerequisites
- Python 3.8+
- MySQL 5.7+
- pip

### Setup Instructions

1. **Create Virtual Environment**
```bash
python -m venv venv
source venv/Scripts/activate  # Windows
source venv/bin/activate       # Linux/Mac
```

2. **Install Dependencies**
```bash
pip install -r requirements.txt
```

3. **Create Database**
```bash
# Open MySQL and run:
CREATE DATABASE darc;
```

4. **Run Migrations**
```bash
python manage.py migrate
```

5. **Create Superuser (Admin)**
```bash
python manage.py createsuperuser
```

6. **Run Development Server**
```bash
python manage.py runserver
```

## API Endpoints

### Base URL
```
http://localhost:8000/api/
```

---

## Users API (`/api/users/`)

### Endpoints

#### 1. Create User (Register)
**POST** `/api/users/`
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john@example.com",
  "mobile": "+1234567890",
  "is_developer": false,
  "password": "securepass123",
  "password_confirm": "securepass123"
}
```

#### 2. Login
**POST** `/api/users/login/`
```json
{
  "email": "john@example.com",
  "password": "securepass123"
}
```

#### 3. Get User Profile
**GET** `/api/users/{id}/`

#### 4. Get Current User
**GET** `/api/users/me/` (Requires authentication)

#### 5. Update User
**PUT** `/api/users/{id}/`
```json
{
  "first_name": "John",
  "last_name": "Doe",
  "mobile": "+1234567890",
  "email": "john@example.com"
}
```

#### 6. Change Password
**POST** `/api/users/change_password/` (Requires authentication)
```json
{
  "old_password": "oldpass123",
  "new_password": "newpass123"
}
```

#### 7. List All Developers
**GET** `/api/users/developers/`

#### 8. List All Users
**GET** `/api/users/?is_developer=false`

---

## Agents API (`/api/agents/`)

### Endpoints

#### 1. Create Agent
**POST** `/api/agents/` (Requires developer account)
```json
{
  "agent_name": "AI Assistant Bot",
  "description": "Helpful AI assistant for customer service",
  "task_fees": "0.01000000",
  "agent_price": "100.00000000",
  "subscription_fee": "9.99000000",
  "subscription_duration_days": 30,
  "agent_template": {
    "version": "1.0",
    "capabilities": ["chat", "analysis"]
  }
}
```

#### 2. List Agents
**GET** `/api/agents/`
- Filter by status: `?status=approved`
- Search: `?search=AI`
- Order by: `?ordering=-created_at` or `?ordering=rating`

#### 3. Get Agent Details
**GET** `/api/agents/{id}/`

#### 4. Update Agent
**PUT/PATCH** `/api/agents/{id}/`
```json
{
  "agent_name": "Updated AI Bot",
  "description": "Updated description",
  "agent_price": "120.00000000"
}
```

#### 5. Delete Agent
**DELETE** `/api/agents/{id}/`

#### 6. Get Approved Agents
**GET** `/api/agents/approved/`

#### 7. Get Pending Agents
**GET** `/api/agents/pending/`

#### 8. Get Agent Statistics
**GET** `/api/agents/{id}/statistics/`
```json
{
  "agent_id": 1,
  "agent_name": "AI Assistant",
  "average_rating": 4.5,
  "total_reviews": 10,
  "total_transactions": 5,
  "total_revenue": "500.00000000"
}
```

#### 9. Approve Agent (Admin)
**POST** `/api/agents/{id}/approve/`

#### 10. Reject Agent (Admin)
**POST** `/api/agents/{id}/reject/`

---

## Transactions API (`/api/transactions/`)

### Endpoints

#### 1. Create Transaction
**POST** `/api/transactions/`
```json
{
  "agent_id": 1,
  "developer_id": 2,
  "client_id": 3,
  "amount": "50.00000000",
  "platform_fee": "5.00000000",
  "tx_hash": "0x1234567890abcdef"
}
```

#### 2. List Transactions
**GET** `/api/transactions/`
- Filter by agent: `?agent_id=1`
- Filter by developer: `?developer_id=2`
- Filter by client: `?client_id=3`

#### 3. Get Transaction Details
**GET** `/api/transactions/{id}/`

#### 4. Developer Transactions
**GET** `/api/transactions/developer_transactions/?developer_id=2`

#### 5. Client Transactions
**GET** `/api/transactions/client_transactions/?client_id=3`

#### 6. Agent Transactions
**GET** `/api/transactions/agent_transactions/?agent_id=1`

#### 7. Transaction Summary
**GET** `/api/transactions/summary/?developer_id=2`
```json
{
  "total_transactions": 5,
  "total_amount": "250.00000000",
  "total_platform_fee": "25.00000000",
  "total_developer_amount": "225.00000000"
}
```

---

## Reviews API (`/api/reviews/`)

### Endpoints

#### 1. Create Review
**POST** `/api/reviews/`
```json
{
  "agent_id": 1,
  "rating": "4.5",
  "title": "Great AI Assistant",
  "comment": "Works perfectly for our needs. Highly recommended!"
}
```

#### 2. List Reviews
**GET** `/api/reviews/`
- Filter by agent: `?agent_id=1`
- Filter by reviewer: `?reviewer_id=2`
- Filter by rating: `?rating=5`

#### 3. Get Review Details
**GET** `/api/reviews/{id}/`

#### 4. Update Review
**PUT/PATCH** `/api/reviews/{id}/`
```json
{
  "rating": "5.0",
  "title": "Excellent AI Assistant",
  "comment": "Even better than expected!"
}
```

#### 5. Delete Review
**DELETE** `/api/reviews/{id}/`

#### 6. Agent Reviews
**GET** `/api/reviews/agent_reviews/?agent_id=1`

#### 7. Agent Statistics
**GET** `/api/reviews/agent_statistics/?agent_id=1`
```json
{
  "agent_id": 1,
  "average_rating": 4.5,
  "total_reviews": 10,
  "verified_reviews": 8,
  "rating_distribution": {
    "5.0": 5,
    "4.0": 3,
    "3.0": 2,
    "2.0": 0,
    "1.0": 0
  }
}
```

#### 8. Mark Review as Helpful
**POST** `/api/reviews/{id}/mark_helpful/`

#### 9. User Reviews
**GET** `/api/reviews/user_reviews/?reviewer_id=2`

---

## Data Models

### User
```
id: integer (PK)
first_name: string(100)
last_name: string(100)
email: string(255) - unique
email_verified: boolean
mobile: string(20)
password_hash: string(255)
status: enum ['allowed', 'warning', 'blocked']
is_developer: boolean
total_earning: decimal(18,8)
created_at: datetime
updated_at: datetime
```

### Agent
```
agent_id: integer (PK)
developer_id: integer (FK -> User)
agent_name: string(255)
description: text
task_fees: decimal(18,8)
agent_price: decimal(18,8)
subscription_fee: decimal(18,8)
rating: decimal(10,8)
subscription_duration_days: integer
agent_template: JSON
status: enum ['pending', 'approved', 'rejected']
created_at: datetime
updated_at: datetime
```

### Transaction
```
transaction_id: integer (PK)
agent_id: integer (FK -> Agent)
developer_id: integer (FK -> User)
client_id: integer (FK -> User)
amount: decimal(18,8)
platform_fee: decimal(18,8)
developer_amount: decimal(18,8)
tx_hash: string(255) - unique
created_at: datetime
updated_at: datetime
```

### Review
```
review_id: integer (PK)
agent_id: integer (FK -> Agent)
reviewer_id: integer (FK -> User)
rating: decimal(3,1)
title: string(200)
comment: text
verified_buyer: boolean
helpful_count: integer
created_at: datetime
updated_at: datetime
```

---

## Authentication

Currently, the API uses:
- Token Authentication
- Session Authentication (for browsable API)
- AllowAny (public endpoints)

To add token authentication:
1. Users receive a token upon login
2. Include token in header: `Authorization: Token <token>`

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Invalid request data",
  "field_name": ["error message"]
}
```

### 401 Unauthorized
```json
{
  "error": "Invalid credentials"
}
```

### 403 Forbidden
```json
{
  "error": "Permission denied"
}
```

### 404 Not Found
```json
{
  "error": "Resource not found"
}
```

---

## Pagination

Default page size: 10 items

Get next page: `?page=2`

Change page size: `?page_size=20`

---

## Testing with cURL

```bash
# Register user
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{...}'

# Login
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"securepass123"}'

# Get agents
curl http://localhost:8000/api/agents/

# Create agent (requires is_developer=true)
curl -X POST http://localhost:8000/api/agents/ \
  -H "Content-Type: application/json" \
  -d '{...}'
```

---

## Database Migrations

```bash
# Create migrations
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# View migration status
python manage.py showmigrations
```

---

## Admin Interface

Access at: `http://localhost:8000/admin/`

Login with superuser credentials created during setup.
