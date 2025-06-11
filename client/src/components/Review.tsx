import axios from "axios";
import { IReview } from "../types.ts";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./Review.css";
import { useTranslation } from "react-i18next";

interface ReviewProps {
    review: IReview;
    setReviews: (reviews: IReview[]) => void;
    userData: object
}

function Review({ review, setReviews, userData }: ReviewProps) {
    const { t } = useTranslation();

    function handleButton() {
        axios.delete(`http://localhost:5000/api/reviews/${review.review_id}`).then(() => {
            setReviews(prevReviews => prevReviews.filter(r => r.review_id !== review.review_id));
        }).catch(error => console.error(t("delete_error"), error));
    }

    return (
        <div className="flex flex-col p-3 border-2 rounded mt-2 bg-[#1d242b] w-3/4">
            <div className="flex">
                <div className="flex flex-col">
                    <h3 className="text-[16px] text-[#647586]">
                        {t("review_by")} <span className="text-[#aabbcc]">{review.user_name.split(" ")[1]} {review.user_name.split(" ")[0]}</span>
                    </h3>
                    <p className="text-[12px] text-[#647586]">
                        {review.review_date ? review.review_date.substring(0, 10).replaceAll("-", ".") : t("date_missing")}
                    </p>
                </div>
                <div className={`ml-auto border rounded-3xl w-[2vw] h-[2vw] text-white flex justify-center items-center ${review.rating > 6 ? "bg-green-500" : review.rating > 3 ? "bg-amber-500" : "bg-red-600"}`}>
                    <h3>{review.rating}</h3>
                </div>
            </div>
            <button className={`${localStorage.getItem("email") === "admin" || userData?.user_id === review.user_id ? "block" : "hidden"}`} onClick={handleButton}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
            </button>
            <div className="quill-container text-[16px] mt-2 text-[#97a8b9] m-0 p-0">
                <ReactQuill
                    value={review.text || t("text_missing")}
                    readOnly={true}
                    theme="bubble"
                />
            </div>
        </div>
    );
}

export default Review;