/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-escape */
import React, { useEffect } from "react";
import { useLocation } from 'react-router-dom';
import logo from "../assets/img/logo.png";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../redux/actions";
import { openNotificationWithIcon } from "../helpers/Utils";
import { useDispatch } from "react-redux";
import CryptoJS from "crypto-js";
import axios from "axios";

const Naipunyam = () => {
    const Params = new URLSearchParams(useLocation().search);
    const studentname = Params.get("studentname");
    const uuid = Params.get("uuid");
    const email = Params.get("email");
    const mobile = Params.get("mobile");
    const district = Params.get("district");
    const collegename = Params.get("collegename");
    const collegetype = Params.get("collegetype");
    const rollnumber = Params.get("rollnumber");
    const branch = Params.get("branch");
    const yearofstudy = Params.get("yearofstudy");
    const apaarid = Params.get("apaarid");
    const gender = Params.get("gender");
    const collegetown = Params.get("collegetown");
    const navigate = useNavigate();
    const handleLogoClick = () => {
        navigate('/');
    };
    const currentYear = new Date().getFullYear();
    const dispatch = useDispatch();
    const loginfuc = async () => {
        localStorage.clear();
        if (
            localStorage.getItem("current_user") &&
            localStorage.getItem("module")
        ) {
            openNotificationWithIcon(
                "error",
                "Clear your browser cache and try logging in"
            );
            return;
        }

        const body = {
            username: uuid.trim(),
            logintype: 'SINGLESIGIN'
        };
        const loginresult = await dispatch(loginUser(body, navigate, "STUDENT", true));
        if (loginresult === 'User not found') {
            regfuc();
        }
    };
    const regfuc = async () => {
        const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
        const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
        const encrypted = CryptoJS.AES.encrypt(uuid, key, {
            iv: iv,
            padding: CryptoJS.pad.NoPadding,
        }).toString();
        const body = {
            full_name: studentname,
            username: uuid,
            mobile: mobile,
            district: district,
            college_type: collegetype,
            college_name: collegename,
            roll_number: rollnumber,
            branch: branch,
            year_of_study: yearofstudy,
            gender: gender,
            college_town: collegetown,
            confirmPassword: encrypted,
            id_number: apaarid,
            email: email,
            reg_type: "naipunyam"
        };
        var config = {
            method: "post",
            url: process.env.REACT_APP_API_BASE_URL + "/students/register",
            headers: {
                "Content-Type": "application/json",
                Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
            },

            data: JSON.stringify(body),
        };
        await axios(config)
            .then((pilotstudent) => {
                if (pilotstudent?.data?.status == 201) {
                    openNotificationWithIcon("success", "registration Successfully");
                    loginfuc();
                }
            })
            .catch((err) => {
                if (err?.response?.data?.status === 406) {
                    openNotificationWithIcon("error", err.response.data?.message);
                } else {
                    openNotificationWithIcon("error", `Invaild Characters and Invaild Data`);
                }
                return err.response;
            });
    };
    useEffect(() => {
        loginfuc();
    }, []);
    return (
        <div className="main-wrapper">
            <div className="account-content">
                <div className="login-wrapper common-pass-wrap bg-img">
                    <div className="login-content">
                        <div className="login-userset">
                            <div className="login-logo logo-normal" onClick={handleLogoClick}>
                                <img src={logo} alt="Logo" />
                            </div>
                            <h1>
                                Authenticating your session, just a moment…
                            </h1>
                            <div className="my-2 d-flex justify-content-center align-items-center copyright-text">
                                <p>Copyright © {currentYear}  <b>YFSI.</b> All rights reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default Naipunyam;