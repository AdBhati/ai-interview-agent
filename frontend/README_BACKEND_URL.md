# Backend URL Configuration

## ✅ Heroku Backend URL Set

The frontend is now configured to use the Heroku backend:

**Backend URL:** `https://ai-interview-agent-4b4b22e44ca7.herokuapp.com`

## Configuration

The backend URL is set in `services/api.ts`:

```typescript
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://ai-interview-agent-4b4b22e44ca7.herokuapp.com';
```

## Environment Variables (Optional)

If you want to override the URL for local development, create `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, the default Heroku URL will be used automatically.

## Testing

The frontend will now connect to the deployed Heroku backend by default.

To test locally with a local backend:
1. Create `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`
2. Restart the Next.js dev server

## API Endpoints

All API calls will go to:
- Base: `https://ai-interview-agent-4b4b22e44ca7.herokuapp.com`
- Health: `https://ai-interview-agent-4b4b22e44ca7.herokuapp.com/api/health/`
- Resumes: `https://ai-interview-agent-4b4b22e44ca7.herokuapp.com/api/resumes/`
- Interviews: `https://ai-interview-agent-4b4b22e44ca7.herokuapp.com/api/interviews/`

✅ **Backend URL is now permanently configured!**

