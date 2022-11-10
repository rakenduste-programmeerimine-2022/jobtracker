import { useState } from "react"

export function useForm(initialValues, validateOnChange = false, validate) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState({})

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setValues({
      ...values,
      [name]: value,
    })
    if (validateOnChange) validate({ [name]: value })
  }

  const resetForm = () => {
    setValues(initialValues)
    setErrors({})
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm,
  }
}

// siin saab kujunduse lisada
export function Form(props) {
  const { children, ...other } = props
  return (
    <form autoComplete="off" {...other}>
      {children}
    </form>
  )
}
