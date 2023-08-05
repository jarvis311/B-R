import React, { useEffect, useState } from "react";
import "../user.css";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link, useNavigate } from "react-router-dom";
import { deleteTemplate, getTemplates } from "Services/templateServices";
import CommDialog from "views/CommonComponent/CommDialog";
import CommAlert from "views/CommonComponent/CommAlert";
import { exportPDF } from "utils/exportPdf";

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "subject", headerName: "Subject", width: 500 },
];

const breadcrumbs = [
  <Link
    underline='hover'
    key='1'
    color='inherit'
    to='/'>
    Dashboard
  </Link>,
  <Link underline='hover' to='' key='2' color='text.primary' aria-current='page'>
    Email Templates
  </Link>,
];

export default function List() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const setSelectedRows=()=>{
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

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getTemplateData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((template) => {
      return (
        template.name.toLowerCase().includes(value?.toLowerCase()) ||
        template.subject.toLowerCase().includes(value?.toLowerCase())
      )
    });
    setRowsData(filteredData);
  }, [value,rows])

  const getTemplateData = () => {
    setLoading(true);
    getTemplates().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.templates)
      }
    })
  }
  const handleAddAction = () => {
    navigate('/templates/add')
  };

  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };
  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deleteTemplate(deleteId).then((res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setRows(rows.filter((template) => template.id !== deleteId))
      } else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  const editHandler = (id) => {
    navigate(`/templates/edit/${id}`)
  };

  const generatePDF = () => {
    exportPDF(columns,rowsData);
  };

  return (
    <>
      {loading && <CommLoader />}

      <CommGrid
        breadcrumbsData={breadcrumbs}
        SearchBarDisplay={true}
        searchValue={value}
        searchHandler={setValue}
        searchPlaceHolder={"Search Template"}
        filterButton={false}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add Template'
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        AllowDeleteInfo={true}
        AllowEditInfo={true}
        addButtonAction={handleAddAction}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        DeleteAllRecord={false}
        setSelectedRows={setSelectedRows}
      />
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <CommAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={10000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position='Top-Right'
      />
    </>
  );
}