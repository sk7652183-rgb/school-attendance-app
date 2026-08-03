# School Attendance API

A Node.js + Express + MongoDB backend for tracking school attendance, with JWT auth, role-based access (admin/teacher), daily/monthly reports, and CSV export.

## Setup

```bash
npm install
cp .env.example .env
# edit .env with your MongoDB URI and JWT secret

# create the first admin account
node seedAdmin.js

# start the server
npm run dev    # with nodemon
npm start      # plain node
```

Default seeded admin: `admin@school.com` / `ChangeMe123!` — change this immediately after first login.

## Roles

- **admin** — full access: manage classes, students, users, attendance, reports
- **teacher** — can view classes/students, mark and update attendance, view reports (cannot create classes/students/users or delete attendance)

## Auth

All routes except `/api/auth/login` require a `Authorization: Bearer <token>` header.

| Method | Route | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | admin | Create a new user (admin or teacher) |
| POST | `/api/auth/login` | public | Log in, returns JWT |
| GET | `/api/auth/me` | any logged-in user | Get current user profile |

## Classes

| Method | Route | Access |
|---|---|---|
| GET | `/api/classes` | any |
| GET | `/api/classes/:id` | any |
| POST | `/api/classes` | admin |
| PUT | `/api/classes/:id` | admin |
| DELETE | `/api/classes/:id` | admin |

## Students

| Method | Route | Access |
|---|---|---|
| GET | `/api/students?classId=` | any |
| GET | `/api/students/:id` | any |
| POST | `/api/students` | admin |
| PUT | `/api/students/:id` | admin |
| DELETE | `/api/students/:id` | admin |

## Attendance

| Method | Route | Access |
|---|---|---|
| POST | `/api/attendance` | admin, teacher |
| GET | `/api/attendance?classId=&date=&studentId=` | any |
| PUT | `/api/attendance/:id` | admin, teacher |
| DELETE | `/api/attendance/:id` | admin |

**Mark attendance for a class** (bulk, one call per class per day):

```json
POST /api/attendance
{
  "classId": "664f...",
  "date": "2026-08-02",
  "records": [
    { "studentId": "664a...", "status": "present" },
    { "studentId": "664b...", "status": "absent" },
    { "studentId": "664c...", "status": "late" }
  ]
}
```

## Reports

| Method | Route | Access | Description |
|---|---|---|---|
| GET | `/api/reports/daily?classId=&date=` | any | Present/absent/late counts for one day |
| GET | `/api/reports/monthly?classId=&year=&month=` | any | Per-student totals for the month |
| GET | `/api/reports/export?classId=&startDate=&endDate=` | any | Downloads a CSV of attendance for the date range |

## Project structure

```
school-attendance-app/
├── config/db.js
├── models/          User, Class, Student, Attendance
├── middleware/       auth.js (JWT), role.js (RBAC)
├── controllers/       auth, class, student, attendance, report
├── routes/
├── server.js
├── seedAdmin.js       bootstrap first admin
└── .env.example
```
<img width="1363" height="728" alt="image" src="https://github.com/user-attachments/assets/6d7ea361-a6e7-4812-b1a5-6489cde1fd24" />

<img width="1365" height="682" alt="image" src="https://github.com/user-attachments/assets/cf4f125e-36bb-4242-8e19-1306a0d6bbb2" />

<img width="1362" height="728" alt="image" src="https://github.com/user-attachments/assets/611b8423-771b-43db-8456-884f6e996c9c" />
## Notes

- Attendance is unique per `(student, class, date)` — marking twice for the same day updates the existing record instead of duplicating it.
- Passwords are hashed with bcrypt; never stored in plain text.
- Swap the in-memory JWT secret in `.env` for a strong random value before deploying.
