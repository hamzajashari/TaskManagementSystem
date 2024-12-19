import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import TaskList from './components/TaskList';
import CreateTask from './components/CreateTask';
import EditTask from './components/EditTask';
import NavBar from './components/NavBar';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route path="/" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavBar />
                <main className="container mx-auto px-4 py-8">
                  <TaskList />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/tasks" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavBar />
                <main className="container mx-auto px-4 py-8">
                  <TaskList />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/create-task" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavBar />
                <main className="container mx-auto px-4 py-8">
                  <CreateTask />
                </main>
              </div>
            </ProtectedRoute>
          } />
          <Route path="/edit-task/:id" element={
            <ProtectedRoute>
              <div className="min-h-screen bg-gray-100">
                <NavBar />
                <main className="container mx-auto px-4 py-8">
                  <EditTask />
                </main>
              </div>
            </ProtectedRoute>
          } />
        </Routes>
        <Toaster />
      </Router>
    </AuthProvider>
  );
};

export default App;
