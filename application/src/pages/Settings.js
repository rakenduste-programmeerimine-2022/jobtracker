import { useContext } from "react"
import axios from "../api/axios"
import { Grid, Typography } from "@mui/material"
import { Form, useForm } from "../components/useForm"
import { Snackbar, useSnackbar } from "../components/useSnackbar"
import { InputField } from "../components/controls/Input"
import { Button } from "../components/controls/Button"
import UserContext from "../contexts/UserContext"

const USER_URL = "/auth/user/"

const Settings = () => {
  const { userData, setUserData, serviceData } = useContext(UserContext)
  const id = userData.id
  const initialValues = {
    ...userData.user,
  }

  const validate = (fieldValues = values) => {
    let temp = { ...errors }
    if ("name" in fieldValues)
      temp.name = fieldValues.name.length > 0 ? "" : "Palun täida see väli."
    if ("surname" in fieldValues)
      temp.surname =
        fieldValues.surname.length > 0 ? "" : "Palun täida see väli."
    if ("businessName" in fieldValues)
      temp.businessName =
        fieldValues.businessName.length > 0 ? "" : "Palun täida see väli."
    if ("regNumber" in fieldValues)
      temp.regNumber = /^[0-9]{8}$/.test(fieldValues.regNumber)
        ? ""
        : "Palun sisesta 8-kohaline registrikood."

    if ("address" in fieldValues)
      temp.address =
        fieldValues.address.length > 0 ? "" : "Palun täida see väli."
    if ("iban" in fieldValues)
      temp.iban = fieldValues.iban.length > 0 ? "" : "Palun täida see väli."
    if ("password" in fieldValues)
      temp.password = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/.test(
        fieldValues.password
      )
        ? ""
        : "Salasõna peab sisaldama vähemalt ühte numbrit ja suurt tähte ning olema vähemalt 8 tähemärki."
    if ("password2" in fieldValues)
      temp.password2 =
        fieldValues.password2.length < 1
          ? "Palun täida see väli."
          : fieldValues.password < 1
          ? "Palun sisesta salasõna"
          : fieldValues.password2 === values.password
          ? ""
          : "Salasõnad ei kattu."

    setErrors({
      ...temp,
    })
    if (fieldValues === values)
      return Object.values(temp).every((x) => x === "")
  }

  const { values, errors, setErrors, handleInputChange } = useForm(
    initialValues,
    true,
    validate
  )

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validate()) {
      handleUpdate(values)
    }
  }

  const handleUpdate = async (updatedValues) => {
    try {
      const UPDATE_URL = USER_URL + id
      const response = await axios.put(UPDATE_URL, updatedValues)
      //õnnestumise teade
      if (response.status === 200) {
        //let temp = {user: {...updatedValues}}
        let temp = { ...userData }
        temp.user = { ...updatedValues }
        setUserData(temp)
        setSnackbarMessage("Muutmine õnnestus!")
        showSnackbar()
      }
    } catch (err) {
      // Handle Error Here
      console.error(err)
      let temp = { ...errors }

      if (err.response.status === 499) {
        temp.code = "See registreerimiskood on juba kasutusel."
      }
      setErrors({
        ...temp,
      })
    }
  }

  const {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
  } = useSnackbar()

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid container item xs={12} sm={6} direction="column">
          <Typography variant="subtitle1">Kasutaja andmed</Typography>
          <Grid container item>
            <Grid container item xs={12} sm={6}>
              <InputField
                required
                label="Eesnimi"
                name="name"
                value={values.name}
                error={errors.name}
                onChange={handleInputChange}
                width="100%"
              />
            </Grid>
            <Grid container item xs={12} sm={6}>
              <InputField
                required
                label="Perekonnanimi"
                name="surname"
                value={values.surname}
                error={errors.surname}
                onChange={handleInputChange}
                width="100%"
              />
            </Grid>
          </Grid>
          <InputField
            required
            label="E-posti aadress"
            name="email"
            value={values.email}
            error={errors.email}
            onChange={handleInputChange}
            //minWidth="90%"
            disabled
          />

          <InputField
            required
            label="Salasõna"
            name="password"
            type="password"
            value={values.password}
            error={errors.password}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Salasõna uuesti"
            name="password2"
            type="password"
            value={values.password2}
            error={errors.password2}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid container item xs={12} sm={6} direction="column">
          <Typography variant="subtitle1">Ettevõtte andmed</Typography>
          <InputField
            required
            label="Ettevõtte nimi"
            name="businessName"
            value={values.businessName}
            error={errors.businessName}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Registrikood"
            name="regNumber"
            value={values.regNumber}
            error={errors.regNumber}
            onChange={handleInputChange}
          />
          <InputField
            label="KMKR number"
            name="vat"
            value={values.vat}
            error={errors.vat}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Asukoht"
            name="address"
            value={values.address}
            error={errors.address}
            onChange={handleInputChange}
          />
          <InputField
            required
            label="Pangakonto"
            name="iban"
            value={values.iban}
            error={errors.iban}
            onChange={handleInputChange}
          />
        </Grid>
      </Grid>
      <Button type="submit" text="Muuda" onClick={handleSubmit} />
      <Snackbar
        open={snackbarOpen}
        onClose={hideSnackbar}
        text={snackbarMessage}
      />
    </Form>
  )
}

export default Settings
