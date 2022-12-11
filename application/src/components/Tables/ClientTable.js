import "primeicons/primeicons.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.css"
import { Button, Input } from "@mui/material"
import React, { useContext, useRef } from "react"
import axios from "../../api/axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Button as Primebutton } from "primereact/button"
import UserContext from "../../Contexts/UserContext"
import { Snackbar, useSnackbar } from "../../components/useSnackbar"
import { AlertDialog, useAlertDialog } from "../../components/useAlertDialog"

const CLIENT_URL = "/api/clients/"

function ClientTable() {
  const { clientData, setClientData } = useContext(UserContext)

  const paginatorLeft = (
    <Button type="button" icon="pi pi-refresh" className="p-button-text" />
  )
  const paginatorRight = (
    <Button type="button" icon="pi pi-cloud" className="p-button-text" />
  )

  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    snackbarSeverity,
    setSnackbarSeverity,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()
  const { deletable, setDeletable, dialogOpen, toggleDeleteDialog } =
    useAlertDialog()

  const handleEditClient = async (updatedClient) => {
    const UPDATE_URL = CLIENT_URL + updatedClient.newData._id
    updatedClient.newData.term = parseInt(updatedClient.newData.term)
    axios
      .put(UPDATE_URL, updatedClient.newData)
      .then((response) => {
        let temp = [...clientData]
        let index = temp.findIndex(
          (element) => element._id === updatedClient.newData._id
        )
        temp[index] = response.data
        setClientData(temp)

        //õnnestumise teade
        setSnackbarSeverity("success")
        setSnackbarMessage("Muutmine õnnestus!")
        showSnackbar()
      })
      .catch((error) => {
        const err = error.response.data.errors
        console.log(err)
        let temp = ""
        if (err.find((item) => item.code === 499)) {
          temp += "See nimi on juba võetud."
        }
        if (err.find((item) => item.code === 498)) {
          temp += "See registrikood on juba võetud."
        }
        if (err.find((item) => item.code === 497)) {
          temp += "See KMKR nr on juba võetud."
        }
        if (err.find((item) => item.msg === "Invalid value")) {
          temp += "Maksetähtaeg peab olema number."
        }

        console.log(temp)
        setSnackbarSeverity("error")
        setSnackbarMessage(temp)
        showSnackbar()
      })
  }

  const handleDeleteClient = async () => {
    if (deletable) {
      const DELETE_URL = CLIENT_URL + deletable._id
      axios
        .delete(DELETE_URL)
        .then((response) => {
          let temp = [...clientData]
          temp = temp.filter((client) => client._id !== deletable._id)
          setClientData(temp)
          setSnackbarSeverity("success")
          setSnackbarMessage("Kustutamine õnnestus!")
          showSnackbar()
          setDeletable(null)
          toggleDeleteDialog()
        })
        .catch((error) => {
          console.error(error)
        })
    }
  }

  const onRowEditComplete1 = (e) => {
    let temp = [...clientData]
    let { newData, index } = e
    temp[index] = newData
    handleEditClient(e)
  }

  const openDeleteDialog = (rowData) => {
    setDeletable(rowData)
    toggleDeleteDialog()
  }

  const deleteRow = (rowData) => {
    return (
      <React.Fragment>
        <Primebutton
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger p-button-text"
          onClick={() => openDeleteDialog(rowData)}
        />
      </React.Fragment>
    )
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
      <Snackbar
        severity={snackbarSeverity}
        open={snackbarOpen}
        onClose={hideSnackbar}
        text={snackbarMessage}
      />
      <AlertDialog
        open={dialogOpen}
        onClose={toggleDeleteDialog}
        title="Kustuta klient"
        content="Oled kindel, et soovid teenuse kustutada"
        onDelete={handleDeleteClient}
      />
      {/*    <Toast ref={toast} /> */}
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
          //style={{ maxWidth: "700px" }}
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
    </div>
  )
}

export default ClientTable
