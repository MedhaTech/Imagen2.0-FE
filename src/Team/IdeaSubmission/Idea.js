/* eslint-disable indent */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from 'react';
import IdeaPageCopy from './IdeaPageCopy';
import { Link } from 'react-router-dom';
import { Check } from 'react-feather';
import FeatherIcon from "feather-icons-react";
import { themes, themesList } from "./themesData";
import { getCurrentUser } from '../../helpers/Utils';
import { encryptGlobal } from '../../constants/encryptDecrypt';
import axios from 'axios';
import { useTranslation } from "react-i18next";

const settings = {
  dots: false,
  autoplay: false,
  slidesToShow: 5,
  margin: 0,
  speed: 500,
  responsive: [
    {
      breakpoint: 1150,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 992,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 800,
      settings: {
        slidesToShow: 5,
      },
    },
    {
      breakpoint: 776,
      settings: {
        slidesToShow: 2,
      },
    },
    {
      breakpoint: 567,
      settings: {
        slidesToShow: 1,
      },
    },
  ],
};

const Idea = ({ showChallenge, idea }) => {
const { t } = useTranslation();

  const [theme, setTheme] = useState(null);
  const currentUser = getCurrentUser('current_user');
  const TeamId = currentUser?.data[0]?.type_id === 0 ? currentUser?.data[0]?.student_id : currentUser?.data[0]?.type_id;
const [statusCode,setStatusCode]= useState(false);
  const [data, setData] = useState(0);
  const [initiate, setInitiate] = useState("");
  const submittedApi = () => {
    const Param = encryptGlobal(
      JSON.stringify({
        student_id: TeamId

      })
    );
    var configidea = {
      method: "get",
      url:
        process.env.REACT_APP_API_BASE_URL +
        `/challenge_response/submittedDetails?Data=${Param}`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${currentUser.data[0]?.token}`,
      },
    };
    axios(configidea)
      .then(function (response) {
        if (response.status === 200) {
          setStatusCode(false);
          if (response.data.data && response.data.data.length > 0) {
            const data = response.data.data[0];
            setInitiate(response.data.data[0].initiate_by);
            idea();
          }
        }
      })
      .catch(function (error) {
        if (error.response.status === 404) {
            setStatusCode( true);
        }

      });
  };
  useEffect(() => {
    submittedApi();
  }, []);


  const challenges = () => {
    showChallenge();
  };
  const [imgStyle, setImgStyle] = useState({ maxWidth: "40%", height: "auto" });

useEffect(() => {
  const updateStyle = () => {
    if (window.innerWidth < 768) {
      setImgStyle({ maxWidth: "40%", height: "auto" });
    } else {
      setImgStyle({ maxWidth: "80%", height: "auto" });
    }
  };

  window.addEventListener("resize", updateStyle);
  updateStyle(); // Initial check

  return () => window.removeEventListener("resize", updateStyle);
}, []);
  return (
    <div className='page-wrapper'>
      <div className='content'>
        <div className="page-header">
          <div className="page-title">
            <h4>  {t('home.idea_submission')}</h4>
            <h6>{t('home.share')}</h6>
          </div>
        </div>

        {statusCode ? (
          <div className="row align-items-start pos-wrapper pos-design">
            <div className="col-md-12 col-lg-8">
              <div className="pos-categories tabs_wrapper">
                <div className="pos-products">
                  <div className="tabs_container">
                    <div className="tab_content active">
                      <div className="row">
                        {themes.map((theme) => (
                          <div id={theme.id} key={theme.id} className="col-sm-2 col-md-6 col-lg-3 col-xl-3 pe-2" onClick={() => setData(theme.id)}>
                            <div className="product-info default-cover card">
                              <Link className="img-bg">
                                <img
                                  src={theme.image}
                                  alt={theme.id}
                                  style={imgStyle}
                                />
                                <span>

                                  <Check className="feather-16" />
                                </span>
                              </Link>
                             
                              <h6 className="product-name">
                                <Link to="#">{t(theme.title)}</Link>
                              </h6>
                              <div className="d-flex align-items-center justify-content-between price">
                                <span>{t('home.ideafocus')}</span>
                                {theme.id === 18 ? (<p><FeatherIcon size={20} icon="loader" /></p>) : ""}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {!data ? (
              <div className="col-md-12 col-lg-4 ps-0">
                <aside className="product-order-list">
                  <div className="head d-flex align-items-center justify-content-between w-100">
                    <div className="">
                      <h5>{t('home.select')}</h5> 
                      <span>{t('home.selectv')}</span>
                    </div>
                  </div>
                </aside>
              </div>
            ) : (
              <div className="col-md-12 col-lg-4 ps-0">
                <aside className="product-order-list">
                  <div className="head d-flex align-items-center justify-content-between w-100">
                    <div className="">
                      <h5>{t(themes[data - 1].title)}</h5><br />
                      <span>{t(themes[data - 1].desc)}</span>
                    </div>
                  </div>
                
                  <div className="btn-row d-sm-flex align-items-center justify-content-between"
                    onClick={() => {setTheme(themes[data - 1].title);setStatusCode(false);}}
                 
                  >
                    <Link
                      className="btn btn-info btn-icon flex-fill"
                    >
                      <span className="me-1 d-flex align-items-center">
                        <i data-feather="pause" className="feather-16" />
                      </span>
                      {t('idea_page.proceed')}
                    </Link>
                  </div>
                </aside>
              </div>
            )}
          </div>
        ) : (
          <IdeaPageCopy  showChallenges={challenges} theme={theme}/>
        )}

      </div>
    </div>
  );
};

export default Idea;
