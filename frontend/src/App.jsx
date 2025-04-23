import { Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Chemicals from './pages/Chemicals';
import Purchases from './pages/Purchases';
import Sales from './pages/Sales';
import Safety from './pages/Safety';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Signup from './pages/SignUp';
import StaffDash from './pages/staff/StaffDash';
import StaffChemicalsMgmt from './pages/staff/StaffChemicals';
import StaffSales from './pages/staff/StaffSales';
import StaffSafety from './pages/staff/StaffSafe';
import Staff_cred from './pages/staff_cred';
import Profile from './pages/staff/profile';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <div>
        <Toaster />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/chemicals" element={<Chemicals />} />
        <Route path="/purchases" element={<Purchases />} />
        <Route path="/sales" element={<Sales />} />
        <Route path="/safety" element={<Safety />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/staff_add" element={<Staff_cred />} />
       
        {/* Staff Routes */}
        <Route path="/staff/chemicals" element={<StaffChemicalsMgmt />} />
        <Route path="/staff/sales" element={<StaffSales />} />
        <Route path="/staff/dashboard" element={<StaffDash/>}/>
        <Route path="/staff/safety" element={<StaffSafety/>}/>
        <Route path="/profile" element={<Profile/>}/>
      </Routes>
    </div>
  );
}

export default App;
