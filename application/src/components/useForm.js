import { useState } from "react"
import PropTypes from "prop-types"

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
export const Form = (props) => {
  const { children, ...other } = props
  return (
    <form autoComplete="off" {...other}>
      {children}
    </form>
  )
}

Form.propTypes = {
  children: PropTypes.node,
}
