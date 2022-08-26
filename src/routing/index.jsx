import NotFound from "../pages/404/NotFound";
import Attendance from "../pages/attendance/Attendance";
import Home from "../pages/home/Home";
import Login from "../pages/login/Login";
import Payment from "../pages/payment/Payment";
import Timing from "../pages/timing/Timing";
import Users from "../pages/users/Users";
import AddEditUser from "../components/users/AddEditUser";
import ListUsers from "../components/users/ListUsers";
import React from "react";
import { Route, Routes } from "react-router-dom";
import MyLayout from "../layouts";
import ProtectedRoute from "./ProtectedRoute";
import UserDetail from "../components/users/UserDetail";

const MyRoutes = () => {
  return (
    <Routes>
      <Route element={<MyLayout />}>
        <Route path="/">
          <Route path="login" element={<Login />} />
          <Route
            index
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route path="users" element={<Users />}>
            <Route
              index
              element={
                <ProtectedRoute>
                  <ListUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="add"
              element={
                <ProtectedRoute>
                  <AddEditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path="edit"
              element={
                <ProtectedRoute>
                  <AddEditUser />
                </ProtectedRoute>
              }
            />
            <Route
              path=":userId"
              element={
                <ProtectedRoute>
                  <UserDetail />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route
            path="attendance"
            element={
              <ProtectedRoute>
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="timing"
            element={
              <ProtectedRoute>
                <Timing />
              </ProtectedRoute>
            }
          />
          <Route
            path="payment"
            element={
              <ProtectedRoute>
                <Payment />
              </ProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default MyRoutes;
