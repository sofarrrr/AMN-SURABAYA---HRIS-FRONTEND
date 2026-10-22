import { createBrowserRouter, Navigate } from 'react-router';
import TataLetakAplikasi from './layouts/TataLetakAplikasi';
import TataLetakAutentikasi from './layouts/TataLetakAutentikasi';
import Login from './pages/Login';
import Beranda from './pages/Beranda';
import Dashboard from './pages/Dashboard';
import DataKaryawan from './pages/DataKaryawan';
import Absensi from './pages/Absensi';
import Perizinan from './pages/Perizinan';

import ManajemenPengguna from './pages/ManajemenPengguna';
import Profil from './pages/Profil';
import { DirekturOnly, ReviewerOnly } from './components/RouteGuards';
const privateChildren=[{index:true,element:<Navigate to="dashboard" replace/>},{path:'home',element:<Beranda/>},{path:'dashboard',element:<Dashboard/>},{path:'employees',element:<DataKaryawan/>},{path:'employees/new',element:<DataKaryawan/>},{path:'employees/:employeeId',element:<DataKaryawan/>},{path:'employees/:employeeId/edit',element:<DataKaryawan/>},{path:'employees/:employeeId/family/new',element:<DataKaryawan/>},{path:'attendance',element:<Absensi/>},{path:'attendance/new',element:<Absensi/>},{path:'attendance/:attendanceId',element:<Absensi/>},{path:'attendance/:attendanceId/edit',element:<Absensi/>},{path:'permits',element:<Perizinan/>},{path:'permits/new',element:<Perizinan/>},{path:'permits/:permitId',element:<Perizinan/>},{path:'permits/:permitId/edit',element:<Perizinan/>},{path:'permits/:permitId/approval',element:<ReviewerOnly/>},{path:'profile',element:<Profil/>},{path:'profile/edit',element:<Profil/>},{element:<DirekturOnly/>,children:[{path:'users',element:<ManajemenPengguna/>},{path:'users/new',element:<ManajemenPengguna/>},{path:'users/:userId',element:<ManajemenPengguna/>},{path:'users/:userId/edit',element:<ManajemenPengguna/>}]}];
export const router=createBrowserRouter([{element:<TataLetakAutentikasi/>,children:[{path:'/login',element:<Login/>}]},{path:'/',element:<Navigate to="/login" replace/>},{path:'/:role',element:<TataLetakAplikasi/>,children:privateChildren},{path:'*',element:<Navigate to="/login" replace/>}]);
