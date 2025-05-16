/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from 'react';
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
import { encryptGlobal } from '../../../constants/encryptDecrypt';
import { stateList, districtList } from "../../../RegPage/ORGData.js";
const State = (props) => {
    const location = useLocation();
    const { evaluatorId } = location.district || {};
    const evalID = JSON.parse(localStorage.getItem('eavlId'));
    const IdIntial = evaluatorId ? evaluatorId : (typeof evalID === 'object' ? evalID.evaluator_id : evalID);
   
    const dispatch = useDispatch();
    const [clickedValue, setclickedValue] = useState({});
    const [selectedStates, setselectedStates] = useState([]);
const navigate = useNavigate();
const fullStatesNames = [...districtList["Telangana"]];
fullStatesNames.unshift("All Districts");

    useEffect(() => {
        
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
        //  handleStates Api where value = state //
        // where we can update the state //
        if(value.district===''){
            value.district = '-';
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
                        'Districts Assigned Successfully'
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
        const value = { district: '' };
        selectedStates.includes('All Districts')
            ? (value.district = selectedStates
                  ?.filter((item) => item !== 'All Districts')
                  .toString())
            : (value.district = selectedStates.toString());
        await handleStates(value);
    };
    const handleDiscard = () => {
        setselectedStates([]);
        localStorage.removeItem('eavlId');
        navigate('/eadmin/evaluator');
      };
    return (
        <div className="page-wrapper">
          <div className="content">
            <Container>
                <Card className="m-3 p-3">
                  
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
                <Row className="align-items-center">
                    <Col xs={12} sm={6} className="text-left">
                    <button
          type="button"
          onClick={handleDiscard}
          style={{ marginLeft: '30px' }}
          className="btn btn-secondary"
        >
          Discard
        </button>
                         
                    </Col>
                    <Col xs={12} sm={6} className="text-right">
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
