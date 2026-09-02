import "./Footer.css";
import { Link } from "react-router-dom";
import { MdEmail, MdLocationOn } from "react-icons/md";
import { FaGraduationCap } from "react-icons/fa";

export const Footer = () => {
    return (
        <footer className="footer">
            <div className="footerContainer">

                <div className="footerColumn">
                    <div className="footerBrandHeader">
                        <FaGraduationCap className="footerBrandIcon" />
                        <span className="footerBrandTitle">DSCH-Edu</span>
                    </div>
                    <p>
                        The dedicated education module of Digital Smart City Hub. Discover verified schools, colleges, and practical skill courses across Kohat.
                    </p>
                </div>

                <div className="footerColumn">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/school">Schools</Link>
                    <Link to="/college">Colleges</Link>
                    <Link to="/courses">Courses</Link>
                    <Link to="/how-it-works">How It Works</Link>
                </div>

                <div className="footerColumn">
                    <h3>Institutes & Portals</h3>
                    <Link to="/register-institute">Register Institute</Link>
                    <Link to="/auth/login">Portal Login</Link>
                    <Link to="/about">About DSCH-Edu</Link>
                    <Link to="/contact">Contact Support</Link>
                </div>

                <div className="footerColumn">
                    <h3>Platform Contact</h3>

                    <div className="contactItem">
                        <MdLocationOn />
                        <span>Kohat, Khyber Pakhtunkhwa, Pakistan</span>
                    </div>

                    <div className="contactItem">
                        <MdEmail />
                        <span>info@kohat.online</span>
                    </div>
                </div>

            </div>

            <div className="footerBottom">
                <p>© 2026 DSCH-Edu · Digital Smart City Hub. All Rights Reserved.</p>
            </div>
        </footer>
    );
};