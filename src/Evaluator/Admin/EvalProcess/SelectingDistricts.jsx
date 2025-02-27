/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
// import Layout from '../Pages/Layout';
import { Row, Col, Label, Container, Card, } from 'reactstrap';
import { Button } from '../../../stories/Button';
import {
    getNormalHeaders,
    openNotificationWithIcon
} from '../../../helpers/Utils';
import axios from 'axios';
import { useLocation, useNavigate } from "react-router-dom";

import { URL, KEY } from '../../../constants/defaultValues';
import Check from './Pages/Check';
import { useDispatch, useSelector ,} from 'react-redux';
// import { getStateData } from '../../../redux/studentRegistration/actions';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { stateList, districtList } from "../../../RegPage/ORGData.js";
const EditEvalProcess = (props) => {
    const location = useLocation();
    const evalID = JSON.parse(localStorage.getItem('eavlId'));
    //  where evalID= evaluation_process_id //
    const dispatch = useDispatch();
    const [clickedValue, setclickedValue] = useState({});
    const [selectedStates, setselectedStates] = useState([]);
const navigate = useNavigate();
const fullStatesNames = [...districtList["Telangana"]];
fullStatesNames.unshift("All Districts");
// const newstateList = ["All Districts", ...districtList];
//     const fullStatesNames = newstateList;

    useEffect(() => {
        // evalID && evalID.state
        //     ? evalID.state.split(',').length ===
        //           fullStatesNames.length - 1 &&
        //       !evalID.state.includes('All Districts')
        //         ? setselectedStates(fullStatesNames)
        //         : setselectedStates(evalID.state.split(','))
        //     : '';
        if (evalID && evalID.district) {
            if (
                evalID.district.split(',').length ===
                    fullStatesNames.length - 1 &&
                !evalID.district.includes('All Districts')
            ) {
                setselectedStates(fullStatesNames);
            } else {
                setselectedStates(evalID.district.split(','));
            }
        }
    }, []);

    useEffect(() => {
        if (clickedValue.name === 'All Districts') {
            if (selectedStates.includes('All Districts')) {
                setselectedStates(fullStatesNames);
            } else {
                setselectedStates([]);
            }
        } else if (
            clickedValue.name &&
            clickedValue.name !== 'All Districts' &&
            selectedStates.length === fullStatesNames.length - 1 &&
            !selectedStates.includes('All Districts')
        ) {
            setselectedStates(fullStatesNames);
        } else if (clickedValue.name && clickedValue.name !== 'All Districts') {
            setselectedStates(
                selectedStates?.filter((item) => item !== 'All Districts')
            );
        }
    }, [clickedValue]);

    async function handleStates(value) {
        //  handleStates Api where value = district //
        // where we can update the district //
        if(value.district===''){
            value.district = '-';
        }
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const evalid = encryptGlobal(JSON.stringify(evalID.evaluation_process_id));
        await axios
            .put(
                `${URL.updateEvalProcess + evalid}`,
                JSON.stringify(value, null, 2),
                axiosConfig
            )
            .then((response) => {
                if (response.status == 200) {
                    openNotificationWithIcon(
                        'success',
                        'Districts Updated Successfully'
                    );
                    navigate('/eadmin/evaluationProcess');
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handleclick = async () => {
        // where we can select  the States //
        const value = { district: '' };
        selectedStates.includes('All Districts')
            ? (value.district = selectedStates
                  ?.filter((item) => item !== 'All Districts')
                  .toString())
            : (value.district = selectedStates.toString());
        await handleStates(value);
    };

    return (
        <div className="page-wrapper">
          <div className="content">
            <Container>
            <Card className="m-3 p-3">
                    <Row>
                        <Col md={4}>
                        <Label className="mb-2 text-info">
                            Level Name :{' '}
                            <span className="text-muted">
                            {evalID && evalID.level_name}
                            </span>{' '}
                        </Label>
                        </Col>
                        <Col md={4}>
                        <Label className="mb-2 text-info">
                            No of Evaluators per idea :{' '}
                            <span className="text-muted">
                            {evalID && evalID.no_of_evaluation}
                            </span>
                        </Label>
                        </Col>
                        <Col md={4}>
                        <Label className="mb-2 text-info">
                            Evaluation Schema :{' '}
                            <span className="text-muted">
                            {evalID && evalID.eval_schema}
                            </span>
                        </Label>
                        </Col>
                    </Row>

                    
                    <hr />

                    <Row>
                        <Label className="mb-2 text-info">Districts:</Label>
                        <Check
                        list={fullStatesNames}
                        value={selectedStates}
                        setValue={setselectedStates}
                        selValue={setclickedValue}
                        />
                    </Row>
                </Card>

                {/* <Row>
                    <Col className="col-xs-12 col-sm-6">
                       
                          <button
                            type="button"
                            onClick={() => navigate('/eadmin/evaluationProcess')}
                            className="btn btn-secondary"
                            style={{ marginLeft: "30px" }}
                            >
                            Discard
                            </button>

                    </Col>
                    <Col className="submit-btn col-xs-12 col-sm-6 text-right">
                        <Button
                        
                            label="Save"
                            onClick={() => handleclick()}
                            btnClass={'primary'}
                            size="small"
                        />
                    </Col>
                </Row>  */}
                <Row className="align-items-center">
    {/* Left Column */}
    <Col xs={12} sm={6} className="text-left">
        <button
            type="button"
            onClick={() => navigate('/eadmin/evaluationProcess')}
            className="btn btn-secondary"
            style={{ marginLeft: '30px' }}
        >
            Discard
        </button>
    </Col>

    {/* Right Column */}
    <Col xs={12} sm={6} className="text-right">
        <Button
            label="Save"
            onClick={() => handleclick()}
            btnClass="primary"
            size="small"
        />
    </Col>
</Row>

            </Container>
        </div>
        </div>
    );
};
export default EditEvalProcess;
