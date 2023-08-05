import { Link } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import { useState } from "react";
import { deletePlan, getPlan, getPlans } from "Services/planService";
import CommAlert from "views/CommonComponent/CommAlert";
import CommDialog from "views/CommonComponent/CommDialog";
import CommGrid from "views/CommonComponent/CommGrid";
import CommLoader from "../../views/CommonComponent/CommLoader";
import AddPlan from "./AddPlan";

const columns = [
  { field: "planName", headerName: "Name", width: 200 },
  { field: "planPrice", headerName: "Price", width: 200 },
  { field: "description", headerName: "Description", width: 400 },
  { field: "offerBy", headerName: "Offer ", width: 200 },
  // { field: "startingDate", headerName: "Offer By", width: 200 },
  // { field: "endingDate", headerName: "Offer By", width: 200 },
];

const DisplayPlan = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterPlan, setFilterPlan] = useState("");
  const [filterSetPlan, setFilterSetPlan] = useState();
  const [rows, setRows] = useState();
  const [fetchEditData, setFetchEditData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const filterOptions = [
    {
      Handler: setFilterPlan,
      value: filterPlan,
      Options: [
        { id: 1, value: "Filter", subTitle: true },
        { id: 2, value: "Above 100$", subTitle: false },
        { id: 3, value: "Below 100$", subTitle: false },
      ],
    },
  ];
  // console.log("rows>>>", rows);
  useEffect(() => {
    getData();
  }, [deleteId, setDeleteId, open, setOpen]);

  const getData = () => {
    setLoading(true);
    getPlans()
      .then((res) => {
        setRows(
          res.data.plan?.map((item) => {
            return {
              id: item.id,
              planName: item.planName,
              planPrice: item.planPrice,
              description: item.description,
              offerBy: item.offerBy,
              startingDate: item.startingDate,
              endingDate: item.endingDate,
            };
          })
        );
        setLoading(false);
      })
      .catch((error) => {
        handleSnackbarOpen("error", error.message);
      });
  };
  useEffect(() => {
    const filters = filterOptions.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterPlan;
      });
    });
    setFilterSetPlan(filters[0][0]?.value);
  }, [filterOptions, filterPlan]);

  useEffect(() => {
    if (filterSetPlan) {
      setRowsData(
        filterSetPlan === "Above 100$"
          ? rows.filter((items) => {
              return items.planPrice > 100;
            })
          : filterSetPlan === "Below 100$" &&
              rows.filter((items) => {
                return items.planPrice < 100;
              })
      );
    } else if (value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.planName.toLowerCase().includes(value?.toLowerCase()) ||
            items.description.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetPlan || value) {
      setRowsData(
        rows.filter((items) =>
          items.planName.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else {
      setRowsData(rows);
    }
  }, [value, filterSetPlan, rows, open, setOpen]);
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Dashboard
    </Link>,
    <Link underline="hover" key="2" color="text.primary" aria-current="page">
      Plan
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
    // console.log("params.row.id", id);
    getPlan(id).then((res) => {
      console.log("edit response >>>", res.data);
      setFetchEditData(res.data);
    });
    setOpen(true);
    setEditMode(true);
  };
  const deleteRecordhandler = () => {
    deletePlan(deleteId).then((res) => {
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
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
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
        searchPlaceHolder={"Search Plan"}
        filterButton={true}
        importButton={false}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName="Add Plan"
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        setSelectedRows={setSelectedRows}
        // filterValue={filterValue}
        // setFilterValue={setFilterValue}
        filterOptions={filterOptions}
        filterSet={filterSetPlan}
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
      <AddPlan
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

export default DisplayPlan;
