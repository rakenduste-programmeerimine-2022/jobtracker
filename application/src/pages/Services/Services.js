import React from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"

const Services = () => {
  return (
    <>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>Siia tuleb tabel</Box>
    </>
  )
}

export default Services
