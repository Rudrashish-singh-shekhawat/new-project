import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children, isAuthenticated }) {
  const navigate = useNavigate();

  if (!isAuthenticated) {
    navigate('/login');
    return null;
  }

  return children;
}
