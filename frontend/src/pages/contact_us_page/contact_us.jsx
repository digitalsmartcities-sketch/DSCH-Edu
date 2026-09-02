import { useState } from "react";
import {
    FaMapMarkerAlt,
    FaEnvelope,
    FaClock,
    FaUser,
    FaPenFancy,
    FaHeadset,
    FaGraduationCap,
    FaPaperPlane,
    FaBookOpen,
    FaUniversity,
    FaKey
} from "react-icons/fa";
import "./contact_us.css";

import { Navbar } from "../../components/navbar/navbar";
import { submitContactForm } from "../../apicalls/public_apicalls";
import { Footer } from "../../components/footer/Footer";

export const ContactUs = () => {

    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        subject: "",
        message: ""
    });

    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    /* =========================================
        FORM SUBMISSION
    ========================================= */
    const handleSubmit = async (e) => {
        e.preventDefault();
        submitContactForm(setLoading, (data) => {
            setFormData(data);
            setSubmitted(true);
        }, formData);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    return (
        <div className="contactPage">
            <Navbar />

            {/* =========================================
                HERO
            ========================================= */}
            <section className="contactHero">
                <div className="contactContainer">
                    <div className="contactHeroContent">
                        <span className="contactHeroLabel">
                            DSCH-Edu Support & Guidance
                        </span>

                        <h1>
                            Get in Touch With Us
                        </h1>

                        <p>
                            Have a question regarding institute discovery, school or college admissions,
                            course enrollments, institute registration, or account access?
                            Our support team is ready to guide you.
                        </p>

                        <div className="contactHeroActions">
                            <a
                                href="#contact-form"
                                className="contactPrimaryBtn"
                            >
                                <FaPaperPlane />
                                Send a Message
                            </a>
                        </div>
                    </div>

                    <div className="contactHeroVisual">
                        <div className="heroCircle heroCircleOne"></div>
                        <div className="heroCircle heroCircleTwo"></div>

                        <div className="heroMainIcon">
                            <FaHeadset />
                        </div>

                        <div className="floatingContactIcon iconOne">
                            <FaEnvelope />
                        </div>

                        <div className="floatingContactIcon iconTwo">
                            <FaGraduationCap />
                        </div>

                        <div className="floatingContactIcon iconThree">
                            <FaUniversity />
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
                CONTACT INFORMATION
            ========================================= */}
            <section className="contactInfoSection">
                <div className="contactContainer">
                    <div className="sectionTitle">
                        <span>Platform Assistance</span>
                        <h2>How to Reach the DSCH-Edu Team</h2>
                        <p>
                            Choose the most convenient way to connect with us.
                        </p>
                    </div>

                    <div className="contactInfoGrid">
                        <div className="contactInfoCard">
                            <div className="contactInfoIcon">
                                <FaMapMarkerAlt />
                            </div>
                            <div>
                                <span>Location</span>
                                <h3>Location</h3>
                                <p>
                                    Digital Smart City Hub, Kohat,
                                    Khyber Pakhtunkhwa, Pakistan
                                </p>
                            </div>
                        </div>

                        <div className="contactInfoCard">
                            <div className="contactInfoIcon">
                                <FaEnvelope />
                            </div>
                            <div>
                                <span>Send Us an Email</span>
                                <h3>Email</h3>
                                <a href="mailto:info@kohat.online">
                                    info@kohat.online
                                </a>
                            </div>
                        </div>

                        <div className="contactInfoCard">
                            <div className="contactInfoIcon">
                                <FaClock />
                            </div>
                            <div>
                                <span>Response Hours</span>
                                <h3>Working Hours</h3>
                                <p>
                                    Monday – Friday<br />
                                    9:00 AM – 5:00 PM (PKT)
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* =========================================
                CONTACT FORM & GUIDANCE CATEGORIES
            ========================================= */}
            <section className="contactFormSection" id="contact-form">
                <div className="contactContainer">
                    <div className="contactFormLayout">

                        {/* LEFT CONTENT */}
                        <div className="contactFormIntro">
                            <span>How We Can Help</span>
                            <h2>Assistance for Every User</h2>
                            <p>
                                Select your inquiry area below to send us a direct message. We review
                                all incoming requests and provide clear guidance.
                            </p>

                            <div className="contactHelpPoints">
                                <div>
                                    <FaUniversity />
                                    <div>
                                        <h4>Institute Registration</h4>
                                        <p>Guidance on onboarding your school or college, document submission, and verification.</p>
                                    </div>
                                </div>

                                <div>
                                    <FaGraduationCap />
                                    <div>
                                        <h4>Student Admissions</h4>
                                        <p>Help with submitting application forms, uploading academic records, or correcting rejected submissions.</p>
                                    </div>
                                </div>

                                <div>
                                    <FaBookOpen />
                                    <div>
                                        <h4>Course Enrollment</h4>
                                        <p>Inquiries about standalone skills courses, fee payment submissions, or certificates.</p>
                                    </div>
                                </div>

                                <div>
                                    <FaKey />
                                    <div>
                                        <h4>Account & Password</h4>
                                        <p>Assistance with student or administrator login credentials and password reset.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* FORM */}
                        <div className="contactFormCard">
                            {submitted && (
                                <div className="contactSuccessMessage">
                                    Thank you! Your message has been sent successfully. Our team will review your inquiry.
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>
                                <div className="contactFormRow">
                                    <div className="contactInputGroup">
                                        <label>First Name</label>
                                        <div className="contactInput">
                                            <FaUser />
                                            <input
                                                type="text"
                                                name="firstName"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                placeholder="First Name"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="contactInputGroup">
                                        <label>Last Name</label>
                                        <div className="contactInput">
                                            <FaUser />
                                            <input
                                                type="text"
                                                name="lastName"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                placeholder="Last Name"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="contactFormRow">
                                    <div className="contactInputGroup">
                                        <label>Email Address</label>
                                        <div className="contactInput">
                                            <FaEnvelope />
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleChange}
                                                placeholder="Email Address"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="contactInputGroup">
                                        <label>Contact Number</label>
                                        <div className="contactInput">
                                            <input
                                                type="text"
                                                name="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="Phone Number (e.g. 0300...)"
                                                required
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="contactInputGroup">
                                    <label>Inquiry Subject</label>
                                    <div className="contactInput">
                                        <FaPenFancy />
                                        <select
                                            name="subject"
                                            value={formData.subject}
                                            onChange={handleChange}
                                            required
                                            style={{ width: "100%", background: "transparent", border: "none", outline: "none", fontSize: "14px", color: "#334155" }}
                                        >
                                            <option value="">Select an inquiry topic</option>
                                            <option value="Institute Registration Assistance">Institute Registration Assistance</option>
                                            <option value="Admission Application Guidance">Admission Application Guidance</option>
                                            <option value="Course Enrollment Inquiry">Course Enrollment Inquiry</option>
                                            <option value="Account or Login Support">Account or Login Support</option>
                                            <option value="Payment Verification Inquiry">Payment Verification Inquiry</option>
                                            <option value="General Question">General Question</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="contactInputGroup">
                                    <label>Message</label>
                                    <div className="contactTextarea">
                                        <textarea
                                            name="message"
                                            value={formData.message}
                                            onChange={handleChange}
                                            placeholder="Write your message or inquiry details here..."
                                            rows="5"
                                            maxLength="1500"
                                            required
                                        />
                                    </div>
                                    <div className="contactCharacterCount">
                                        {formData.message.length}/1500
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="contactSubmitBtn"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        "Sending..."
                                    ) : (
                                        <>
                                            Send Message
                                            <FaPaperPlane />
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    );
};