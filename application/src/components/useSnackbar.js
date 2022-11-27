import { useState } from "react"
import { Alert, Snackbar as MuiSnackbar } from "@mui/material"

export const useSnackbar = () => {
  const [snackbarOpen, setSnackbarOpen] = useState(false)
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
  }
}

export const Snackbar = (props) => {
  const { onClose, open, text } = props
  return (
    <MuiSnackbar
      open={open}
      autoHideDuration={6000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert onClose={onClose} severity="success" sx={{ width: "100%" }}>
        {text}
      </Alert>
    </MuiSnackbar>
  )
}
