import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer } from "react-toastify";
import './App.css';
import './index.css';
import { useSelector } from "react-redux";

import Login from './components/auth/login';

import Header from './components/Header';
import Sidebar from './Sidebar';
import Dashboard from './components/dashboard/Dashboard';

import Finances from './components/Department/Finances';
import FinancialRequests from './components/Department/FinancialRequest';

import IPCTracking from './components/Ofifce/IPCTracking';
import OfficeFinance from './components/Ofifce/OfficeFinance';
import OfficeProgress from './components/Ofifce/OfficeProgress';

import Employees from './components/Projects/Employees';
import PendingEmployees from './components/Projects/PendingEmployees';
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

const App = () => {
  return (
    <>
        <Router>
            {/* Public Routes */}
            <Routes>
                <Route path="/login" element={<Login />} />
            </Routes>

                <div className="flex flex-col h-screen">
                <Header />

                <div className="flex flex-1">
                <Sidebar />

                <div className="flex-1 bg-blue-50 overflow-auto">
                    <Routes>
                    <Route element={<ProtectedRoutes />}>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/finances" element={<Finances />} />
                    <Route path="/financial-requests" element={<FinancialRequests />} />
                    <Route path="/ipc-tracking" element={<IPCTracking />} />
                    <Route path="/office-finances" element={<OfficeFinance />} />
                    <Route path="/office-progress" element={<OfficeProgress />} />

                    <Route path="/employees" element={<Employees />} />
                    <Route path="/add-employee" element={<AddNewEmployee />} />
                    <Route path="/add-employee/:id" element={<AddNewEmployee />} />
                    <Route path="/pending-employees" element={<PendingEmployees />} />
                    <Route path="/vendors" element={<Vendors />} />
                    <Route path="/project-finances" element={<ProjectFinances />} />
                    <Route path="/project-inventory" element={<Inventory />} />
                    <Route path="/project-progress" element={<ProjectProgress />} />
                    <Route path="/supply-tracking" element={<SupplyTracking />} />
                    <Route path="/salaries" element={<Salaries />} />

                    <Route path="/company-inventory" element={<CompanyInventory />} />
                    <Route path="/machinery-finances" element={<MachineryFinances />} />
                    <Route path="/site-inventory" element={<SiteInventory />} />
                    </Route>
                    </Routes>
                </div>
                </div>
            </div>
        </Router>
    </>
  );
};

export default App;
