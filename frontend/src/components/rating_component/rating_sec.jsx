import { useContext, useEffect, useState } from "react";
import { FaSchool, FaStar } from "react-icons/fa";
import "./rating_sec.css";
import { useNavigate } from "react-router-dom";
import AppContext from "../../app_context/context";
import { getTheReviews, handleReviewSubmission } from "../../apicalls/public_apicalls";
import { useToast } from "../toast/ToastContext";

export const RatingReview = ({ instituteId }) => {
    const navigate = useNavigate();
    const { userState } = useContext(AppContext);
    const toast = useToast();
    const [rating, setRating] = useState(0); // user rating getting
    const [hoverRating, setHoverRating] = useState(0);
    const [review, setReview] = useState(""); // for user review getting
    const [reviews, setReviews] = useState([]); // for rendering
    const [loading, setLoading] = useState(false); // for loading
    // Get reviews of this institute
    useEffect(() => {
        getTheReviews(setReviews, setLoading, instituteId);
    }, [instituteId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userState) {
            toast.error("Please login first to submit a review.");
            return;
        }

        if (rating === 0) {
            toast.error("Please select a rating.");
            return;
        }

        if (!review.trim()) {
            toast.error("Please write your review.");
            return;
        }

        handleReviewSubmission(setLoading, setRating, setReview, rating, review, setReviews, instituteId);
    };

    return (
        <section id="reviews" className="reviewsSection">
            <div className="container">
                <div className="sectionTitle">
                    <span>Ratings & Reviews</span>
                    <h2>What Students Say</h2>
                </div>
                <div className="review-form-card">
                    {!userState ? (
                        <div className="login-review-message">
                            <h3>Want to review this institute?</h3>
                            <p>
                                Please login to submit your rating and review.
                            </p>
                            <button
                                onClick={() => {
                                    navigate("/auth/login")
                                }}
                            >
                                Login to Review
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit}>
                            <h3>Rate this Institute</h3>
                            <div className="star-container">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar
                                        key={star}
                                        className="rating-star"
                                        size={32}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() =>
                                            setHoverRating(star)
                                        }
                                        onMouseLeave={() =>
                                            setHoverRating(0)
                                        }
                                        style={{
                                            color:
                                                star <=
                                                    (hoverRating || rating)
                                                    ? "#f59e0b"
                                                    : "#d1d5db"
                                        }}
                                    />
                                ))}
                            </div>
                            <p className="rating-text">
                                {rating === 0
                                    ? "Select your rating"
                                    : `${rating} out of 5`}
                            </p>
                            <textarea
                                value={review}
                                onChange={(e) =>
                                    setReview(e.target.value)
                                }
                                placeholder="Write your review..."
                                rows="5"
                                maxLength={1000}
                            />
                            <div className="review-character-count">
                                {review?.length || 0}/1000
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                            >
                                {loading
                                    ? "Submitting..."
                                    : "Submit Review"}
                            </button>
                        </form>
                    )}
                </div>
                <div className="reviewsGrid">

                    {loading ? (
                        <div className="reviewsLoading">
                            <span></span>
                            <p>Loading reviews...</p>
                        </div>
                    ) : (
                        reviews?.length === 0 || !reviews ? (

                            <div className="noReviewsCard">

                                <div className="noReviewsIcon">
                                    <FaStar />
                                </div>

                                <h3>Be the First to Review</h3>

                                <p>
                                    No reviews have been submitted for this institute yet.
                                    Share your experience and help other students make
                                    the right decision.
                                </p>

                                {!userState && (
                                    <span className="noReviewsLoginText">
                                        Login to submit your review.
                                    </span>
                                )}

                            </div>

                        ) : (

                            reviews.map((item, index) => (

                                <div className="reviewCard" key={index}>

                                    {/* Top section */}
                                    <div className="reviewHeader">

                                        <div className="reviewAvatar">
                                            {item.userName?.charAt(0)?.toUpperCase()}
                                        </div>

                                        <div className="reviewInfo">

                                            <div className="reviewNameRow">

                                                <h4>{item.userName}</h4>
                                            </div>

                                            <div className="reviewMeta">

                                                <span className="userRole">
                                                    {item.userRole}
                                                </span>

                                                <span className="reviewDot">
                                                    â€¢
                                                </span>

                                                <span className="reviewDate">
                                                    {new Date(item.date).toLocaleDateString(
                                                        "en-US",
                                                        {
                                                            day: "numeric",
                                                            month: "short",
                                                            year: "numeric"
                                                        }
                                                    )}
                                                </span>

                                            </div>

                                        </div>

                                    </div>


                                    {/* Rating */}
                                    <div className="reviewRating">

                                        <div className="reviewStars">

                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar
                                                    key={star}
                                                    size={15}
                                                    className={
                                                        star <= item.rating
                                                            ? "starFilled"
                                                            : "starEmpty"
                                                    }
                                                />
                                            ))}

                                        </div>

                                        <span className="ratingNumber">
                                            {item.rating}.0
                                        </span>

                                    </div>


                                    {/* Review */}
                                    <p className="reviewText">
                                        "{item.review}"
                                    </p>


                                    {/* Institute */}
                                    <div className="reviewInstitute" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>

                                        <div>
                                            <span className="instituteIcon">
                                                <FaSchool size={13} />
                                            </span>

                                            <span>
                                                {item.instituteName}
                                            </span>
                                        </div>

                                        {item.isVerified && (
                                            <span className="verifiedBadgeOfReviewer">
                                                âœ“ Verified
                                            </span>
                                        )}

                                    </div>

                                </div>

                            ))

                        )
                    )}

                </div>
            </div>
        </section>
    );
};