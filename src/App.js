import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';

import Login from './components/auth/login';

import Header from './components/Header';
import Sidebar from './Sidebar';
import Dashboard from './components/dashboard/Dashboard';

import Finances from './components/Department/Finances';
import MechineryParts from './components/Department/MechineryParts';
import FinancialRequests from './components/Department/FinancialRequest';

import IPCTracking from './components/Ofifce/IPCTracking';
import OfficeFinance from './components/Ofifce/OfficeFinance';
import OfficeProgress from './components/Ofifce/OfficeProgress';
import Projects from './components/Ofifce/Projects';

import Employees from './components/Projects/Employees';
import PendingFinance from './components/Projects/PendingFinances';
import AddNewEmployee from './components/Projects/AddNewEmployee';
import Vendors from './components/Projects/Vendors';
import ProjectFinances from './components/Projects/Finances';
import Inventory from './components/Projects/Inventory';
import ProjectProgress from './components/Projects/Progress';
import SupplyTracking from './components/Projects/SupplyTracking';
import Salaries from './components/Projects/Salaries';

import CompanyInventory from './components/Machinery/CompanyInventory';
import MachineryFinances from './components/Machinery/MachineryFinances';
import SiteInventory from './components/Machinery/SiteInventory';

import ProtectedRoutes from './PrivateRoute';

const AppContent = () => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';

  // State to toggle sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Toggle function to show/hide the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      {!isLoginPage && <Header />}

      <div className="flex flex-1 relative">
        {!isLoginPage && (
          <>
            {/* Sidebar */}
            <div
              className={`fixed inset-y-0 left-0 transform ${
                isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
              } transition-transform duration-300 ease-in-out z-10 md:relative md:translate-x-0 md:flex bg-white shadow-md`}
            >
              <Sidebar toggleSidebar={toggleSidebar} />
            </div>
          </>
        )}

        <div className="flex-1 bg-blue-50 overflow-auto">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route element={<ProtectedRoutes />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/machinery-parts" element={<MechineryParts />} />
              <Route path="/financial-requests" element={<FinancialRequests />} />
              <Route path="/ipc-tracking" element={<IPCTracking />} />
              <Route path="/office-finances" element={<OfficeFinance />} />
              <Route path="/office-progress" element={<OfficeProgress />} />
              <Route path="/projects" element={<Projects />} />

              <Route path="/employees" element={<Employees />} />
              <Route path="/:id/employees" element={<Employees />} />
              <Route path="/add-employee" element={<AddNewEmployee />} />
              <Route path="/add-employee/:id" element={<AddNewEmployee />} />
              <Route path="/:id/pending-finances" element={<PendingFinance />} />
              <Route path="/:id/vendors" element={<Vendors />} />
              <Route path="/:id/project-finances" element={<ProjectFinances />} />
              <Route path="/:id/project-inventory" element={<Inventory />} />
              <Route path="/:id/project-progress" element={<ProjectProgress />} />
              <Route path="/:id/supply-tracking" element={<SupplyTracking />} />
              <Route path="/:id/salaries" element={<Salaries />} />

              <Route path="/company-inventory" element={<CompanyInventory />} />
              <Route path="/machinery-finances" element={<MachineryFinances />} />
              <Route path="/site-inventory" element={<SiteInventory />} />
            </Route>
          </Routes>
        </div>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
