import React, { useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import Grid from "@mui/material/Grid";
import CommButton from "./CommButton";
import CommBreadCrum from "./CommBreadCrum";
import SearchBar from "./SearchBar";
import DropDown from "./DropDown";
import DeleteIcon from "@mui/icons-material/Delete";
import ModeEditIcon from "@mui/icons-material/ModeEdit";
import { checkPermissions } from "utils/checkPermissions";
import { useLocation } from "react-router";
import { useSelector } from "react-redux";
import CommDatePicker from "./CommDatePicker";
import dayjs from "dayjs";
import { Switch, Tooltip } from "@mui/material";

export default function CommGrid({
  breadcrumbsData = [],
  SearchBarDisplay = false,
  searchValue,
  searchHandler,
  searchPlaceHolder,
  filterButton = false,
  importButton = false,
  exportButton = false,
  generatePDF = false,
  addButton = false,
  addButtonName,
  addButtonAction,
  tableColums = [],
  tableRows = [],
  pageSize,
  rowsPerPageOptions,
  setSelectedRows,
  filterOptions,
  filterSet,
  AllowDeleteInfo = false,
  AllowEditInfo = false,
  deleteHandler,
  editHandler,
  DeleteAllRecord = false,
  DeleteAllRecordInfo,
  setSetFilterStartdate,
  setSetFilterEnddate,
  showDatePicker,
  blockCustomer,
  AllowBlockSwitch,
}) {
  const [writePermission, setWritePermission] = useState(false);
  const [executePermission, setExecutePermission] = useState(false);
  const [pageLength, setPageLength] = useState(pageSize);
  const { pathname } = useLocation();
  const { moduleList } = useSelector((state) => state.module);

  const [checked, setChecked] = useState(false);

  useState(() => {
    setWritePermission(checkPermissions(pathname, "write", moduleList));
    setExecutePermission(checkPermissions(pathname, "execute", moduleList));
  }, []);

  const handleSwitchChanege = (index, event, checked) => {
    blockCustomer({ id: event.target.value, data: checked });
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CommBreadCrum breadcrumbs={breadcrumbsData} />
        </Grid>
        <Grid item xs={12}>
          <div className="action-main-div">
            <div className="action-search-div">
              {SearchBarDisplay && (
                <SearchBar
                  value={searchValue}
                  setValue={searchHandler}
                  placeHolder={searchPlaceHolder}
                />
              )}

              {filterButton &&
                filterOptions &&
                filterOptions.length > 0 &&
                filterOptions.map((items, i) => {
                  return (
                    <div key={i}>
                      <DropDown
                        filterValue={items.value}
                        setFilterValue={items.Handler}
                        filterOptions={items.Options}
                        filterSet={filterSet}
                      />
                    </div>
                  );
                })}

              {showDatePicker && (
                <>
                  <CommDatePicker
                    setSetDateValue={setSetFilterStartdate}
                    label="Start Date"
                    initialDate={dayjs("2023-01-01T21:11:54")}
                  />
                  <CommDatePicker
                    setSetDateValue={setSetFilterEnddate}
                    label="End Date"
                    initialDate={dayjs("2023-12-31T21:11:54")}
                  />
                </>
              )}
            </div>
            <div className="button-group-main">
              {importButton && (
                <div>
                  <CommButton title="Import" />
                </div>
              )}
              {DeleteAllRecord && executePermission && (
                <div>
                  <CommButton
                    title="Delete All User"
                    handleClick={DeleteAllRecordInfo}
                  />
                </div>
              )}
              {exportButton && (
                <div>
                  <CommButton title="Export" handleClick={generatePDF} />
                </div>
              )}
              {addButton && writePermission && (
                <div>
                  <CommButton
                    title={addButtonName}
                    handleClick={addButtonAction}
                  />
                </div>
              )}
            </div>
          </div>
        </Grid>
        <div style={{ height: 400, width: "100%" }} className="data-grid-main">
          <DataGrid
            rows={tableRows}
            columns={
              (AllowEditInfo === true || AllowDeleteInfo === true) &&
              (writePermission || executePermission)
                ? [
                    ...tableColums,
                    {
                      field: "Action",
                      headerName: "Action",
                      width: 140,
                      renderCell: (params) => {
                        // console.log('renderCell>>',params)
                        return (
                          <>
                            {AllowDeleteInfo && executePermission && (
                              <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                              >
                                <Tooltip
                                  title="Delete"
                                  placement="bottom-start"
                                >
                                  <DeleteIcon
                                    index={params.row.id}
                                    onClick={() => deleteHandler(params.row.id)}
                                    style={{ marginRight: "10px" }}
                                  />
                                </Tooltip>
                              </div>
                            )}
                            {AllowDeleteInfo &&
                              executePermission &&
                              AllowEditInfo &&
                              writePermission &&
                              "|"}

                            {AllowEditInfo && writePermission && (
                              <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                              >
                                <Tooltip title="Edit" placement="bottom-start">
                                  <ModeEditIcon
                                    style={{ marginLeft: "10px" }}
                                    index={params.row.id}
                                    onClick={() => editHandler(params.row.id)}
                                  />
                                </Tooltip>
                              </div>
                            )}
                            {AllowBlockSwitch && writePermission && (
                              <div
                                className="d-flex justify-content-between align-items-center"
                                style={{ cursor: "pointer" }}
                              >
                                {tableRows.map((item, index) => (
                                  <Tooltip
                                    title="Block"
                                    placement="bottom-start"
                                  >
                                    <Switch
                                      checked={checked[index]}
                                      key={index}
                                      value={params.row.id}
                                      onChange={(event, checked) =>
                                        handleSwitchChanege(
                                          index,
                                          event,
                                          checked
                                        )
                                      }
                                    />
                                  </Tooltip>
                                ))}
                              </div>
                            )}
                          </>
                        );
                      },
                    },
                  ]
                : tableColums
            }
            pageSize={pageLength}
            rowsPerPageOptions={rowsPerPageOptions}
            checkboxSelection
            onPageSizeChange={(page) => {
              setPageLength(page);
            }}
            onSelectionModelChange={(ids) => {
              const selectedIDs = new Set(ids);
              const selectedRows = tableRows.filter((row) =>
                selectedIDs.has(row.id)
              );
              setSelectedRows(selectedRows);
            }}
          />
        </div>
      </Grid>
    </>
  );
}
