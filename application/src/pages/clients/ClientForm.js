import { useContext, useEffect, useState } from "react"
import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { useSnackbar, Snackbar } from "../../components/useSnackbar"
import { InputField } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import axios from "../../api/axios"
import { useNavigate, useParams } from "react-router-dom"
import UserContext from "../../contexts/UserContext"

const CLIENT_URL = "/api/clients/"

const ClientForm = () => {
  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()

  const { userData, clientData, setClientData } = useContext(UserContext)

  const userId = userData.id

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
      //temp.regcode = /^[0-9]{8}$/.test(fieldValues.regcode)
      temp.regcode =
        fieldValues.regcode.length > 0 ? "" : "Palun sisesta registrikood."
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
      handleAddClient(values)
      console.log(values)
    }
  }

  const handleAddClient = async (newClient) => {
    console.log(newClient)
    newClient.term = parseInt(newClient.term)
    try {
      let response = await axios.post(CLIENT_URL, newClient)
      if (response.status === 200) {
        resetForm()
        console.log(response)

        //õnnestumise teade
        setSnackbarMessage("Lisamine õnnestus!")
        showSnackbar()
        //kasutajakonteksti lisamine
        let temp = [...clientData]
        temp.push(response.data)
        setClientData(temp)
      }
    } catch (err) {
      // Handle Error Here
      console.error(err)
      let temp = { ...errors }

      if (err.response?.status === 499) {
        temp.name = "See nimi on juba võetud."
      }

      if (err.response?.status === 498) {
        temp.regcode = "See registrikood on juba võetud."
      }

      if (err.response?.status === 497) {
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
            width="200px"
          />
          <InputField
            required
            label="Registrikood"
            name="regcode"
            value={values.regcode}
            error={errors.regcode}
            onChange={handleInputChange}
            width="200px"
          />
          <InputField
            label="KMKR nr"
            name="vatno"
            value={values.vatno}
            error={errors.vatno}
            onChange={handleInputChange}
            width="200px"
          />
          <InputField
            label="Aadress"
            name="address"
            value={values.address}
            error={errors.address}
            onChange={handleInputChange}
            width="200px"
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
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        text={snackbarMessage}
      />
    </Form>
  )
}

export default ClientForm
