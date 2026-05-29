import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Profile from './pages/Profile';
import Landing from './pages/Landing';
import ProtectedRoute from './components/auth/ProtectedRoute';
import { UserProvider } from './components/hooks/UserContext';

function App() {
  return (
    <BrowserRouter>
      <UserProvider>
        <Routes>
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Login />} />
          <Route path='/dashboard' element={<ProtectedRoute> <Dashboard /> </ProtectedRoute>} />
          <Route path='/products' element={<ProtectedRoute> <Products /> </ProtectedRoute>} />
          <Route path='/profile' element={<ProtectedRoute> <Profile /> </ProtectedRoute>} />
          <Route path='/' element={<Landing />} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </UserProvider>
    </BrowserRouter>
  );
}

export default App