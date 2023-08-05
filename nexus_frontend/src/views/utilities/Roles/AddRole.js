import React, { useEffect, useState } from 'react'
import { Card, CardActions, CardContent, CardHeader, Checkbox, Divider, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import CommButton from 'views/CommonComponent/CommButton';
import "../user.css";
import { useNavigate, useParams } from 'react-router';
import { addRole, getModuleRoles, getRoleDetail, updateRole } from 'Services/roleServices';
import CommLoader from "../../CommonComponent/CommLoader";
import CommTextField from 'views/CommonComponent/CommTextField';
import { useFormik } from 'formik';
import * as Yup from "yup";
import CommAlert from 'views/CommonComponent/CommAlert';
import CommBreadCrum from 'views/CommonComponent/CommBreadCrum';
import { Link } from 'react-router-dom';
import { getModulesList } from 'Services/moduleServices';
import { SUCCESS } from 'store/actions';
import { useDispatch } from 'react-redux';

const headerSX = {
  '& .MuiCardHeader-action': { mr: 0 }
};

const AddRole = ({ editMode }) => {
  const params = useParams();
  const [loading, setLoading] = useState(false);
  const [moduleRoleData, setModuleRoleData] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const handleSnackbarOpen = (severity, message) => {
    setOpenSnackbar(true);
    setSnackbarSeverity(severity);
    setSnackbarMessage(message);
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") return;
    setOpenSnackbar(false);
  };


  const getModuleData = () => {
    setLoading(true);
    getModuleRoles().then((data) => {
      setLoading(false);
      if (data && data.data) {
        setModuleRoleData(
          data.data
        )
      }
    })
  }

  const validationSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
  });
  const dispatch = useDispatch();
  const formik = useFormik({
    initialValues: {
      name: "",
      permissions: []
    },
    onSubmit: (values) => {
      setLoading(true)
      if (editMode) {
        updateRole(params.id, values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            updateModule();
            handleSnackbarOpen("success", res?.message);
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          handleSnackbarOpen("error", err?.message);
        })
      }
      else {
        addRole(values).then((res) => {
          setLoading(false);
          if (res && res.status === true) {
            updateModule();
            handleSnackbarOpen("success", res?.message);
            formik.resetForm();
          }
          else {
            handleSnackbarOpen("error", res?.message);
          }
        }).catch((err) => {
          handleSnackbarOpen("error", err?.message);
        })
      }
    },
    validationSchema,
  });
  const updateModule = (value) => {
    getModulesList().then(res => {
      if (res && res.data) {
          dispatch({ type: SUCCESS, payload: res.data });
      }
  })
  }
  const handleChange = (value) => {
    const currentIndex = formik.values.permissions.indexOf(value);
    const newChecked = [...formik.values.permissions];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    formik.setFieldValue(
      'permissions',
      newChecked,
    );
  };

  useEffect(() => {
    if (editMode && params.id) {
      getRoleDetail(params.id).then(res => {
        if (res.status === true && res.data) {
          formik.setValues({ name: res.data.name, permissions: res.data?.user_modules_role ? res.data?.user_modules_role : [] });
        }
      })
    }
    getModuleData();
  }, [])

  const navigate = useNavigate();
  const handleCancel = () => {
    navigate("/roles")
  }

  const breadcrumbs = [
    <Link
      underline='hover'
      key='1'
      color='inherit'
      to='/'>
      Dashboard
    </Link>,
    <Link underline='hover' to='/roles' key='2' color='text.primary' aria-current='page'>
      Role
    </Link>,
    <Link underline='hover' to='' key='2' color='text.primary' aria-current='page'>
      {editMode ? "Edit Role" : "Add Role"}
    </Link>
  ];

  return (
    <>
      {loading && <CommLoader />}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <CommBreadCrum breadcrumbs={breadcrumbs} />
        </Grid>
        <Grid item xs={12}>
          <Card title="">
            <form onSubmit={formik.handleSubmit}>
              <CardHeader sx={headerSX} title={<Typography variant="h3">{editMode ? "Edit Role" : "Add Role"}</Typography>} />
              <Divider />

              <CardContent>
                <Grid
                >
                  <Grid container >
                    <Grid item xs={2} sm={12} md={2} >
                      <Typography variant='h5' p={1}>Name</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={4}  >
                      <CommTextField
                        value={formik.values.name}
                        setValue={formik.handleChange}
                        type='text'
                        errorClass={
                          formik.touched.name && Boolean(formik.errors.name)
                        }
                        helperText={
                          formik.touched.name && formik.errors.name
                        }
                        name='name'
                      />
                    </Grid>
                  </Grid>

                  <Typography variant='h4' my={2} p={1}>Permissions</Typography>
                  <TableContainer component={Paper}>
                    <Table sx={{ width: 500 }} aria-label="simple table">
                      <TableHead>
                        <TableRow>
                          <TableCell>Modules</TableCell>
                          <TableCell align="right">Read</TableCell>
                          <TableCell align="right">Write</TableCell>
                          <TableCell align="right">Execute</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                          moduleRoleData && moduleRoleData.map((row) => (
                            <TableRow
                              key={row.index}
                              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                              <TableCell component="th" scope="row">
                                {row.name}
                              </TableCell>
                              {row.modules_roles && row.modules_roles.map((role) => (
                                <TableCell align="right" key={role.id}>
                                  <Checkbox
                                    checked={formik.values.permissions.indexOf(role.id) > -1}
                                    onChange={() => handleChange(role.id)}
                                    name='checked'
                                    color='primary'
                                  />
                                </TableCell>
                              ))}

                            </TableRow>
                          ))
                        }

                      </TableBody>
                    </Table>
                  </TableContainer>
                </Grid>

              </CardContent>
              <Divider />
              <CardActions>
                <CommButton
                  title={editMode ? "Update" : "Save"}
                  type='submit'
                />
                <CommButton title='Cancel' handleClick={handleCancel} />
              </CardActions>
            </form>
          </Card>
          <CommAlert
            message={snackbarMessage}
            severity={snackbarSeverity}
            autoHideDuration={10000}
            open={openSnackbar}
            handleSnackbarClose={handleSnackbarClose}
            position='Top-Right'
          />
        </Grid>
      </Grid>
    </>
  )
}

export default AddRole