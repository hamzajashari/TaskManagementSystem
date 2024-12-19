# Task Management System

Full-stack task management app with .NET 8 and React + TypeScript, featuring JWT auth and comprehensive task management.

## Features

- 🔐 JWT Authentication
- ✅ CRUD operations for tasks
- 🔍 Advanced filtering & sorting
- 📱 Responsive design
- 🧪 Unit & Integration tests

## Quick Start

### Backend Setup

```bash
cd backend/TaskManagementSystem/TaskSystem
dotnet tool install --global dotnet-ef
dotnet ef database update
dotnet run
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

### Running Tests

```bash
cd backend/TaskManagementSystem/TaskSystem.Tests
dotnet test
```

## Test Coverage

- Integration Tests:
  - Full CRUD operations
  - Authentication flow
  - Database interactions

- Unit Tests:
  - Task service operations
  - Sorting functionality
  - Filter validations

## Tech Stack

### Backend
- .NET 8
- SQL Server + Dapper
- JWT Authentication
- xUnit for testing

### Frontend
- React + TypeScript
- Tailwind CSS
- React Hook Form

## API Endpoints

### Auth
- POST `/api/account/register`
- POST `/api/account/login`

### Tasks
- GET/POST `/api/tasks`
- PUT/DELETE `/api/tasks/{id}`
- PATCH `/api/tasks/{id}/complete`

## Security

- JWT with refresh tokens
- Password hashing
- Protected routes