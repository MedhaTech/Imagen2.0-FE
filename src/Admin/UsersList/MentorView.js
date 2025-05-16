/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useNavigate} from 'react-router-dom';
import { Container, Row, Card, CardBody, CardText, Col } from 'reactstrap';
import DoughnutChart from '../../Teacher/Dashboard/TeamsProgDD';
import axios from 'axios';
import { getCurrentUser } from '../../helpers/Utils';
import { encryptGlobal } from '../../constants/encryptDecrypt';
const ViewMore = () => {
    const navigate = useNavigate();
    const currentUser = getCurrentUser('current_user');

    const orgDaTa = JSON.parse(localStorage.getItem('orgData'));

    const [course, setCourse] = useState([]);
   
    // where orgDaTa = orgnization details //
    // we can see all orgnization , mentor details //
  
    var teamId = [];
    teamId.push({
        mentor_id: orgDaTa.mentor.mentor_id,
        user_id: orgDaTa.mentor.user_id
    });

    const handleBack = () => {
       
        navigate("/mentor-view");
        localStorage.setItem(
            'organization_code',
            JSON.stringify(orgDaTa.organization_code)
        );
    };

    useEffect(() => {
        const userIdParam = encryptGlobal(
            JSON.stringify({
                user_id: orgDaTa?.mentor.user_id,
                role: 'MENTOR'
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/dashboard/quizscores?Data=${userIdParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setCourse(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }, []);

    const atlData = orgDaTa.organization_code;
    const altRes = atlData.split('-');
  
    return (
        <div className="page-wrapper">
        <div className="content">
            <Container className="dynamic-form">
                <div className="d-flex align-items-end">
                <div className="ms-auto mb-2">
                    <button
                       className='btn btn-secondary'
                        onClick={handleBack}
                    >
                        Back
                </button>
                </div>
                </div>
                <Row>
                    <Row>
                        <Card className="py-2">
                            <CardBody>
                                <h2 className="mb-4">Organization Details</h2>

                                <CardText>
                                    <span className="mx-3">
                                        <b>Organization Name :</b>
                                    </span>
                                    <b>{orgDaTa.organization_name}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>UDISE Code :</b>
                                    </span>
                                    <b>{orgDaTa.organization_code}</b>
                                </CardText>
                               
                                <CardText>
                                    <span className="mx-3">
                                        <b>Category :</b>
                                    </span>
                                    <b>{orgDaTa.category}</b>
                                </CardText>

                                <CardText>
                                    <span className="mx-3">
                                        <b>District :</b>
                                    </span>
                                    <b>{orgDaTa.district}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>state :</b>
                                    </span>
                                    <b>{orgDaTa.state}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Pincode :</b>
                                    </span>
                                    <b>{orgDaTa.pin_code}</b>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Row>

                    <Row className="py-2">
                        <Card className="py-2">
                            <CardBody>
                                <h4 className="mb-4">Teacher Details</h4>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Title :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.title}</b>
                                </CardText>

                                <CardText>
                                    <span className="mx-3">
                                        <b>Teacher Name :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.full_name}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Gender :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.gender}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Mentor Id :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.mentor_id}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Email Id :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.user.username}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>Mobile No :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.mobile}</b>
                                </CardText>
                                <CardText>
                                    <span className="mx-3">
                                        <b>WhatsApp No :</b>
                                    </span>
                                    <b>{orgDaTa.mentor.whatapp_mobile}</b>
                                </CardText>
                            </CardBody>
                        </Card>
                    </Row>
                    <Row className="teacher-statistics bg-white">
                        <Row className="">
                            <Col>
                                <div >
                                    <DoughnutChart
                                        user={teamId}
                                        dashBoard={'Admin'}
                                    />
                                </div>
                            </Col>
                        </Row>
                    </Row>


                </Row>
            </Container>
        </div>
        </div>

    );
};
export default ViewMore;
