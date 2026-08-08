# Felizardo's Event Place — API Reference

Base URL (development): `http://localhost:5000/api`

All responses follow this envelope:
```json
{ "success": true, "data": <payload> }
{ "success": false, "message": "Error description" }
```

Protected routes require the header:
```
Authorization: Bearer <token>
```

---

## Auth

### POST `/api/auth/login`
**Public** — Authenticate admin and receive a JWT.

**Request body:**
```json
{
  "email": "admin@felizardos.com",
  "password": "felizardos2025"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIs...",
    "admin": {
      "id": "66f1a2b3c4d5e6f7a8b9c0d1",
      "email": "admin@felizardos.com",
      "name": "Felizardo Admin"
    }
  }
}
```

**Response `401` — wrong credentials:**
```json
{ "success": false, "message": "Invalid email or password" }
```

---

## Facilities

### GET `/api/facilities`
**Public** — Returns all facilities.

Query parameters:
- `showOnLanding=true` — filter to landing page venues only

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "id": "pavilion",
      "name": "The Pavilion",
      "type": "Event Hall",
      "capacity": 200,
      "status": "active",
      "showOnLanding": true,
      "description": "An open-air garden sanctuary...",
      "amenities": ["Garden backdrop", "Sound system", "..."],
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z"
    }
  ]
}
```

---

### GET `/api/facilities/:id`
**Public** — Returns one facility by its slug id (e.g. `pavilion`, `pool`).

**Response `404`:**
```json
{ "success": false, "message": "Facility not found" }
```

---

### POST `/api/facilities` 🔒
**Protected** — Create a new facility.

**Request body:**
```json
{
  "id": "function-hall",
  "name": "Function Hall",
  "type": "Function Room",
  "capacity": 100,
  "status": "active",
  "showOnLanding": false,
  "description": "Indoor air-conditioned function hall.",
  "amenities": ["A/C", "Projector", "Whiteboard"]
}
```

**Response `201`:**
```json
{ "success": true, "data": { ...facility } }
```

---

### PUT `/api/facilities/:id` 🔒
**Protected** — Replace all fields of a facility.

**Request body:** same shape as POST (partial updates also accepted).

---

### PATCH `/api/facilities/:id/status` 🔒
**Protected** — Update only the status field.

**Request body:**
```json
{ "status": "maintenance" }
```
Status values: `active` | `maintenance` | `inactive`

---

### PATCH `/api/facilities/:id/landing` 🔒
**Protected** — Toggle landing page visibility.

**Request body:**
```json
{ "showOnLanding": false }
```

---

### DELETE `/api/facilities/:id` 🔒
**Protected** — Delete a facility.

**Response `200`:**
```json
{ "success": true, "data": null }
```

---

## Schedules

All schedule routes are **Protected** 🔒.

### GET `/api/schedules`
Returns all bookings, sorted by date ascending.

Query parameters:
- `facilityId=pavilion` — filter by facility
- `date=2025-09-15` — filter by specific date (returns all bookings for that day)

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "facilityId": "pavilion",
      "title": "Santos Wedding Reception",
      "clientName": "Jose & Maria Santos",
      "date": "2025-09-18T00:00:00.000Z",
      "startTime": "15:00",
      "endTime": "22:00",
      "status": "confirmed",
      "guests": 180,
      "packageName": "Premium",
      "phone": "+63 912 111 2222",
      "notes": "White & gold theme.",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### GET `/api/schedules/:id` 🔒
Returns one booking by MongoDB `_id`.

---

### POST `/api/schedules` 🔒
Create a new booking.

**Request body:**
```json
{
  "facilityId": "pool",
  "title": "Garcia Family Reunion",
  "clientName": "Pedro Garcia",
  "date": "2025-10-05",
  "startTime": "10:00",
  "endTime": "18:00",
  "status": "pending",
  "guests": 75,
  "packageName": "Wave",
  "phone": "+63 915 000 1111",
  "notes": "Requires floating decorations."
}
```

---

### PUT `/api/schedules/:id` 🔒
Update all fields of a booking.

---

### PATCH `/api/schedules/:id/status` 🔒
Update booking status only.

**Request body:**
```json
{ "status": "confirmed" }
```
Status values: `pending` | `confirmed` | `cancelled` | `completed`

---

### DELETE `/api/schedules/:id` 🔒
Delete a booking.

---

## Maintenance

All maintenance routes are **Protected** 🔒.

### GET `/api/maintenance`
Returns all maintenance tasks, sorted by scheduledDate ascending.

Query parameters:
- `facilityId=pool` — filter by facility
- `status=in-progress` — filter by status
- `priority=critical` — filter by priority

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "facilityId": "pool",
      "title": "Monthly Pool Filter Cleaning",
      "description": "Full backwash and chemical balance check.",
      "priority": "high",
      "status": "in-progress",
      "scheduledDate": "2025-09-16T00:00:00.000Z",
      "assignee": "Maintenance Team A",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

### GET `/api/maintenance/:id` 🔒
Returns one task by MongoDB `_id`.

---

### POST `/api/maintenance` 🔒
Create a maintenance task.

**Request body:**
```json
{
  "facilityId": "andoy",
  "title": "Court Night Lighting Repair",
  "description": "Two flood light bulbs burnt out on poles 3 & 4.",
  "priority": "high",
  "status": "scheduled",
  "scheduledDate": "2025-09-19",
  "assignee": "Electrician — J. Magsino"
}
```

Priority values: `low` | `medium` | `high` | `critical`
Status values: `scheduled` | `in-progress` | `completed`

---

### PUT `/api/maintenance/:id` 🔒
Update all fields of a maintenance task.

---

### PATCH `/api/maintenance/:id/status` 🔒
Update task status only.

**Request body:**
```json
{ "status": "completed" }
```

---

### DELETE `/api/maintenance/:id` 🔒
Delete a maintenance task.

---

## Site Content

### GET `/api/content`
**Public** — Returns landing page copy and contact information.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "heroTagline": "Premium Event Venue · Philippines",
    "heroTitle": "Where Every Moment Becomes",
    "heroHighlight": "A Memory",
    "heroSubtitle": "Two stunning venues...",
    "contactAddress": "Felizardo's Event Place, Batangas, Philippines",
    "contactPhone": "+63 912 345 6789",
    "contactEmail": "events@felizardos.com",
    "contactHours": "Monday – Saturday, 9:00 AM – 6:00 PM",
    "pavilionDescription": "An open-air masterpiece...",
    "poolDescription": "Dive into a tropical paradise...",
    "updatedAt": "..."
  }
}
```

---

### PUT `/api/content` 🔒
**Protected** — Update landing page content. Send only the fields you want to change (upserts the singleton).

**Request body (partial example):**
```json
{
  "heroTagline": "Award-Winning Event Venue · Batangas",
  "contactPhone": "+63 999 888 7777"
}
```

---

## Admin Settings

### GET `/api/settings`
**Protected** — Returns current admin settings.

**Response `200`:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "venueName": "Felizardo's Event Place",
    "address": "Felizardo's Event Place, Batangas, Philippines",
    "phone": "+63 912 345 6789",
    "email": "events@felizardos.com",
    "hours": "Monday – Saturday, 9:00 AM – 6:00 PM",
    "notifyNewBooking": true,
    "notifyMaintenance": true,
    "notifyPayment": false,
    "updatedAt": "..."
  }
}
```

---

### PUT `/api/settings` 🔒
**Protected** — Update admin settings. Send only the fields you want to change.

**Request body (partial example):**
```json
{
  "venueName": "Felizardo's Event Place",
  "notifyPayment": true
}
```

---

## Error Codes

| Code | Meaning |
|---|---|
| `400` | Bad request — missing or invalid fields |
| `401` | Unauthorized — no token, invalid token, or wrong credentials |
| `404` | Resource not found |
| `500` | Server error — check server logs |

---

## Quick Reference: Protected Routes

| Method | Path | What it does |
|---|---|---|
| POST | `/api/auth/login` | Login — returns JWT |
| GET | `/api/facilities` | List facilities (public) |
| GET | `/api/facilities/:id` | Get one facility (public) |
| POST | `/api/facilities` 🔒 | Create facility |
| PUT | `/api/facilities/:id` 🔒 | Update facility |
| PATCH | `/api/facilities/:id/status` 🔒 | Toggle status |
| PATCH | `/api/facilities/:id/landing` 🔒 | Toggle landing visibility |
| DELETE | `/api/facilities/:id` 🔒 | Delete facility |
| GET | `/api/schedules` 🔒 | List bookings |
| GET | `/api/schedules/:id` 🔒 | Get one booking |
| POST | `/api/schedules` 🔒 | Create booking |
| PUT | `/api/schedules/:id` 🔒 | Update booking |
| PATCH | `/api/schedules/:id/status` 🔒 | Update booking status |
| DELETE | `/api/schedules/:id` 🔒 | Delete booking |
| GET | `/api/maintenance` 🔒 | List tasks |
| GET | `/api/maintenance/:id` 🔒 | Get one task |
| POST | `/api/maintenance` 🔒 | Create task |
| PUT | `/api/maintenance/:id` 🔒 | Update task |
| PATCH | `/api/maintenance/:id/status` 🔒 | Update task status |
| DELETE | `/api/maintenance/:id` 🔒 | Delete task |
| GET | `/api/content` | Get site content (public) |
| PUT | `/api/content` 🔒 | Update site content || GET | `/api/settings` 🔒 | Get admin settings |
| PUT | `/api/settings` 🔒 | Update admin settings |
🔒 = requires `Authorization: Bearer <token>` header
