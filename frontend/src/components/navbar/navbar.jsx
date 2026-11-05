import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    HiOutlineBars3BottomRight,
    HiOutlineUserCircle
} from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import { FiChevronDown, FiLogOut, FiGrid } from "react-icons/fi";
import "./navbar.css";
import AppContext from "../../app_context/context";
import { logOutApi } from "../../apicalls/public_apicalls";
import logo from "../../assets/logo.jpg";

const ROLE_LABELS = {
    superadmin: "Super Admin",
    admin: "Institute Admin",
    student: "Student",
};

// Used when the session cookie is present but the role is unknown.
const FALLBACK_DASHBOARD = "/";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const [userMenuOpen, setUserMenuOpen] = useState(false);
    const { userState, setUserState } = useContext(AppContext);
    const navigate = useNavigate();
    const userMenuRef = useRef(null);

    const isLoggedIn = Boolean(userState);

    // The user state is either the object returned by the API or the plain
    // "login" marker, so every field has to be read defensively.
    const user = typeof userState === "object" && userState !== null ? userState : {};
    const dashboardUrl = user.dashboardUrl || FALLBACK_DASHBOARD;
    const roleLabel = ROLE_LABELS[user.role] || "User";
    const displayName = user.name || user.email || "Account";

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const closeUserMenu = () => {
        setUserMenuOpen(false);
    };

    const handleLogout = () => {
        closeUserMenu();
        logOutApi(setUserState, navigate);
    };

    // Clicking anywhere outside the user menu closes it.
    useEffect(() => {
        if (!userMenuOpen) return undefined;

        const handleClickOutside = (event) => {
            if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setUserMenuOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setUserMenuOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [userMenuOpen]);

    return (
        <header className="navbar">
            <div className="navbarContainer">
                {/* =========================================
                    LOGO
                ========================================= */}
                <Link
                    to="/"
                    className="logo"
                    onClick={closeMenu}
                >
                    <img
                        src={logo}
                        alt="Digital Smart City Hub"
                    />
                </Link>
                {/* =========================================
                    DESKTOP NAVIGATION
                ========================================= */}
                <nav className="navMenu">
                    <NavLink to="/" onClick={closeMenu}>
                        Home
                    </NavLink>
                    <NavLink to="/school" onClick={closeMenu}>
                        Schools
                    </NavLink>
                    <NavLink to="/college" onClick={closeMenu}>
                        Colleges
                    </NavLink>
                    <NavLink to="/courses" onClick={closeMenu}>
                        Courses
                    </NavLink>
                    <NavLink to="/how-it-works" onClick={closeMenu}
                    >
                        How It Works
                    </NavLink>
                    <NavLink to="/about" onClick={closeMenu}>
                        About
                    </NavLink>
                    <NavLink to="/contact" onClick={closeMenu}>
                        Contact
                    </NavLink>
                </nav>
                {/* =========================================
                    DESKTOP ACTIONS
                ========================================= */}
                <div className="navButtons">
                    {isLoggedIn ? (
                        /* =========================================
                            USER MENU
                            The icon itself is a shortcut back to the
                            dashboard, the caret opens the menu with the
                            account details and the logout action.
                        ========================================= */
                        <div
                            className="userMenu"
                            ref={userMenuRef}
                        >
                            <Link
                                to={dashboardUrl}
                                className="userMenuTrigger"
                                title="Go to dashboard"
                                onClick={closeMenu}
                            >
                                <HiOutlineUserCircle />
                                <span className="userMenuName">
                                    {displayName}
                                </span>
                            </Link>
                            <button
                                type="button"
                                className="userMenuToggle"
                                aria-label="Open account menu"
                                aria-expanded={userMenuOpen}
                                onClick={() => setUserMenuOpen((prev) => !prev)}
                            >
                                <FiChevronDown />
                            </button>
                            {userMenuOpen && (
                                <div className="userMenuDropdown">
                                    <div className="userMenuHeader">
                                        <span className="userMenuHeaderName">
                                            {displayName}
                                        </span>
                                        <span className="userMenuHeaderRole">
                                            {roleLabel}
                                        </span>
                                    </div>
                                    <Link
                                        to={dashboardUrl}
                                        className="userMenuItem"
                                        onClick={closeUserMenu}
                                    >
                                        <FiGrid />
                                        Dashboard
                                    </Link>
                                    <button
                                        type="button"
                                        className="userMenuItem userMenuLogout"
                                        onClick={handleLogout}
                                    >
                                        <FiLogOut />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="loginNavBtn"
                            >
                                Login
                            </Link>
                            <Link
                                to="/register-institute"
                                className="registerNavBtn"
                            >
                                Register
                            </Link>
                        </>
                    )}
                </div>
                {/* =========================================
                    MOBILE MENU BUTTON
                ========================================= */}
                <button
                    className="menuButton"
                    type="button"
                    aria-label={
                        menuOpen
                            ? "Close navigation menu"
                            : "Open navigation menu"
                    }
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen((prev) => !prev)}
                >
                    {menuOpen
                        ? <IoClose />
                        : <HiOutlineBars3BottomRight />
                    }
                </button>
            </div>
            {/* =========================================
                MOBILE MENU
            ========================================= */}
            <div
                className={`mobileNavMenu ${menuOpen ? "active" : ""
                    }`}
            >
                <nav className="mobileNavLinks">
                    <NavLink
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </NavLink>
                    <NavLink
                        to="/school"
                        onClick={closeMenu}
                    >
                        Schools
                    </NavLink>
                    <NavLink
                        to="/college"
                        onClick={closeMenu}
                    >
                        Colleges
                    </NavLink>
                    <NavLink
                        to="/courses"
                        onClick={closeMenu}
                    >
                        Courses
                    </NavLink>
                    <NavLink
                        to="/about"
                        onClick={closeMenu}
                    >
                        About
                    </NavLink>
                    <NavLink
                        to="/contact"
                        onClick={closeMenu}
                    >
                        Contact
                    </NavLink>
                    <NavLink
                        to="/how-it-works"
                        onClick={closeMenu}
                    >
                        How It Works
                    </NavLink>
                </nav>
                <div className="mobileNavDivider"></div>
                <div className="mobileNavActions">
                    {isLoggedIn ? (
                        <>
                            <div className="mobileUserCard">
                                <span className="mobileUserCardName">
                                    {displayName}
                                </span>
                                <span className="mobileUserCardRole">
                                    {roleLabel}
                                </span>
                            </div>
                            <Link
                                to={dashboardUrl}
                                className="mobileDashboardBtn"
                                onClick={closeMenu}
                            >
                                <FiGrid />
                                Dashboard
                            </Link>
                            <button
                                className="mobileLogoutBtn"
                                onClick={handleLogout}
                            >
                                <FiLogOut />
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/auth/login"
                                className="mobileLoginBtn"
                                onClick={closeMenu}
                            >
                                <HiOutlineUserCircle />
                                Login
                            </Link>
                            <Link
                                to="/register-institute"
                                className="mobileRegisterBtn"
                                onClick={closeMenu}
                            >
                                Register Your Institute
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
};
