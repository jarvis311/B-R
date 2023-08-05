import React, { useEffect, useState } from "react";
import "../user.css";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link } from "react-router-dom";
import { deleteModule, getModules } from "Services/moduleServices";
import CommDialog from "views/CommonComponent/CommDialog";
import AddModule from "./AddModule";
import CommAlert from "views/CommonComponent/CommAlert";
import { exportPDF } from "utils/exportPdf";

const columns = [
  { field: "name", headerName: "Name", width: 400 },
  { field: "index", headerName: "Key", width: 400 },
  { field: "order", headerName: "Order", width: 200, },
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
    Module
  </Link>,
];

export default function List() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [editId, setEditId] = useState(null);
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

  const [moduleData, setModuleData] = useState({
    name: "",
    index: "",
    order: "",
  });

  const [loading, setLoading] = useState(false);
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

  useEffect(() => {
    getModuleData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((module) => {
      let filterVal = filterStatus === 1 ? 1 : filterStatus === 2 ? 0 : ""
      if (filterStatus) {
        return (
          module.status === filterVal && (
            module.name.toLowerCase().includes(value?.toLowerCase()) ||
            module.index.toLowerCase().includes(value?.toLowerCase()) ||
            module.order === parseInt(value)
          )
        )
      }
      else {
        return (
          module.name.toLowerCase().includes(value?.toLowerCase()) ||
          module.index.toLowerCase().includes(value?.toLowerCase()) ||
          module.order === parseInt(value)
        )
      }
    });
    setRowsData(filteredData);
  }, [filterStatus, value, rows])

  const getModuleData = () => {
    setLoading(true);
    getModules().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.module)
      }
    })
  }
  const handleAddAction = () => {
    setEditMode(false);

    setOpen(true);
  };
  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };
  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deleteModule(deleteId).then((res) => {
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

  const editHandler = (id) => {
    const selected = rows.find((module) => module.id === id)
    setEditId(id)
    setOpen(true);
    setEditMode(true);
    setModuleData({
      id: selected.id,
      name: selected.name,
      index: selected.index,
      order: selected.order,
    })
  };

  const generatePDF = () => {
    exportPDF(columns, rowsData);
  };

  return (
    <>
      {loading && <CommLoader />}

      <CommGrid
        breadcrumbsData={breadcrumbs}
        SearchBarDisplay={true}
        searchValue={value}
        searchHandler={setValue}
        searchPlaceHolder={"Search Module"}
        filterButton={true}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add Module'
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
        filterOptions={filterOptions}

      />
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <AddModule
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        getModuleData={getModuleData}
        editMode={editMode}
        moduleData={moduleData}
        rows={rows}
        handleSnackbarOpen={handleSnackbarOpen}
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
    </>
  );
}