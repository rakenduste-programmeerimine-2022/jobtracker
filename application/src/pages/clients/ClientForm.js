//import { useRef, useState } from "react"
import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { InputField } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"

const initialValues = {
  name: "",
  regcode: "",
  vatno: "",
  address: "",
  term: "14",
}

const ClientForm = () => {
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
      window.alert("Esitatud")
      resetForm()
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
