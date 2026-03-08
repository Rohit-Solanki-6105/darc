# DARC Backend - Quick Start Guide

## ⚡ 5-Minute Setup

### Step 1: Install Dependencies
```bash
cd darc_backend
pip install -r requirements.txt
```

### Step 2: Apply Database Migrations
```bash
python manage.py makemigrations
python manage.py migrate
```

### Step 3: Create Admin User
```bash
python manage.py createsuperuser
# Follow prompts to create superuser account
```

### Step 4: Run Server
```bash
python manage.py runserver
```

Server runs at: `http://localhost:8000`

---

## 🌐 API Base URLs

```
API Root:        http://localhost:8000/api/
Admin Panel:     http://localhost:8000/admin/
Users API:       http://localhost:8000/api/users/
Agents API:      http://localhost:8000/api/agents/
Transactions API: http://localhost:8000/api/transactions/
Reviews API:     http://localhost:8000/api/reviews/
```

---

## 📚 API Examples

### 1. Register a New User
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "password": "securepass123",
    "password_confirm": "securepass123",
    "is_developer": false,
    "mobile": "+1234567890"
  }'
```

### 2. Register a Developer
```bash
curl -X POST http://localhost:8000/api/users/ \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane@example.com",
    "password": "devpass123",
    "password_confirm": "devpass123",
    "is_developer": true
  }'
```

### 3. Login
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "jane@example.com",
    "password": "devpass123"
  }'
```

### 4. Create an Agent (Developer Only)
```bash
curl -X POST http://localhost:8000/api/agents/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_name": "Smart Analytics Bot",
    "description": "AI-powered analytics for businesses",
    "task_fees": "0.05000000",
    "agent_price": "99.99000000",
    "subscription_fee": "9.99000000",
    "subscription_duration_days": 30,
    "agent_template": {
      "version": "1.0",
      "capabilities": ["analytics", "reporting"]
    }
  }'
```

### 5. List All Agents
```bash
curl http://localhost:8000/api/agents/
```

### 6. Get Approved Agents Only
```bash
curl http://localhost:8000/api/agents/?status=approved
```

### 7. Search Agents
```bash
curl "http://localhost:8000/api/agents/?search=analytics"
```

### 8. Create a Transaction
```bash
curl -X POST http://localhost:8000/api/transactions/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": 1,
    "developer_id": 2,
    "client_id": 3,
    "amount": "50.00000000",
    "platform_fee": "5.00000000",
    "tx_hash": "0xabcd1234"
  }'
```

### 9. Create a Review
```bash
curl -X POST http://localhost:8000/api/reviews/ \
  -H "Content-Type: application/json" \
  -d '{
    "agent_id": 1,
    "rating": "4.5",
    "title": "Excellent bot!",
    "comment": "Works perfectly for our analytics needs."
  }'
```

### 10. Get Agent Statistics
```bash
curl http://localhost:8000/api/agents/1/statistics/
```

---

## 🛠️ Database Management

### Create Migrations After Model Changes
```bash
python manage.py makemigrations
```

### Apply Migrations
```bash
python manage.py migrate
```

### Reset Database (Development Only)
```bash
python manage.py migrate agents zero  # Revert all migrations
python manage.py migrate              # Reapply
```

### View Migration Status
```bash
python manage.py showmigrations
```

---

## 📊 Django Admin

Access at: `http://localhost:8000/admin/`

**Features:**
- Manage Users (edit status, is_developer flag)
- View & approve/reject Agents
- Monitor Transactions
- Review submitted reviews

---

## 🔑 Key Features

### Users App
- User registration with password hashing
- User login functionality
- Profile management
- Developer account support
- Account status tracking (allowed/warning/blocked)

### Agents App
- Create, list, update, delete agents
- Agent approval workflow (pending → approved/rejected)
- Agent template support (JSON)
- Rating system
- Subscription pricing

### Transactions App
- Create immutable transactions
- Track platform fees and developer earnings
- Blockchain tx_hash support
- Summary reports
- Filter by developer, client, or agent

### Reviews App
- Submit and manage reviews
- Rating system (0-5 stars)
- Verified buyer badge
- Helpful count tracking
- Agent review statistics
- Auto-update agent rating

---

## 📁 File Structure

```
darc_backend/
├── users/              # User management app
├── agents/             # Agent marketplace app
├── transactions/       # Transaction processing app
├── reviews/            # Review & rating app
├── darc_backend/       # Project settings & URLs
├── manage.py           # Django management
├── requirements.txt    # Python dependencies
├── API_DOCUMENTATION.md     # Full API reference
├── SETUP_SUMMARY.md         # Setup details
└── QUICK_START.md           # This file
```

---

## 🧪 Testing APIs

### Using Postman
1. Open Postman
2. Create new collection
3. Add requests for each endpoint
4. Reference `API_DOCUMENTATION.md` for all endpoints

### Using REST Client (VS Code Extension)
1. Create `.rest` file
2. Add requests in format:
```
POST http://localhost:8000/api/users/
Content-Type: application/json

{
  "first_name": "Test",
  "last_name": "User",
  "email": "test@example.com",
  "password": "testpass123",
  "password_confirm": "testpass123"
}
```

### Using Python Requests
```python
import requests

# Register user
response = requests.post('http://localhost:8000/api/users/', json={
    'first_name': 'John',
    'last_name': 'Doe',
    'email': 'john@example.com',
    'password': 'securepass123',
    'password_confirm': 'securepass123'
})
print(response.json())

# List agents
response = requests.get('http://localhost:8000/api/agents/')
print(response.json())
```

---

## ⚙️ Configuration

### CORS Settings (settings.py)
```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]
```

Update with your frontend URLs.

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

Update credentials as needed.

---

## 🐛 Common Issues

### Issue: "No such table"
**Solution:** Run migrations
```bash
python manage.py migrate
```

### Issue: "ModuleNotFoundError"
**Solution:** Install dependencies
```bash
pip install -r requirements.txt
```

### Issue: "Connection refused to MySQL"
**Solution:** Check if MySQL is running and update database credentials in settings.py

### Issue: Port 8000 already in use
**Solution:** Use different port
```bash
python manage.py runserver 8001
```

---

## 📝 Documentation

- **Full API Reference:** See `API_DOCUMENTATION.md`
- **Setup Details:** See `SETUP_SUMMARY.md`
- **Django Docs:** https://docs.djangoproject.com/
- **DRF Docs:** https://www.django-rest-framework.org/

---

## Next Steps

1. ✅ Install dependencies
2. ✅ Run migrations
3. ✅ Create superuser
4. ✅ Start development server
5. Test APIs using cURL or Postman
6. Connect frontend (Next.js app)
7. Deploy to production

---

**Happy coding! 🚀**
