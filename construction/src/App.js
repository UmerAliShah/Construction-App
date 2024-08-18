import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import './index.css';
import Header from './components/Header';
import Sidebar from './Sidebar';
import Dashboard from './components/dashboard/Dashboard';

import Finances from './components/Department/Finances';

import IPCTracking from './components/Ofifce/IPCTracking';
import OfficeFinance from './components/Ofifce/OfficeFinance';
import OfficeProgress from './components/Ofifce/OfficeProgress';

import Employees from './components/Projects/Employees';
import Vendors from './components/Projects/Vendors';
import ProjectFinances from './components/Projects/Finances';
import Inventory from './components/Projects/Inventory';
import ProjectProgress from './components/Projects/Progress';
import SupplyTracking from './components/Projects/SupplyTracking';
import Salaries from './components/Projects/Salaries';

import CompanyInventory from './components/Machinery/CompanyInventory';
import MachineryFinances from './components/Machinery/MachineryFinances';
import SiteInventory from './components/Machinery/SiteInventory';


const App = () => {
  return (
    <Router>
      <div className="flex flex-col h-screen">
        {/* Header at the top */}
        <Header />

        <div className="flex flex-1">
          {/* Sidebar on the left */}
          <Sidebar />

          {/* Main content area */}
          <div className="flex-1 bg-blue-50 overflow-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/finances" element={<Finances />} />
              <Route path="/ipc-tracking" element={<IPCTracking />} />
              <Route path="/office-finances" element={<OfficeFinance />} />
              <Route path="/office-progress" element={<OfficeProgress />} />

              <Route path="/employees" element={<Employees />} />
              <Route path="/vendors" element={<Vendors />} />
              <Route path="/project-finances" element={<ProjectFinances />} />
              <Route path="/project-inventory" element={<Inventory />} />
              <Route path="/project-progress" element={<ProjectProgress />} />
              <Route path="/supply-tracking" element={<SupplyTracking />} />
              <Route path="/salaries" element={<Salaries />} />

              <Route path="/company-inventory" element={<CompanyInventory />} />
              <Route path="/machinery-finances" element={<MachineryFinances />} />
              <Route path="/site-inventory" element={<SiteInventory />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
