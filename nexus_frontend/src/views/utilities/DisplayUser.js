import React, { useEffect, useState } from "react";
import Link from "@mui/material/Link";
import "./user.css";
import CommGrid from "../CommonComponent/CommGrid";
import AddUserData from "./AddUserData";
import JsPDF from "jspdf";
import "jspdf-autotable";
import CommDialog from "views/CommonComponent/CommDialog";
import CommLoader from "views/CommonComponent/CommLoader";
import {
  GetUserData,
  getSingleUserData,
  DeleteUserData,
  GetRoleData,
} from "Services/apiServices";
import CommAlert from "views/CommonComponent/CommAlert";

const columns = [
  { field: "first_name", headerName: "First name", width: 200 },
  { field: "last_name", headerName: "Last name", width: 150 },
  {
    field: "email",
    headerName: "Email",
    width: 150,
  },
  {
    field: "active",
    headerName: "Active",
    width: 150,
  },
  {
    field: "role_id",
    headerName: "User Role",
    width: 150,
  },
];
export default function DisplayUser() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [filterSetRole, setfilterSetRole] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  // const [filterSet, setfilterSet] = useState();
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterRole, setfilterRole] = useState("");
  const [filterStatus, setfilterStatus] = useState("");
  const [editData, seteditData] = useState("");
  const [editId, seteditId] = useState("");
  const [refreshPage, setRefreshPage] = useState(false);
  const [roleOptions, setRoleOptions] = useState([]);

  const [filterOptions, setfilterOptions] = useState([]);
  useEffect(() => {
    const roles = [];
    setLoading(true);
    GetRoleData()
      .then((res) => {
        res.data.roles.map((items, index) => {
          roles.push({
            id: items.id + 1,
            value: items.name,
            subTitle: false,
          });
        });

        setRoleOptions([...roles, { id: 1, value: "role", subTitle: true }]);
        setLoading(false);
      })
      .catch((error) => {
        handleSnackbarOpen("success", error.message);
        setLoading(false);
      });
    setfilterOptions([
      {
        Handler: setfilterRole,
        value: filterRole,
        Options: [...roles, { id: 1, value: "role", subTitle: true }],
      },
      {
        Handler: setfilterStatus,
        value: filterStatus,
        Options: [
          { id: 5, value: "Status", subTitle: true },
          { id: 6, value: "Active", subTitle: false },
          { id: 7, value: "In active", subTitle: false },
        ],
      },
    ]);
  }, [filterRole, filterStatus]);

  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  function handleClick(event) {
    event.preventDefault();
    console.info("You clicked a breadcrumb.");
  }
  const breadcrumbs = [
    <Link
      underline='hover'
      key='1'
      color='inherit'
      href='/'
      onClick={handleClick}>
      Dashboard
    </Link>,
    <Link underline='hover' key='2' color='text.primary' aria-current='page'>
      Users
    </Link>,
  ];
  const handleAddAction = () => {
    setOpen(true);
  };
  const [row, setRow] = useState([]);
  console.log("row>>>", row);
  useEffect(() => {
    setLoading(true);
    GetUserData()
      .then((res) => {
        if (res.status === false) {
          setLoading(false);
          handleSnackbarOpen("error", res.message);
        } else {
          setLoading(false);
          setRefreshPage(false);
          setRow(
            res.data.users.map((item) => {
              console.log("itemitemitemitem", item);
              return item;
            })
          );
        }
      })
      .catch((error) => {
        handleSnackbarOpen("error", error.message);
        setLoading(false);
      });
  }, [refreshPage]);

  useEffect(() => {
    const filters = filterOptions?.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterRole;
      });
    });
    setfilterSetRole(filters?.[0]?.[0]?.value);
  }, [filterOptions, filterRole, filterStatus]);
  useEffect(() => {
    if (filterSetRole) {
      setRowsData(
        row.filter(
          (items) =>
            items.active.toLowerCase().includes(filterSetRole?.toLowerCase()) ||
            items.UserRole.toLowerCase().includes(filterSetRole?.toLowerCase())
        )
      );
    } else if (value) {
      setRowsData(
        row.filter(
          (items) =>
            items.first_name.toLowerCase().includes(value?.toLowerCase()) ||
            items.last_name.toLowerCase().includes(value?.toLowerCase()) ||
            items.email.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetRole || value) {
      console.log("first 3");
      setRowsData(
        row.filter(
          (items) =>
            items.first_name.toLowerCase().includes(value?.toLowerCase()) ||
            items.last_name.toLowerCase().includes(value?.toLowerCase()) ||
            items.email.toLowerCase().includes(value?.toLowerCase()) ||
            items.active.toLowerCase().includes(filterSetRole?.toLowerCase())
        )
      );
    } else {
      setRowsData(row);
    }
  }, [value, filterSetRole, row]);
  const generatePDF = () => {
    const columnsPdf = columns.map((items) => {
      return {
        title: items.headerName,
        field: items.field,
      };
    });
    const doc = new JsPDF();

    doc.autoTable({
      theme: "grid",
      columns: columnsPdf.map((col) => ({ ...col, dataKey: col.field })),
      body: row,
    });
    doc.save("table.pdf");
  };
  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };
  const editHandler = (id) => {
    console.log("params.row.id", id);
    seteditId(id);
    setLoading(true);
    getSingleUserData(id)
      .then((result) => {
        if (result.status === true) {
          setLoading(false);
          seteditData(result.data);
          setOpen(true);
          setEditMode(true);
        } else {
          handleSnackbarOpen("error", result.message);
          setLoading(false);
        }
      })
      .catch((error) => {
        handleSnackbarOpen("error", error.message);
        setLoading(false);
        console.log("errorerrorerrorerror", error);
      });
  };
  const deleteRecordhandler = () => {
    DeleteUserData(deleteId)
      .then((res) => {
        if (res.status === false) {
          handleSnackbarOpen("error", res.message);
          setLoading(false);
          setOpenConfirm(false);
        } else {
          setRefreshPage(true);
          handleSnackbarOpen("success", res.message);
          setLoading(false);
          setOpenConfirm(false);
        }
      })
      .catch((error) => {
        setOpenConfirm(false);
        handleSnackbarOpen("error", error.message);
        setLoading(false);
      });
  };
  const DeleteAllRecordInfo = () => {
    console.log("selectedRowsselectedRows", selectedRows);
  };

  return (
    <>
      {loading && <CommLoader />}
      <CommGrid
        breadcrumbsData={breadcrumbs}
        SearchBarDisplay={true}
        searchValue={value}
        searchHandler={setValue}
        searchPlaceHolder={"Search User"}
        filterButton={true}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName='Add user'
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        setSelectedRows={setSelectedRows}
        // filterValue={filterValue}
        // setFilterValue={setFilterValue}
        filterOptions={filterOptions}
        filterSet={filterSetRole}
        AllowDeleteInfo={true}
        AllowEditInfo={true}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        DeleteAllRecord={true}
        DeleteAllRecordInfo={DeleteAllRecordInfo}
      />
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <AddUserData
        open={open}
        setOpen={setOpen}
        editMode={editMode}
        setEditMode={setEditMode}
        editData={editData}
        editId={editId}
        setRefreshPage={setRefreshPage}
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
