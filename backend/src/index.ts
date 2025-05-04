import { Hono } from 'hono';
import { cors } from 'hono/cors';

import { userRoutes } from './routes/user';
import { blogRoutes } from './routes/blog';

// Create the main Hono app
const app = new Hono<{
  Bindings:{
    DATABASE_URL: string,
    JWT_SECRET: string
  }
}>();

// Enable CORS for all routes
app.use('*', cors({
  origin: '*', 
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
  allowHeaders: ['Authorization', 'Content-Type'], 
  exposeHeaders: ['Authorization'], 
  maxAge: 3600, 
  credentials: true, 
  }));


app.route('/api/v1/user', userRoutes);
app.route('/api/v1/blog', blogRoutes);

export default app;
