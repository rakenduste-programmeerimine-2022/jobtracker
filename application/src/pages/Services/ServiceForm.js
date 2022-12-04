import { useContext, useEffect, useState } from "react"
import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { useAlertDialog, AlertDialog } from "../../components/useAlertDialog"
import { useSnackbar, Snackbar } from "../../components/useSnackbar"
import { InputField, DropDownInput } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import { getTaxRates } from "../../utilities/LocalRequests"
import axios from "../../api/axios"
import { useNavigate, useParams } from "react-router-dom"
import ServiceContext from "../../contexts/ServiceContext"
import UserContext from "../../contexts/UserContext"

const SERVICE_URL = "/api/services"

//https://www.youtube.com/watch?v=-XKaSCU0ZLM

const ServiceForm = ({ fetchData }) => {
  /*   const { id } = useParams() */
  const { userData, serviceData, setServiceData } = useContext(UserContext)
  const userId = userData.id
  const [datatoTransfer, setDataToTransfer] = useContext(ServiceContext)

  const initialValues = {
    userId: userId,
    code: "",
    description: "",
    unit: "",
    price: "",
    tax: "",
  }

  const navigate = useNavigate()

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ("code" in fieldValues)
      temp.code = /^[0-9]{1,10}$/.test(fieldValues.code)
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

  const { values, errors, setValues, setErrors, handleInputChange, resetForm } =
    useForm(initialValues, true, validate)

  /* const fetchDataCall = async ({ api }) => {
    let apiReturn = await axios
      .get(api)
      .then((response) => response.data)
      .catch(function (error) {
        console.log(error)
      })
    return apiReturn
  }

  useEffect(() => {
    if (id !== undefined) {
      console.log(id)
      const api = SERVICE_URL + "/" + id
      console.log(id)
      const fetchItem = async (api) => {
        let response = await fetchDataCall({ api: api })
        const { userId, code, description, unit, price, tax } = response
        const dbValues = {
          userId,
          code,
          description,
          unit,
          price: price.$numberDecimal,
          tax: tax.$numberDecimal,
        }

        setValues(dbValues)
      }
      fetchItem(api)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
 */
  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      handleAddService(values)
    }
  }

  const handleAddService = async (newService) => {
    newService.tax = parseInt(newService.tax)
    newService.price = parseInt(newService.price)
    try {
      let response = await axios.post(SERVICE_URL, newService)
      if (response.status === 200) {
        resetForm()

        //õnnestumise teade SEE EI TÖÖTA
        setSnackbarMessage("Lisamine õnnestus!")
        showSnackbar()
        //kasutajakonteksti lisamine
        let temp = [...serviceData]
        temp.push(newService)
        setServiceData(temp)
      }
    } catch (err) {
      // Handle Error Here
      console.error(err)
      let temp = { ...errors }

      if (err.response?.status === 499) {
        temp.code = "See kood on juba võetud."
      }
      setErrors({
        ...temp,
      })
    }
  }
  /* 
  const handleEdit = (e) => {
    e.preventDefault()

    if (validate()) {
      console.log(values)
      handleEditService(values)
    }
  }

  const handleEditService = async (updatedService) => {
    try {
      const UPDATE_URL = SERVICE_URL + "/" + id
      console.log(UPDATE_URL)
      console.log(updatedService)
      const response = await axios.put(UPDATE_URL, updatedService)
      //õnnestumise teade
      setSnackbarMessage("Muutmine õnnestus!")
      showSnackbar()
      console.log(response.data)
    } catch (err) {
      // Handle Error Here
      console.error(err)
      let temp = { ...errors }

      if (err.response.status === 499) {
        temp.code = "See kood on juba võetud."
        console.log("499")
      }
      setErrors({
        ...temp,
      })
    }
  }

  const handleDelete = (e) => {
    e.preventDefault()
    //kontrollida, kas on kasutuses
    //kinnitus lisada
    handleDeleteService()
    navigate("/services")
  }

  const handleDeleteService = async () => {
    try {
      const DELETE_URL = SERVICE_URL + "/" + id
      const response = await axios.delete(DELETE_URL)
      console.log(response.data)
    } catch (err) {
      // Handle Error Here
      console.error(err)
    }
  }
 */
  const { dialogOpen, handleDialogOpen, handleDialogClose } = useAlertDialog()
  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item md={12}>
          <InputField
            required
            label="Kood"
            name="code"
            value={values.code}
            error={errors.code}
            onChange={handleInputChange}
            width="100px"
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
            type="number"
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
            type="number"
            value={values.tax}
            error={errors.tax}
            onChange={handleInputChange}
            options={getTaxRates()}
            width="100px"
          />
          {/* {id !== undefined ? (
            <>
              <Button type="edit" text="Muuda" onClick={handleEdit} />
              <Button text="kustuta" onClick={handleDialogOpen} />
              <Snackbar
                open={snackbarOpen}
                onClose={hideSnackbar}
                text={snackbarMessage}
              />
              <AlertDialog
                open={dialogOpen}
                onClose={handleDialogClose}
                title="Kustuta teenus"
                content="Oled kindel, et soovid teenuse kustutada"
                onDelete={handleDelete}
              />
            </>
          ) : ( */}
          <Button type="submit" text="Lisa" onClick={handleSubmit} />
          {/*   )} */}
        </Grid>
      </Grid>
    </Form>
  )
}

export default ServiceForm
