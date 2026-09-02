import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaArrowRight,
    FaChevronRight,
    FaClock,
    FaGraduationCap,
    FaSearch,
    FaStar
} from "react-icons/fa";
import { Navbar } from "../../components/navbar/navbar";
import "./courses_list.css";
import { fetchAllCourses } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";

export const CoursesList = () => {

    const navigate = useNavigate();

    /* =========================================================
       STATE
    ========================================================= */

    const [courses, setCourses] = useState([]);
    const [search, setSearch] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("ALL");
    const [selectedLevel, setSelectedLevel] = useState("ALL");
    const [startIndex, setStartIndex] = useState(0);
    const [loading, setLoading] = useState(true);


    /* =========================================================
       FETCH COURSES
    ========================================================= */

    useEffect(() => {
        fetchAllCourses(setCourses, setLoading);
    }, []);


    /* =========================================================
       CATEGORIES
    ========================================================= */

    const categories = useMemo(() => {
        const uniqueCategories = [
            ...new Set(
                courses
                    .map((course) => course?.category)
                    .filter(Boolean)
            )
        ];

        return [
            "ALL",
            ...uniqueCategories
        ];

    }, [courses]);


    /* =========================================================
       LEVELS
    ========================================================= */

    const levels = [
        "ALL",
        "BEGINNER",
        "INTERMEDIATE",
        "ADVANCED"
    ];


    /* =========================================================
       FILTER COURSES
    ========================================================= */

    const filteredCourses = useMemo(() => {

        const query = search.trim().toLowerCase();

        return courses.filter((course) => {

            const searchableValues = [
                course?.title,
                course?.category,
                course?.offeredByInstitute,
                course?.shortDescription
            ];

            const matchesSearch =
                !query ||
                searchableValues
                    .filter(Boolean)
                    .some((value) =>
                        String(value)
                            .toLowerCase()
                            .includes(query)
                    );


            const matchesCategory =
                selectedCategory === "ALL" ||
                course?.category === selectedCategory;


            const matchesLevel =
                selectedLevel === "ALL" ||
                course?.level === selectedLevel;


            return (
                matchesSearch &&
                matchesCategory &&
                matchesLevel
            );

        });

    }, [
        courses,
        search,
        selectedCategory,
        selectedLevel
    ]);


    /* =========================================================
       VISIBLE COURSES
    ========================================================= */

    const visibleCourses = filteredCourses.slice(
        startIndex,
        startIndex + 6
    );


    /* =========================================================
       RESET PAGINATION
    ========================================================= */

    const resetPagination = () => {
        setStartIndex(0);
    };


    /* =========================================================
       CLEAR FILTERS
    ========================================================= */

    const clearFilters = () => {

        setSearch("");
        setSelectedCategory("ALL");
        setSelectedLevel("ALL");
        setStartIndex(0);

    };


    /* =========================================================
       LOADING STATE
    ========================================================= */

    if (loading) {
        return (
            <div className="loadingPage">
                <Navbar />

                <div className="loadingInstitutes">
                    <div className="loaderCont">

                        <div className="access-loader">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <p>
                            Finding Courses...
                        </p>

                    </div>
                </div>
            </div>
        );
    }


    /* =========================================================
       MAIN
    ========================================================= */

    return (

        <div className="coursesPage">

            <Navbar />


            {/* =================================================
                HERO
            ================================================= */}

            <section className="coursesHero">

                <div className="coursesHeroImage">

                    <img
                        src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1800&q=85"
                        alt="Students learning"
                    />

                </div>


                <div className="coursesHeroOverlay"></div>


                <div className="coursesHeroContent">

                    <div className="coursesBreadcrumb">

                        <Link to="/">
                            Home
                        </Link>

                        <FaChevronRight />

                        <span>
                            Courses
                        </span>

                    </div>


                    <span className="coursesHeroEyebrow">
                        DSCH · LEARNING
                    </span>


                    <h1>
                        Learn skills that
                        <span> move you forward.</span>
                    </h1>


                    <p>
                        Explore courses offered by educational
                        institutes and build practical skills for
                        your academic and professional journey.
                    </p>


                    {/* HERO STATS */}
                    <div className="coursesHeroStats">
                        <div>
                            <strong>
                                {courses.length}
                            </strong>
                            <span>
                                Courses
                            </span>
                        </div>
                        <div>
                            <strong>
                                {Math.max(categories.length - 1, 0)}
                            </strong>
                            <span>
                                Categories
                            </span>
                        </div>
                        <div>
                            <strong>
                                Open
                            </strong>
                            <span>
                                Enrollment
                            </span>
                        </div>
                    </div>

                </div>

            </section>


            {/* =================================================
                LISTING
            ================================================= */}

            <main className="coursesListingSection">

                <div className="coursesContainer">


                    {/* =================================================
                        SEARCH / FILTER BAR
                    ================================================= */}

                    <div className="coursesFilterBar">


                        {/* SEARCH */}

                        <div className="coursesSearchBox">

                            <FaSearch />

                            <input
                                type="text"
                                placeholder="Search courses, categories or institutes..."
                                value={search}
                                onChange={(e) => {

                                    setSearch(e.target.value);
                                    resetPagination();

                                }}
                            />

                        </div>


                        {/* CATEGORY */}

                        <select
                            value={selectedCategory}
                            onChange={(e) => {

                                setSelectedCategory(e.target.value);
                                resetPagination();

                            }}
                        >

                            {categories.map((category) => (

                                <option
                                    key={category}
                                    value={category}
                                >
                                    {category === "ALL"
                                        ? "All Categories"
                                        : category}
                                </option>

                            ))}

                        </select>


                        {/* LEVEL */}

                        <select
                            value={selectedLevel}
                            onChange={(e) => {

                                setSelectedLevel(e.target.value);
                                resetPagination();

                            }}
                        >

                            {levels.map((level) => (

                                <option
                                    key={level}
                                    value={level}
                                >
                                    {level === "ALL"
                                        ? "All Levels"
                                        : level}
                                </option>

                            ))}

                        </select>

                    </div>


                    {/* =================================================
                        LISTING HEADER
                    ================================================= */}

                    <div className="coursesListingTop">

                        <div>

                            <span className="coursesListingEyebrow">
                                EXPLORE COURSES
                            </span>

                            <h2>
                                {filteredCourses.length}{" "}
                                {filteredCourses.length === 1
                                    ? "course"
                                    : "courses"}{" "}
                                available
                            </h2>

                            <p>
                                Find a course that matches your
                                interests and learning goals.
                            </p>

                        </div>


                        <div className="coursesResultCount">

                            <span>
                                Showing
                            </span>

                            <strong>
                                {visibleCourses.length}
                            </strong>

                        </div>

                    </div>


                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {visibleCourses.length === 0 && (

                        <div className="coursesEmptyState">

                            <div className="coursesEmptyIcon">

                                <FaSearch />

                            </div>


                            <h3>
                                {courses.length === 0
                                    ? "No courses available"
                                    : "No courses found"}
                            </h3>


                            <p>

                                {courses.length === 0
                                    ? "There are currently no courses available."
                                    : "Try changing your search or filters to find available courses."}

                            </p>


                            {courses.length > 0 && (

                                <button
                                    onClick={clearFilters}
                                >
                                    Clear Filters
                                </button>

                            )}

                        </div>

                    )}


                    {/* =================================================
                        COURSE GRID
                    ================================================= */}

                    {visibleCourses.length > 0 && (

                        <div className="coursesGrid">

                            {visibleCourses.map((course) => (

                                <article
                                    className="courseListingCard"
                                    key={course._id}
                                >


                                    {/* =================================================
                                        COURSE IMAGE
                                    ================================================= */}

                                    <div className="courseListingImage">

                                        <img
                                            src={
                                                course.thumbnail ||
                                                "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80"
                                            }
                                            alt={
                                                course.title ||
                                                "Course"
                                            }
                                        />


                                        <span className="courseCategoryBadge">

                                            {course.category}

                                        </span>

                                    </div>


                                    {/* =================================================
                                        COURSE BODY
                                    ================================================= */}

                                    <div className="courseListingBody">


                                        {/* TITLE */}

                                        <div className="courseListingTitle">

                                            <h3>
                                                {course.title}
                                            </h3>

                                        </div>


                                        {/* DESCRIPTION */}

                                        <p className="courseListingDescription">

                                            {course.shortDescription}

                                        </p>


                                        {/* =================================================
                                            COURSE META
                                        ================================================= */}

                                        <div className="courseListingMeta">

                                            <span>

                                                <FaGraduationCap />

                                                {course.level ||
                                                    "BEGINNER"}

                                            </span>


                                            <span>

                                                <FaClock />

                                                {course.duration ||
                                                    "N/A"}

                                            </span>

                                        </div>


                                        {/* =================================================
                                            PROVIDER
                                        ================================================= */}

                                        <div className="courseListingProvider">


                                            <img
                                                src={
                                                    course.offeredByInstituteLogoUrl ||
                                                    "https://via.placeholder.com/80"
                                                }
                                                alt={
                                                    course.offeredByInstitute ||
                                                    "Institute"
                                                }
                                            />


                                            <div>

                                                <small>
                                                    Offered by
                                                </small>

                                                <strong>
                                                    {course.offeredByInstitute}
                                                </strong>

                                            </div>

                                        </div>


                                        {/* =================================================
                                            FOOTER
                                        ================================================= */}

                                        <div className="courseListingFooter">


                                            {/* RATING */}

                                            <div className="courseListingRating">

                                                <FaStar />

                                                <strong>
                                                    {Number(
                                                        course.rating || 0
                                                    ).toFixed(1)}
                                                </strong>

                                                <span>
                                                    {course.studentEnrolled || 0}{" "}
                                                    learners
                                                </span>

                                            </div>


                                            {/* VIEW COURSE */}

                                            <button
                                                className="courseViewBtn"
                                                onClick={() =>
                                                    navigate(
                                                        `/course/${course._id}`
                                                    )
                                                }
                                            >

                                                View Course

                                                <FaArrowRight />

                                            </button>

                                        </div>

                                    </div>

                                </article>

                            ))}

                        </div>

                    )}


                    {/* =================================================
                        PAGINATION
                    ================================================= */}

                    {filteredCourses.length > 6 && (

                        <div className="coursesPagination">


                            {/* PREVIOUS */}

                            <button
                                disabled={startIndex === 0}
                                onClick={() =>
                                    setStartIndex(
                                        Math.max(
                                            startIndex - 6,
                                            0
                                        )
                                    )
                                }
                            >
                                Previous
                            </button>

                            {/* PAGE NUMBER */}
                            <span>
                                {Math.floor(startIndex / 6) + 1}
                            </span>


                            {/* NEXT */}

                            <button
                                disabled={
                                    startIndex + 6 >=
                                    filteredCourses.length
                                }
                                onClick={() =>
                                    setStartIndex(
                                        startIndex + 6
                                    )
                                }
                            >
                                Next
                            </button>

                        </div>

                    )}

                </div>

            </main>


            <Footer />

        </div>

    );
};