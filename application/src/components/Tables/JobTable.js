import "primeicons/primeicons.css"
import "primereact/resources/themes/lara-light-indigo/theme.css"
import "primereact/resources/primereact.css"
import '../../index.css';
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Input,
  Snackbar,
} from "@mui/material"
import React, { useContext, useRef, useState } from "react"
import { Calendar } from 'primereact/calendar';
import axios from "../../api/axios"
import { Column } from "primereact/column"
import { DataTable } from "primereact/datatable"
import { Dropdown } from "primereact/dropdown"
import { Toast } from "primereact/toast"
import { Button as Primebutton } from "primereact/button"
import MuiAlert from "@mui/material/Alert"
//import ServiceContext from "../../contexts/ServiceContext"
import UserContext from "../../Contexts/UserContext"

const JOBS_URL = "/api/jobs/"
const Alert = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
})





function ServiceTable() {
  const { serviceData, setServiceData } = useContext(UserContext)
  const {jobData, setJobData} = useContext(UserContext)
  const [open, setOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletableData, setDeletableData] = useState()
  const [deleteDataDialog, setDeleteDataDialog] = useState(false)

  console.log(jobData)

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

  const handleEditJob = async (updatedJob) => {
    console.log(updatedJob.newData)
    const UPDATE_URL = JOBS_URL + updatedJob.newData._id
    console.log(updatedJob.newData)

    axios
      .put(UPDATE_URL, updatedJob.newData)
      .then((response) => {
        let temp = [...jobData]
        let index = temp.findIndex(
          (element) => element._id === updatedJob.newData._id
        )
        console.log(response.data)
        temp[index] = response.data
        setJobData(temp)
        console.log(jobData)
      })
      .catch((error) => {
        let temp = {}
        if (error.response.data.find((item) => item.code === 499)) {
          temp.code = "See kood on juba võetud."
        }
        console.log(error)
      })
  }

  const handleDeleteService = async () => {
    const DELETE_URL = JOBS_URL + deletableData._id
    axios
      .delete(DELETE_URL)
      .then((response) => {
        let temp = [...serviceData]
        temp = temp.filter((service) => service._id !== deletableData._id)
        setServiceData(temp)
      })
      .catch((error) => {
        console.log(error)
      })
  }

  const toast = useRef(null)

  const getTaxLabel = (status) => {
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

  const getStatusLabel = (status) => {
    switch (status) {
      case "active":
        return "Töös"

      case "finished":
        return "Valmis"

      default:
        return "NA"
    }
  }

  const taxes = [
    { label: "0%", value: 0.0 },
    { label: "9%", value: 9.0 },
    { label: "20%", value: 20.0 },
  ]

  const statuses = [
    { label: "töös", value: "active" },
    { label: "valmis", value: "finished" },
  ]

  const onRowEditComplete = (e) => {
    let temp = [...jobData]
    let { newData, index } = e

    temp[index] = newData

    handleEditJob(e)
  }

  const deleteData = () => {
    handleDeleteService()
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
    return getStatusLabel(rowData.status)
  }

  const taxBodyTemplate = (rowData) => {
    return getTaxLabel(rowData.tax)
  }

  const formatDate = (value) => {
    value = new Date(value)
    return value.toLocaleDateString("en-GB", {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });
}

const dateBodyTemplate = (rowData) => {
    return formatDate(rowData.dueDate);
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
        options={taxes}
        optionLabel="label"
        optionValue="value"
        onChange={(e) => options.editorCallback(e.value)}
        //placeholder="Vali KM"
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

  const statusEditor = (options) => {
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

  const dateEditor = (options) => {
    return ( 
        <Calendar value={options.value} onChange={(e) => options.editorCallback(e.target.value)} />
    )
  }

  const priceBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(rowData.price)
  }

  const totalBodyTemplate = (rowData) => {
    return new Intl.NumberFormat("en-EU", {
      style: "currency",
      currency: "EUR",
    }).format(rowData.total)
  }

  const rowClass = (data) => {
    return {
        'row-valmis': data.status === 'finished'
    }
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
          value={jobData}
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
          rowClassName={rowClass}
          editMode="row"
          size="small"
          dataKey="id"
          showGridlines
          stripedRows
          onRowEditComplete={onRowEditComplete}
          responsiveLayout="scroll"
        >
          <Column
            field="clientId.name"
            header="Klient"
            sortable
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="serviceId.description"
            sortable
            header="Teenus"
            style={{ width: "15%" }}
            resizeable={false}
          ></Column>
          <Column
            field="description"
            header="Kirjeldus"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "25%" }}
            resizeable={false}
          ></Column>
          <Column
            field="unit"
            header="Ühik"
            sortable
            editor={(options) => textEditor(options)}
            style={{ width: "5%" }}
            resizeable={false}
          ></Column>
            <Column
            field="price"
            header="Hind"
            sortable
            body={priceBodyTemplate}
            editor={(options) => priceEditor(options)}
            style={{ width: "10%" }}
            resizeable={false}
          ></Column>
          <Column
            field="tax"
            header="KM"
            sortable
            body={taxBodyTemplate}
            editor={(options) => taxEditor(options)}
            style={{ width: "5%" }}
            resizeable={false}
          ></Column>
           <Column
            field="total"
            header="Kokku"
            sortable
            body={totalBodyTemplate}
            editor={(options) => priceEditor(options)}
            style={{ width: "10%" }}
            resizeable={false}
          ></Column>
             <Column
            field="dueDate"
            header="Tähtaeg"
            sortable
            body={dateBodyTemplate}
            dataType="date"
            editor={(options) => dateEditor(options)}
            style={{ width: "10%" }}
            resizeable={false}
          ></Column>
            <Column
            field="status"
            header="Staatus"
            sortable
            body={statusBodyTemplate}
            editor={(options) => statusEditor(options)}
            style={{ width: "5%" }}
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

export default ServiceTable
