import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import {
  InputField,
  DatePicker,
  DropDownInput,
} from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import { getClients, getServices } from "../../utilities/DataBaseRequests"
import { getStatuses, getTaxRates } from "../../utilities/LocalRequests"

//https://www.youtube.com/watch?v=-XKaSCU0ZLM

const initialValues = {
  user: "",
  client: "",
  service: "",
  description: "",
  unit: "",
  price: "",
  tax: "",
  total: "",
  dueDate: "",
  status: "töös",
  // date: Date(),
}

const JobForm = () => {
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
          <DropDownInput
            required
            label="Klient"
            name="client"
            value={values.client}
            error={errors.client}
            onChange={handleInputChange}
            options={getClients()}
          />
          <DropDownInput
            required
            label="Teenus"
            name="service"
            value={values.service}
            error={errors.service}
            onChange={handleInputChange}
            options={getServices()}
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
          <DatePicker
            label="Tähtaeg"
            name="date"
            value={values.dueDate}
            error={errors.dueDate}
            onChange={handleInputChange}
          />
          <DropDownInput
            required
            label="Olek"
            name="status"
            value={values.status}
            error={errors.status}
            onChange={handleInputChange}
            options={getStatuses()}
          />
          <Button type="submit" text="Lisa töö" onClick={handleSubmit} />
        </Grid>
      </Grid>
    </Form>
  )
}

export default JobForm
