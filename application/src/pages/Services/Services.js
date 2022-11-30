import React from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"
import TableTemplate from "../../components/TableTemplate"

const Services = () => {
  return (
    <Box width={"100%"}>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>Tabeli koht</Box>
    </Box>
  )
}

export default Services
