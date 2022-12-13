import { useContext } from "react"
import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { useSnackbar, Snackbar } from "../../components/useSnackbar"
import { InputField, DropDownInput } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import { getTaxRates } from "../../utilities/LocalRequests"
import axios from "../../api/axios"
import UserContext from "../../contexts/UserContext"

const SERVICE_URL = "/api/services"

const ServiceForm = () => {
  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()

  const { userData, serviceData, setServiceData } = useContext(UserContext)
  //console.log(serviceData)
  const userId = userData.id

  const initialValues = {
    userId: userId,
    code: "",
    description: "",
    unit: "",
    price: "",
    tax: "",
  }

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

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    initialValues,
    true,
    validate
  )

  function handleSubmit(e) {
    e.preventDefault()

    if (validate()) {
      handleAddService(values)
    }
  }

  function handleAddService(newService) {
    axios
      .post(SERVICE_URL, newService)
      .then((response) => {
        resetForm()
        console.log(response.data)
        //õnnestumise teade
        setSnackbarMessage("Lisamine õnnestus!")
        showSnackbar()
        //kasutajakonteksti lisamine
        let temp = [...serviceData]
        temp.push(response.data)
        setServiceData(temp)
        console.log(serviceData)
      })
      .catch((error) => {
        let temp = { ...errors }
        console.log(error)
        // if (error.response.data.find((item) => item.code === 499)) {
        //   temp.code = "See kood on juba võetud."
        // }
        setErrors({
          ...temp,
        })
      })
  }

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
          <Button type="submit" text="Lisa" onClick={handleSubmit} />
        </Grid>
      </Grid>
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        text={snackbarMessage}
      />
    </Form>
  )
}

export default ServiceForm
