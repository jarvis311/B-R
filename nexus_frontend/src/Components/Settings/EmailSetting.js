import React, { useEffect, useState } from "react";
import { getEmailSettings, getEmailSetting } from "Services/settingService";
import { DataGrid } from "@mui/x-data-grid";
import { ModeEdit } from "@mui/icons-material";
import { Grid } from "@mui/material";
import SearchBar from "views/CommonComponent/SearchBar";
import CommButton from "views/CommonComponent/CommButton";
import AddEmailSetting from "./AddEmailSetting";
import { exportPDF } from "utils/exportPdf";

export default function EmailSetting() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [fetchEditData, setFetchEditData] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    getSettingData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((setting) => {
      return (
        setting.key.toLowerCase().includes(value?.toLowerCase()) ||
        setting.value?.toLowerCase().includes(value?.toLowerCase())
      )
    });
    setRowsData(filteredData);
  }, [value,rows])

  const getSettingData = () => {
    getEmailSettings().then((data) => {
      if (data && data.data) {
        setRows(data.data.settings)
      }
    })
  }

  const generatePDF = () => {
    exportPDF(columns,rowsData);
  };
  
  const columns = [
    { field: "key", headerName: "Name", width: 200 },
    // { field: "value", headerName: "value", width: 500, editable: true, renderEditCell: renderEditInputCell, },
    {
      field: "Action",
      headerName: "Action",
      width: 100,
      renderCell: (params) => {
        return (
          <>
            <div
              className="d-flex justify-content-between align-items-center"
              style={{ cursor: "pointer" }}
            >
              <ModeEdit
                style={{ marginLeft: "10px" }}
                index={params.row.id}
                onClick={() => handleEdit(params.row.id)}
              />
            </div>
          </>
        );
      },
    }
  ];

  const handleEdit = (id) => {
    setOpen(true)
    getEmailSetting(id).then((res) => {
      setFetchEditData(res.data);
    });
  };

  return (
    <>
      <Grid item xs={12}>
        <div className="action-main-div">
          <div className="action-search-div">
            <SearchBar
              value={value}
              setValue={setValue}
              placeHolder={"Search"}
            />
          </div>
          <div className="button-group-main">
            <div>
              <CommButton title="Export" handleClick={generatePDF} />
            </div>
          </div>
        </div>
      </Grid>
      <div style={{ height: 400, width: "100%" }} className="data-grid-main">
        <DataGrid
          rows={rowsData}
          columns={
            columns
          }
          experimentalFeatures={{ newEditingApi: true }}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 15]}
          checkboxSelection={false}
        />
        <AddEmailSetting
          open={open}
          setOpen={setOpen}
          fetchEditData={fetchEditData}
          getData={getSettingData}
        />
      </div>
    </>
  );
}