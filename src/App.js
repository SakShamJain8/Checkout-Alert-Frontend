import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Dashboard from './pages/Dashboard';
import EndpointDetail from './pages/EndpointDetail';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
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
        <Route path="/privacy" element={
          <PrivacyPolicy />
        } />
        <Route path="/terms" element={
          <TermsOfService />
        } />
      </Routes>
    </BrowserRouter>
  );
}