import React, { useEffect, useState } from "react";
import "../user.css";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link } from "react-router-dom";
import { deletePage, getPages } from "Services/pageServices";
import CommDialog from "views/CommonComponent/CommDialog";
import AddPage from "./AddPage";
import CommAlert from "views/CommonComponent/CommAlert";
import { exportPDF } from "utils/exportPdf";

const columns = [
  { field: "title", headerName: "Title", width: 200 },
  { field: "short_description", headerName: "Short Description", width: 300 },
  { field: "long_description", headerName: "Long Description", width: 400, },
  { field: "menu_id", headerName: "Menu", width: 200, valueGetter: (params) => params.row.menu?.title },
  { field: "status", headerName: "Status", width: 200, valueGetter: (params) => params.row.status === 1 ? "Active" : "Inactive" },
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
    Page
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

  const [pageData, setPageData] = useState({
    title: "",
    slug: "",
    order: "",
    status: "",
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
        { id: 2, value: "InActive", subTitle: false },
      ],
    },
  ];

  useEffect(() => {
    getPageData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((page) => {
      let filterVal = filterStatus === 1 ? 1 : filterStatus === 2 ? 0 : ""
      if (filterStatus) {
        return (
          page.status === filterVal && (
            page.title.toLowerCase().includes(value?.toLowerCase()) ||
            page.short_description.toLowerCase().includes(value?.toLowerCase()) ||
            page.long_description.toLowerCase().includes(value?.toLowerCase()) ||
            page.menu.title.toLowerCase().includes(value?.toLowerCase()) ||
            page.order === parseInt(value)
          )
        )
      }
      else {
        return (
          page.title.toLowerCase().includes(value?.toLowerCase()) ||
          page.short_description.toLowerCase().includes(value?.toLowerCase()) ||
          page.long_description.toLowerCase().includes(value?.toLowerCase()) ||
          page.menu.title.toLowerCase().includes(value?.toLowerCase()) ||
          page.order === parseInt(value)
        )
      }
    });
    setRowsData(filteredData);
  }, [filterStatus, value,rows])

  const getPageData = () => {
    setLoading(true);
    getPages().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.pages)
      }
    })
  }
  const handleAddAction = () => {
    setEditMode(false);
    setPageData({})
    setOpen(true);
  };

  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };

  const deleteRecordhandler = () => {
    setOpenConfirm(false);
    deletePage(deleteId).then((res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setRows(rows.filter((page) => page.id !== deleteId))
      }
      else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  const editHandler = (id) => {
   
    setEditId(id)
    setOpen(true);
    setEditMode(true);
    const selected = rows.find((page) => page.id === id)
    setPageData({
      id: selected.id,
      title: selected.title,
      short_description: selected.short_description,
      long_description: selected.long_description,
      menu_id: selected.menu_id,
      status: selected.status,
      banners:selected.pages_banners
    })
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
        searchPlaceHolder={"Search Page"}
        filterButton={true}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add Page'
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
      <AddPage
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        getPageData={getPageData}
        editMode={editMode}
        pageData={pageData}
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