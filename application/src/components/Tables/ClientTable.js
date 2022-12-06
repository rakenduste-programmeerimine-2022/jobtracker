import "primeicons/primeicons.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.css"
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Input,
  Snackbar,
} from "@mui/material"
import React, { useContext, useRef, useState } from "react"
import axios from "../../api/axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Toast } from "primereact/toast"
import { Button as Primebutton } from "primereact/button"
import MuiAlert from "@mui/material/Alert"
import UserContext from "../../contexts/UserContext"

const CLIENT_URL = "/api/clients/"
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})

function ClientTable() {
  const { clientData, setClientData } = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletableData, setDeletableData] = useState()
  const [deleteDataDialog, setDeleteDataDialog] = useState(false)

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  )
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  )

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
    setDeleteOpen(false)
    setDeleteDataDialog(false)
  }

  const handleEditClient = async (updatedClient) => {
    try {
      const UPDATE_URL = CLIENT_URL + updatedClient.newData._id
      const response = await axios.put(UPDATE_URL, updatedClient.newData)
      //kasutajakonteksti lisamine
      if (response.status === 200) {
        let temp = [...clientData]
        let index = temp.findIndex(
          (element) => element._id === updatedClient.newData._id
        )
        temp[index] = updatedClient.newData
        setClientData(temp)
      }
      //õnnestumise teade
      setOpen(true)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const handleDeleteClient = async () => {
    try {
      const DELETE_URL = CLIENT_URL + deletableData._id
      const response = await axios.delete(DELETE_URL)
      if (response.status === 200) {
        let temp = [...clientData]
        temp = temp.filter((client) => client._id !== deletableData._id)
        setClientData(temp)
      }
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }

  const toast = useRef(null)

  const onRowEditComplete1 = (e) => {
    let temp = [...clientData]
    let { newData, index } = e

    temp[index] = newData

    handleEditClient(e)
  }

  const deleteData = () => {
    //let _products = ClientData.filter((val) => val._id !== deletableData._id)
    handleDeleteClient()
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

  const textEditor = (options) => {
    return (
      <Input
        type="text"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    )
  }

  const numEditor = (options) => {
    return (
      <Input
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
      />
    )
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
          value={clientData}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Näitan {first} kuni {last} rida {totalRecords}-st"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          sortField="name"
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
            field="name"
            header="Nimi"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="regcode"
            sortable
            header="Registrikood"
            editor={(options) => textEditor(options)}
            style={{ width: "45%" }}
            resizeable={false}
          ></Column>
          <Column
            field="vatno"
            header="KMKR nr"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="address"
            header="Aadress"
            sortable
            //body={priceBodyTemplate}
            editor={(options) => textEditor(options)}
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="term"
            header="Tähtaeg"
            sortable
            editor={(options) => numEditor(options)}
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
        <DialogTitle>{"Olete kindel, et soovite rea kustutada?"}</DialogTitle>
        <DialogActions>
          <Button onClick={deleteData} autoFocus>
            JAH
          </Button>
          <Button onClick={handleClose}>EI</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default ClientTable
