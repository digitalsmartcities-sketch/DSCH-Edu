import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
    HiOutlineBars3BottomRight,
    HiOutlineUserCircle
} from "react-icons/hi2";
import { IoClose } from "react-icons/io5";
import "./navbar.css";
import AppContext from "../../app_context/context";
import { logOutApi } from "../../apicalls/public_apicalls";

export const Navbar = () => {
    const [menuOpen, setMenuOpen] = useState(false);
    const { userState, setUserState } = useContext(AppContext);
    const navigate = useNavigate();

    const closeMenu = () => {
        setMenuOpen(false);
    };

    const handleLogout = () => {
        logOutApi(setUserState, navigate);
        closeMenu();
    };

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
                        src="https://kohat.online/static/media/navlogo.0fd8dfb4ecd22e75c6c8.jpg"
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
                    {userState === "login" ? (
                        <button
                            className="logOutNavBtn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
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
                    {userState === "login" ? (
                        <button
                            className="mobileLogoutBtn"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>
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