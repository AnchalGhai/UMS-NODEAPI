# UMS-PROJECT (University Management System)

This is a backend project built with Node.js and Express to manage a University Management System (UMS). It supports features like student and professor management, course allocation, attendance tracking, and role-based login.

## 📁 Project Structure

```
UMS-PROJECT/
├── UMS-NODEAPI/
│   ├── config/           # Database configuration
│   ├── controllers/      # Route logic
│   ├── models/           # Sequelize models
│   ├── routes/           # API route handlers
│   ├── app.js            # Main Express server
│   ├── package.json      # Dependencies
│   └── .env              # Environment variables
```

## 🚀 Features

- User authentication with JWT (Admin, Student, Professor)
- CRUD operations for:
  - Students
  - Professors
  - Courses
  - Departments
- Attendance management
- Course allocation
- Role-based access control

## 🛠️ Tech Stack

- Node.js
- Express.js
- MySQL + Sequelize ORM
- JWT Authentication
- Dotenv for environment config

## 🔧 Setup Instructions

1. Clone the repository:
```bash
git clone https://github.com/your-username/UMS-PROJECT.git
cd UMS-PROJECT/UMS-NODEAPI
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file:
```
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=universitydb
JWT_SECRET=your_jwt_secret
```

4. Start the server:
```bash
npm start
```

## 📬 Sample API Endpoints

| Method | Endpoint        | Description                  |
|--------|-----------------|------------------------------|
| POST   | /login          | Login (Admin/Student/Professor) |
| GET    | /students       | Get all students             |
| POST   | /students       | Add new student              |
| PUT    | /students/:id   | Update student               |
| DELETE | /students/:id   | Delete student               |
| ...    |                 | And more for other entities  |

## 📄 License

This project is licensed under the MIT License.
