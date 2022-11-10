import React from "react"
import { Button as MuiButton } from "@mui/material"

export const Button = (props) => {
  const { text, size, color, variant, onClick, ...other } = props
  return (
    <MuiButton
      size={size || "large"}
      color={color || "primary"}
      variant={variant || "contained"}
      onClick={onClick}
      sx={{ mx: 1, my: 2 }}
      {...other}
    >
      {text}
    </MuiButton>
  )
}
