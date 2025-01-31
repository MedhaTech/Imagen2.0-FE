/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable indent */
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card } from "reactstrap";
// import { Tabs } from 'antd';
import { Button } from "../../stories/Button";

import axios from "axios";
import { URL, KEY } from "../../constants/defaultValues.js";

import { getNormalHeaders } from "../../helpers/Utils";
import { useNavigate } from "react-router-dom";

import "sweetalert2/src/sweetalert2.scss";
import DataTable, { Alignment } from "react-data-table-component";
import DataTableExtensions from "react-data-table-component-extensions";
import "react-data-table-component-extensions/dist/index.css";
import Select from "./Select.js";
import { PlusCircle } from "feather-icons-react/build/IconComponents";

import { useDispatch } from "react-redux";
import { encryptGlobal } from "../../constants/encryptDecrypt.js";
import { stateList, districtList } from "../../RegPage/ORGData.js";

const TicketsPage = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tableData, settableData] = React.useState([]);
  const [showspin, setshowspin] = React.useState(false);

  const fiterDistData = [...districtList["Telangana"]];
  fiterDistData.unshift("All Districts");
  const [state, setState] = useState("");

  const handleclickcall = async () => {
    // where we can select district and sdg //
    // where we can see list of challenges districtwise //
    setshowspin(true);
    await handleideaList();
  };

  async function handleideaList() {
    // handleideaList api //
    //where we can see all ideas in districtwise //
    settableData([]);
    const axiosConfig = getNormalHeaders(KEY.User_API_Key);

    const resparam = encryptGlobal(
      JSON.stringify({
        status: "ALL",
        district: state,
      })
    );
    await axios
      .get(`${URL.getMentors}?Data=${resparam}`, axiosConfig)
      .then(function (response) {
        if (response.status === 200) {
          console.log(response, "11");
          const updatedWithKey =
            response.data &&
            response.data.data[0] &&
            response.data.data[0].dataValues.map((item, i) => {
              const upd = { ...item };
              upd["key"] = i + 1;
              return upd;
            });
          settableData(updatedWithKey);
          setshowspin(false);
        }
      })
      .catch(function (error) {
        console.log(error);
        setshowspin(false);
      });
  }
 
  const StudentsData = {
    data: tableData && tableData.length > 0 ? tableData : [],
    columns: [
      {
        name: "No",
        // selector: (row) => row.id,
        selector: (row, key) => key + 1,
        cellExport: (row) => row.index,
        width: "4rem",
      },

      {
        name: "Full Name",
        selector: (row) => row?.full_name,
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row?.full_name}
          </div>
        ),
        cellExport: (row) => row?.full_name,
        width: "9rem",
      },
      {
        name: "Email Address",
        selector: (row) => row?.username_email,
        width: "13rem",
      },
      {
        name: "Mobile No",
        selector: (row) => row?.mobile,
        cellExport: (row) => row?.mobile,
        width: "10rem",
      },
      {
        name: "District",
        selector: (row) => row.district,
        cellExport: (row) => row.district,
        width: "8rem",
      },
      {
        name: "College Type",
        cell: (row) => (
          <div
            style={{
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
            }}
          >
            {row?.college_type}
          </div>
        ),
        selector: (row) => row?.college_type,
        cellExport: (row) => row?.college_type,
        width: "10rem",
      },

      {
        name: "College Name",
        selector: (row) => row?.college_name,
        cellExport: (row) => row?.college_name,
        width: "18rem",
      },
    
    ],
  };
  const customStyles = {
    head: {
      style: {
        fontSize: "1em", // Adjust as needed
      },
    },
  };
  const showbutton = state;
  return (
    <div className="page-wrapper">
      <div className="content">
        <Container className="ticket-page mb-50 userlist">
          <Row className="mt-0">
            <h4 className="my-2 mx-0">Institutions List</h4>
            {/* <Container fluid className="px-0"> */}
              <Row className="align-items-center">
                <Col md={2}>
                  <Select
                    list={fiterDistData}
                    setValue={setState}
                    placeHolder={"Select District"}
                    value={state}
                    className="form-select"
                  />
                </Col>

                <Col md={2}>
                  <div className="text-center">
                    <Button
                      btnClass={showbutton ? "primary" : "default"}
                      size="small"
                      label="Search"
                      disabled={!showbutton}
                      onClick={() => handleclickcall()}
                    />
                  </div>
                </Col>
                <Col className="d-flex justify-content-end">
                  <div className="text-center">
                    <button
                      className="btn btn-info"
                      onClick={() => navigate("/add-institution")}
                    >
                      <PlusCircle className="me-2" style={{ color: "white" }} />
                      <b>Add Institution</b>
                    </button>
                  </div>
                </Col>
              </Row>
              <div className="bg-white border card pt-3 mt-5">
                <DataTableExtensions
                  print={false}
                  export={false}
                  {...StudentsData}
                >
                  <DataTable
                    data={tableData || []}
                    defaultSortField="id"
                    customStyles={customStyles}
                    defaultSortAsc={false}
                    pagination
                    highlightOnHover
                    fixedHeader
                    subHeaderAlign={Alignment.Center}
                  />
                </DataTableExtensions>
              </div>
            {/* </Container> */}
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default TicketsPage;
