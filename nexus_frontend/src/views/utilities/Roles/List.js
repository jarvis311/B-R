import React, { useEffect, useState } from "react";
import "../user.css";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link, useNavigate } from "react-router-dom";
import { deleteRole, getRoles } from "Services/roleServices";
import CommDialog from "views/CommonComponent/CommDialog";
import CommAlert from "views/CommonComponent/CommAlert";
import { exportPDF } from "utils/exportPdf";

const columns = [
  { field: "name", headerName: "Name", width: 400 },
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
    Role
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
  useEffect(() => {
    getRoleData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((role) => {
      return (
        role.name.toLowerCase().includes(value?.toLowerCase())
      )
    });
    setRowsData(filteredData);
  }, [value,rows])

  const getRoleData = () => {
    setLoading(true);
    getRoles().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.roles)
      }
    })
  }

  const navigate = useNavigate();
  const handleAddAction = () => {
    navigate('/roles/add')
  };

  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };
  
  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deleteRole(deleteId).then((res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setRows(rows.filter((role) => role.id !== deleteId))
      } else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  const editHandler = (id) => {
    navigate(`/roles/edit/${id}`)
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
        searchPlaceHolder={"Search Role"}
        filterButton={false}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add Role'
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