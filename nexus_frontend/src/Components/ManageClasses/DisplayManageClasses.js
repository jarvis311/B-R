import { Link } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import { useState } from "react";
import {
  deleteClasses,
  getAllClasses,
  getClasses,
} from "Services/manageClassesService";
import CommAlert from "views/CommonComponent/CommAlert";
import CommDialog from "views/CommonComponent/CommDialog";
import CommGrid from "views/CommonComponent/CommGrid";
import CommLoader from "../../views/CommonComponent/CommLoader";
import AddManageClasses from "./AddManageClasses";

const columns = [
  { field: "eventName", headerName: "Event Name", width: 200 },
  { field: "Description", headerName: "Description", width: 400 },
  { field: "type", headerName: "Type", width: 200 },
];

const DisplayManageClasses = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterClasses, setFilterClasses] = useState("");
  const [filterSetClasses, setFilterSetClasses] = useState();
  const [rows, setRows] = useState();
  const [fetchEditData, setFetchEditData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const filterOptions = [
    {
      Handler: setFilterClasses,
      value: filterClasses,
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
    getAllClasses().then((res) => {
      setRows(
        res.data.classesData?.map((item) => {
          return {
            id: item.id,
            eventName: item.eventName,
            Description: item.Description,
            type: item.type,
            isplan: item.isplan,
          };
        })
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    const filters = filterOptions.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterClasses;
      });
    });
    // console.log("filterRolefilterRolefilterRole", filters[0][0], filterClasses);
    setFilterSetClasses(filters[0][0]?.value);
  }, [filterOptions, filterClasses]);

  useEffect(() => {
    if (filterSetClasses) {
      setRowsData(rows.filter((items) => {}));
    } else if (value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.eventName.toLowerCase().includes(value?.toLowerCase()) ||
            items.type.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetClasses || value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.eventName.toLowerCase().includes(value?.toLowerCase()) ||
            items.type.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else {
      setRowsData(rows);
    }
  }, [value, filterSetClasses, rows, open, setOpen]);
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
      Classes
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
    getClasses(id).then((res) => {
      console.log("edit response >>>", res.data);
      setFetchEditData(res.data);
    });
    setOpen(true);
    setEditMode(true);
  };
  const deleteRecordhandler = () => {
    deleteClasses(deleteId).then((res) => {
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
        searchPlaceHolder={"Search Class"}
        filterButton={false}
        importButton={false}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName="Add Class"
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        setSelectedRows={setSelectedRows}
        // filterValue={filterValue}
        // setFilterValue={setFilterValue}
        filterOptions={filterOptions}
        filterSet={filterSetClasses}
        AllowDeleteInfo={true}
        AllowEditInfo={true}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        DeleteAllRecord={false}
        DeleteAllRecordInfo={DeleteAllRecordInfo}
      />
      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <AddManageClasses
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

export default DisplayManageClasses;
