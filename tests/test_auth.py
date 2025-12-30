import pytest

from app.models.user import UserRole


async def register_user(client, email: str, role: UserRole):
    return await client.post(
        "/auth/register",
        json={"email": email, "password": "password123", "role": role, "name": "Test User"},
    )


@pytest.mark.asyncio
async def test_register_and_login(client):
    response = await register_user(client, "doctor@example.com", UserRole.DOCTOR)
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "doctor@example.com"

    dup = await register_user(client, "doctor@example.com", UserRole.DOCTOR)
    assert dup.status_code == 400

    login_response = await client.post(
        "/auth/login",
        data={"username": "doctor@example.com", "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert login_response.status_code == 200
    token_data = login_response.json()
    assert token_data["access_token"]

    bad_login = await client.post(
        "/auth/login",
        data={"username": "doctor@example.com", "password": "wrong"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert bad_login.status_code == 401


@pytest.mark.asyncio
async def test_forgot_password(client):
    response = await client.post("/auth/forgot-password", params={"email": "test@example.com"})
    assert response.status_code == 200
    assert "Password reset" in response.json()["message"]
