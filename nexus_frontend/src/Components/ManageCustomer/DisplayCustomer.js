import React from "react";
//
import { Link } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import { useState } from "react";

import CommAlert from "views/CommonComponent/CommAlert";
import CommDialog from "views/CommonComponent/CommDialog";
import CommGrid from "views/CommonComponent/CommGrid";
import CommLoader from "../../views/CommonComponent/CommLoader";
import AddCustomer from "./AddCustomer";
import {
  deleteCustomer,
  getCustomer,
  getCustomers,
  updateBlockCustomer,
} from "Services/customerService";

const columns = [
  { field: "firstName", headerName: "First Name", width: 200 },
  { field: "lastName", headerName: "Last Name", width: 400 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "phone", headerName: "Phone", width: 200 },
  { field: "isBlock", headerName: "Is Block", width: 200 },
];

const DisplayCustomer = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterCustomer, setFilterCustomer] = useState("");
  const [filterSetCustomer, setFilterSetCustomer] = useState();
  const [rows, setRows] = useState();
  const [fetchEditData, setFetchEditData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");


  const filterOptions = [
    {
      Handler: setFilterCustomer,
      value: filterCustomer,
      Options: [
        { id: 1, value: "Filter", subTitle: true },
        { id: 2, value: "Above 50$", subTitle: false },
      ],
    },
  ];

  useEffect(() => {
    getData();
  }, [deleteId, setDeleteId, open, setOpen]);

  const getData = () => {
    setLoading(true);
    getCustomers().then((res) => {
      setRows(
        res.data.customer?.map((item) => {
          return {
            id: item.id,
            firstName: item.firstName,
            lastName: item.lastName,
            email: item.email,
            phone: item.phone,
            isBlock: item.isBlock,
          };
        })
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    const filters = filterOptions.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterCustomer;
      });
    });
    // console.log("filterRolefilterRolefilterRole", filters[0][0], filterCustomer);
    setFilterSetCustomer(filters[0][0]?.value);
  }, [filterOptions, filterCustomer]);

  useEffect(() => {
    if (filterSetCustomer) {
      setRowsData(rows.filter((items) => {}));
    } else if (value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.firstName.toLowerCase().includes(value?.toLowerCase()) ||
            items.lastName.toLowerCase().includes(value?.toLowerCase()) ||
            items.email.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetCustomer || value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.firstName.toLowerCase().includes(value?.toLowerCase()) ||
            items.lastName.toLowerCase().includes(value?.toLowerCase()) ||
            items.email.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else {
      setRowsData(rows);
    }
  }, [value, filterSetCustomer, rows, open, setOpen]);
  const breadcrumbs = [
    <Link
      underline="hover"
      key="1"
      color="inherit"
      href="/"
      // onClick={handleClick}
    >
      Dashboard
    </Link>,
    <Link underline="hover" key="2" color="text.primary" aria-current="page">
      Manage Customer
    </Link>,
  ];
  const generatePDF = () => {
    const columnsPdf = columns.map((items) => {
      return {
        title: items.headerName,
        field: items.field,
      };
    });
    const doc = new jsPDF();
    doc.autoTable({
      theme: "grid",
      columns: columnsPdf.map((col) => ({ ...col, dataKey: col.field })),
      body: rows,
    });
    doc.save("table.pdf");
  };
  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };

  const editHandler = (id) => {
    getCustomer(id).then((res) => {
      console.log("edit response >>>", res.data);
      setFetchEditData(res.data);
    });
    setOpen(true);
    setEditMode(true);
  };

  const blockCustomer = ({id,data}) => {
    updateBlockCustomer({id: id, data:{isBlock: data}})
      .then((res) => {
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(res.message);
        getData();
      })
      .catch((error) => {
        setOpenSnackbar(true);
        setSnackbarSeverity("success");
        setSnackbarMessage(error.message);
        getData();
      });
  };

  const deleteRecordhandler = () => {
    deleteCustomer(deleteId).then((res) => {
      console.log("Delete Response >>>>", res);
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(res.message);
      setOpenConfirm(false);
      getData();
    });
  };
  const DeleteAllRecordInfo = () => {
    console.log("selectedRowsselectedRows", selectedRows);
  };
  const handleAddAction = () => {
    setOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  return (
    <>
      {loading && <CommLoader />}
      <CommGrid
        breadcrumbsData={breadcrumbs}
        SearchBarDisplay={true}
        searchValue={value}
        exportButton={true}
        searchHandler={setValue}
        searchPlaceHolder={"Search Customer"}
        filterButton={false}
        importButton={false}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName="Add Customer"
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        setSelectedRows={setSelectedRows}
        // filterValue={filterValue}
        // setFilterValue={setFilterValue}
        AllowSwitch={true}
        filterOptions={filterOptions}
        filterSet={filterSetCustomer}
        AllowDeleteInfo={true}
        AllowEditInfo={true}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        DeleteAllRecord={false}
        AllowBlockSwitch={true}
        DeleteAllRecordInfo={DeleteAllRecordInfo}
        blockCustomer={blockCustomer}
      />
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <AddCustomer
        open={open}
        setOpen={setOpen}
        editMode={editMode}
        setEditMode={setEditMode}
        fetchEditData={fetchEditData}
        getData={getData}
      />
      <CommAlert
        message={snackbarMessage}
        severity={snackbarSeverity}
        autoHideDuration={10000}
        open={openSnackbar}
        handleSnackbarClose={handleSnackbarClose}
        position="Top-Right"
      />
    </>
  );
};

export default DisplayCustomer;
