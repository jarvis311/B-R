import { Link } from "@mui/material";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useEffect } from "react";
import { useState } from "react";
import { getAllClasses } from "Services/manageClassesService";
import {
  deleteSchedule,
  getSchedule,
  getSchedules,
} from "Services/scheduleService";

import CommAlert from "views/CommonComponent/CommAlert";
import CommDialog from "views/CommonComponent/CommDialog";
import CommGrid from "views/CommonComponent/CommGrid";
import CommLoader from "../../views/CommonComponent/CommLoader";
import AddSchedule from "./AddSchedule";
import moment from "moment";
import dayjs from "dayjs";

const columns = [
  { field: "className", headerName: "Class Name", width: 200 },
  { field: "startDate", headerName: "Start Date", width: 200 },
  { field: "endDate", headerName: "End Date", width: 200 },
  { field: "startTime", headerName: "Start Time", width: 200 },
  { field: "endTime", headerName: "Start Date", width: 200 },
  { field: "isRepeat", headerName: "Is Repeat", width: 200 },
  { field: "day", headerName: "Day", width: 200 },
];

const DisplaySchedules = () => {
  const [selectedRows, setSelectedRows] = useState([
    { id: 1, value: "Filter", subTitle: true },
  ]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterSchedule, setFilterSchedule] = useState("");
  const [filterSetSchedule, setFilterSetSchedule] = useState("");
  const [rows, setRows] = useState();
  const [fetchEditData, setFetchEditData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [eventOptios, setEventOptios] = useState("");
  const [setFilterStartdate, setSetFilterStartdate] = useState("2023-01-01");
  const [setFilterEnddate, setSetFilterEnddate] = useState("2023-12-31");

  const getEvent = () => {
    getAllClasses().then((res) => {
      setEventOptios(
        res.data.classesData?.map((item) => {
          return {
            id: item.id,
            value: item.eventName,
            subTitle: false,
          };
        })
      );
    });
  };
  const filterOptions = [
    {
      Handler: setFilterSchedule,
      value: filterSchedule,
      Options: [
        { id: 0, value: "Select Class", subTitle: true },
        ...eventOptios,
      ],
    },
  ];

  useEffect(() => {
    getData();
    getEvent();
  }, [deleteId, setDeleteId, open, setOpen]);

  const getData = () => {
    setLoading(true);
    getSchedules().then((res) => {
      setRows(
        res.data.schedules?.map((item) => {
          return {
            id: item.id,
            startDate: item.startDate.split("T")[0],
            endDate: item.endDate.split("T")[0],
            startTime: item.startTime,
            className: item.manageClass.eventName,
            endTime: item.startTime,
            isRepeat:
              (item.isRepeat === true && "Yes") ||
              (item.isRepeat === false && "No"),
            day:
              (item.day === 1 && "Monday") ||
              (item.day === 2 && "Tuesday") ||
              (item.day === 3 && "Wedesday") ||
              (item.day === 4 && "Thurday") ||
              (item.day === 5 && "Friday") ||
              (item.day === 6 && "Saturday") ||
              (item.day === 7 && "Sunday") ||
              (!item.day && "-"),
          };
        })
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    const filters = filterOptions.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterSchedule;
      });
    });
    setFilterSetSchedule(filters[0][0]?.value);
  }, [filterOptions, filterSchedule]);

  useEffect(() => {
    if (filterSetSchedule && setFilterStartdate && setFilterEnddate) {
      setRowsData(
        rows?.filter(
          (items) =>
            items.startDate >
              moment(setFilterStartdate).format().split("T")[0] &&
            items.endDate < moment(setFilterEnddate).format().split("T")[0] &&
            items.className.includes(filterSetSchedule)
        )
      );
    } else if (filterSetSchedule) {
      setRowsData(
        rows?.filter((items) => items.className.includes(filterSetSchedule))
      );
    } else if (value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.startDate.toLowerCase().includes(value?.toLowerCase()) ||
            items.endDate.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetSchedule || value) {
      setRowsData(
        rows.filter(
          (items) =>
            items.startDate.toLowerCase().includes(value?.toLowerCase()) ||
            items.endDate.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else {
      setRowsData(rows);
    }
  }, [value, filterSetSchedule, rows, open, setOpen]);
  const breadcrumbs = [
    <Link underline="hover" key="1" color="inherit" href="/">
      Dashboard
    </Link>,
    <Link underline="hover" key="2" color="text.primary" aria-current="page">
      Schedule
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
    getSchedule(id).then((res) => {
      console.log("edit response >>>", res.data);
      setFetchEditData(res.data);
    });
    setOpen(true);
    setEditMode(true);
  };
  const deleteRecordhandler = () => {
    deleteSchedule(deleteId).then((res) => {
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
        SearchBarDisplay={false}
        searchValue={value}
        exportButton={true}
        searchHandler={setValue}
        searchPlaceHolder={"Search Schedule"}
        filterButton={true}
        importButton={false}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName="Add Schedule"
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        setSelectedRows={setSelectedRows}
        filterOptions={filterOptions}
        filterSet={filterSetSchedule}
        AllowDeleteInfo={true}
        AllowEditInfo={true}
        deleteHandler={deleteHandler}
        editHandler={editHandler}
        DeleteAllRecord={false}
        DeleteAllRecordInfo={DeleteAllRecordInfo}
        setSetFilterStartdate={setSetFilterStartdate}
        setSetFilterEnddate={setSetFilterEnddate}
        showDatePicker={true}
      />

      <CommDialog
        setOpenConfirm={setOpenConfirm}
        openConfirm={openConfirm}
        deleteRecordhandler={deleteRecordhandler}
      />
      <AddSchedule
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

export default DisplaySchedules;
