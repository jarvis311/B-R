import React, { useEffect, useState } from "react";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link } from "react-router-dom";
import { getAllNewsLetters } from "Services/contactServices";
import { exportPDF } from "utils/exportPdf";
import moment from "moment";
import SendMail from "./SendMail";

const columns = [
  { field: "name", headerName: "Name", width: 200 },
  { field: "email", headerName: "Email", width: 200 },
  { field: "createdAt", headerName: "Created at", width: 200, valueGetter: (params) => moment(params.row.createdAt).format('DD-MM-YYYY HH:mm') },
  { field: "updatedAt", headerName: "Updated at", width: 200, valueGetter: (params) => moment(params.row.createdAt).format('DD-MM-YYYY HH:mm') },
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
    NewsLetter
  </Link>,
];

export default function List() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    getNewsLetterData()
  }, [])

  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((row) => {
      return (
        row.name?.toLowerCase().includes(value?.toLowerCase()) ||
        row.email?.toLowerCase().includes(value?.toLowerCase())
      )
    });
    setRowsData(filteredData);
  }, [value, rows]);

  useEffect(() => {
    setRowsData(rows)
  }, [rows])

  const getNewsLetterData = () => {
    setLoading(true);
    getAllNewsLetters().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.newsletters)
      }
    })
  }

  const generatePDF = () => {
    exportPDF(columns, rowsData);
  };

  const handleAddAction = () => {
    setOpen(true)
  }

  return (
    <>
      {loading && <CommLoader />}
      <CommGrid
        breadcrumbsData={breadcrumbs}
        SearchBarDisplay={true}
        searchValue={value}
        searchHandler={setValue}
        searchPlaceHolder={"Search"}
        filterButton={false}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={true}
        addButtonName={"Send Mail"}
        addButtonAction={handleAddAction}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        AllowDeleteInfo={false}
        AllowEditInfo={false}
        DeleteAllRecord={false}
        setSelectedRows={setSelectedRows}
      />
      <SendMail
        open={open}
        setOpen={setOpen}
        selectedRows={selectedRows}
      />
    </>
  );
}