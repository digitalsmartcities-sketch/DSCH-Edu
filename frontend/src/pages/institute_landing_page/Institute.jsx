import "./Institute.css";
import { useEffect, useState } from "react";
import { FaCalendarAlt, FaChevronDown, FaGlobe, FaPhoneAlt, FaShare } from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import { Navbar } from "../../components/navbar/navbar";
import { getPublishedInstituteById } from "../../apicalls/public_apicalls";
import { RatingReview } from "../../components/rating_component/rating_sec";
import { Footer } from "../../components/footer/Footer";

const formatCurrency = (amount) => `PKR ${Number(amount || 0).toLocaleString()}`;

const InstituteLoading = () => {
    return (
        <>
            <Navbar />
            <main className="instituteLoadingPage" aria-label="Loading institute profile">
                <div className="Inst_container">
                    <div className="instituteLoadingHero">
                        <div className="loadingGallery">
                            <div className="loadingBlock loadingMainImage"></div>
                            <div className="loadingSideImages">
                                <div className="loadingBlock"></div>
                                <div className="loadingBlock"></div>
                                <div className="loadingBlock"></div>
                                <div className="loadingBlock"></div>
                            </div>
                        </div>

                        <div className="loadingTitleRow">
                            <div>
                                <div className="loadingBlock loadingBadge"></div>
                                <div className="loadingBlock loadingTitle"></div>
                                <div className="loadingBlock loadingLocation"></div>
                            </div>
                            <div className="loadingBlock loadingShare"></div>
                        </div>

                        <div className="loadingButtons">
                            <div className="loadingBlock loadingButton"></div>
                            <div className="loadingBlock loadingButton secondary"></div>
                            <div className="loadingBlock loadingButton secondary"></div>
                        </div>
                    </div>

                    <div className="loadingInfoGrid">
                        {[1, 2, 3, 4, 5].map((item) => (
                            <div className="loadingInfoCard" key={item}>
                                <div className="loadingBlock loadingInfoLabel"></div>
                                <div className="loadingBlock loadingInfoValue"></div>
                            </div>
                        ))}
                    </div>

                    <div className="loadingOverview">
                        <div>
                            <div className="loadingBlock loadingSectionLabel"></div>
                            <div className="loadingBlock loadingSectionTitle"></div>
                            <div className="loadingBlock loadingParagraph"></div>
                            <div className="loadingBlock loadingParagraph short"></div>
                        </div>
                        <div className="loadingStats">
                            {[1, 2, 3, 4].map((item) => <div className="loadingBlock loadingStat" key={item}></div>)}
                        </div>
                    </div>
                </div>
            </main>
        </>
    );
};

export const Institute = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeFAQ, setActiveFAQ] = useState(-1);
    const [institute, setInstitute] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        getPublishedInstituteById(id, setInstitute, setError, setLoading);
    }, [id]);

    if (loading) return <InstituteLoading />;
    if (error || !institute) return <><Navbar /><main className="container">{error || "Institute not found."}</main></>;

    const heroImages = institute.heroImages?.filter((image) => image.imageUrl) || [];
    const galleryImages = institute.gallery?.filter((image) => image.imageUrl) || [];
    const displayImages = heroImages.length ? heroImages : galleryImages;
    const quickInfo = institute.quickInfo || {};
    const aboutInfo = institute.aboutInfo || {};
    const programs = institute.academicPrograms || [];
    const facilities = institute.facilities || [];
    const faqs = institute.faqs || [];

    return (
        <>
            <Navbar />
            <section className="instituteHero"><div className="Inst_container">
                <div className="gallery">
                    <div className="mainImage">{displayImages[0]?.imageUrl ? <img src={displayImages[0].imageUrl} alt={institute.instituteName} /> : <div className="school-image-placeholder">No image yet</div>}</div>
                    <div className="sideImages">{displayImages.slice(1, 5).map((image, index) => <img key={image._id || image.public_id || index} src={image.imageUrl} alt={`${institute.instituteName} campus`} />)}</div>
                </div>
                <div className="instPgHeroContent"><div className="titleRow"><div className="heroTitleGroup">
                    {institute.instituteLogo?.imageUrl && (
                        <div className="heroLogoCircle">
                            <img src={institute.instituteLogo.imageUrl} alt={`${institute.instituteName} logo`} />
                        </div>
                    )}
                    <div>
                        <div className="instPgVerifiedBadge"><MdVerified /> Verified Institute</div>
                        <h1>{institute.instituteName}</h1>
                        <div className="heroMeta"><span><MdLocationOn /> {institute.instituteAddress}</span></div>
                    </div>
                </div><div className="heroActions"><button type="button" aria-label="Share institute"><FaShare /></button></div></div>
                    <div className="heroButtons">
                        <button className="applyBtn" onClick={() => navigate(`/${institute.instituteType}/admission/${institute._id}`)}>Apply Now</button>
                        <a className="callBtn" href={`tel:${institute.institutePhone}`}><FaPhoneAlt /> Call</a>
                        {institute.website && <a className="websiteBtn" href={institute.website} target="_blank" rel="noreferrer"><FaGlobe /> Website</a>}
                    </div>
                </div>
            </div></section>

            <section className="quickInfoSection"><div className="container"><div className="quickInfoGrid">
                <div className="infoCard"><span>Admission Status</span><h3>{quickInfo.admissionStatus || "Not announced"}</h3></div>
                <div className="infoCard"><span>Board</span><h3>{quickInfo.board || "Not provided"}</h3></div>
                <div className="infoCard"><span>Classes</span><h3>{quickInfo.classes || "Not provided"}</h3></div>
                <div className="infoCard"><span>Medium</span><h3>{quickInfo.medium || "Not provided"}</h3></div>
                <div className="infoCard"><span>Gender</span><h3>{quickInfo.gender || "Not provided"}</h3></div>
            </div></div></section>

            <section className="stickyNavigation"><div className="container"><div className="stickyNav"><a href="#overview">Overview</a><a href="#programs">Programs</a><a href="#timetable">Timetable</a><a href="#facilities">Facilities</a><a href="#gallery">Gallery</a><a href="#faqs">FAQs</a></div></div></section>

            <section id="overview" className="overviewSection"><div className="container"><div className="sectionTitle"><span>About Institute</span><h2>Overview</h2></div><div className="overviewGrid">
                <div className="overviewContent"><p>{aboutInfo.about || "This institute has not added an overview yet."}</p></div>
                <div className="overviewHighlights">
                    <div className="highlightCard"><h3>Established</h3><p>{aboutInfo.establishedYear || "—"}</p></div>
                    <div className="highlightCard"><h3>Total Students</h3><p>{aboutInfo.totalStudents || "—"}</p></div>
                    <div className="highlightCard"><h3>Teachers</h3><p>{aboutInfo.teachers || "—"}</p></div>
                    <div className="highlightCard"><h3>Campus Area</h3><p>{aboutInfo.campusArea || "—"}</p></div>
                </div>
            </div></div></section>

            <section id="programs" className="programsSection"><div className="container"><div className="sectionTitle"><span>Academic Programs</span><h2>Classes & Fee Structure</h2></div><div className="programTable">
                <div className="tableHeader"><span>Program</span><span>Duration</span><span>Admission Fee</span><span>Monthly Fee</span><span>Admission Status</span></div>
                {programs.map((program, index) => <div className="tableRow" key={program._id || program.id || index}><span>{program.class}</span><span>{program.duration}</span><span>{formatCurrency(program.admissionFee)}</span><span>{formatCurrency(program.monthlyFee)}</span><span className={`instPageProgramTblAdmStat ${program.admissionStatus === "OPEN" ? "open" : "close"}`}>{program.admissionStatus}</span></div>)}
                {!programs.length && <p>This institute has not added programs yet.</p>}
            </div></div></section>

            <section id="facilities" className="facilitiesSection"><div className="container"><div className="sectionTitle"><span>Campus Facilities</span><h2>Everything Students Need</h2></div><div className="facilityGrid">
                {facilities.map((facility, index) => <div className="facilityCard" key={facility._id || facility.id || index}><h3>{facility.name}</h3><p>{facility.description || ""}</p></div>)}
                {!facilities.length && <p>This institute has not added facilities yet.</p>}
            </div></div></section>

            {institute.timeTableImage?.imageUrl && (
                <section id="timetable" className="timetableSection">
                    <div className="container">
                        <div className="sectionTitle">
                            <span>Class Schedule</span>
                            <h2>Academic Timetable</h2>
                        </div>
                        <div className="timetableWrapper">
                            <div className="timetableHeader">
                                <div className="timetableHeaderLeft">
                                    <div className="timetableIconBadge"><FaCalendarAlt /></div>
                                    <div>
                                        <h3>Official Class Schedule</h3>
                                        <p>View the complete class, break &amp; holiday schedule below.</p>
                                    </div>
                                </div>
                                <a
                                    href={institute.timeTableImage.imageUrl}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="timetableDownloadBtn"
                                >
                                    View Full Size
                                </a>
                            </div>
                            <div className="timetableImgContainer">
                                <img
                                    src={institute.timeTableImage.imageUrl}
                                    alt={`${institute.instituteName} timetable`}
                                    className="timetableImg"
                                />
                            </div>
                        </div>
                    </div>
                </section>
            )}

            <section id="gallery" className="gallerySection"><div className="container"><div className="sectionTitle"><span>Campus Gallery</span><h2>Explore Our Campus</h2></div>
                {galleryImages.length ? <div className="galleryGrid">{galleryImages.slice(0, 5).map((image, index) => <div className={index === 0 ? "galleryLarge" : "galleryItem"} key={image._id || image.public_id || index}><img src={image.imageUrl} alt={`${institute.instituteName} campus`} /></div>)}</div> : <p>This institute has not added gallery images yet.</p>}
            </div></section>
            <RatingReview instituteId={institute._id} />
            <section id="faqs" className="faqSection"><div className="container"><div className="sectionTitle"><span>Frequently Asked Questions</span><h2>Have Questions?</h2></div><div className="faqContainer">
                {faqs.map((faq, index) => <div className={`faqItem ${activeFAQ === index ? "active" : ""}`} key={faq._id || faq.id || index}><button className="faqQuestion" onClick={() => setActiveFAQ(activeFAQ === index ? -1 : index)}><span>{faq.question}</span><FaChevronDown /></button>{activeFAQ === index && <div className="faqAnswer"><p>{faq.answer}</p></div>}</div>)}
                {!faqs.length && <p>This institute has not added FAQs yet.</p>}
            </div></div></section>

            <section className="admissionSection"><div className="container"><div className="admissionBox"><div className="admissionContent"><span>Student Admission</span><h2>Apply for Admission</h2><p>Submit your admission application directly to {institute.instituteName}.</p></div><div className="loginCard"><h3>Ready to apply?</h3><p>Continue to the admission form for this institute.</p><button onClick={() => navigate(`/${institute.instituteType}/admission/${institute._id}`)} className="loginBtn">Apply Now</button></div></div></div></section>
            <Footer />
        </>
    );
};
