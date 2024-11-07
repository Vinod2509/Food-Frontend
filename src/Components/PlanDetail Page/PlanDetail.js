import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router';
import '../Styles/planDetail.css'
import '../Styles/contact.css'
import { useAuth } from '../Context/AuthProvider';

function PlanDetail() {
    const [plan, setplan] = useState({})
    const { id } = useParams();
    const [arr, setarr] = useState();
    const [review, setreview] = useState("");
    const [rate, setrate] = useState();
    const { user } = useAuth();

    useEffect(async () => {
        const data = await axios.get("https://iamhungry.onrender.com/plan/"+id);

        delete data.data.data["_id"];
        delete data.data.data["__v"];
        setplan(data.data.data);

        const reviews = await axios.get("https://iamhungry.onrender.com/review/"+id);

        setarr(reviews.data.data)
    }, [])

    function capitalizeFirstLetter(string) {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }
    console.log(rate);
    const handleClick = async () => {
        await axios.post("https://iamhungry.onrender.com/review/crud/"+id, {
            "review": review,
            "rating": parseInt(rate),
            "user": user._id,
            "plan": id
        })

        const reviews = await axios.get("https://iamhungry.onrender.com/review/"+id);
        setarr(reviews.data.data)
    }
    const handleDelete = async(reviewId) =>{
        try{
            await axios.delete("https://iamhungry.onrender.com/review/crud/"+id, { data: { "id": reviewId } });

            const reviews = await axios.get("https://iamhungry.onrender.com/review/" + id);
            setarr(reviews.data.data);
            alert("review deleted");
        }
        catch(err){
            alert(err);
        }
    }

    return (
        <div className="pDetailBox">
            <div className='h1Box'>
                <h1 className='h1'>PLAN DETAILS</h1>
                <div className="line"></div>
            </div>
            <div className="planDetailBox">
                <div className='planDetail'>
                    <div className="loginBox">
                        {
                            Object.keys(plan).map((ele, key) => (
                                <div className='entryBox' key={key}>
                                    <div className="entryText">{capitalizeFirstLetter(ele)}</div>
                                    <div className=" input">{capitalizeFirstLetter(plan[ele].toString())}</div>
                                </div>
                            ))
                        }
                    </div>

                </div>
            </div>

            <div className='reviewBox'>
                <div className="reviewEnrty">
                    <input type="text" value={review} onChange={(e) => setreview(e.target.value)} />
                    <select name="" id="" className="select" onChange={(e) => {setrate(e.target.value, 10)}}>
                        <option value="5">5 Excellent</option>
                        <option value="4">4 Very Good</option>
                        <option value="3">3 Good</option>
                        <option value="2">2 Poor</option>
                        <option value="1">1 Very Poor</option>
                    </select>
                    <div className="submitBtn">
                        <button  className="btn" onClick={handleClick}>
                            Submit
                        </button>
                    </div>
                </div>
                {
                    arr && arr?.map((ele, key) => (
                        <div className="reviewsCard" key={key}>
                            <div className="pdreviews">
                                <div className="pdrdetail">
                                    <h3>{ele.user.name}</h3>
                                    <div className="input"> {ele.review}</div>
                                </div>
                                <div className='rate'>
                                    {
                                        <label htmlFor="star5" title="text">{ele.rating}</label>

                                    }
                                </div>
                            </div>

                            <div className='rcBtn'>
                                <button className="showMoreBtn btn" onClick={()=>{handleDelete(ele._id)}}>Delete</button>
                            </div>
                        </div>
                    ))
                }

            </div>
        </div>
    )
}

export default PlanDetail
