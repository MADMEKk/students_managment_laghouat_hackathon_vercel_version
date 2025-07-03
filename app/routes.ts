import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Public routes
  index("routes/home.tsx"),
  route("user/:userId", "routes/user-details.tsx"),
  route("auth/signin", "routes/auth/signin.tsx"),
  route("auth/signup", "routes/auth/signup.tsx"),
  
  // Protected routes with role-based access
  // We'll handle protection directly in the components
  route("studentdashboard", "routes/studentdashboard.tsx"),
  route("incubateurdashboard", "routes/incubateurdashboard.tsx"),
  route("cdedashboard", "routes/cdedashboard.tsx"),
  route("catidashboard", "routes/catidashboard.tsx"),
  route("admindashboard", "routes/admindashboard.tsx"),
  
  // Catch-all route for /dashboard to handle legacy/incorrect redirects
  route("dashboard", "routes/dashboard-redirect.tsx"),
] satisfies RouteConfig;
