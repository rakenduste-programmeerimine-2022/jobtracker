import "primeicons/primeicons.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.css"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Input,
  Select,
  Snackbar,
  useSnackbar,
} from "@mui/material"
import React, { useContext, useEffect, useRef, useState } from "react"
import axios from "../../api/axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"
import { Button as Primebutton } from "primereact/button"
import { DropDownInput } from "../controls/Input"
import { useParams } from "react-router-dom"
import { SettingsPowerRounded } from "@mui/icons-material"
import MuiAlert from "@mui/material/Alert"
import ServiceContext from "../../contexts/ServiceContext"

const SERVICE_URL = "/api/services/"
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function ServiceTable() {
  const [contextData, setcontextData] = useContext(ServiceContext)
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [tableData, setData] = useState([])
  const [deletableData, setDeletableData] = useState()
  const [deleteDataDialog, setDeleteDataDialog] = useState(false)

  const fetchData = async () => {
    const response = await axios.get(SERVICE_URL)
    setData(response.data)
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
    setDeleteOpen(false)
    setDeleteDataDialog(false)
  }

  useEffect(() => {
    if (contextData !== "") {
      tableData.push(contextData)
      console.log("useEffect called")
    }
  }, [contextData])

  useEffect(() => {
    fetchData()
  }, [])

  const handleEditService = async (updatedService) => {
    try {
      const UPDATE_URL = SERVICE_URL + "/" + updatedService.newData._id
      console.log(UPDATE_URL)
      console.log(updatedService.newData)
      const response = await axios.put(UPDATE_URL, updatedService.newData)
      //õnnestumise teade
      console.log(response.data)
      setOpen(true)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const handleDeleteService = async () => {
    try {
      const DELETE_URL = SERVICE_URL + "/" + deletableData._id
      const response = await axios.delete(DELETE_URL)
      console.log(response.data)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const toast = useRef(null)

  const columns = [
    { field: "code", header: "Kood" },
    { field: "description", header: "Kirjeldus" },
    { field: "unit", header: "Ühik" },
    { field: "price", header: "Hind" },
    { field: "tax", header: "KM" },
  ]

  const getStatusLabel = (status) => {
    switch (status) {
      case 0:
        return "0%"

      case 9:
        return "9%"

      case 20:
        return "20%"

      default:
        return "NA"
    }
  }

  const statuses = [
    { label: "0%", value: 0 },
    { label: "9%", value: 9 },
    { label: "20%", value: 20 },
  ]

  const onRowEditComplete1 = (e) => {
    let _tableData = [...tableData]
    let { newData, index } = e

    _tableData[index] = newData

    setData(_tableData)
    handleEditService(e)
  }

  const textEditor = (options) => {
    return (
      <Input
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    )
  }

  const taxEditor = (options) => {
    return (
      <Dropdown
        value={options.value}
        options={statuses}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        placeholder="Vali KM"
        itemTemplate={(option) => {
          return (
            <span className={`product-badge status-${option.value}`}>
              {option.label}
            </span>
          )
        }}
      />
    )
  }

  const deleteData = () => {
    console.log(deletableData)
    let _products = tableData.filter((val) => val._id !== deletableData._id)
    handleDeleteService()
    setData(_products)
    setDeleteDataDialog(false)
    setDeletableData(null)
    setDeleteOpen(true)
  }

  const deleteRow = (rowData) => {
    return (
      <React.Fragment>
        <Primebutton
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => confirmDeleteProduct(rowData)}
        />
      </React.Fragment>
    )
  }

  const confirmDeleteProduct = (data) => {
    setDeletableData(data)
    setDeleteDataDialog(true)
  }

  const statusBodyTemplate = (rowData) => {
    return getStatusLabel(rowData.tax)
  }

  const priceEditor = (options) => {
    return (
      <Input
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.value)}
        mode="currency"
        currency="USD"
        locale="en-US"
      />
    )
  }

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(rowData.price)
  }

  return (
    <div className="datatable-editing-demo">
      <Snackbar autoHideDuration={6000} open={open} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Teenus on edukalt muudetud.
        </Alert>
      </Snackbar>
      <Snackbar autoHideDuration={6000} open={deleteOpen} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Rida edukalt kustutatud.
        </Alert>
      </Snackbar>

      <Toast ref={toast} />
      <div className="card p-fluid">
        <DataTable
          value={tableData}
          sortField="code"
          sortOrder={1}
          resizableColumns
          editMode="row"
          size="small"
          dataKey="id"
          showGridlines
          stripedRows
          onRowEditComplete={onRowEditComplete1}
          responsiveLayout="scroll"
        >
          <Column
            field="code"
            header="Kood"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="description"
            sortable
            header="Kirjeldus"
            editor={(options) => textEditor(options)}
            style={{ width: "45%" }}
            resizeable={false}
          ></Column>
          <Column
            field="unit"
            header="Ühik"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="price"
            header="Hind"
            sortable
            body={priceBodyTemplate}
            editor={(options) => priceEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="tax"
            header="KM"
            sortable
            body={statusBodyTemplate}
            editor={(options) => taxEditor(options)}
            style={{ width: "10%" }}
            resizeable={false}
          ></Column>
          <Column
            rowEditor
            headerStyle={{ width: "5%", borderRight: "none" }}
            bodyStyle={{ textAlign: "right", borderRight: "none" }}
          ></Column>
          <Column
            body={deleteRow}
            headerStyle={{ width: "5%", borderLeft: "none" }}
            bodyStyle={{ textAlign: "left", borderLeft: "none" }}
          ></Column>
        </DataTable>
      </div>

      <Dialog
        open={deleteDataDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle>{"Olete kindel, et soovite rida kustutada?"}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>EI</Button>
          <Button onClick={deleteData} autoFocus>
            JAH
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ServiceTable
