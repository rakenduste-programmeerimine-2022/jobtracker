import { Box, Grid, TextField } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { useContext, useState } from "react"
import {
  InputField,
  DropDownInput,
} from "../../components/controls/Input"
import axios from "../../api/axios"
import { useSnackbar, Snackbar } from "../../components/useSnackbar"
import { Button } from "../../components/controls/Button"
import { getClients, getServices } from "../../utilities/DataBaseRequests"
import { getStatuses, getTaxRates } from "../../utilities/LocalRequests"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../Contexts/UserContext"
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"


const CLIENT_URL = "/api/jobs/"

//https://www.youtube.com/watch?v=-XKaSCU0ZLM



const JobForm = () => {

  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()

  const { jobData, setJobData} = useContext(UserContext)
  const { userData} = useContext(UserContext)
  const { clientData, setClientData } = useContext(UserContext)
  const{serviceData, setServiceData} = useContext(UserContext)
  const{serviceUnit, setServiceUnit} = useState("")
  const{servicePrice, setServicePrice} = useState("")
  const{serviceTax, setServiceTax} = useState("")
  const{jonTotal, setJobTotal} = useState("")
  const[dateValue, setDateValue] = useState(new Date())
  console.log(clientData)
  console.log(serviceData)

  const userId = userData.id

  const initialValues = {
    userId: userId,
    clientId: "",
    serviceId: "",
    description: "",
    unit: "",
    price: "",
    tax: "",
    total: "",
    status: "active",
    dueDate: dateValue,
  }

  const clientDropdown = () =>{
    const tempDataList = []

    console.log(clientData)
    if(clientData.length > 0){
      for (let index = 0; index < clientData.length; index++) {
        const element = {id: clientData[index]._id, title: clientData[index].name};
        tempDataList.push(element)
      }
      return(tempDataList)
    }
    
    return([
          {
            id: "",
            title: "",
          },
        ])
  }

  const serviceDropdown = () =>{
    const tempDataList = []

    console.log(serviceData)
    if(serviceData.length > 0){
      for (let index = 0; index < serviceData.length; index++) {
        const element = {id: serviceData[index]._id, title: serviceData[index].description};
        tempDataList.push(element)
      }
      return(tempDataList)
    }
    
    return([
          {
            id: "",
            title: "",
          },
        ])
  }


  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ("code" in fieldValues)
      temp.code = /^[0-9]{3,10}$/.test(fieldValues.code)
        ? ""
        : "Koodis saab olla 3-10 numbrit."
    if ("description" in fieldValues)
      temp.description =
        fieldValues.description.length > 0 ? "" : "Palun täida see väli."
    if ("unit" in fieldValues)
      temp.unit = /^[ -~]{1,5}$/.test(fieldValues.unit)
        ? ""
        : "Ühikus saab olla kuni 5 tähte."
    if ("price" in fieldValues)
      //temp.price = /^[-+]?[0-9]*(\.|\,)?[0-9]{1,100}$/.test(fieldValues.price)
      temp.price = /^[+-]?([0-9]+((.|,)?[0-9]*)?){1,100}$/.test(
        fieldValues.price
      )
        ? ""
        : "Palun sisesta number."
    if ("tax" in fieldValues)
      temp.tax = fieldValues.tax ? "" : "Palun täida see väli."

    setErrors({
      ...temp,
    })
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "")
  }

  const { values, errors, setErrors, handleInputChange, resetForm, handleServiceInputChange } = useForm(
    initialValues,
    true,
    validate
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      console.log(values)
      handleAddJob(values)
      resetForm()
    }
  }


  const handleAddJob = async (newJob) => {
    newJob.price = parseInt(newJob.price)
    newJob.total = parseInt(newJob.total)
    newJob.tax = parseInt(newJob.tax)
    newJob.dueDate = dateValue
    console.log(newJob)
    axios
      .post(CLIENT_URL, newJob)
      .then((response) => {
        resetForm()
        //õnnestumise teade
        setSnackbarMessage("Lisamine õnnestus!")
        showSnackbar()
        //kasutajakonteksti lisamine
        let temp = [...jobData]
        console.log(response.data)
        temp.push(response.data)
        setJobData(temp)
      })
      .catch((error) => {
        console.log(error)
      })
  }



  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item md={12}>
          <DropDownInput
          sx={{ width: "auto", minWidth: "200px", mx: 1, my: 2 }}
            required
            label="Klient"
            name="clientId"
            value={values.clientId}
            error={errors.clientId}
            onChange={handleInputChange}
            options={clientDropdown()}
          />
          {/*           <DropDownInput
            required
            label="Teenus"
            name="service"
            value={values.service}
            error={errors.service}
            onChange={handleInputChange}
            options={getServices()}
          /> */}
          <DropDownInput
          sx={{ width: "auto", minWidth: "200px", mx: 1, my: 2 }}
            required
            label="Teenus"
            name="serviceId"
            value={values.serviceId}
            error={errors.serviceId}
            onChange={handleInputChange}
            options={serviceDropdown()}
          />
          <InputField
            required
            label="Kirjeldus"
            name="description"
            value={values.description}
            error={errors.description}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Ühik"
            name="unit"
            value={values.unit}
            error={errors.unit}
            onChange={handleInputChange}
            width="100px"
          />
          <InputField
            required
            label="Hind"
            name="price"
            value={values.price}
            error={errors.price}
            onChange={handleInputChange}
            width="120px"
          />
          <DropDownInput
            required
            label="KM"
            name="tax"
            value={values.tax}
            error={errors.tax}
            onChange={handleInputChange}
            options={getTaxRates()}
            width="100px"
          />
          <InputField
            required
            label="Kokku"
            name="total"
            value={values.total}
            error={errors.total}
            onChange={handleInputChange}
            width="120px"
          />
      
      <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            label="Tähtaeg"
            inputFormat="DD.MM.YYYY"
            value={dateValue}
            onChange={(newValue) => {
              console.log(new Date(newValue))
              setDateValue(new Date(newValue));
            }}
            renderInput={(params) => <TextField size="small"  sx= {{mx: 1, my: 2, width: "150px"}} {...params} />}
          />
       </LocalizationProvider>


          {/* <DatePicker
            label="Tähtaeg"
            name="date"
            value={values.dueDate}
            error={errors.dueDate}
            onChange={handleInputChange}
          /> */}
          {/*           <DropDownInput
            required
            label="Olek"
            name="status"
            value={values.status}
            error={errors.status}
            onChange={handleInputChange}
            options={getStatuses()}
          /> */}
          
        </Grid>
        <Grid item md={12}>
        <Button sx={{ mx: 1, my: 2 }} type="submit" text="Lisa töö" onClick={handleSubmit} />
        </Grid>
      </Grid>
    </Form>
  )
}

export default JobForm
