import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import EndpointDetail from './pages/EndpointDetail';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import Incidents from './pages/Incidents';
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={
          <PrivateRoute><Dashboard /></PrivateRoute>
        } />
        <Route path="/endpoint/:id" element={
          <PrivateRoute><EndpointDetail /></PrivateRoute>
        } />
        <Route path="/incidents" element={
          <PrivateRoute><Incidents /></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}