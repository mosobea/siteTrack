# SiteTrack

A Mini Construction Project Management System built with NestJS, TypeScript, PostgreSQL, and Prisma.

## Problem

Construction projects involve multiple teams, tasks, and responsibilities that need to be coordinated. Without a centralized management system, tracking project activities, assigning responsibilities, and monitoring progress can become challenging.

## Solution

**SiteTrack** aims to provide a centralized platform for organizing and managing construction projects.

The system currently focuses on helping project teams:

- Create and manage construction projects.
- Organize and assign tasks to team members.
- Track task progress and completion.
- Keep project-related information organized in one place.

## ERD
<img width="2570" height="1615" alt="image(1)" src="https://github.com/user-attachments/assets/158c4f17-5937-44ac-87a3-f7ab9e07e719" />

## App Modules
<img width="2720" height="1496" alt="image(2)" src="https://github.com/user-attachments/assets/43c1e7c8-b94f-4fcf-a96b-74b99530d9f3" />

## Current API Endpoints
<img width="1491" height="1270" alt="image" src="https://github.com/user-attachments/assets/ba5e8f8e-7dba-4f44-b640-ef8431660eab" />

### Phase 1: Core API
- [x] Project setup, PostgreSQL, Prisma schema
- [x] Auth: register, login, JWT
- [x] Role-based access control
- [x] Projects CRUD
- [x] Tasks CRUD with filtering and pagination

### Phase 2: Site workflows
- [ ] Issues (punch list)
- [ ] RFIs
- [ ] Comments
### Phase 3:
- [ ] React front end
- [ ] File upload for issue photos
