import React, { useState } from "react";
import * as XLSX from "xlsx";
import { UploadOutlined } from "@ant-design/icons";
import moment from "moment";
import { useUserAuth } from "../../hooks/UseUserAuth";
import { getBloodGroupValue } from "../../utils/Utils";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase-config";

const ReadExcelData = () => {
  const [sheetArr, setSheetArr] = useState([]);
  const { addDataToFirebase, updateDataToFirebase } = useUserAuth();

  const feetToCm = (feetString) => {
    let feetVal = feetString.split("'")[0];
    let inchVal = feetString.split("'")[1];
    let totalInches = parseInt(feetVal) * 12 + parseInt(inchVal);
    const cmVal = (totalInches * 2.54).toFixed(2).toString()
    console.log(cmVal);
    return cmVal;
  };
  const xslToJson = (workbook) => {
    //var data = [];
    var sheet_name_list = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list], {
      raw: false,
      dateNF: "YYYY-MMM-DD",
      header: 0,
      defval: "",
    });
  };

  const handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = (e) => {
      /* Parse data */
      const bstr = e.target.result;
      const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
      /* Get first worksheet */
      let arr = xslToJson(wb);
      const changedArr = arr.map((item) => {
        const obj = {
          gymboyId:
            item["Reg"] === ""
              ? moment().valueOf().toString()
              : item["Reg"].trim(),
          gymboyName: item["Name"].trim(),
          gymboyAddress: item["Address"].trim(),
          gymboyBirthday: moment(item["DOB"], "DD/MM/YYYY").format(),
          gymboyBloodGroup: getBloodGroupValue(
            item["Blood"].replace(/ive/gi, "").trim()
          ),
          gymboyEducation: item["Qualification"],
          gymboyHeight:
            item["Height"] === ""
              ? "0"
              : item["Height"].replace(/cm/gi, "").trim().includes("'")
              ? feetToCm(item["Height"].replace(/cm/gi, "").trim())
              : item["Height"].replace(/cm/gi, "").trim(),
          gymboyWeight:
            item["Weight"] === ""
              ? "0"
              : item["Weight"].replace(/kg/gi, "").trim(),
          gymboyGender: "male",
          gymboyIncome: item["Income"].replace(/nil/gi, "").trim(),
          gymboyOccupation: item["Occupation"].trim(),
          gymboyMobile: item["Mobile"].trim(),
          gymboyProblems: item["Problems"].trim(),
          createdOn: moment(item["Date"], "DD/MM/YYYY").format(),
          gymboyAvatar: "",
          paymentDetails: [
            {
              fee: "0",
              validity: [moment().format(), moment().format()],
              paidOn: moment().format(),
            },
          ],
        };
        return obj;
      });
      changedArr.sort((a,b) => parseInt(a.gymboyId) - parseInt(b.gymboyId))
      setSheetArr(changedArr);
      // let finalData = []

      changedArr.forEach(async (data) => {
        // console.log("data rows ", data)
        const memberQuery = query(collection(db, "members"), where("gymboyId", "==", data.gymboyId));

        const querySnapshot = await getDocs(memberQuery);
        if(querySnapshot.length > 0){
          querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            console.log(doc.id, " => ", doc.data());
            updateDataToFirebase(doc.id, data)
          });
          
        }else{
          addDataToFirebase(data);
        }
      });
      // this.setState({ DataEESSsend: finalData })
      // console.log("finalData ", finalData)
    };

    if (rABS) reader.readAsBinaryString(file);
    else reader.readAsArrayBuffer(file);
  };

  const handleChange = (e) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };
  console.log("arr ", sheetArr);

  return (
    <label
      htmlFor="my-file-selector"
      className="btn btn-outline-warning btn-sm"
    >
      <input
        id="my-file-selector"
        className="d-none"
        type="file"
        onChange={handleChange}
      />
      <div className="d-flex align-items-center justify-content-center gap-2">
        <UploadOutlined />
        Import Excel
      </div>
    </label>
  );
};
export default ReadExcelData;
