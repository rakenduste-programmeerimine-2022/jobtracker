import React, { useContext, useEffect, useState } from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"
import axios from "../../api/axios"
import ServiceTable from "../../components/tables/ServiceTable"
import UserContext from "../../contexts/UserContext"

const SERVICE_URL = "/api/services/"

const Services = () => {
  const { userData, serviceData } = useContext(UserContext)

  return (
    /*  <ServiceContext.Provider value={[addService, setAddService]}> */
    <Box width={"100%"}>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom /* fetchData={fetchData} */ />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>
        <ServiceTable />
      </Box>
    </Box>
    /*  </ServiceContext.Provider> */
  )
}

export default Services
