# CleanSweepPro - Cleaning Service Management Platform

A comprehensive full-stack application for managing cleaning service businesses, including customer management, staff scheduling, service offerings, and appointment booking.

## 🚀 Quick Links

- **GitHub Repository**: https://github.com/PresidentAnderson/cleansweeppro-platform
- **Quick Deploy Guide**: See [QUICK_DEPLOY.md](QUICK_DEPLOY.md)
- **Detailed Deployment**: See [DEPLOYMENT.md](DEPLOYMENT.md)
- **Live Demo**: Deploy to Vercel in 5 minutes!

## Features

### Core Functionality
- **Customer Management**: Add, edit, and track customer information including contact details and addresses
- **Staff Management**: Manage team members with positions, hourly rates, and availability
- **Service Management**: Define cleaning services with pricing and duration
- **Appointment Scheduling**: Schedule and track appointments with status management
- **Dashboard Analytics**: Overview of key metrics and upcoming appointments
- **Authentication**: Secure user authentication and authorization

### Technical Features
- RESTful API with FastAPI
- React frontend with TypeScript
- PostgreSQL database
- JWT-based authentication
- Responsive design with Tailwind CSS
- Real-time updates with React Query
- Docker support for easy deployment

## Tech Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **PostgreSQL** - Relational database
- **Alembic** - Database migrations
- **Pydantic** - Data validation
- **Python-Jose** - JWT token handling
- **Passlib** - Password hashing

### Frontend
- **React** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **TanStack Query** - Server state management
- **Zustand** - Client state management
- **Tailwind CSS** - Utility-first CSS framework
- **Axios** - HTTP client
- **React Hot Toast** - Toast notifications
- **Lucide React** - Icon library

## Project Structure

```
cleansweeppro/
├── backend/
│   ├── alembic/              # Database migrations
│   ├── app/
│   │   ├── api/
│   │   │   ├── endpoints/    # API route handlers
│   │   │   ├── api.py        # API router
│   │   │   └── deps.py       # Dependencies
│   │   ├── core/
│   │   │   ├── config.py     # App configuration
│   │   │   └── security.py   # Security utilities
│   │   ├── crud/             # CRUD operations
│   │   ├── db/               # Database setup
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   └── main.py           # FastAPI app
│   ├── requirements.txt
│   ├── .env.example
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/       # React components
│   │   ├── pages/            # Page components
│   │   ├── lib/              # API client
│   │   ├── store/            # State management
│   │   ├── types/            # TypeScript types
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── Dockerfile
└── docker-compose.yml
```

## Getting Started

### Prerequisites
- Python 3.11+
- Node.js 18+
- PostgreSQL 15+
- Docker & Docker Compose (optional)

### Option 1: Docker Setup (Recommended)

1. **Clone the repository**
   ```bash
   cd cleansweeppro
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   cp frontend/.env.example frontend/.env
   ```

3. **Start all services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Run database migrations**
   ```bash
   docker-compose exec backend alembic upgrade head
   ```

5. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

### Option 2: Manual Setup

#### Backend Setup

1. **Create and activate virtual environment**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Set up PostgreSQL database**
   ```bash
   createdb cleansweeppro
   ```

5. **Run database migrations**
   ```bash
   alembic upgrade head
   ```

6. **Start the backend server**
   ```bash
   uvicorn app.main:app --reload
   ```

#### Frontend Setup

1. **Navigate to frontend directory**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

## Usage

### Creating Your First Admin Account

1. Navigate to http://localhost:5173/register
2. Fill in your details:
   - Full Name
   - Email
   - Password
3. Click "Create account"
4. You'll be automatically logged in

### Managing the System

#### Dashboard
- View key metrics: total customers, staff, services, and appointments
- See upcoming scheduled appointments
- Quick overview of business operations

#### Customers
- Add new customers with complete contact information
- Edit existing customer details
- View customer history
- Delete customers (will prompt for confirmation)

#### Staff
- Add team members with positions and hourly rates
- Set staff as active or inactive
- Track hire dates and notes
- Edit staff information

#### Services
- Create service offerings with descriptions
- Set pricing and duration estimates
- Mark services as active or inactive
- Update service details

#### Appointments
- Schedule appointments with customers, staff, and services
- Select date and time
- Track appointment status:
  - Scheduled
  - In Progress
  - Completed
  - Cancelled
  - No Show
- Add notes for each appointment
- Filter appointments by customer, staff, or date range

## API Documentation

Once the backend is running, visit http://localhost:8000/docs for interactive API documentation powered by Swagger UI.

### Key Endpoints

#### Authentication
- `POST /api/v1/auth/login` - Login with email and password
- `POST /api/v1/auth/register` - Register new user
- `GET /api/v1/auth/me` - Get current user

#### Customers
- `GET /api/v1/customers/` - List all customers
- `POST /api/v1/customers/` - Create customer
- `GET /api/v1/customers/{id}` - Get customer by ID
- `PUT /api/v1/customers/{id}` - Update customer
- `DELETE /api/v1/customers/{id}` - Delete customer

#### Staff
- `GET /api/v1/staff/` - List all staff
- `POST /api/v1/staff/` - Create staff member
- `GET /api/v1/staff/{id}` - Get staff by ID
- `PUT /api/v1/staff/{id}` - Update staff
- `DELETE /api/v1/staff/{id}` - Delete staff

#### Services
- `GET /api/v1/services/` - List all services
- `POST /api/v1/services/` - Create service
- `GET /api/v1/services/{id}` - Get service by ID
- `PUT /api/v1/services/{id}` - Update service
- `DELETE /api/v1/services/{id}` - Delete service

#### Appointments
- `GET /api/v1/appointments/` - List all appointments
- `POST /api/v1/appointments/` - Create appointment
- `GET /api/v1/appointments/{id}` - Get appointment by ID
- `PUT /api/v1/appointments/{id}` - Update appointment
- `DELETE /api/v1/appointments/{id}` - Delete appointment

## Database Schema

### Users
- Authentication and user management
- Fields: email, password, full_name, is_active, is_admin

### Customers
- Customer information
- Fields: name, email, phone, address, city, state, zip_code, notes

### Staff
- Team member management
- Fields: name, email, phone, position, hourly_rate, is_active, hire_date

### Services
- Service offerings
- Fields: name, description, price, duration_minutes, is_active

### Appointments
- Booking management
- Fields: customer_id, staff_id, service_id, scheduled_date, status, notes

## Development

### Running Tests
```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

### Database Migrations

**Create a new migration:**
```bash
cd backend
alembic revision --autogenerate -m "description of changes"
```

**Apply migrations:**
```bash
alembic upgrade head
```

**Rollback migration:**
```bash
alembic downgrade -1
```

### Building for Production

**Backend:**
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

**Frontend:**
```bash
cd frontend
npm run build
npm run preview
```

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://cleansweep:cleansweep123@localhost:5432/cleansweeppro
SECRET_KEY=your-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:8000/api/v1
```

## Security Considerations

- Change the `SECRET_KEY` in production
- Use environment variables for sensitive data
- Enable HTTPS in production
- Implement rate limiting
- Regular security audits
- Keep dependencies updated
- Use strong passwords
- Enable CORS only for trusted domains

## Troubleshooting

### Backend Issues

**Database connection errors:**
- Verify PostgreSQL is running
- Check DATABASE_URL in .env
- Ensure database exists

**Migration errors:**
- Check alembic/env.py configuration
- Verify all models are imported
- Run `alembic upgrade head`

### Frontend Issues

**API connection errors:**
- Verify backend is running on port 8000
- Check VITE_API_URL in .env
- Check CORS settings in backend

**Build errors:**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear cache: `npm cache clean --force`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Future Enhancements

- [ ] Email notifications for appointments
- [ ] SMS reminders
- [ ] Payment processing integration
- [ ] Invoice generation
- [ ] Calendar view for appointments
- [ ] Mobile app
- [ ] Advanced analytics and reporting
- [ ] Multi-location support
- [ ] Customer portal
- [ ] Recurring appointments
- [ ] Staff time tracking
- [ ] Inventory management

## Acknowledgments

Built with modern web technologies and best practices for scalability and maintainability.
