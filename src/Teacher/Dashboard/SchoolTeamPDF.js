import React, { useEffect, useRef, useState } from 'react';
import { getCurrentUser } from '../../helpers/Utils';
import axios from 'axios';
import { FaKey } from 'react-icons/fa';
import { useReactToPrint } from 'react-to-print';
import Schoolpdf from './SchoolPdf';
import { encryptGlobal } from '../../constants/encryptDecrypt';

function SchoolTeamPDF() {
    const currentUser = getCurrentUser('current_user');
    const [teamsData, setTeamsData] = useState([]);

    const [teamsList, setTeamsList] = useState([]);
    useEffect(() => {
        if (currentUser.data[0]?.mentor_id) {
            teamNameandIDsbymentorid(currentUser.data[0]?.mentor_id);
        }
    }, [currentUser.data[0]?.mentor_id]);

    const teamNameandIDsbymentorid = (mentorid) => {
        const teamApi = encryptGlobal(
            JSON.stringify({
                mentor_id: mentorid
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/teams/namebymenterid?Data=${teamApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTeamsList(response.data.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    //school pdf mentor deatils
    const [mentorValuesForPDF, setMentorValuesForPDF] = useState();
    const mentorDataforPDF = () => {
        const mentorDataApi = encryptGlobal(
            JSON.stringify({
                id: currentUser.data[0]?.mentor_id,
                user_id: currentUser.data[0]?.user_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/mentors/mentorpdfdata?Data=${mentorDataApi}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setMentorValuesForPDF(response?.data?.data[0]);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };
    //team Credentials
    const [teamCredentials, setTeamCredentials] = useState();
    const fetchTeamCredentials = (mentorId) => {
        const mentorParam = encryptGlobal(JSON.stringify(mentorId));
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/mentors/teamCredentials/${mentorParam}`,
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setTeamCredentials(response?.data?.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    // Function to fetch data for a single team by ID
    const fetchTeamData = async (teamId, teamName) => {
        const teamParam = encryptGlobal(JSON.stringify(teamId));
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/dashboard/teamStats/${teamParam}`,
                {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${currentUser?.data[0]?.token}`
                    }
                }
            );
            return [...response.data.data, { name: teamName }];
        } catch (error) {
            console.error(`Error fetching data for team ID ${teamId}:`, error);
            return null;
        }
    };

    // Function to fetch data for all teams and store in a single array
    const fetchAllTeamsData = async () => {
        try {
            const teamDataPromises = teamsList.map((teamId) =>
                fetchTeamData(teamId.team_id, teamId.team_name)
            );
            const teamDataArray = await Promise.all(teamDataPromises);
            const filteredDataArray = teamDataArray.filter(
                (data) => data !== null
            );
            setTeamsData(filteredDataArray);
        } catch (error) {
            console.error('Error fetching team data:', error);
        }
    };
    const [ideaValuesForPDF, setIdeaValuesForPDF] = useState();
    const ideaDataforPDF = () => {
        const ideaDataApi = encryptGlobal(
            JSON.stringify({
                mentor_id: currentUser?.data[0]?.mentor_id
            })
        );
        var config = {
            method: 'get',
            url:
                process.env.REACT_APP_API_BASE_URL +
                `/challenge_response/schoolpdfideastatus?Data=${ideaDataApi}`,
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${currentUser.data[0]?.token}`
            }
        };
        axios(config)
            .then(function (response) {
                if (response.status === 200) {
                    setIdeaValuesForPDF(response?.data?.data);
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };

    useEffect(() => {
        if (
            teamsData.length === teamsList.length &&
            teamsData.length !== 0 &&
            mentorValuesForPDF !== undefined
            && ideaValuesForPDF !== undefined
        ) {
            handlePrint();
        } else {
            // console.log("Some PDF printing related api's are failing");
        }
    }, [teamsData, mentorValuesForPDF]);
    const tsetcall = () => {
        mentorDataforPDF();
        fetchTeamCredentials(currentUser?.data[0]?.mentor_id);
        ideaDataforPDF();
        fetchAllTeamsData();
    };
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current
    });


    return (
        <>
            <div style={{ display: 'none' }}>
                <Schoolpdf
                    ref={componentRef}
                    tabledata={teamsData}
                    remMentor={mentorValuesForPDF}
                    teamCredentials={teamCredentials}
                    ideaStatusDetails={ideaValuesForPDF}
                />
            </div>
            <div className="dash-imgs" onClick={tsetcall}>
                <FaKey />
            </div>
        </>
    );
}
export default SchoolTeamPDF;