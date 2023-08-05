import React, { useEffect, useState } from "react";
import "../user.css";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link } from "react-router-dom";
import { deleteMenu, getMenus } from "Services/menuServices";
import CommDialog from "views/CommonComponent/CommDialog";
import AddMenu from "./AddMenu";
import CommAlert from "views/CommonComponent/CommAlert";
import { exportPDF } from "utils/exportPdf";
const columns = [
  { field: "title", headerName: "Title", width: 400 },
  { field: "slug", headerName: "Slug", width: 400 },
  { field: "status", headerName: "Status", width: 200 ,valueGetter: (params) => params.row.status===1?"Active":"Inactive"},
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
    Menu
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

  const [menuData, setMenuData] = useState({
    title: "",
    slug: "",
    order: "",
    status: "",
    menu_id: ""
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
    getMenuData()
  }, [])

  useEffect(() => {
   
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((menu) => {
      let filterVal = filterStatus === 1 ? 1 : filterStatus === 2 ? 0 : ""
      if (filterStatus) {
        return (
          menu.status === filterVal && (
            menu.title.toLowerCase().includes(value?.toLowerCase()) ||
            menu.slug.toLowerCase().includes(value?.toLowerCase()) ||
            menu.order === parseInt(value)
          )
        )
      }
      else {
        return (
          menu.title.toLowerCase().includes(value?.toLowerCase()) ||
          menu.slug.toLowerCase().includes(value?.toLowerCase()) ||
          menu.order === parseInt(value)
        )
      }
    });
    setRowsData(filteredData);
  }, [filterStatus, value,rows])

  const getMenuData = () => {
    setLoading(true);
    getMenus().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.menus)
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
    deleteMenu(deleteId).then((res) => {
      if (res && res.status === true) {
        handleSnackbarOpen("success", res.message);
        setRows(rows.filter((menu) => menu.id !== deleteId))
      } else {
        handleSnackbarOpen("error", res?.message);
      }
    }).catch((err) => {
      handleSnackbarOpen("error", err?.message);
    })
  };

  const editHandler = (id) => {
    const selected = rows.find((menu) => menu.id === id)
    setEditId(id)
    setOpen(true);
    setEditMode(true);
    setMenuData({
      id: selected.id,
      title: selected.title,
      slug: selected.slug,
      order: selected.order,
      status: selected.status,
      menu_id: selected.menu_id ? selected.menu_id : ''
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
        searchPlaceHolder={"Search Menu"}
        filterButton={true}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add Menu'
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
      <AddMenu
        open={open}
        setOpen={setOpen}
        setLoading={setLoading}
        getMenuData={getMenuData}
        editMode={editMode}
        menuData={menuData}
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