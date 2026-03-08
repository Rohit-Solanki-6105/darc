import json
import bcrypt
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.db import connection


# =========================
# USER SIGNUP
# =========================

@csrf_exempt
def signup_user(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        name = data.get("name", "").strip()
        email = data.get("email", "").lower().strip()
        password = data.get("password")
        role = data.get("role", "client")

        if not name or not email or not password:
            return JsonResponse({"error": "Missing required fields"}, status=400)

        # split name
        name_parts = name.split(" ")
        first_name = name_parts[0]
        last_name = " ".join(name_parts[1:]) if len(name_parts) > 1 else ""

        # hash password
        password_hash = bcrypt.hashpw(
            password.encode("utf-8"), bcrypt.gensalt()
        ).decode("utf-8")

        # developer flag
        is_developer = 1 if role == "developer" else 0

        with connection.cursor() as cursor:

            # check if email exists
            cursor.execute(
                "SELECT id FROM users WHERE email = %s",
                [email]
            )

            if cursor.fetchone():
                return JsonResponse(
                    {"error": "Email already registered"},
                    status=400
                )

            # insert user
            cursor.execute(
                """
                INSERT INTO users
                (first_name, last_name, email, password_hash, is_developer)
                VALUES (%s, %s, %s, %s, %s)
                """,
                [first_name, last_name, email, password_hash, is_developer]
            )

        return JsonResponse({
            "message": "User registered successfully",
            "email": email,
            "role": role
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)


# =========================
# USER LOGIN
# =========================

@csrf_exempt
def login_user(request):

    if request.method != "POST":
        return JsonResponse({"error": "Only POST method allowed"}, status=405)

    try:
        data = json.loads(request.body)

        email = data.get("email", "").lower().strip()
        password = data.get("password")

        if not email or not password:
            return JsonResponse(
                {"error": "Email and password required"},
                status=400
            )

        with connection.cursor() as cursor:

            cursor.execute(
                """
                SELECT id, first_name, last_name, password_hash, is_developer
                FROM users
                WHERE email = %s
                """,
                [email]
            )

            user = cursor.fetchone()

            if not user:
                return JsonResponse(
                    {"error": "Invalid email or password"},
                    status=401
                )

            user_id, first_name, last_name, password_hash, is_developer = user

            # verify password
            if not bcrypt.checkpw(
                password.encode("utf-8"),
                password_hash.encode("utf-8")
            ):
                return JsonResponse(
                    {"error": "Invalid email or password"},
                    status=401
                )

            role = "developer" if is_developer else "client"

        return JsonResponse({
            "message": "Login successful",
            "user": {
                "id": user_id,
                "name": f"{first_name} {last_name}",
                "email": email,
                "role": role
            }
        })

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)