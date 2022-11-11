import { Grid } from "@mui/material"
import { Form, useForm } from "../../components/useForm"
import { InputField, DropDownInput } from "../../components/controls/Input"
import { Button } from "../../components/controls/Button"
import { getTaxRates } from "../../utilities/LocalRequests"

//https://www.youtube.com/watch?v=-XKaSCU0ZLM

/*
Kasutajaliideses:
- kasutaja id
- kood
- kirjeldus
- ühiku nimi
- ühiku hind
- maksumäär (0, 9, 20)

Serveri poolel:
const serviceSchema = new Schema(
  {
    userId: { type: String, required: true},
    code: { type: String, required: true, unique: true }, 
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Decimal128, required: true },
    tax: { type: Decimal128, enum: ["0.0", "9.0", 20.0"], default: "20.0" },
  },
  { timestamps: true }
)
*/

const initialValues = {
  code: "",
  description: "",
  unit: "",
  price: "",
  tax: "",
  // date: Date(),
}

const Services = () => {
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

          {/*           <DatePicker
            label="Kuupäev"
            name="date"
            value={values.date}
            onChange={handleInputChange}
          /> */}

          <Button type="submit" text="Lisa teenus" onClick={handleSubmit} />
        </Grid>
      </Grid>
    </Form>
  )
}

export default Services
