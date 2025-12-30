import pytest

from app.models.user import UserRole


async def register_user(client, email: str, role: UserRole):
    resp = await client.post(
        "/auth/register",
        json={"email": email, "password": "password123", "role": role, "name": "Test User"},
    )
    assert resp.status_code == 201
    return resp.json()


async def login(client, email: str):
    resp = await client.post(
        "/auth/login",
        data={"username": email, "password": "password123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"},
    )
    assert resp.status_code == 200
    token = resp.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


@pytest.mark.asyncio
async def test_booking_flow(client):
    doctor = await register_user(client, "doc@example.com", UserRole.DOCTOR)
    patient = await register_user(client, "pat@example.com", UserRole.PATIENT)

    doctor_headers = await login(client, doctor["email"])
    patient_headers = await login(client, patient["email"])

    availability_resp = await client.post(
        "/doctors/availability",
        json={"start_time": "2030-01-01T09:00:00", "end_time": "2030-01-01T17:00:00"},
        headers=doctor_headers,
    )
    assert availability_resp.status_code == 201

    booking_resp = await client.post(
        "/appointments",
        json={
            "doctor_id": doctor["id"],
            "start_time": "2030-01-01T10:00:00",
            "end_time": "2030-01-01T11:00:00",
        },
        headers=patient_headers,
    )
    assert booking_resp.status_code == 201
    appointment = booking_resp.json()

    double_book = await client.post(
        "/appointments",
        json={
            "doctor_id": doctor["id"],
            "start_time": "2030-01-01T10:30:00",
            "end_time": "2030-01-01T11:30:00",
        },
        headers=patient_headers,
    )
    assert double_book.status_code == 400

    outside = await client.post(
        "/appointments",
        json={
            "doctor_id": doctor["id"],
            "start_time": "2030-01-02T10:00:00",
            "end_time": "2030-01-02T11:00:00",
        },
        headers=patient_headers,
    )
    assert outside.status_code == 400

    my_appts = await client.get("/appointments", headers=patient_headers)
    assert my_appts.status_code == 200
    assert len(my_appts.json()) == 1

    doctor_appts = await client.get("/doctors/me/appointments", headers=doctor_headers)
    assert doctor_appts.status_code == 200
    assert len(doctor_appts.json()) == 1

    cancel = await client.delete(f"/appointments/{appointment['id']}", headers=patient_headers)
    assert cancel.status_code == 200

    after_cancel = await client.get("/appointments", headers=patient_headers)
    assert after_cancel.status_code == 200
    assert len(after_cancel.json()) == 0
