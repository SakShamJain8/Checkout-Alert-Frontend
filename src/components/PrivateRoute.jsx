import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ children }) {
    // cookie is httpOnly so JS can't read it
    // use email in localStorage as indicator of logged-in state
    const email = localStorage.getItem('email');
    return email ? children : <Navigate to="/login" replace />;
}