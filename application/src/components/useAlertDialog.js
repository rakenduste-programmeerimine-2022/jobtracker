import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material"

import { useState } from "react"

//export function useForm(initialValues, validateOnChange = false, validate) {
//export const useAlertDialog = () => {
export function useAlertDialog() {
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleDialogOpen = () => {
    console.log("tere")
    setDialogOpen(true)
  }

  const handleDialogClose = () => {
    setDialogOpen(false)
  }

  return {
    dialogOpen,
    handleDialogOpen,
    handleDialogClose,
  }
}

export const AlertDialog = (props) => {
  const { open, onClose, title, content, onDelete } = props
  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={onDelete}>Kustuta</Button>
          <Button onClick={onClose} autoFocus>
            Loobu
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
