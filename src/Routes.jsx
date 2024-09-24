// /* eslint-disable no-unused-vars */
// /* eslint-disable indent */
// import React from "react";
// import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
// import { ProtectedRoute } from "../src/helpers/authHelper";
// // import PageNotFound from "../src/PageNotFound";
// import { Outlet } from "react-router-dom";

// import FirstPage from "../src/RegPage/FirstPage";
// import LogInTeacher from "../src/Teacher/LogInTeacher";
// import AtlPage from "../src/RegPage/AtlPage";
// import AdminLogin from "../src/Admin/AdminLogin";
// import Dashboard from "./Admin/Dashboard";
// import NonAtlPage from "../src/RegPage/NonAtlPage";
// import ThemeSettings from "../src/InitialPage/themeSettings";
// import Header from "../src/InitialPage/Sidebar/Header";
// import Sidebar from "../src/InitialPage/Sidebar/Sidebar";
// import { useSelector } from "react-redux";
// import HorizontalSidebar from "../src/InitialPage/Sidebar/horizontalSidebar";
// import AdminProfile from "./Admin/AdminProfile";
// import AtlSucess from "./RegPage/AtlSucess";
// import NonAtlSuccess from "./RegPage/NonAtlSuccess";
// import { all_routes } from "./Router/all_routes";
// const HeaderLayout = () => {
//   const data = useSelector((state) => state.toggle_header);
//   return (
//     <div className={`main-wrapper ${data ? "header-collapse" : ""}`}>
//       <Header />
//       <Sidebar />
//       <Outlet />
//       <ThemeSettings />
//     </div>
//   );
// };

// const Authpages = () => {
//   const data = useSelector((state) => state.toggle_header);
//   return (
//     <div className={data ? "header-collapse" : ""}>
//       <Outlet />
//       <ThemeSettings />
//     </div>
//   );
// };

// const Pospages = () => (
//   <div>
//     <Header />
//     <Outlet />
//     <ThemeSettings />
//   </div>
// );

// const Routers = () => {
//   return (
//     // <Router>
//     <Routes>
//       <Route path="/" element={<Navigate to="/institution" />} />
//       <Route path="/">
//         <Route path="/registration" element={<FirstPage />} />
//         <Route path="/atl-register" element={<AtlPage />} />
//         <Route path="/atl-success" element={<AtlSucess />} />
//         <Route path="/non-atl-success" element={<NonAtlSuccess />} />

//         <Route path="/non-atl-register" element={<NonAtlPage />} />

//         <Route path="/admin" element={<AdminLogin />} />
//         <Route path="/institution" element={<LogInTeacher />} />

//         {/* <Route
//           path="/admin/dashboard"
//           element={
//             <>
//               <ProtectedRoute user="ADMIN" element={<HeaderLayout />}>
//                 <Dashboard />
//               </ProtectedRoute>
//             </>
//           }
//         /> */}
        
//         <Route
//           path="/admin/profile"
//           element={
//             <ProtectedRoute user="ADMIN" element={<Authpages />}>
//               <AdminProfile />
//             </ProtectedRoute>
//           }
//         />
       
//       </Route>
//     </Routes>
//   );
// };

// export default Routers;
