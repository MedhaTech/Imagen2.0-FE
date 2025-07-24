/* eslint-disable indent */
import React, { useState } from "react";
import * as XLSX from "xlsx";
import axios from "axios";
import CryptoJS from "crypto-js";
import { saveAs } from "file-saver";

const ExcelReader = () => {
  let result = {};
  const [loadder, setloadder] = useState(false);
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target.result;
      const workbook = XLSX.read(bstr, { type: "binary",cellDates: true });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(worksheet);
      looptest(jsonData);
      setloadder(true);
    };
    reader.readAsBinaryString(file);
  };
  const passeencrypted = async (value) => {
    try {
      const key = CryptoJS.enc.Hex.parse("253D3FB468A0E24677C28A624BE0F939");
      const iv = CryptoJS.enc.Hex.parse("00000000000000000000000000000000");
      const enp = CryptoJS.AES.encrypt(JSON.stringify(value), key, {
        iv: iv,
        padding: CryptoJS.pad.NoPadding,
      }).toString();
      return enp;
    } catch (err) {
      console.log(err, "password error");
    }
  };
  const studentcrews = async (item) => {
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/students/addStudent",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: JSON.stringify(item),
    };
    return await axios(config)
      .then((mentorRegRes) => {
        if (mentorRegRes?.data?.status == 201) {
          return "Done ";
        }
        return "Error then uploading";
      })
      .catch((err) => {
        if (err?.response?.data?.status === 406) {
          return "Duplicate in DB";
        }
        return "Error uploading";
      });
  };
  const studentPiolt = async (body) => {
    var config = {
      method: "post",
      url: process.env.REACT_APP_API_BASE_URL + "/students/register",
      headers: {
        "Content-Type": "application/json",
        Authorization: "O10ZPA0jZS38wP7cO9EhI3jaDf24WmKX62nWw870",
      },
      data: JSON.stringify(body),
    };
    return await axios(config)
      .then((mentorRegRes) => {
        if (mentorRegRes?.data?.status == 201) {
          return mentorRegRes?.data?.data[0]?.student_id;
        }
        return "Error then uploading";
      })
      .catch((err) => {
        if (err?.response?.data?.status === 406) {
          return "Duplicate in DB";
        }
        return "Error uploading";
      });
  };
const dateformat = async (date) =>{
  const datenewF = new Date(date);
  datenewF.setDate(datenewF.getDate() + 1);
  return datenewF;
};
  const looptest = async (data) => {
    for (const item of data) {
      const body = {
        full_name: item["P_FullName"] === undefined ? null : item["P_FullName"],
        username: item["P_Email"] === undefined ? null : item["P_Email"],
        mobile:
          item["P_Mobile"] === undefined
            ? null
            : JSON.stringify(item["P_Mobile"]),
        district:
          item["P_CollegeDistrict"] === undefined
            ? null
            : item["P_CollegeDistrict"],
        college_type:
          item["P_CollegeType"] === undefined ? null : item["P_CollegeType"],
        college_name:
          item["P_CollegeName"] === undefined ? null : item["P_CollegeName"],
        roll_number:
          item["P_RollNumber"] === undefined
            ? null
            : typeof(item["P_RollNumber"]) === 'string' ? item["P_RollNumber"] : JSON.stringify(item["P_RollNumber"]),
        branch: item["P_Branch"] === undefined ? null : item["P_Branch"],
        year_of_study:
          item["P_YearOfStudy"] === undefined ? null : item["P_YearOfStudy"],
        confirmPassword: await passeencrypted(item["P_Mobile"]),
        gender: item["P_Gender"] === undefined ? null : item["P_Gender"],
        college_town:
          item["P_CollegeTown"] === undefined ? null : item["P_CollegeTown"],
        dateofbirth:
          item["P_DateOfBirth"] === undefined ? null : await dateformat(item["P_DateOfBirth"]),
        disability:
          item["P_Disability"] === undefined ? null : item["P_Disability"],
        area:
          item["P_AreaofResidence"] === undefined
            ? null
            : item["P_AreaofResidence"],
        id_number:
          item["P_APAARId"] === undefined
            ? null
            : typeof(item["P_APAARId"]) === 'string' ? item["P_APAARId"] : JSON.stringify(item["P_APAARId"]),
      };
      const studentId = await studentPiolt(body);
      if (typeof studentId === "number") {
        result[item["P_no"]] = "Pilot Done ";
        const bodycrew1 = {
          full_name:
            item["C1_FullName"] === undefined ? null : item["C1_FullName"],
          username: item["C1_Email"] === undefined ? null : item["C1_Email"],
          mobile:
            item["C1_Mobile"] === undefined
              ? null
              : JSON.stringify(item["C1_Mobile"]),
          district:
            item["C1_CollegeDistrict"] === undefined
              ? null
              : item["C1_CollegeDistrict"],
          college_type:
            item["C1_CollegeType"] === undefined
              ? null
              : item["C1_CollegeType"],
          college_name:
            item["C1_CollegeName"] === undefined
              ? null
              : item["C1_CollegeName"],
          roll_number:
            item["C1_RollNumber"] === undefined
              ? null
              : typeof(item["C1_RollNumber"]) === 'string' ? item["C1_RollNumber"] : JSON.stringify(item["C1_RollNumber"]),
          branch: item["C1_Branch"] === undefined ? null : item["C1_Branch"],
          year_of_study:
            item["C1_YearOfStudy"] === undefined
              ? null
              : item["C1_YearOfStudy"],
          confirmPassword: await passeencrypted(item["C1_Mobile"]),
          gender: item["C1_Gender"] === undefined ? null : item["C1_Gender"],
          college_town:
            item["C1_CollegeTown"] === undefined
              ? null
              : item["C1_CollegeTown"],
          dateofbirth:
            item["C1_DateOfBirth"] === undefined
              ? null
              : await dateformat(item["C1_DateOfBirth"]),
          disability:
            item["C1_Disability"] === undefined ? null : item["C1_Disability"],
          area:
            item["C1_AreaofResidence"] === undefined
              ? null
              : item["C1_AreaofResidence"],
          id_number:
            item["C1_APAARId"] === undefined
              ? null
              : typeof(item["C1_APAARId"]) === 'string' ? item["C1_APAARId"] : JSON.stringify(item["C1_APAARId"]),
          type: JSON.stringify(studentId),
        };
        const crew1 = await studentcrews(bodycrew1);
        const bodycrew2 = {
          full_name:
            item["C2_FullName"] === undefined ? null : item["C2_FullName"],
          username: item["C2_Email"] === undefined ? null : item["C2_Email"],
          mobile:
            item["C2_Mobile"] === undefined
              ? null
              : JSON.stringify(item["C2_Mobile"]),
          district:
            item["C2_CollegeDistrict"] === undefined
              ? null
              : item["C2_CollegeDistrict"],
          college_type:
            item["C2_CollegeType"] === undefined
              ? null
              : item["C2_CollegeType"],
          college_name:
            item["C2_CollegeName"] === undefined
              ? null
              : item["C2_CollegeName"],
          roll_number:
            item["C2_RollNumber"] === undefined
              ? null
              : typeof(item["C2_RollNumber"]) === 'string' ? item["C2_RollNumber"] : JSON.stringify(item["C2_RollNumber"]),
          branch: item["C2_Branch"] === undefined ? null : item["C2_Branch"],
          year_of_study:
            item["C2_YearOfStudy"] === undefined
              ? null
              : item["C2_YearOfStudy"],
          confirmPassword: await passeencrypted(item["C2_Mobile"]),
          gender: item["C2_Gender"] === undefined ? null : item["C2_Gender"],
          college_town:
            item["C2_CollegeTown"] === undefined
              ? null
              : item["C2_CollegeTown"],
          dateofbirth:
            item["C2_DateOfBirth"] === undefined
              ? null
              : await dateformat(item["C2_DateOfBirth"]),
          disability:
            item["C2_Disability"] === undefined ? null : item["C2_Disability"],
          area:
            item["C2_AreaofResidence"] === undefined
              ? null
              : item["C2_AreaofResidence"],
          id_number:
            item["C2_APAARId"] === undefined
              ? null
              : typeof(item["C2_APAARId"]) === 'string' ? item["C2_APAARId"] : JSON.stringify(item["C2_APAARId"]),
          type: JSON.stringify(studentId),
        };
        const crew2 = await studentcrews(bodycrew2);
        const bodycrew3 = {
          full_name:
            item["C3_FullName"] === undefined ? null : item["C3_FullName"],
          username: item["C3_Email"] === undefined ? null : item["C3_Email"],
          mobile:
            item["C3_Mobile"] === undefined
              ? null
              : JSON.stringify(item["C3_Mobile"]),
          district:
            item["C3_CollegeDistrict"] === undefined
              ? null
              : item["C3_CollegeDistrict"],
          college_type:
            item["C3_CollegeType"] === undefined
              ? null
              : item["C3_CollegeType"],
          college_name:
            item["C3_CollegeName"] === undefined
              ? null
              : item["C3_CollegeName"],
          roll_number:
            item["C3_RollNumber"] === undefined
              ? null
              : typeof(item["C3_RollNumber"]) === 'string' ? item["C3_RollNumber"] : JSON.stringify(item["C3_RollNumber"]),
          branch: item["C3_Branch"] === undefined ? null : item["C3_Branch"],
          year_of_study:
            item["C3_YearOfStudy"] === undefined
              ? null
              : item["C3_YearOfStudy"],
          confirmPassword: await passeencrypted(item["C3_Mobile"]),
          gender: item["C3_Gender"] === undefined ? null : item["C3_Gender"],
          college_town:
            item["C3_CollegeTown"] === undefined
              ? null
              : item["C3_CollegeTown"],
          dateofbirth:
            item["C3_DateOfBirth"] === undefined
              ? null
              : await dateformat(item["C3_DateOfBirth"]),
          disability:
            item["C3_Disability"] === undefined ? null : item["C3_Disability"],
          area:
            item["C3_AreaofResidence"] === undefined
              ? null
              : item["C3_AreaofResidence"],
          id_number:
            item["C3_APAARId"] === undefined
              ? null
              : typeof(item["C3_APAARId"]) === 'string' ? item["C3_APAARId"] : JSON.stringify(item["C3_APAARId"]),
          type: JSON.stringify(studentId),
        };
        const crew3 = await studentcrews(bodycrew3);
        result[item["P_no"]] =
          (result[item["P_no"]] || "") +
          "Crew1 " +
          crew1 +
          "Crew2 " +
          crew2 +
          "Crew3 " +
          crew3;
      } else {
        result[item["P_no"]] = studentId;
      }
    }
    exportJsonToExcel(result);
  };

  const exportJsonToExcel = (jsonData, fileName = "DTEB2Status.xlsx") => {
    // Convert object to array of arrays (for Excel)
    const aoa = [["ID", "Message"]]; // Header row
    for (const key in jsonData) {
      aoa.push([key, jsonData[key]]);
    }
    // Create worksheet and workbook
    const worksheet = XLSX.utils.aoa_to_sheet(aoa);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

    // Write and download
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const dataBlob = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });
    saveAs(dataBlob, fileName);
    setloadder(false);
  };

  return (
    <div className="page-wrapper">
      <div className="content">
        <div>
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />
          {loadder && (
            <div className="spinner-border text-info" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExcelReader;
