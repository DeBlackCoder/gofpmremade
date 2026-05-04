# Database Utilities

This directory contains database connection utilities for the Church Management System.

## MongoDB Connection

The `mongodb.ts` file provides a MongoDB connection utility with connection pooling and reuse logic.

### Features

- **Connection Pooling**: Automatically reuses connections to optimize performance
- **Development Mode**: Preserves connections across Hot Module Replacement (HMR)
- **Production Mode**: Creates fresh connections for production environments
- **Error Handling**: Provides clear error messages for connection failures

### Usage

```typescript
import { getDatabase, getClient } from '@/lib/db/mongodb';

// Get database instance
const db = await getDatabase();

// Get client instance
const client = await getClient();

// Get specific database
const customDb = await getDatabase('myDatabaseName');
```

### Environment Configuration

Add the following environment variable to your `.env.local` file:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```

Replace:
- `<username>`: Your MongoDB username
- `<password>`: Your MongoDB password
- `<cluster>`: Your MongoDB cluster address
- `<database>`: Your database name

### Testing the Connection

To verify the MongoDB connection is working:

```bash
# Install tsx if not already installed
npm install -D tsx

# Run the connection test script
npx tsx scripts/test-mongodb-connection.ts
```

### Requirements Satisfied

This implementation satisfies the following requirements from the Sermon Management System specification:

- **Requirement 5.1**: Establishes connections to MongoDB Atlas using environment variables
- **Requirement 5.2**: Reuses existing connections when available
- **Requirement 5.3**: Provides valid database connections for operations
- **Requirement 5.4**: Throws errors with diagnostic information on connection failure
- **Requirement 5.5**: Handles connection pooling automatically

### Architecture

The connection utility follows the singleton pattern to ensure only one MongoDB client is created per application instance. In development mode, the client is stored in a global variable to survive HMR. In production, a new client is created for each deployment.

```
┌─────────────────────────────────────┐
│   Application Code                  │
│   (API Routes, Services)            │
└──────────────┬──────────────────────┘
               │
               │ getDatabase() / getClient()
               │
┌──────────────▼──────────────────────┐
│   MongoDB Connection Utility        │
│   (lib/db/mongodb.ts)               │
│   - Connection Pooling              │
│   - Environment Config              │
│   - Error Handling                  │
└──────────────┬──────────────────────┘
               │
               │ MongoClient
               │
┌──────────────▼──────────────────────┐
│   MongoDB Atlas                     │
│   (Cloud Database)                  │
└─────────────────────────────────────┘
```
