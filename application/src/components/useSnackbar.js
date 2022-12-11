import { useState } from "react"
import PropTypes from "prop-types"
import { Alert, Snackbar as MuiSnackbar } from "@mui/material"

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
  const [snackbarSeverity, setSnackbarSeverity] = useState("success")
  const [snackbarMessage, setSnackbarMessage] = useState()

  const showSnackbar = () => {
    setSnackbarOpen(true)
  }

  const hideSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return
    }
    setSnackbarOpen(false)
  }
  return {
    snackbarOpen,
    snackbarMessage,
    setSnackbarMessage,
    showSnackbar,
    hideSnackbar,
    snackbarSeverity,
    setSnackbarSeverity,
  }
}

export const Snackbar = (props) => {
  const { onClose, severity = "success", open, text } = props
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity={severity} sx={{ width: "100%" }}>
        {text}
      </Alert>
    </MuiSnackbar>
  )
}

Snackbar.propTypes = {
  onClose: PropTypes.func,
  severity: PropTypes.string,
  open: PropTypes.bool,
  text: PropTypes.string,
}
