import { createRoot } from "react-dom/client";
import { Component, Suspense, lazy } from "react";
import "./index.css";
import {
    createBrowserRouter,
    RouterProvider,
    Outlet,
    ScrollRestoration,
} from "react-router-dom";

import { ContextProvider } from "./app_context/context.jsx";
import { ToastProvider } from "./components/toast/ToastContext.jsx";
import { ErrorPage } from "./pages/error_page/error_page.jsx";

// =========================================
// EAGERLY LOADED (small, always needed)
// =========================================

import App from "./App.jsx";
import { Login } from "./forms/login/login.jsx";

// =========================================
// LAZY LOADED (keeps the initial bundle small)
// =========================================

const Institute = lazy(() =>
    import("./pages/institute_landing_page/Institute.jsx").then((m) => ({
        default: m.Institute,
    }))
);
const InstitutesList = lazy(() =>
    import("./pages/institutes_listing/institute_list.jsx").then((m) => ({
        default: m.InstitutesList,
    }))
);
const AdmissionForm = lazy(() =>
    import("./forms/admission_form/admission_form.jsx").then((m) => ({
        default: m.AdmissionForm,
    }))
);
const AdminRegister = lazy(() =>
    import("./forms/register/register.jsx")
);
const HowItWorksPage = lazy(() =>
    import("./pages/how_it_works/how_it_works.jsx").then((m) => ({
        default: m.HowItWorksPage,
    }))
);
const ForgotPassword = lazy(() =>
    import("./pages/forgot_password/forgot_password.jsx").then((m) => ({
        default: m.ForgotPassword,
    }))
);
const AboutUs = lazy(() =>
    import("./pages/about_us_page/about_us.jsx").then((m) => ({
        default: m.AboutUs,
    }))
);
const ContactUs = lazy(() =>
    import("./pages/contact_us_page/contact_us.jsx").then((m) => ({
        default: m.ContactUs,
    }))
);
const CoursesList = lazy(() =>
    import("./pages/courses_list/courses_list.jsx").then((m) => ({
        default: m.CoursesList,
    }))
);
const Course = lazy(() =>
    import("./pages/course_details_page/course.jsx").then((m) => ({
        default: m.Course,
    }))
);
const CourseEnrollment = lazy(() =>
    import("./forms/course_enrollment/enrollment_form.jsx").then((m) => ({
        default: m.CourseEnrollment,
    }))
);
const CheckAdminAccess = lazy(() =>
    import("./dashboards/admin_dashboard/checkAdminAccess.jsx").then((m) => ({
        default: m.CheckAdminAccess,
    }))
);
const CheckStudentAccess = lazy(() =>
    import("./dashboards/student_dashboard/checkStudentAccess.jsx").then((m) => ({
        default: m.CheckStudentAccess,
    }))
);
const CheckSuperAdminAccess = lazy(() =>
    import("./dashboards/superadmin_dashboard/checkSuperAdminAccess.jsx").then((m) => ({
        default: m.CheckSuperAdminAccess,
    }))
);

// =========================================
// LAYOUT
// =========================================

const RootLayout = () => (
    <>
        <ScrollRestoration />
        <Outlet />
    </>
);

const PageLoader = () => (
    <div className="appPageLoader">
        <div className="appPageLoader__spinner"></div>
        <p>Loading, Please wait...</p>
    </div>
);

const allRoutes = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            // =========================================
            // PUBLIC
            // =========================================

            {
                index: true,
                element: <App />,
            },
            {
                path: "about",
                element: <AboutUs />,
            },
            {
                path: "contact",
                element: <ContactUs />,
            },
            {
                path: "how-it-works",
                element: <HowItWorksPage />,
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />,
            },

            // =========================================
            // CATEGORIES
            // =========================================

            {
                path: "school",
                element: <InstitutesList category="school" />,
            },
            {
                path: "college",
                element: <InstitutesList category="college" />,
            },
            {
                path: "courses",
                element: <CoursesList />,
            },

            // =========================================
            // INSTITUTE
            // =========================================

            {
                path: "school/:id",
                element: <Institute />,
            },
            {
                path: "college/:id",
                element: <Institute />,
            },
            {
                path: "course/:id",
                element: <Course />,
            },

            // =========================================
            // ADMISSION
            // =========================================

            {
                path: "school/admission/:id",
                element: <AdmissionForm />,
            },
            {
                path: "college/admission/:id",
                element: <AdmissionForm />,
            },
            {
                path: "course/enroll/:id",
                element: <CourseEnrollment />,
            },

            // =========================================
            // AUTH
            // =========================================

            {
                path: "auth/login",
                element: <Login />,
            },
            {
                path: "register-institute",
                element: <AdminRegister />,
            },

            // =========================================
            // DASHBOARDS
            // =========================================

            {
                path: "std/dashboard",
                element: <CheckStudentAccess />,
            },
            {
                path: "inst/dashboard",
                element: <CheckAdminAccess />,
            },
            {
                path: "superadmin/dashboard",
                element: <CheckSuperAdminAccess />,
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
                ),
            },
        ],
    },
]);

class RootErrorBoundary extends Component {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <ErrorPage
          code="500"
          title="Something Went Wrong"
          message="An unexpected error occurred. Please refresh the page or try again later."
        />
      );
    }
    return this.props.children;
  }
}


createRoot(document.getElementById("root")).render(
  <ContextProvider>
    <ToastProvider>
      <RootErrorBoundary>
        <Suspense fallback={<PageLoader />}>
          <RouterProvider router={allRoutes} />
        </Suspense>
      </RootErrorBoundary>
    </ToastProvider>
  </ContextProvider>
);
