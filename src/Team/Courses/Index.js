/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'react-feather';
import C1 from '../../assets/img/c1.svg';
import C2 from '../../assets/img/c2.svg';
import { getCurrentUser } from '../../helpers/Utils';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import axios from 'axios';

const Index = () => {
  const currentUser = getCurrentUser("current_user");
  const [studentD, setStudentD] = useState();
  useEffect(() => {
    fetchstudentdetails();
  }, []);
  async function fetchstudentdetails() {
    const fectchTecParam = encryptGlobal(JSON.stringify(currentUser?.data[0]?.student_id));
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/students/${fectchTecParam}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${currentUser?.data[0]?.token}`,
          },
        }
      );
      if (response.status === 200) {
        setStudentD(response.data?.data[0].course);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className='page-wrapper'>
      <div className='content' style={{
    padding: window.innerWidth > 768 ? '30px' : '0', // Dynamic padding based on window width
  }}>
        <div className="page-header">
          <div className="page-title">
            <h4 className='m-2'>Course</h4>
            <h6 className='m-2'>Join us on this problem solving journey.</h6>
          </div>
        </div>
        <div className="row align-items-start pos-wrapper pos-design">
          <div className="col-md-12 col-lg-8">
            <div className="pos-categories tabs_wrapper">
              <div className="pos-products">
                <div className="tabs_container">
                  <div className="tab_content active">
                    <div className="row">
                      {studentD >= 1 && (<div className="col-sm-2 col-md-6 col-lg-6 col-xl-3 pe-2">
                        <div className="product-info default-cover card"  style={{ width: '250px', height: '200px', padding: '20px' }}>
                          <Link className="img-bg" to='/studentcourse/VTJGc2RHVmtYMThUMXFCOXBiWTZReGN3dXdSU3JzSlJYM3NwblpZSVlSZz0='>
                            <img
                              src={C1}
                              alt={'course1'}
                              style={{ width: '2500px', height: '100%', objectFit: 'cover' }}
                            />
                            <span>

                              <Check className="feather-16" />
                            </span>
                          </Link>
                          <h6 
                          className="product-name col-sm-6 col-md-6 col-lg-3 col-xl-6" 
                          style={{ fontSize: '1.2rem', marginTop: '1rem', textAlign:"center"}}
                          // className="product-name"
                          >
                            <Link to='/studentcourse/VTJGc2RHVmtYMThUMXFCOXBiWTZReGN3dXdSU3JzSlJYM3NwblpZSVlSZz0='>Course 1</Link>
                          </h6>
                          {/* <div className="d-flex align-items-center justify-content-between price">
                              <span>{t('home.ideafocus')}</span>
                              {theme.id === 8 ? (<p><FeatherIcon size={20} icon="loader" /></p>) : (<p>{theme.focusareas.length - 1}</p>)}
                            </div> */}
                        </div>
                      </div>)}

                      {studentD >= 2 && (<div className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2">
                        <div className="product-info default-cover card">
                          <Link className="img-bg" to='/studentcourse/VTJGc2RHVmtYMStuTlpBam9KZUVUeTNpMmMwc0k3QnVQTnd0aXBkUHg0QT0='>
                            <img
                              src={C2}
                              alt={'course2'}
                            />
                            <span>

                              <Check className="feather-16" />
                            </span>
                          </Link>
                          <h6 className="product-name">
                            <Link to='/studentcourse/VTJGc2RHVmtYMStuTlpBam9KZUVUeTNpMmMwc0k3QnVQTnd0aXBkUHg0QT0='>Course2</Link>
                          </h6>
                        </div>
                      </div>)}


                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
