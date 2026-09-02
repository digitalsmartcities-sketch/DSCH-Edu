import {
    FaGraduationCap,
    FaHome,
    FaExclamationTriangle
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "./error_page.css";

export const ErrorPage = ({
    code = "404",
    title = "Page Not Found",
    message = "The page you're looking for doesn't exist or may have been moved."
}) => {

    const navigate = useNavigate();

    return (
        <div className="dschErrorPage">

            <div className="dschErrorBackgroundShape shapeOne"></div>
            <div className="dschErrorBackgroundShape shapeTwo"></div>

            <div className="dschErrorContainer">

                {/* =========================================
                    BRAND
                ========================================= */}

                <div className="dschErrorBrand">

                    <div className="dschErrorBrandIcon">
                        <FaGraduationCap />
                    </div>

                    <div>
                        <strong>
                            DSCH
                        </strong>

                        <span>
                            Education
                        </span>
                    </div>

                </div>


                {/* =========================================
                    ERROR ICON
                ========================================= */}

                <div className="dschErrorIcon">

                    <div className="dschErrorIconCircle">
                        {code === "404"
                            ? "404"
                            : <FaExclamationTriangle />}
                    </div>

                </div>


                {/* =========================================
                    CONTENT
                ========================================= */}

                <span className="dschErrorLabel">
                    {code === "404"
                        ? "PAGE NOT FOUND"
                        : "SOMETHING WENT WRONG"}
                </span>

                <h1>
                    {title}
                </h1>

                <p>
                    {message}
                </p>


                {/* =========================================
                    ACTIONS
                ========================================= */}

                <div className="dschErrorActions">

                    <button
                        className="dschErrorPrimaryBtn"
                        onClick={() => navigate("/")}
                    >
                        <FaHome />
                        Back to Home
                    </button>
                </div>


                {/* =========================================
                    FOOTER MESSAGE
                ========================================= */}

                <div className="dschErrorFooter">

                    <span>
                        Digital Smart City Hub
                    </span>

                    <small>
                        Education Module
                    </small>

                </div>

            </div>

        </div>
    );
};