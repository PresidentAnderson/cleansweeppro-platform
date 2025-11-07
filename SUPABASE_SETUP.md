# Supabase Setup Guide for CleanSweepPro

## Step 1: Run Database Migration

1. **Go to your Supabase Dashboard:**
   - Visit: https://supabase.com/dashboard
   - Select your project: `dvjcunyuqznqlgwvzbie`

2. **Open SQL Editor:**
   - Click "SQL Editor" in the left sidebar
   - Click "New query"

3. **Run the Migration:**
   - Copy the entire contents of `supabase_migration.sql`
   - Paste into the SQL editor
   - Click "Run" or press Cmd/Ctrl + Enter

4. **Verify Tables Created:**
   - Go to "Table Editor" in the sidebar
   - You should see these tables:
     - `customers`
     - `staff`
     - `services`
     - `appointments`

## Step 2: Verify Row Level Security (RLS)

Your tables are protected with RLS policies that:
- Allow authenticated users to view all records
- Allow authenticated users to create, update, and delete records
- Block anonymous access

## Step 3: Test Authentication

1. **Enable Email Authentication:**
   - Go to "Authentication" → "Providers"
   - Ensure "Email" is enabled
   - Configure email templates if needed

2. **Test Registration:**
   - Go to your deployed frontend
   - Try registering a new account
   - Check "Authentication" → "Users" in Supabase to see the new user

## Database Schema

### Customers Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Reference to auth.users
- `first_name`, `last_name`, `email`, `phone`
- `address`, `city`, `state`, `zip_code`
- `notes` (optional)
- `created_at`, `updated_at` (auto-managed)

### Staff Table
- `id` (UUID) - Primary key
- `user_id` (UUID) - Reference to auth.users
- `first_name`, `last_name`, `email`, `phone`
- `address`, `city`, `state`, `zip_code` (optional)
- `position`, `hourly_rate` (optional)
- `is_active` (default: true)
- `hire_date` (optional)
- `notes` (optional)
- `created_at`, `updated_at` (auto-managed)

### Services Table
- `id` (UUID) - Primary key
- `name` (unique)
- `description` (optional)
- `price` (decimal)
- `duration_minutes` (integer)
- `is_active` (default: true)
- `created_at`, `updated_at` (auto-managed)

### Appointments Table
- `id` (UUID) - Primary key
- `customer_id` (UUID) - Foreign key to customers
- `staff_id` (UUID) - Foreign key to staff
- `service_id` (UUID) - Foreign key to services
- `scheduled_date` (timestamp)
- `end_date` (timestamp, optional)
- `status` (enum: scheduled, in_progress, completed, cancelled, no_show)
- `notes` (optional, customer-facing)
- `internal_notes` (optional, staff-only)
- `created_at`, `updated_at` (auto-managed)

## Sample Data

The migration automatically inserts 5 sample services:
1. Basic Cleaning - $89.99 (120 min)
2. Deep Cleaning - $149.99 (180 min)
3. Move-In/Out Cleaning - $199.99 (240 min)
4. Office Cleaning - $129.99 (150 min)
5. Window Cleaning - $79.99 (90 min)

## Indexes

The following indexes are created for performance:
- Email lookups (customers, staff)
- User ID lookups
- Service name lookups
- Appointment date/status queries
- Foreign key relationships

## Triggers

Auto-update triggers are set up for `updated_at` columns on all tables.

## Security Features

- Row Level Security (RLS) enabled on all tables
- Policies require authenticated users
- Email/password authentication
- JWT tokens for API access
- Anon key for client-side requests
- Service role key for admin operations (keep secret!)

## Troubleshooting

### Migration Fails
- Check for existing tables with the same names
- Drop tables if needed: `DROP TABLE IF EXISTS <table_name> CASCADE;`
- Re-run the migration

### Authentication Issues
- Verify email provider is enabled
- Check email templates are configured
- Ensure SMTP is set up (or use Supabase's built-in email)

### RLS Blocks Queries
- Check user is authenticated
- Verify JWT token is valid
- Check policies in "Authentication" → "Policies"

### Can't Create Records
- Ensure user is logged in
- Check browser console for errors
- Verify Supabase URL and anon key in .env

## Next Steps

After running the migration:
1. Test user registration
2. Create sample customers
3. Add staff members
4. Verify services were created
5. Test appointment booking

## Support

- Supabase Docs: https://supabase.com/docs
- Supabase Discord: https://discord.supabase.com
- GitHub Issues: https://github.com/PresidentAnderson/cleansweeppro-platform/issues
