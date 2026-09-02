import { useContext, useEffect, useState } from 'react';
import { Navbar } from './components/navbar/navbar';
import { Footer } from './components/footer/Footer';
import { Link } from 'react-router-dom';
import { MdVerified, MdOutlineFactCheck } from 'react-icons/md';
import { fetchAllCourses } from './apicalls/public_apicalls';
import { IoSchool } from 'react-icons/io5';
import AppContext from './app_context/context';
import heroImage from "./assets/hero.png";
import "./App.css";
import {
  HiOutlineAcademicCap,
  HiOutlineDocumentCheck,
  HiOutlineCreditCard,
  HiOutlineBuildingLibrary,
  HiOutlineClipboardDocumentCheck,
  HiOutlineIdentification
} from 'react-icons/hi2';
import {
  FaArrowRightLong,
  FaClock,
  FaLocationDot,
  FaSchool,
  FaShieldHalved,
  FaCheck,
  FaRotateRight
} from 'react-icons/fa6';

function App() {
  const { heroPageInstitutes } = useContext(AppContext);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchAllCourses(setCourses);
  }, []);

  return (
    <>
      {/* Navbar */}
      <Navbar />
      <main className="homePageMain">
        {/* DSCH-Edu Hero Section */}
        <section className="dschHeroSection">
          <div className="dschHeroGlow dschHeroGlowPrimary"></div>
          <div className="dschHeroGlow dschHeroGlowSecondary"></div>
          <div className="dschHeroContainer">
            <div className="dschHeroContent">
              <div className="dschHeroBadge">
                <MdVerified />
                <span>
                  Education Module · Digital Smart City Hub
                </span>
              </div>
              <h1 className="dschHeroTitle">
                Explore education.
                <span>Find what fits you.</span>
              </h1>
              <p className="dschHeroDescription">
                Discover schools, colleges and skill-based courses,
                explore available information, and use digital
                admission and enrollment services through DSCH-Edu.
              </p>
              <div className="dschHeroActions">
                <Link
                  to="/school"
                  className="dschHeroPrimaryButton"
                >
                  Explore Institutes
                  <FaArrowRightLong />
                </Link>
                <Link
                  to="/courses"
                  className="dschHeroSecondaryButton"
                >
                  Browse Courses
                </Link>
              </div>
              <div className="dschHeroExploreLinks">
                <span className="dschHeroExploreLabel">
                  Explore
                </span>
                <Link to="/school">
                  <FaSchool />
                  Schools
                </Link>
                <Link to="/college">
                  <IoSchool />
                  Colleges
                </Link>
                <Link to="/courses">
                  <HiOutlineAcademicCap />
                  Courses
                </Link>
              </div>
            </div>
            <div className="dschHeroVisual">
              <div className="dschHeroVisualGlow"></div>
              <div className="dschHeroArtwork">
                <img
                  src={heroImage}
                  alt="DSCH-Edu digital education platform"
                />
              </div>
              <div className="dschHeroAccentLine"></div>
            </div>
          </div>
        </section>
        {/* Explore Categories */}
        <section className="categories">
          <div className="sectionHeading">
            <span>Browse Categories</span>
            <h2>Find the Right Educational Pathway</h2>
            <p>
              Explore schools, colleges, and standalone professional skill courses
              across Kohat.
            </p>
          </div>
          <div className="categoryGrid">
            <Link to="/school" className="categoryCard">
              <div className="categoryIcon">
                <FaSchool />
              </div>
              <h3>Schools</h3>
              <p>
                Search primary, secondary, and higher secondary schools with
                program details, facilities, and admission requirements.
              </p>
              <span>
                Explore Schools
                <FaArrowRightLong />
              </span>
            </Link>
            <Link to="/college" className="categoryCard">
              <div className="categoryIcon">
                <IoSchool />
              </div>
              <h3>Colleges</h3>
              <p>
                Discover intermediate and degree colleges offering FSC, FA,
                ICS, and undergraduate programs with fee information.
              </p>
              <span>
                Explore Colleges
                <FaArrowRightLong />
              </span>
            </Link>
            <Link to="/courses" className="categoryCard">
              <div className="categoryIcon">
                <HiOutlineAcademicCap />
              </div>
              <h3>Skill Courses</h3>
              <p>
                Learn practical technical and creative skills through certified
                short courses open to all learners independently.
              </p>
              <span>
                Explore Courses
                <FaArrowRightLong />
              </span>
            </Link>
          </div>
        </section>
        {/* DSCH-Edu offers */}
        <section className="whatWeOfferSection">
          <div className="sectionHeading">
            <span>Platform Capabilities</span>
            <h2>What DSCH-Edu Offers</h2>
            <p>
              A purpose-built digital ecosystem connecting students, parents,
              and educational institutes with clear, verifiable processes.
            </p>
          </div>
          <div className="servicesGrid">
            <div className="serviceCard">
              <div className="serviceIcon">
                <FaSchool />
              </div>
              <h3>School Discovery</h3>
              <p>
                Explore verified school profiles, class levels, academic facilities,
                and contact information in one organized directory.
              </p>
            </div>
            <div className="serviceCard">
              <div className="serviceIcon">
                <HiOutlineBuildingLibrary />
              </div>
              <h3>College Discovery</h3>
              <p>
                Compare intermediate and degree programs, monthly fees, eligibility
                criteria, and campus environments.
              </p>
            </div>
            <div className="serviceCard">
              <div className="serviceIcon">
                <HiOutlineClipboardDocumentCheck />
              </div>
              <h3>Online Admissions</h3>
              <p>
                Submit complete admission applications online with personal, academic,
                and guardian details plus digital document verification.
              </p>
            </div>
            <div className="serviceCard">
              <div className="serviceIcon">
                <HiOutlineAcademicCap />
              </div>
              <h3>Course Enrollment</h3>
              <p>
                Discover published skill courses and enroll directly without needing
                admission to a formal school or college.
              </p>
            </div>
            <div className="serviceCard">
              <div className="serviceIcon">
                <HiOutlineCreditCard />
              </div>
              <h3>Fee & Payment Records</h3>
              <p>
                Submit admission fee and monthly payment proofs and receive verified
                digital confirmation through administrative review.
              </p>
            </div>
            <div className="serviceCard">
              <div className="serviceIcon">
                <HiOutlineIdentification />
              </div>
              <h3>Academic Certificates</h3>
              <p>
                Access verified course completion and student certificates generated
                through supported DSCH-Edu administrative workflows.
              </p>
            </div>
          </div>
        </section>
        {/* DSCH-Edu working */}
        <section className="howItWorksOverviewSec">
          <div className="sectionHeading">
            <span>Simple & Structured</span>
            <h2>How DSCH-Edu Works</h2>
            <p>
              Every step from discovery to completion is designed to be transparent,
              reliable, and easy to follow.
            </p>
          </div>
          <div className="stepsPipeline">
            <div className="stepPipelineCard">
              <span className="stepNum">01</span>
              <h3>Discover</h3>
              <p>Find an institute, academic program, or skill course that fits your goals.</p>
            </div>
            <div className="stepPipelineCard">
              <span className="stepNum">02</span>
              <h3>Review</h3>
              <p>Read program requirements, fee structures, and verified institute information.</p>
            </div>
            <div className="stepPipelineCard">
              <span className="stepNum">03</span>
              <h3>Apply / Enroll</h3>
              <p>Submit your admission or course enrollment application with required documents.</p>
            </div>
            <div className="stepPipelineCard">
              <span className="stepNum">04</span>
              <h3>Verification</h3>
              <p>The responsible administrator reviews submitted information and payment proofs.</p>
            </div>
            <div className="stepPipelineCard">
              <span className="stepNum">05</span>
              <h3>Complete</h3>
              <p>Receive status updates, student account access, or course participation details.</p>
            </div>
          </div>

          <div className="howItWorksCtaRow">
            <Link to="/how-it-works" className="howItWorksFullBtn">
              Read Detailed Workflow Guide
              <FaArrowRightLong />
            </Link>
          </div>
        </section>
        {/* Workflow guidance */}
        <section className="twoWorkflowsSection">
          <div className="sectionHeading">
            <span>Clear Separation</span>
            <h2>Understanding Our Workflows</h2>
            <p>
              DSCH-Edu manages formal school/college admissions and standalone skill
              course enrollments through separate, dedicated workflows.
            </p>
          </div>
          <div className="workflowsCompareGrid">
            {/* ADMISSION WORKFLOW */}
            <div className="workflowCompareCard">
              <div className="workflowHeader">
                <span className="workflowBadge admissionBadge">Formal Education</span>
                <h3>Student Admission Workflow</h3>
                <p>For students applying to schools or colleges.</p>
              </div>
              <ul className="workflowChecklist">
                <li>
                  <FaCheck />
                  <div>
                    <strong>Browse Institute Profile</strong>
                    <p>Review academic programs, facilities and fees etc.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Submit Admission Form</strong>
                    <p>Provide personal, academic, guardian data, and document uploads.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Submit Fee Proof</strong>
                    <p>Provide transaction ID and payment proof for admission fees.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Institute Review & Correction</strong>
                    <p>Institute reviews application. If rejected, corrections can be resubmitted.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Student Account Provisioning</strong>
                    <p>Upon approval, a student dashboard account is created to track fees and records.</p>
                  </div>
                </li>
              </ul>
              <div className="workflowFooterLink">
                <Link to="/school">Explore Schools & Colleges</Link>
              </div>
            </div>
            {/* COURSE ENROLLMENT WORKFLOW */}
            <div className="workflowCompareCard">
              <div className="workflowHeader">
                <span className="workflowBadge courseBadge">Skill Development</span>
                <h3>Course Enrollment Workflow</h3>
                <p>Open to any learner — no school/college admission required.</p>
              </div>
              <ul className="workflowChecklist">
                <li>
                  <FaCheck />
                  <div>
                    <strong>Explore Available Courses</strong>
                    <p>Browse technical, creative, and professional learning modules.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Submit Direct Enrollment</strong>
                    <p>Fill out the standalone course enrollment form with your contact details.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Submit Course Fee Proof</strong>
                    <p>Provide payment verification for the specified course fee.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Administrative Approval</strong>
                    <p>Admin reviews and approves enrollment, sharing course details/group links.</p>
                  </div>
                </li>
                <li>
                  <FaCheck />
                  <div>
                    <strong>Participation & Certificate</strong>
                    <p>Complete learning milestones and receive a verified course certificate.</p>
                  </div>
                </li>
              </ul>
              <div className="workflowFooterLink">
                <Link to="/courses">Browse Available Courses</Link>
              </div>
            </div>
          </div>
        </section>
        {/* Featured Institutes if avaliable else informative box for it */}
        <section className="featuredInstitutesSection">
          {heroPageInstitutes && heroPageInstitutes.length >= 3 ? (
            <>
              <div className="sectionHeading">
                <span>Featured Institutes</span>
                <h2>Registered Educational Institutes</h2>
                <p>
                  Browse verified schools and colleges currently active on the platform.
                </p>
              </div>
              <div className="featuredGrid">
                {heroPageInstitutes.map((item) => (
                  <div className="featuredInstitutes_instituteCard" key={item.id || item._id}>
                    <div className="featuredInstitutes_cardImage">
                      <img src={item.image || item.heroImages?.[0]?.imageUrl || "https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80"} alt={item.name || item.instituteName} />
                    </div>
                    <div className="featuredInstitutes_cardBody">
                      {item.verified && (
                        <div className="verifiedBadge">
                          <MdVerified />
                          Verified
                        </div>
                      )}
                      <h3>{item.name || item.instituteName}</h3>
                      <div className="featuredInstitutes_location">
                        <FaLocationDot />
                        {item.location || item.instituteAddress || "Kohat"}
                      </div>
                      {item.fee && <p>{item.fee}</p>}
                      <Link
                        to={`/${item.instituteType || 'school'}/${item.id || item._id}`}
                        className="featuredInstitutes_viewProfileBtn"
                      >
                        View Profile
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="informativeFeatureBox">
              <div className="informativeHeader">
                <span className="informativeEyebrow">Directory in Progress</span>
                <h2>Explore Education in Kohat</h2>
                <p>
                  DSCH-Edu is currently onboarding educational institutes across Kohat.
                  As schools and colleges complete administrative verification, their official
                  profiles, fee schedules, and admission forms will appear here.
                </p>
              </div>
              <div className="informativeHighlights">
                <div className="infoHighlightCard">
                  <FaSchool />
                  <h4>Verified School Profiles</h4>
                  <p>Check recognized primary, middle, and high schools with direct application links.</p>
                  <Link to="/school">View Schools Directory</Link>
                </div>
                <div className="infoHighlightCard">
                  <IoSchool />
                  <h4>Intermediate & Degree Colleges</h4>
                  <p>Discover science, arts, commerce, and computer science intermediate colleges.</p>
                  <Link to="/college">View Colleges Directory</Link>
                </div>
                <div className="infoHighlightCard">
                  <FaShieldHalved />
                  <h4>Institute Registration</h4>
                  <p>Are you an institute administrator? Register your institution to start receiving online admissions.</p>
                  <Link to="/register-institute">Register Your Institute</Link>
                </div>
              </div>
            </div>
          )}
        </section>
        {/* Featured Courses if avaliable else informative box for it */}
        <section className="latestCourses">
          {courses && courses.length >= 3 ? (
            <>
              <div className="sectionHeading">
                <span>Learning Opportunities</span>
                <h2>Popular Skill Courses</h2>
                <p>
                  Explore professional courses offered by verified training providers.
                </p>
              </div>
              <div className="courseGrid">
                {courses.slice(0, 6).map((course) => (
                  <div className="courseCard" key={course._id}>
                    <div className="courseImage">
                      <img
                        src={course.thumbnail || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80"}
                        alt={course.title}
                      />
                    </div>
                    <div className="courseContent">
                      <div className="courseBadge">
                        <HiOutlineAcademicCap />
                        {course.category || "Skill Course"}
                      </div>
                      <h3>{course.title}</h3>
                      <h4>{course.offeredByInstitute || "Digital Smart City Hub"}</h4>
                      <div className="courseFooter">
                        <span>
                          <FaClock />
                          {course.duration || "Self-Paced"}
                        </span>
                        <Link to={`/course/${course._id}`}>
                          View Details
                          <FaArrowRightLong />
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="informativeFeatureBox coursesFallbackBox">
              <div className="informativeHeader">
                <span className="informativeEyebrow">Skill Building</span>
                <h2>Learning Opportunities at DSCH-Edu</h2>
                <p>
                  DSCH-Edu provides a dedicated gateway for discovering short courses,
                  vocational training, and digital skills programs in Kohat.
                </p>
              </div>
              <div className="informativeHighlights">
                <div className="infoHighlightCard">
                  <HiOutlineAcademicCap />
                  <h4>Standalone Enrollment</h4>
                  <p>Anyone can enroll directly in skill courses without needing formal school or college admission.</p>
                </div>
                <div className="infoHighlightCard">
                  <MdOutlineFactCheck />
                  <h4>Administrative Review</h4>
                  <p>Applications and fee verification are reviewed securely by authorized course coordinators.</p>
                </div>
                <div className="infoHighlightCard">
                  <HiOutlineIdentification />
                  <h4>Verified Certificates</h4>
                  <p>Earn verifiable digital course certificates upon successful completion of your training.</p>
                </div>
              </div>
              <div className="fallbackActionRow">
                <Link to="/courses" className="dschHeroPrimaryButton">
                  Check Available Courses
                  <FaArrowRightLong />
                </Link>
              </div>
            </div>
          )}
        </section>
        {/* What Happens After Submission Section */}
        <section className="submissionTransparencySection">
          <div className="sectionHeading">
            <span>Review & Verification</span>
            <h2>What Happens After Submission</h2>
            <p>
              We maintain a transparent evaluation cycle for both institute admissions
              and course enrollments.
            </p>
          </div>
          <div className="statusExplanationsGrid">
            <div className="statusCard pending">
              <div className="statusBadgeTitle">
                <FaClock />
                <span>PENDING</span>
              </div>
              <h4>Application Under Review</h4>
              <p>Your application and submitted documents have been received and are waiting for administrative review.</p>
            </div>
            <div className="statusCard submitted">
              <div className="statusBadgeTitle">
                <HiOutlineDocumentCheck />
                <span>SUBMITTED</span>
              </div>
              <h4>Payment Proof Received</h4>
              <p>Payment information or bank receipt has been submitted and is undergoing verification by the institute or admin.</p>
            </div>
            <div className="statusCard approved">
              <div className="statusBadgeTitle">
                <MdVerified />
                <span>PAID / APPROVED</span>
              </div>
              <h4>Application Approved</h4>
              <p>Your admission or enrollment is confirmed. Next steps such as student portal access or course links are unlocked.</p>
            </div>
            <div className="statusCard rejected">
              <div className="statusBadgeTitle">
                <FaRotateRight />
                <span>REJECTED & CORRECTION</span>
              </div>
              <h4>Correction Supported</h4>
              <p>If an issue is found, a clear rejection reason is provided. You can correct rejected information and resubmit for review.</p>
            </div>
          </div>
        </section>
        {/* Partner/Institute Owner CTA Section */}
        <section className="partnerCTA">
          <div className="partnerContent">
            <div className="partnerLeft">
              <span>For Educational Institutes</span>
              <h2>
                Bring Your Institute Online with DSCH-Edu
              </h2>
              <p>
                Digitize your admissions, manage student records, review fee payment
                proofs, and issue verified certificates through one structured,
                transparent platform.
              </p>
              <div className="partnerButtons">
                <Link
                  to="/register-institute"
                  className="registerInstituteBtn"
                >
                  Register Your Institute
                  <FaArrowRightLong />
                </Link>
                <Link
                  to="/how-it-works"
                  className="contactSalesBtn"
                >
                  How Registration Works
                </Link>
              </div>
            </div>
            <div className="partnerRight">
              <div className="partnerCard">
                <FaSchool />
                <h3>DSCH</h3>
                <p>Education Module</p>
              </div>
            </div>
          </div>
        </section>
        {/* Students/Learners CTA(Call To Action) Section */}
        <section className="finalCtaSection">
          <div className="finalCtaContainer">
            <h2>Ready to Start Your Educational Journey?</h2>
            <p>
              Browse verified schools, explore colleges, or discover practical skill courses in Kohat today.
            </p>
            <div className="finalCtaButtons">
              <Link to="/school" className="dschHeroPrimaryButton">
                Explore Schools & Colleges
                <FaArrowRightLong />
              </Link>
              <Link to="/contact" className="dschHeroSecondaryButton">
                Contact Support
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  )
}

export default App