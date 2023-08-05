import React, { useEffect, useState } from "react";
import CommLoader from "../../CommonComponent/CommLoader";
import CommGrid from "../../CommonComponent/CommGrid";
import { Link } from "react-router-dom";
import { getAllContacts } from "Services/contactServices";
import { exportPDF } from "utils/exportPdf";
import moment from "moment";

const columns = [
  { field: "first_name", headerName: "First Name", width: 150 },
  { field: "last_name", headerName: "Last Name", width: 150 },
  { field: "email", headerName: "Email", width: 150  },
  { field: "phone", headerName: "Phone", width: 150 },
  { field: "message", headerName: "Message", width: 300 },
  { field: "createdAt", headerName: "Created at", width: 200 ,valueGetter: (params) => moment(params.row.createdAt).format('DD-MM-YYYY HH:mm')},
  { field: "updatedAt", headerName: "Updated at", width: 200 ,valueGetter: (params) => moment(params.row.createdAt).format('DD-MM-YYYY HH:mm')},
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
    Contacts
  </Link>,
];

export default function List() {
  const [value, setValue] = useState("");
  const [rows, setRows] = useState([]);
  const [rowsData, setRowsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const setSelectedRows=()=>{
  }
  useEffect(() => {
    getContactData()
  }, [])
  
  useEffect(() => {
    const filteredData = JSON.parse(JSON.stringify(rows)).filter((contact) => {
      return (
        contact.first_name?.toLowerCase().includes(value?.toLowerCase()) ||
        contact.last_name?.toLowerCase().includes(value?.toLowerCase()) ||
        contact.email?.toLowerCase().includes(value?.toLowerCase()) ||
        contact.phone?.toLowerCase().includes(value?.toLowerCase()) ||
        contact.message?.toLowerCase().includes(value?.toLowerCase())
      )
    });
    setRowsData(filteredData);
  }, [value,rows]);

  useEffect(() => {
    setRowsData(rows)
  }, [rows])

  const getContactData = () => {
    setLoading(true);
    getAllContacts().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setRows(data.data.contacts)
      }
    })
  }

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
        searchPlaceHolder={"Search Contacts"}
        filterButton={false}
        importButton={false}
        exportButton={true}
        generatePDF={generatePDF}
        addButton={false}
        tableColums={columns}
        tableRows={rowsData}
        pageSize={5}
        rowsPerPageOptions={[5, 10, 15]}
        AllowDeleteInfo={false}
        AllowEditInfo={false}
        DeleteAllRecord={false}
        setSelectedRows={setSelectedRows}
      />
    </>
  );
}