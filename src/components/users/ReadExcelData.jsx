import React from "react";
import * as XLSX from "xlsx";
import {
  UploadOutlined,
} from "@ant-design/icons";

const ReadExcelData = () => {

  const xslToJson = workbook => {
    //var data = [];
    var sheet_name_list = workbook.SheetNames[0];
    return XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list], {
        raw: false,
        dateNF: "DD-MMM-YYYY",
        header:0,
        defval: ""
    });
};

 const handleFile = (file /*:File*/) => {
    /* Boilerplate to set up FileReader */
    const reader = new FileReader();
    const rABS = !!reader.readAsBinaryString;

    reader.onload = e => {
        /* Parse data */
        const bstr = e.target.result;
        const wb = XLSX.read(bstr, { type: rABS ? "binary" : "array" });
        /* Get first worksheet */
        let arr = xslToJson(wb);

        console.log("arr ", arr)
        // let finalData = []

        // arr.forEach(data => {
        //     console.log("data rows ", data)
            
        // })
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
  }
  
  return (
    <label  htmlFor="my-file-selector" className="btn btn-outline-warning btn-sm">
        <input id="my-file-selector" className="d-none" type="file" onChange={handleChange} />
        <div className="d-flex align-items-center justify-content-center gap-2"><UploadOutlined />Import Excel</div>
    </label>
  )
}
export default ReadExcelData