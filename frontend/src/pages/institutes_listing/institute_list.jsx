import "./institute_list.css";
import { Link, useNavigate } from "react-router-dom";
import {
    FaChevronRight,
    FaSearch,
    FaArrowRight,
    FaMapMarkerAlt
} from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { Navbar } from "../../components/navbar/navbar";
import { useEffect, useMemo, useState } from "react";
import { getPublishedInstitutes } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";

export const InstitutesList = ({ category }) => {
    const navigate = useNavigate();
    const [institutes, setInstitutes] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    let [instStartIdx, setInstStartIdx] = useState(0);

    useEffect(() => {
        getPublishedInstitutes(
            category,
            setInstitutes,
            setError,
            setLoading
        );
    }, [category]);

    const visibleInstitutes = useMemo(() => {
        const query = search.trim().toLowerCase();

        if (!query) {
            return institutes.slice(0, instStartIdx + 10);
        }

        return institutes.filter((institute) =>
            [
                institute.instituteName,
                institute.instituteAddress,
                institute.instituteType
            ]
                .filter(Boolean)
                .some((value) =>
                    value.toLowerCase().includes(query)
                )
        );
    }, [institutes, search, instStartIdx]);

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
                            Finding {category}s...
                        </p>

                    </div>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />

            {/* =========================================
                HERO / PAGE HEADER
            ========================================== */}
            <section className="categoryHero">
                <div className="categoryHeroImage">
                    <img
                        src={
                            category?.toLowerCase() === "school"
                                ? "https://images.unsplash.com/photo-1623078478974-7fd58475aab9?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                : "https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=1800&q=85"
                        }
                        alt={`${category} education`}
                    />
                </div>
                <div className="categoryHeroOverlay"></div>
                <div className="categoryHeroContent">
                    <div className="breadcrumb">
                        <Link to="/">
                            Home
                        </Link>
                        <FaChevronRight />
                        <span>
                            {category}
                        </span>
                    </div>
                    <span className="categoryHeroEyebrow">
                        EXPLORE EDUCATION IN KOHAT
                    </span>
                    <h1>
                        Discover trusted
                        <span> {category}</span>
                        <br />
                        for your journey
                    </h1>
                    <p>
                        Explore verified {category?.toLowerCase()} in
                        Kohat, compare their facilities, fee structures
                        and information, and find an institute that fits
                        your needs.
                    </p>
                    <div className="categoryHeroStats">
                        <div>
                            <strong>
                                {institutes.length}
                            </strong>
                            <span>
                                Institutes
                            </span>
                        </div>
                        <div>
                            <strong>
                                100%
                            </strong>
                            <span>
                                Verified Listings
                            </span>
                        </div>
                        <div>
                            <strong>
                                Online
                            </strong>
                            <span>
                                Admissions
                            </span>
                        </div>
                    </div>
                </div>
            </section>
            {/* =========================================
                LISTING
            ========================================== */}
            <main className="listingSection">
                <div className="container">
                    <div className="searchBox">
                        <input
                            type="text"
                            placeholder={`Search ${category} by name or location...`}
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                        />
                        <FaSearch />
                    </div>
                    <div className="listingTop">
                        <div>
                            <span className="listingEyebrow">
                                DISCOVER
                            </span>
                            <h2>
                                {visibleInstitutes.length}
                                {" "}
                                {category} available
                            </h2>
                            <p>
                                Browse institutes and explore their
                                information before making a decision.
                            </p>
                        </div>
                        <div className="listingSort">
                            <span>
                                Showing
                            </span>
                            <strong>
                                {visibleInstitutes.length}
                            </strong>
                        </div>
                    </div>
                    {error && (
                        <div className="listingMessage error">
                            {error}
                        </div>
                    )}
                    {!error && visibleInstitutes.length > 0 && (
                        <div className="listingGrid">
                            {visibleInstitutes.map((item) => {
                                const image =
                                    item.heroImages?.find(
                                        (hero) =>
                                            hero.name === "image1"
                                    )?.imageUrl ||
                                    item.heroImages?.[0]?.imageUrl;
                                const lowestMonthlyFee =
                                    item.academicPrograms?.length
                                        ? Math.min(
                                            ...item.academicPrograms.map(
                                                (program) =>
                                                    program.monthlyFee || 0
                                            )
                                        )
                                        : null;
                                return (
                                    <article
                                        className="schoolCard"
                                        key={item._id}
                                    >
                                        <div className="schoolImage">
                                            {image ? (
                                                <img
                                                    src={image}
                                                    alt={item.instituteName}
                                                />
                                            ) : (
                                                <div className="schoolImagePlaceholder">
                                                    <span>
                                                        No image available
                                                    </span>
                                                </div>
                                            )}
                                            <div className="verifiedTag">
                                                <MdVerified />
                                                Verified Institute
                                            </div>
                                        </div>
                                        <div className="schoolContent">
                                            <div className="schoolCardHeading">
                                                <h3>
                                                    {item.instituteName}
                                                </h3>
                                                <span className="schoolType">
                                                    {item.instituteType}
                                                </span>
                                            </div>
                                            <div className="locationRow">
                                                <FaMapMarkerAlt />
                                                <span>
                                                    {item.instituteAddress ||
                                                        "Location not provided"}
                                                </span>
                                            </div>
                                            {lowestMonthlyFee !== null && (
                                                <div className="feeHighlight">
                                                    <div>
                                                        <span>
                                                            Monthly fee
                                                        </span>
                                                        <strong>
                                                            PKR{" "}
                                                            {lowestMonthlyFee.toLocaleString()}
                                                        </strong>
                                                    </div>
                                                    <small>
                                                        Starting from
                                                    </small>
                                                </div>
                                            )}
                                            <div className="cardFooter">
                                                <button
                                                    className="detailsBtn"
                                                    onClick={() =>
                                                        navigate(
                                                            `/${item.instituteType || category}/${item._id}`
                                                        )
                                                    }
                                                >
                                                    View Institute
                                                    <FaArrowRight />
                                                </button>
                                            </div>
                                        </div>
                                    </article>
                                );
                            })}
                        </div>
                    )}
                    {!error &&
                        visibleInstitutes.length === 0 && (
                            <div className="emptyListing">
                                <div className="emptyIcon">
                                    <FaSearch />
                                </div>
                                <h3>
                                    {institutes.length === 0
                                        ? `No ${category}s registered yet`
                                        : "No institutes found"}
                                </h3>
                                <p>
                                    {institutes.length === 0
                                        ? `Educational institutes in this category will appear here as they complete registration and administrative verification.`
                                        : "We couldn't find any institutes matching your search query. Try another keyword or location."}
                                </p>
                            </div>
                        )}
                </div>
            </main>
            {/* =========================================
                PAGINATION
            ========================================== */}
            <section className="paginationSection">
                <div className="container">
                    <div className="pagination">
                        <button
                            disabled={instStartIdx === 0}
                            className="pageBtn"
                            onClick={() => {
                                (instStartIdx > 0) ?
                                    setInstStartIdx(instStartIdx - 10)
                                    :
                                    setInstStartIdx(0)
                            }}
                        >
                            Previous
                        </button>
                        <button
                            disabled={
                                instStartIdx >= institutes.length - 10
                            }
                            className="pageBtn"
                            onClick={() => {
                                if (
                                    instStartIdx <
                                    institutes.length - 10
                                ) {
                                    setInstStartIdx(
                                        instStartIdx + 10
                                    );
                                }
                            }}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    );
};