import "primeicons/primeicons.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.css"
import { Button, Input } from "@mui/material"
import React, { useContext } from "react"
import axios from "../../api/axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dropdown } from "primereact/dropdown"
import { Button as Primebutton } from "primereact/button"
import UserContext from "../../contexts/UserContext"
import { Snackbar, useSnackbar } from "../../components/useSnackbar"
import { AlertDialog, useAlertDialog } from "../../components/useAlertDialog"

const SERVICE_URL = "/api/services/"

function ServiceTable() {
  const { serviceData, setServiceData } = useContext(UserContext)

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

  const handleEditService = async (updatedService) => {
    const UPDATE_URL = SERVICE_URL + updatedService.newData._id
    axios
      .put(UPDATE_URL, updatedService.newData)
      .then((response) => {
        let temp = [...serviceData]
        let index = temp.findIndex(
          (element) => element._id === updatedService.newData._id
        )
        temp[index] = response.data
        setServiceData(temp)

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
          temp += "See kood on juba võetud."
        }
        if (err.find((item) => item.msg === "Invalid value")) {
          temp += "Vale väärtus."
        }
        console.log(temp)
        setSnackbarSeverity("error")
        setSnackbarMessage(temp)
        showSnackbar()
      })
  }

  const handleDeleteService = async () => {
    const DELETE_URL = SERVICE_URL + deletable._id
    console.log(DELETE_URL)
    axios
      .delete(DELETE_URL)
      .then((response) => {
        let temp = [...serviceData]
        temp = temp.filter((service) => service._id !== deletable._id)
        setServiceData(temp)
        setSnackbarSeverity("success")
        setSnackbarMessage("Kustutamine õnnestus!")
        showSnackbar()
        setDeletable(null)
        toggleDeleteDialog()
      })
      .catch((error) => {
        console.log(error)
      })
  }

  //const toast = useRef(null)

  const getStatusLabel = (status) => {
    switch (status) {
      case 0.0:
        return "0%"

      case 9.0:
        return "9%"

      case 20.0:
        return "20%"

      default:
        return "NA"
    }
  }

  //võtta failist
  const statuses = [
    { label: "0%", value: 0.0 },
    { label: "9%", value: 9.0 },
    { label: "20%", value: 20.0 },
  ]

  const onRowEditComplete = (e) => {
    let temp = [...serviceData]
    let { newData, index } = e
    temp[index] = newData
    handleEditService(e)
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

  const statusBodyTemplate = (rowData) => {
    return getStatusLabel(rowData.tax)
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

  const priceEditor = (options) => {
    return (
      <Input
        type="number"
        value={options.value}
        onChange={(e) => options.editorCallback(e.target.value)}
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
        content="Oled kindel, et soovid teenuse kustutada?"
        onDelete={handleDeleteService}
      />

      <div className="card p-fluid">
        <DataTable
          value={serviceData}
          paginator
          paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
          currentPageReportTemplate="Näitan {first} kuni {last} rida {totalRecords}-st"
          rows={10}
          rowsPerPageOptions={[10, 20, 50]}
          paginatorLeft={paginatorLeft}
          paginatorRight={paginatorRight}
          sortField="code"
          sortOrder={1}
          resizableColumns
          editMode="row"
          size="small"
          dataKey="id"
          showGridlines
          stripedRows
          onRowEditComplete={onRowEditComplete}
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
    </div>
  )
}

export default ServiceTable
