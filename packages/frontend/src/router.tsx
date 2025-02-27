import { createBrowserRouter, Navigate, RouteObject } from 'react-router-dom';

import Login from './auth/Login';
import UserForm from './user/UserForm';
import UserList from './user/UserList';

export const routes: RouteObject[] = [
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/user',
    element: <UserList />,
  },
  {
    path: '/user/new',
    element: <UserForm />,
  },
  {
    path: '/user/:id',
    element: <UserForm />,
  },
  {
    path: '/*',
    element: <Navigate to="/user" replace />,
  },
];

const router = createBrowserRouter(routes);

export default router;
