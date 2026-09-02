import { useNavigate, useParams } from "react-router-dom";
import {
    FaArrowLeft,
    FaArrowRight,
    FaCheckCircle,
    FaChevronDown,
    FaClock,
    FaGraduationCap,
    FaPlay,
    FaStar,
    FaUniversity,
    FaUserGraduate
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Navbar } from "../../components/navbar/navbar";
import "./course.css";
import { useEffect, useState } from "react";
import { getCourseById } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";

export const Course = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    let [course, setCourse] = useState();
    let [loading, setLoading] = useState(true);

    useEffect(() => {
        getCourseById(id, setCourse, setLoading);
    }, [id])

    if (loading) {
        return (
            <>
                <Navbar />

                <div className="courseNotFound">
                    <FaGraduationCap />

                    <h1>
                        Loading...
                    </h1>

                    <p>
                        Please wait while we load the course.
                    </p>
                </div>

                <Footer />
            </>
        );
    }

    if (!course) {
        return (
            <>
                <Navbar />

                <div className="courseNotFound">
                    <FaGraduationCap />

                    <h1>
                        Course Not Found
                    </h1>

                    <p>
                        The course you are looking for does not exist.
                    </p>

                    <Link to="/courses">
                        Browse Courses
                    </Link>
                </div>

                <Footer />
            </>
        );
    }

    return (
        <div className="courseDetailsPage">

            <Navbar />


            {/* =========================================
                HERO
            ========================================= */}

            <section className="courseDetailsHero">

                <div className="courseDetailsHeroInner">

                    <Link
                        to="/courses"
                        className="courseBackLink"
                    >
                        <FaArrowLeft />
                        All Courses
                    </Link>


                    <div className="courseDetailsHeroGrid">

                        <div className="courseDetailsHeroContent">

                            <span className="courseDetailsCategory">
                                {course.category}
                            </span>

                            <h1>
                                {course.title}
                            </h1>

                            <p className="courseDetailsShortDescription">
                                {course.shortDescription}
                            </p>


                            <div className="courseDetailsMeta">

                                <span>
                                    <FaGraduationCap />
                                    {course.level}
                                </span>

                                <span>
                                    <FaClock />
                                    {course.duration}
                                </span>

                                <span>
                                    <FaUniversity />
                                    {course.mode}
                                </span>

                                <span>
                                    <FaStar />
                                    {course.rating}
                                </span>

                            </div>


                            <div className="courseOfferedBy">

                                <img
                                    src={
                                        course.offeredByInstituteLogoUrl
                                    }
                                    alt={
                                        course.offeredByInstitute
                                    }
                                />

                                <div>

                                    <small>
                                        Course offered by
                                    </small>

                                    <strong>
                                        {course.offeredByInstitute}
                                    </strong>

                                </div>

                            </div>

                        </div>


                        {/* COURSE IMAGE / ENROLL BOX */}

                        <div className="courseDetailsEnrollCard">

                            <div className="courseDetailsImage">

                                <img
                                    src={course.thumbnail}
                                    alt={course.title}
                                />

                            </div>


                            <div className="courseEnrollContent">

                                <div className="enrollmentStatus">

                                    <span className="activeDot"></span>

                                    Enrollment Open

                                </div>

                                <button className="enrollCourseBtn" onClick={() => navigate(`/course/enroll/${course?._id}`)}>
                                    Enroll Now
                                    <FaArrowRight />
                                </button>

                                <p>
                                    Enroll through DSCH and start
                                    your learning journey.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </section>


            {/* =========================================
                MAIN CONTENT
            ========================================= */}

            <main className="courseDetailsMain">

                <div className="courseDetailsLayout">

                    <div className="courseDetailsPrimary">

                        {/* LEARNING OUTCOMES */}

                        <section className="courseDetailsSection">

                            <div className="courseSectionHeading">

                                <span>
                                    WHAT YOU'LL LEARN
                                </span>

                                <h2>
                                    Skills you'll gain
                                </h2>

                            </div>


                            <div className="learningOutcomesGrid">

                                {course.learningOutcomes.map(
                                    (item, index) => (

                                        <div
                                            className="learningOutcome"
                                            key={index}
                                        >
                                            <FaCheckCircle />
                                            <span>
                                                {item}
                                            </span>
                                        </div>

                                    ))}

                            </div>

                        </section>


                        {/* DESCRIPTION */}

                        <section className="courseDetailsSection">

                            <div className="courseSectionHeading">

                                <span>
                                    ABOUT THE COURSE
                                </span>

                                <h2>
                                    Course Overview
                                </h2>

                            </div>

                            <p className="courseOverviewText">
                                {course.description}
                            </p>

                        </section>


                        {/* CURRICULUM */}

                        <section className="courseDetailsSection">

                            <div className="courseSectionHeading">

                                <span>
                                    CURRICULUM
                                </span>

                                <h2>
                                    Course Curriculum
                                </h2>

                                <p>
                                    {course.modules.length} modules
                                    {" · "}
                                    {course.modules.reduce(
                                        (total, module) =>
                                            total + module.lessons.length,
                                        0
                                    )}
                                    {" lessons"}
                                </p>

                            </div>


                            <div className="courseCurriculum">

                                {course.modules.map(
                                    (module, index) => (

                                        <details
                                            className="courseModule"
                                            key={module.title}
                                            open={index === 0}
                                        >

                                            <summary>

                                                <div>

                                                    <span>
                                                        Module {index + 1}
                                                    </span>

                                                    <strong>
                                                        {module.title}
                                                    </strong>

                                                </div>

                                                <FaChevronDown />

                                            </summary>


                                            <div className="moduleLessons">

                                                {module.lessons.map(
                                                    (lesson, lessonIndex) => (

                                                        <div
                                                            className="courseLesson"
                                                            key={lessonIndex}
                                                        >

                                                            <FaPlay />

                                                            <span>
                                                                {lesson}
                                                            </span>

                                                        </div>

                                                    ))}

                                            </div>

                                        </details>

                                    ))}

                            </div>

                        </section>


                        {/* REQUIREMENTS */}

                        <section className="courseDetailsSection">

                            <div className="courseTwoColumn">

                                <div>

                                    <div className="courseSectionHeading">
                                        <span>
                                            REQUIREMENTS
                                        </span>

                                        <h2>
                                            Before you begin
                                        </h2>
                                    </div>

                                    <div className="simpleList">

                                        {course.requirements.map(
                                            (item, index) => (

                                                <div key={index}>
                                                    <FaCheckCircle />
                                                    {item}
                                                </div>

                                            ))}

                                    </div>

                                </div>


                                <div>

                                    <div className="courseSectionHeading">

                                        <span>
                                            WHO IT'S FOR
                                        </span>

                                        <h2>
                                            This course is for
                                        </h2>

                                    </div>

                                    <div className="simpleList">

                                        {course.targetAudience.map(
                                            (item, index) => (

                                                <div key={index}>
                                                    <FaUserGraduate />
                                                    {item}
                                                </div>

                                            ))}

                                    </div>

                                </div>

                            </div>

                        </section>

                    </div>


                    {/* SIDE CARD */}

                    <aside className="courseDetailsSidebar">

                        <div className="courseSidebarCard">

                            <div className="sidebarIcon">
                                <FaCertificateIcon />
                            </div>

                            <h3>
                                Certificate Available
                            </h3>

                            <p>
                                Students who successfully complete
                                the course can receive a certificate
                                through DSCH.
                            </p>

                        </div>


                        <div className="courseSidebarProvider">

                            <span>
                                OFFERED BY
                            </span>

                            <img
                                src={
                                    course.offeredByInstituteLogoUrl
                                }
                                alt={
                                    course.offeredByInstitute
                                }
                            />

                            <h3>
                                {course.offeredByInstitute}
                            </h3>

                        </div>

                    </aside>

                </div>
            </main>


            {/* =========================================
                CTA
            ========================================= */}

            <section className="courseDetailsCTA">

                <h2>
                    Ready to start learning?
                </h2>

                <p>
                    Enroll in {course.title} and begin building
                    valuable skills.
                </p>

                <button onClick={() => navigate(`/course/enroll/${course?._id}`)}>
                    Enroll Now
                    <FaArrowRight />
                </button>

            </section>


            <Footer />

        </div>
    );
};


/* Small helper icon */

const FaCertificateIcon = () => (
    <FaGraduationCap />
);