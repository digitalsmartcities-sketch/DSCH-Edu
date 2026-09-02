import { createRoot } from "react-dom/client";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App.jsx";

import { Institute } from "./pages/institute_landing_page/Institute.jsx";
import { AdmissionForm } from "./forms/admission_form/admission_form.jsx";

import { Login } from "./forms/login/login.jsx";
import AdminRegister from "./forms/register/register.jsx";

import { CheckAdminAccess } from "./dashboards/admin_dashboard/checkAdminAccess.jsx";
import { CheckStudentAccess } from "./dashboards/student_dashboard/checkStudentAccess.jsx";

import { HowItWorksPage } from "./pages/how_it_works/how_it_works.jsx";
import { ForgotPassword } from "./pages/forgot_password/forgot_password.jsx";
import { AboutUs } from "./pages/about_us_page/about_us.jsx";
import { ContactUs } from "./pages/contact_us_page/contact_us.jsx";
import { ErrorPage } from "./pages/error_page/error_page.jsx";

import { ContextProvider } from "./app_context/context.jsx";
import { CoursesList } from "./pages/courses_list/courses_list.jsx";
import { Course } from "./pages/course_details_page/course.jsx";
import { CourseEnrollment } from "./forms/course_enrollment/enrollment_form.jsx";
import { CheckSuperAdminAccess } from "./dashboards/superadmin_dashboard/checkSuperAdminAccess.jsx";
import { InstitutesList } from "./pages/Institutes_listing/institute_list.jsx";


const allRoutes = createBrowserRouter([
  // =========================================
  // PUBLIC
  // =========================================

  {
    path: "/",
    element: <App />
  },
  {
    path: "/about",
    element: <AboutUs />
  },
  {
    path: "/contact",
    element: <ContactUs />
  },
  {
    path: "/how-it-works",
    element: <HowItWorksPage />
  },
  {
    path: "/forgot-password",
    element: <ForgotPassword />
  },

  // =========================================
  // CATEGORIES
  // =========================================

  {
    path: "/school",
    element: <InstitutesList category="school" />
  },
  {
    path: "/college",
    element: <InstitutesList category="college" />
  },
  {
    path: "/courses",
    element: <CoursesList />
  },

  // =========================================
  // INSTITUTE
  // =========================================

  {
    path: "/school/:id",
    element: <Institute />
  },
  {
    path: "/college/:id",
    element: <Institute />
  },
  {
    path: "/course/:id",
    element: <Course />
  },

  // =========================================
  // ADMISSION
  // =========================================

  {
    path: "/school/admission/:id",
    element: <AdmissionForm />
  },
  {
    path: "/college/admission/:id",
    element: <AdmissionForm />
  },
  {
    path: "/course/enroll/:id",
    element: <CourseEnrollment />
  },

  // =========================================
  // AUTH
  // =========================================

  {
    path: "/auth/login",
    element: <Login />
  },
  {
    path: "/register-institute",
    element: <AdminRegister />
  },

  // =========================================
  // DASHBOARDS
  // =========================================
  
  {
    path: "/std/dashboard",
    element: <CheckStudentAccess />
  },
  {
    path: "/inst/dashboard",
    element: <CheckAdminAccess />
  },
  {
    path: "/superadmin/dashboard",
    element: <CheckSuperAdminAccess />
  },

  // =========================================
  // 404
  // =========================================

  {
    path: "*",
    element: (
      <ErrorPage
        code="404"
        title="Page Not Found"
        message="The page you're looking for doesn't exist or may have been moved."
      />
    )
  }
]);


createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <RouterProvider router={allRoutes} />
  </ContextProvider>
);