import {IReview} from "../types.ts";

interface ReviewProps{
    review: IReview
}

function Review(props: ReviewProps) {
    return (
        <div className={"flex flex-col p-3 border-2 rounded"}>
            <div className={"flex"}>
                <div className={"flex flex-col"}>
                    <h3 className={"text-[16px] text-[#647586]"}>Review by <span className={"text-[#aabbcc]"}>{props.review.фамилия} {props.review.имя}</span></h3>
                    <p className={"text-[12px] text-[#647586]"}>{props.review.дата_отзыва.substring(0,10).replaceAll("-", ".")}</p>
                </div>
                <div className={`ml-auto border rounded-3xl w-[2vw] h-[2vw] text-white flex justify-center items-center ${props.review.оценка > 6 ? "bg-green-500" : props.review.оценка > 3 ? "bg-amber-500" : "bg-red-600"}`}>
                    <h3>{props.review.оценка}</h3>
                </div>
            </div>
            <p className={"text-[16px] mt-2 text-[#97a8b9]"}>{props.review.текст}</p>
        </div>
    );
}

export default Review;