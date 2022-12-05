import { useContext, useEffect, useState } from "react"
//import { useAlertDialog, AlertDialog } from "../../components/useAlertDialog"
//import { useSnackbar, Snackbar } from "../../components/useSnackbar"
import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { InputField } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import axios from "../../api/axios"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../contexts/UserContext"

const CLIENT_URL = "/api/clients/"

const ClientForm = () => {
  //const { id } = useParams()
  const { userData } = useContext(UserContext)

  let userId = null

  if (userData) {
    userId = userData.id
  } else {
    userId = sessionStorage.getItem("user").id
  }
  //const userId = userData.id

  const initialValues = {
    userId: userId,
    name: "",
    regcode: "",
    vatno: "",
    address: "",
    term: 14,
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ("name" in fieldValues)
      temp.name = fieldValues.name.length > 0 ? "" : "Palun täida see väli."
    if ("regcode" in fieldValues)
      temp.regcode = /^[0-9]{8}$/.test(fieldValues.regcode)
        ? ""
        : "Palun sisesta kehtiv registrikood."
    if ("vatno" in fieldValues)
      temp.vatno = /^$|^([A-Z]{2})+([0-9]{8,9})$/.test(fieldValues.vatno)
        ? ""
        : "Palun sisesta kehtiv KMKR number."
    if ("term" in fieldValues)
      temp.term = /^[0-9]{1,4}$/.test(fieldValues.term)
        ? ""
        : "Maksetähtaeg päevades."

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

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      console.log(values)
      handleAddClient(values)
      resetForm()
    }
  }

  const handleAddClient = async (newClient) => {
    console.log(newClient)
    newClient.term = parseInt(newClient.term)
    try {
      console.log(newClient)
      await axios.post(CLIENT_URL, newClient).then(function (response) {
        console.log(response)
      })
      resetForm()
      //fetchData()
      //õnnestumise teade
      //setSnackbarMessage("Lisamine õnnestus!")
      //showSnackbar()
      //setDataToTransfer(newClient)
    } catch (err) {
      // Handle Error Here
      console.error(err)
      let temp = { ...errors }

      if (err.response.status === 499) {
        temp.name = "See nimi on juba võetud."
      }

      if (err.response.status === 498) {
        temp.regcode = "See registrikood on juba võetud."
      }

      if (err.response.status === 497) {
        temp.vatno = "See KMKR nr on juba võetud."
      }

      setErrors({
        ...temp,
      })
    }
  }

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container>
        <Grid item md={12}>
          <InputField
            required
            label="Nimi"
            name="name"
            value={values.name}
            error={errors.name}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Registrikood"
            name="regcode"
            value={values.regcode}
            error={errors.regcode}
            onChange={handleInputChange}
            width="100px"
          />
          <InputField
            label="KMKR nr"
            name="vatno"
            value={values.vatno}
            error={errors.vatno}
            onChange={handleInputChange}
            width="100px"
          />
          <InputField
            label="Aadress"
            name="address"
            value={values.address}
            error={errors.address}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Maksetähtaeg"
            name="term"
            value={values.term}
            error={errors.term}
            onChange={handleInputChange}
            width="100px"
          />
          <Button type="submit" text="Lisa klient" onClick={handleSubmit} />
        </Grid>
      </Grid>
    </Form>
  )
}

export default ClientForm
