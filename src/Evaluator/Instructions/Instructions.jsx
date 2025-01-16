/* eslint-disable indent */
import React from 'react';
import { Card } from 'reactstrap';
import { Button } from '../../stories/Button';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getInstructions } from '../store/evaluator/action';

const Instructions = () => {
    // here we can start the evaluator  journey //
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const instructiondata = useSelector(
        (state) => state?.evaluator.instructionsData
    );

    React.useEffect(() => {
        dispatch(getInstructions());
    }, []);

    return (
        <div className="page-wrapper">
        <div className="content">
            <Card className="m-2 p-2">
                <h3 className='m-2 p-2'>Instructions</h3>
                <div
                    dangerouslySetInnerHTML={{
                        __html: instructiondata && instructiondata?.instructions
                    }}
                ></div>

                <div className='mt-2 mb-3' >
                    <Button
                        label={'L1 - Round Evaluator'}
                        btnClass="primary mx-3"
                        size="small"
                        onClick={() =>
                            navigate('/evaluator/submitted-ideas')
                        }
                    />
                    <Button
                        label={'L2 - Round Evaluator'}
                        btnClass="primary mx-3"
                        size="small"
                        onClick={() =>
                            navigate('/evaluator2/submitted-ideas')
                        }
                    />
                </div>
            </Card>
        </div>
        </div>

    );
};

export default Instructions;
