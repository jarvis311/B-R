import React, { useEffect, useState } from "react";
import { getSocialLinks, deleteSocialLink } from "Services/settingService";
import { Avatar } from "@mui/material";
import { exportPDF } from "utils/exportPdf";
import CommGrid from "views/CommonComponent/CommGrid";
import AddSocialLink from "./AddSocialLink";
import CommAlert from "views/CommonComponent/CommAlert";
import CommDialog from "views/CommonComponent/CommDialog";

export default function SocialSetting() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [open, setOpen] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [editId, setEditId] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [filterStatus, setfilterStatus] = useState("");
  const filterOptions = [
    {
      Handler: setfilterStatus,
      value: filterStatus,
      Options: [
        { id: 0, value: "Status", subTitle: true },
        { id: 1, value: "Active", subTitle: false },
        { id: 2, value: "Inactive", subTitle: false },
      ],
    },
  ];

  const setSelectedRows = () => {
  }

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };

  useEffect(() => {
    getSettingData()
  }, [])

  useEffect(() => {

    const filteredData = JSON.parse(JSON.stringify(rows)).filter((setting) => {
      let filterVal = filterStatus === 1 ? 1 : filterStatus === 2 ? 0 : ""
      if (filterStatus) {
        return (
          setting.status === filterVal && (
            setting.url.toLowerCase().includes(value?.toLowerCase())
          )
        )
      }
      else {
        return (
          setting.url.toLowerCase().includes(value?.toLowerCase())
        )
      }
    });
    setRowsData(filteredData);
  }, [filterStatus, value, rows])

  const getSettingData = () => {
    getSocialLinks().then((data) => {
      if (data && data.data) {
        setRows(data.data)
      }
    })
  }

  const generatePDF = () => {
    exportPDF(columns, rowsData);
  };

  const [settingData, setSettingData] = useState({
    id: "",
    url: "",
    status: "",
  });

  const columns = [
    {
      field: "icon", headerName: "Icon", width: 200, renderCell: (params) => {
        return (
          params.row.icon ?
            <Avatar variant="square" src={params.row.icon} alt=""/>
            : "")
      }
    },
    { field: "url", headerName: "URL", width: 400 },
    { field: "status", headerName: "Status", width: 200, valueGetter: (params) => params.row.status === 1 ? "Active" : "Inactive" },
  ];

  const handleAddAction = () => {
    setEditMode(false);
    setOpen(true);
  };

  const editHandler = (id) => {
    const selected = rows.find((module) => module.id === id)
    setEditId(id)
    setOpen(true);
    setEditMode(true);
    setSettingData({
      id: selected.id,
      url: selected.url,
      status: selected.status,
    })
  };

  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };

  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deleteSocialLink(deleteId).then((res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setRows(rows.filter((module) => module.id !== deleteId))
      } else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  return (
    <>
      <div style={{ height: 400, width: "100%" }} className="data-grid-main">
        <CommGrid
          SearchBarDisplay={true}
          searchValue={value}
          exportButton={true}
          searchHandler={setValue}
          searchPlaceHolder={"Search"}
          filterButton={true}
          importButton={false}
          generatePDF={generatePDF}
          addButton={true}
          addButtonName="Add Social Link"
          addButtonAction={handleAddAction}
          tableColums={columns}
          tableRows={rowsData}
          pageSize={10}
          rowsPerPageOptions={[5, 10, 15]}
          setSelectedRows={setSelectedRows}
          AllowDeleteInfo={true}
          AllowEditInfo={true}
          deleteHandler={deleteHandler}
          editHandler={editHandler}
          DeleteAllRecord={false}
          filterOptions={filterOptions}
        />
        <AddSocialLink
          open={open}
          setOpen={setOpen}
          getSettingData={getSettingData}
          handleSnackbarOpen={handleSnackbarOpen}
          editMode={editMode}
          settingData={settingData}
          rows={rows}
          editId={editId}
        />
        <CommAlert
          message={snackbarMessage}
          severity={snackbarSeverity}
          autoHideDuration={10000}
          open={openSnackbar}
          handleSnackbarClose={handleSnackbarClose}
          position='Top-Right'
        />
        <CommDialog
          setOpenConfirm={setOpenConfirm}
          openConfirm={openConfirm}
          deleteRecordhandler={deleteRecordhandler}
        />
      </div>
    </>
  );
}