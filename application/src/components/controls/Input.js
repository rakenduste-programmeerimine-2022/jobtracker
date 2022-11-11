import React from "react"
import { MenuItem, TextField, TextFieldProps } from "@mui/material"
//import { MuiPickerUtilsProvider, KeyboardDatePicker } from "@material-ui/pickers"
import {
  //AdapterDayjs,
  DatePicker as MuiDatePicker,
  LocalizationProvider,
} from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"

export const InputField = (props) => {
  const { label, name, onChange, value, error = null, width, ...other } = props
  return (
    <TextField
      size="small"
      variant="outlined"
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      sx={{ width: { width }, mx: 1, my: 2 }}
      {...other}
    />
  )
}

export const DropDownInput = (props) => {
  const {
    label,
    name,
    onChange,
    options,
    value,
    error = null,
    width,
    ...other
  } = props
  return (
    <TextField
      size="small"
      variant="outlined"
      select
      label={label}
      name={name}
      value={value}
      onChange={onChange}
      {...(error && { error: true, helperText: error })}
      sx={{ width: { width }, mx: 1, my: 2 }}
      {...other}
    >
      {options.map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.title}
        </MenuItem>
      ))}
    </TextField>
  )
}

export const DatePicker = (props) => {
  const { label, name, onChange, value, ...other } = props

  const convertToDefaultEventParams = (name, value) => ({
    target: {
      name,
      value,
    },
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <MuiDatePicker
        label={label}
        name={name}
        inputFormat="DD.MM.YYYY" //depends on date lib
        value={value}
        onChange={(event) =>
          onChange(convertToDefaultEventParams(name, event.$d))
        }
        renderInput={(params: TextFieldProps) => {
          return <TextField {...params} />
        }}
        views={["day"]}
        showDaysOutsideCurrentMonth //very useful
        /* placeholder="pp.kk.aaaa" */
        {...other}
      />
    </LocalizationProvider>
  )
}
