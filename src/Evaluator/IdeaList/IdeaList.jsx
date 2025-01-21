/* eslint-disable indent */
import React from 'react';
import './IdeaList.scss';
// import Layout from '../Layout';
import IdeaDetail from './IdeaDetail';
// import { Button } from '../../stories/Button';
import { getSubmittedIdeaList } from '../store/evaluator/action';
import { useDispatch, useSelector } from 'react-redux';
import succesImg from '../../assets/img/success1.jpeg';
// import { HmacSHA384 } from 'crypto-js';

const IdeaList = () => {
    // here we can see all the ideasList //
    const topRef = React.useRef();
    const dispatch = useDispatch();
    const [ideaDetails, setIdeaDetails] = React.useState({});
    const [isNextDiv, setIsNextDiv] = React.useState(false);

    const allIdeaList = useSelector(
        (state) => state?.evaluator.submittedIdeaList
    );

    React.useEffect(() => {
        dispatch(getSubmittedIdeaList('L1'));
    }, []);
    React.useEffect(() => {
        if (allIdeaList) {
            setIdeaDetails(allIdeaList);
        } else {
            setIdeaDetails({});
        }
    }, [allIdeaList]);
 
    const handleNext = () => {
        dispatch(getSubmittedIdeaList('L1'));
    };

    return (
        <div className="page-wrapper">
        <div className="content">
            <div
                className="container idea_list_wrapper pt-2 mb-50"
                ref={topRef}
            >
                <div className="row">
                    {!isNextDiv && (
                        <div className="col-12">
                            {Object.keys(ideaDetails).length > 2 ? (
                                <IdeaDetail
                                    ideaDetails={ideaDetails}
                                    handleSkip={handleNext}
                                    setIsNextDiv={setIsNextDiv}
                                    topRef={topRef}
                                />
                            ) : (
                                <div className="row">
                                    <div className="col-sm-6 m-auto">
                                        <div className="card p-4 text-center">
                                            <div className="success_img text-center w-100">
                                                <img src={succesImg} alt=".." />
                                                <br />
                                            </div>
                                            <h4 className="my-auto text-center my-4">
                                                All idea has been processed, no
                                                more idea to display.
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    // ) : (
                    //     <div className="col-sm-6 m-auto">
                    //         <div className="card p-4 text-center">
                    //             <div className="success_img text-center w-100">
                    //                 <img src={succesImg} alt=".." />
                    //                 <br />
                    //             </div>
                    //             <h2>Idea successfully processed!</h2>
                    //             <p>Do you want to process another Idea?</p>
                    //             <div className="text-center my-3">
                    //                 <Button
                    //                     btnClass="primary"
                    //                     size="small"
                    //                     label="Click Here"
                    //                     onClick={() => {
                    //                         setIsNextDiv(false);
                    //                     }}
                    //                 />
                    //             </div>
                    //         </div>
                    //     </div>
                    )}
                </div>
            </div>
            </div>
            </div >
    );
};

export default IdeaList;
