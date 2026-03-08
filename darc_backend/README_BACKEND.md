# DARC Backend API - Complete Setup

## 📋 What Was Created

### Models (4 Apps)
✅ **Users App** - User management with authentication
✅ **Agents App** - Agent marketplace with approval workflow  
✅ **Transactions App** - Transaction processing & tracking
✅ **Reviews App** - Reviews, ratings, & agent statistics

### API Endpoints (50+ endpoints)
✅ **User Endpoints** - Registration, login, profile management
✅ **Agent Endpoints** - CRUD, filtering, search, statistics, approval
✅ **Transaction Endpoints** - Create, list, summaries, filtering  
✅ **Review Endpoints** - Create, manage, statistics, helpfulness

### Serializers (14 total)
✅ User (4 serializers) - Create, Read, Update, Login
✅ Agent (4 serializers) - Create, Read, Update, List
✅ Transaction (3 serializers) - Create, List, Detail
✅ Review (3 serializers) - Create, Update, List

### Configuration
✅ Django REST Framework setup
✅ CORS headers configured
✅ Filtering & search enabled
✅ Pagination configured
✅ Django Admin for all models
✅ URL routing for all endpoints
✅ Requirements.txt updated

---

## 🚀 Quick Start (3 steps)

### 1. Install & Migrate
```bash
pip install -r requirements.txt
python manage.py migrate
```

### 2. Create Admin Account
```bash
python manage.py createsuperuser
```

### 3. Run Server
```bash
python manage.py runserver
```

**API Running at:** `http://localhost:8000/api/`

---

## 📚 Complete Documentation

| Document | Purpose |
|----------|---------|
| **QUICK_START.md** | 5-minute setup & common examples |
| **API_DOCUMENTATION.md** | Full API reference with all endpoints |
| **SETUP_SUMMARY.md** | Detailed setup info & architecture |

---

## 🔌 API Endpoints Overview

### Users (`/api/users/`)
```
POST   /                    - Register new user
POST   /login/              - User login
GET    /me/                 - Current user info
GET    /{id}/               - Get user profile
PUT    /{id}/               - Update profile
POST   /change_password/    - Change password
GET    /developers/         - List all developers
GET    /                    - List all users
```

### Agents (`/api/agents/`)
```
POST   /                    - Create agent (dev only)
GET    /                    - List agents (searchable)
GET    /{id}/               - Get agent details
PUT    /{id}/               - Update agent (owner only)
DELETE /{id}/               - Delete agent (owner only)
GET    /approved/           - List approved agents
GET    /pending/            - List pending agents
GET    /{id}/statistics/    - Agent statistics
POST   /{id}/approve/       - Approve agent (admin)
POST   /{id}/reject/        - Reject agent (admin)
```

### Transactions (`/api/transactions/`)
```
POST   /                    - Create transaction
GET    /                    - List transactions
GET    /{id}/               - Get details
GET    /developer_transactions/  - Dev transactions
GET    /client_transactions/     - Client transactions
GET    /agent_transactions/      - Agent transactions
GET    /summary/            - Transaction summary
```

### Reviews (`/api/reviews/`)
```
POST   /                    - Create review
GET    /                    - List reviews (filterable)
GET    /{id}/               - Get review details
PUT    /{id}/               - Update review (owner only)
DELETE /{id}/               - Delete review (owner only)
GET    /agent_reviews/      - Reviews for an agent
GET    /agent_statistics/   - Agent review stats
POST   /{id}/mark_helpful/  - Mark review helpful
GET    /user_reviews/       - User's reviews
```

---

## 📊 Database Models

### User
```
id, first_name, last_name, email, mobile,
email_verified, password_hash, status,
is_developer, total_earning, created_at, updated_at
```

### Agent
```
agent_id, developer_id (FK), agent_name, description,
task_fees, agent_price, subscription_fee, rating,
subscription_duration_days, agent_template (JSON),
status, created_at, updated_at
```

### Transaction
```
transaction_id, agent_id (FK), developer_id (FK),
client_id (FK), amount, platform_fee, developer_amount,
tx_hash, created_at, updated_at
```

### Review
```
review_id, agent_id (FK), reviewer_id (FK), rating,
title, comment, verified_buyer, helpful_count,
created_at, updated_at
```

---

## 🛠️ Tech Stack

```
Framework:     Django 6.0.3
REST API:      Django REST Framework 3.14.0
Database:      MySQL 5.7+
Python:        3.8+
CORS:          django-cors-headers 4.3.1
Filtering:     django-filter 24.1
```

---

## ✨ Features Implemented

### Authentication & Security
- ✅ User registration with password hashing
- ✅ User login functionality
- ✅ Password change endpoint
- ✅ Permission-based access control
- ✅ Token authentication ready

### Agent Management
- ✅ Create agents (developers only)
- ✅ Approval workflow (pending → approved/rejected)
- ✅ Agent statistics (reviews, transactions, rating)
- ✅ Subscription pricing support
- ✅ JSON template storage

### Transaction Tracking
- ✅ Transaction creation (immutable)
- ✅ Platform fee & developer amount calculation
- ✅ Blockchain tx_hash support
- ✅ Transaction summaries & reporting
- ✅ Multi-user filtering

### Review System
- ✅ User reviews & ratings (0-5 stars)
- ✅ Verified buyer badge
- ✅ Review statistics per agent
- ✅ Helpful count tracking
- ✅ Auto-update agent rating
- ✅ Unique constraint (one review per user per agent)

### API Features
- ✅ Pagination (10 items per page)
- ✅ Advanced filtering
- ✅ Full-text search
- ✅ Ordering/sorting
- ✅ CORS enabled for frontend
- ✅ JSON responses
- ✅ Proper error handling

### Admin Dashboard
- ✅ User management
- ✅ Agent approval interface
- ✅ Transaction monitoring
- ✅ Review management
- ✅ Filtered list views
- ✅ Search capabilities

---

## 📝 Example API Calls

### Register User
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"John",
    "last_name":"Doe",
    "email":"john@example.com",
    "password":"test123",
    "password_confirm":"test123"
  }'
```

### Create Agent
```bash
curl -X POST http://localhost:8000/api/agents/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name":"ChatBot",
    "description":"AI assistant",
    "agent_price":"99.99000000"
  }'
```

### Create Transaction
```bash
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id":1,
    "developer_id":2,
    "client_id":3,
    "amount":"50.00000000"
  }'
```

### Create Review
```bash
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id":1,
    "rating":"4.5",
    "title":"Great!",
    "comment":"Works perfectly"
  }'
```

---

## 🔧 Configuration

### Database (settings.py)
```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'darc',
        'USER': 'root',
        'PASSWORD': 'root',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}
```

### CORS (settings.py)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

### Pagination
```python
REST_FRAMEWORK = {
    'PAGE_SIZE': 10
}
```

---

## 📂 Project Structure

```
darc_backend/
├── agents/              ← Agent app (CRUD, approval, stats)
│   ├── models.py        ← Agent model
│   ├── views.py         ← API viewsets
│   ├── serializers.py   ← Data serialization
│   ├── urls.py          ← URL routing
│   └── admin.py         ← Django admin
├── users/               ← User app (auth, profile)
│   ├── models.py        ← User model
│   ├── views.py         ← API viewsets
│   ├── serializers.py   ← Data serialization
│   ├── urls.py          ← URL routing
│   └── admin.py         ← Django admin
├── transactions/        ← Transaction app (payments)
│   ├── models.py        ← Transaction model
│   ├── views.py         ← API viewsets
│   ├── serializers.py   ← Data serialization
│   ├── urls.py          ← URL routing
│   └── admin.py         ← Django admin
├── reviews/             ← Review app (ratings)
│   ├── models.py        ← Review model
│   ├── views.py         ← API viewsets
│   ├── serializers.py   ← Data serialization
│   ├── urls.py          ← URL routing
│   └── admin.py         ← Django admin
├── darc_backend/        ← Project config
│   ├── settings.py      ← Settings (updated)
│   ├── urls.py          ← Main URLs (updated)
│   ├── asgi.py
│   └── wsgi.py
├── manage.py            ← Django management
├── requirements.txt     ← Dependencies (updated)
├── README.md            ← This file
├── QUICK_START.md       ← Quick setup guide
├── API_DOCUMENTATION.md ← Full API docs
└── SETUP_SUMMARY.md     ← Setup details
```

---

## 🚦 Running the Project

### Development Server
```bash
python manage.py runserver
```

### With Custom Port
```bash
python manage.py runserver 8001
```

### With Custom Host
```bash
python manage.py runserver 0.0.0.0:8000
```

---

## 🧪 Testing

### Run All Tests
```bash
python manage.py test
```

### Run Specific App Tests
```bash
python manage.py test agents
python manage.py test users
python manage.py test transactions
python manage.py test reviews
```

---

## 📐 Data Validation

- **Emails:** Valid email format required
- **Passwords:** Hashed with Django's PBKDF2
- **Financial:** Decimal(18,8) precision
- **Ratings:** 0.0 to 5.0 range
- **Status:** Enum values (allowed/warning/blocked)
- **Agent Status:** pending/approved/rejected
- **Unique:** email, tx_hash, (agent_id, reviewer_id)

---

## 🔐 Security Features

- Password hashing (PBKDF2)
- CORS protection
- Permission-based access
- Data validation
- SQL injection prevention
- CSRF protection

---

## 📈 Performance Tips

1. **Indexes:** All foreign keys and frequently queried fields indexed
2. **Pagination:** Default 10 items per page
3. **Database:** Use database indexes for filtering
4. **Cache:** Consider caching for read-heavy endpoints

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| "No such table" | Run `python manage.py migrate` |
| "ModuleNotFoundError" | Install dependencies `pip install -r requirements.txt` |
| "Connection refused" | Check MySQL is running |
| "Port 8000 in use" | Use `python manage.py runserver 8001` |

---

## 📞 Support Resources

- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/
- **MySQL Docs:** https://dev.mysql.com/doc/

---

## ✅ Checklist

- [x] Models created (User, Agent, Transaction, Review)
- [x] Serializers created (14 total)
- [x] API views created with filtering & search
- [x] URLs configured
- [x] Django admin configured
- [x] Requirements.txt updated
- [x] CORS enabled
- [x] DRF configured
- [x] Documentation created
- [x] Ready for frontend integration

---

## 🎉 You're All Set!

Your DARC backend is now fully configured and ready to use!

### Next Steps:
1. Install dependencies: `pip install -r requirements.txt`
2. Run migrations: `python manage.py migrate`
3. Create admin account: `python manage.py createsuperuser`
4. Start server: `python manage.py runserver`
5. Visit admin panel: `http://localhost:8000/admin/`
6. Test APIs: Use cURL, Postman, or reference API_DOCUMENTATION.md

**Happy coding! 🚀**
