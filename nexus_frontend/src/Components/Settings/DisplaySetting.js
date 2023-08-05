import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, Card, Grid, Tab } from "@mui/material";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteSetting,
  getSetting,
  getSettings,
} from "Services/settingService";
import { exportPDF } from "utils/exportPdf";
import CommAlert from "views/CommonComponent/CommAlert";
import CommBreadCrum from "views/CommonComponent/CommBreadCrum";
import CommDialog from "views/CommonComponent/CommDialog";
import CommGrid from "views/CommonComponent/CommGrid";
import CommLoader from "../../views/CommonComponent/CommLoader";
import AddSetting from "./AddSetting";
import EmailSetting from "./EmailSetting";
import SocialSetting from "./SocialSetting";

const columns = [
  { field: "key", headerName: "Name", width: 200 },
  { field: "value", headerName: "value", width: 200 },
];

const DisplaySetting = () => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [rowsData, setRowsData] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [filterSetting, setfilterSetting] = useState("");
  const [filterSetSetting, setFilterSetSetting] = useState();
  const [rows, setRows] = useState();
  const [fetchEditData, setFetchEditData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");

  const filterOptions = [
    {
      Handler: setfilterSetting,
      value: filterSetting,
      Options: [
        { id: 1, value: "Filter", subTitle: true },
        { id: 2, value: "Value-1", subTitle: false },
        { id: 3, value: "Value-2", subTitle: false },
        { id: 4, value: "Vlaue-3", subTitle: false },
      ],
    },
  ];


  useEffect(() => {
    getData();
  }, [deleteId, setDeleteId, open, setOpen]);

  const getData = () => {
    setLoading(true);
    getSettings().then((res) => {
      setRows(
        res.data.settings?.map((item) => {
          return item;
        })
      );
      setLoading(false);
    });
  };

  useEffect(() => {
    const filters = filterOptions.map((items) => {
      return items.Options.filter((item) => {
        return item.id === filterSetting;
      });
    });
    setFilterSetSetting(filters[0][0]?.value);
  }, [filterOptions, filterSetting]);

  useEffect(() => {
    if (filterSetSetting) {
      setRowsData(
        rows.filter(
          (items) =>
            items.value
              .toLowerCase()
              .includes(filterSetSetting?.toLowerCase()) ||
            items.value.toLowerCase().includes(filterSetSetting?.toLowerCase())
        )
      );
    } else if (value) {
      setRowsData(
        rows.filter((items) =>
          items.key.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else if (filterSetSetting || value) {
      setRowsData(
        rows.filter((items) =>
          items.key.toLowerCase().includes(value?.toLowerCase())
        )
      );
    } else {
      setRowsData(rows);
    }
  }, [value, filterSetSetting, rows, open, setOpen]);

  const breadcrumbs = [
    <Link
    underline='hover'
    key='1'
    color='inherit'
    to='/'>
    Dashboard
  </Link>,
  <Link underline='hover' to='' key='2' color='text.primary' aria-current='page'>
    Settings
  </Link>,
  ];
  const generatePDF = () => {
    exportPDF(columns,rows)
  };
  const deleteHandler = (id) => {
    setOpenConfirm(true);
    setDeleteId(id);
  };

  const editHandler = (id) => {
    getSetting(id).then((res) => {
      setFetchEditData(res.data);
    });
    setOpen(true);
    setEditMode(true);
  };
  const deleteRecordhandler = () => {
    deleteSetting(deleteId).then((res) => {
      setOpenSnackbar(true);
      setSnackbarSeverity("error");
      setSnackbarMessage(res.message);
      setOpenConfirm(false);
      getData();
    });
  };
  const DeleteAllRecordInfo = () => {
  };
  const handleAddAction = () => {
    setOpen(true);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };
  const [values, setValues] = useState("1");

  const handleChange = (event, newValue) => {
    setValues(newValue);
  };
  
  return (
    <>
      {loading && <CommLoader />}
      <Grid container spacing={2}   rowSpacing={4} >
        <Grid item xs={12}>
          <CommBreadCrum breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12}>
          <Card>
          <TabContext value={values}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="lab API tabs example">
                <Tab label="General Settings" value="1" />
                <Tab label="Email Settings" value="2" />
                <Tab label="Social Links" value="3" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <CommGrid
                SearchBarDisplay={true}
                searchValue={value}
                exportButton={true}
                searchHandler={setValue}
                searchPlaceHolder={"Search Setting"}
                filterButton={false}
                importButton={false}
                generatePDF={generatePDF}
                addButton={true}
                addButtonName="Add Setting"
                addButtonAction={handleAddAction}
                tableColums={columns}
                tableRows={rowsData}
                pageSize={10}
                rowsPerPageOptions={[5, 10, 15]}
                setSelectedRows={setSelectedRows}
                // filterValue={filterValue}
                // setFilterValue={setFilterValue}
                filterOptions={filterOptions}
                filterSet={filterSetSetting}
                AllowDeleteInfo={true}
                AllowEditInfo={true}
                deleteHandler={deleteHandler}
                editHandler={editHandler}
                DeleteAllRecord={false}
                DeleteAllRecordInfo={DeleteAllRecordInfo}
              />
            </TabPanel>
            <TabPanel value="2">
              <EmailSetting/>
            </TabPanel>
            <TabPanel value="3">
              <SocialSetting/>
            </TabPanel>
          </TabContext>
          </Card>
        </Grid>
        <CommDialog
          setOpenConfirm={setOpenConfirm}
          openConfirm={openConfirm}
          deleteRecordhandler={deleteRecordhandler}
        />
        <AddSetting
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
        </Grid>
      </>
      );
};

export default DisplaySetting;
