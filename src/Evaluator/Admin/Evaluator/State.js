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
import Check from '../EvalProcess/Pages/Check.jsx';
import { useDispatch, useSelector ,} from 'react-redux';
// import { getStateData } from '../../../redux/studentRegistration/actions';
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { stateList, districtList } from "../../../RegPage/ORGData.js";
const State = (props) => {
    const location = useLocation();
    const { evaluatorId } = location.state || {};
    // console.log(evaluatorId,"id");
    const evalID = JSON.parse(localStorage.getItem('eavlId'));
    const IdIntial =evaluatorId ? evaluatorId : evalID.evaluator_id ;
    // console.log(evalID,"item");
    const dispatch = useDispatch();
    const [clickedValue, setclickedValue] = useState({});
    const [selectedStates, setselectedStates] = useState([]);
const navigate = useNavigate();
const fullStatesNames = [...districtList["Telangana"]];
fullStatesNames.unshift("All Districts");
    // const newstateList = ["All Districts", ...districtList];
    // const fullStatesNames = newstateList;

    useEffect(() => {
        
        if (evalID && evalID.state) {
            if (
                evalID.state.split(',').length ===
                    fullStatesNames.length - 1 &&
                !evalID.state.includes('All Districts')
            ) {
                setselectedStates(fullStatesNames);
            } else {
                setselectedStates(evalID.state.split(','));
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
        //  handleStates Api where value = state //
        // where we can update the state //
        if(value.state===''){
            value.state = '-';
        }
        const axiosConfig = getNormalHeaders(KEY.User_API_Key);
        const evalid = encryptGlobal(JSON.stringify(IdIntial));
        await axios
            .put(
                `${URL.updateEvaluatorState + evalid}`,
                JSON.stringify(value, null, 2),
                axiosConfig
            )
            .then((response) => {
                if (response.status == 200) {
            localStorage.removeItem('eavlId');

                    openNotificationWithIcon(
                        'success',
                        'States Update Successfully'
                    );
                    navigate('/eadmin/evaluator');
                }
            })
            .catch((err) => {
                return err.response;
            });
    }

    const handleclick = async () => {
        // where we can select  the States //
        const value = { state: '' };
        selectedStates.includes('All Districts')
            ? (value.state = selectedStates
                  ?.filter((item) => item !== 'All Districts')
                  .toString())
            : (value.state = selectedStates.toString());
        await handleStates(value);
    };
    const handleDiscard = () => {
        // alert("hii");
        setselectedStates([]);
        localStorage.removeItem('eavlId');
        navigate('/eadmin/evaluator');
      };
    console.log(selectedStates,"selected");
    return (
        <div className="page-wrapper">
          <div className="content">
            <Container>
                <Card className="m-3 p-3">
                    <Row>
                        <Col md={4}>
                            <Label className="mb-2 text-info">
                            
                                <span className="text-muted">
                                    {/* {evalID.evaluator_id} */}
                                </span>{' '}
                            </Label>
                        </Col>
                      
                    </Row>
                    <Row>
                        <Label className="mb-2 text-info form-label">Districts :</Label>
                        <Check
                            list={fullStatesNames}
                            value={selectedStates}
                            setValue={setselectedStates}
                            selValue={setclickedValue}
                        />
                    </Row>
                </Card>
                <Row>
                    <Col className="col-xs-12 col-sm-6">
                    <button
          type="button"
          onClick={handleDiscard}
        //   onClick={() => {
        //     localStorage.removeItem('eavlId');
        //     navigate('/eadmin/evaluator');
        //   }}
          className="btn btn-secondary"
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
                </Row>
            </Container>
        </div>
        </div>
    );
};
export default State;
