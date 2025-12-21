import { useNavigate } from 'react-router-dom';

export default function InstructorRoute({ children, isAuthenticated, user }) {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  if (user?.role !== 'instructor') {
    navigate('/');
    return null;
  }

  return children;
}
