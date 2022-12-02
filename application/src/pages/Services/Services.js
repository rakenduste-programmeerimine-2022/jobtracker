import React, { createContext, useEffect, useState } from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"
import axios from "../../api/axios"
import { NavLink } from "react-router-dom"
import ServiceTable from "../../components/Tables/ServiceTable"
import ServiceContext from "../../Contexts/ServiceContext"

const SERVICE_URL = "/api/services/"

const Services = () => {
  const [services, setServices] = useState([])

  const [addService, setAddService] = useState("")

  const fetchData = async () => {
    const response = await axios.get(SERVICE_URL)
    setServices(response.data)
  }
  

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <ServiceContext.Provider value={[addService, setAddService]}>
    <Box width={"100%"}>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom fetchData={fetchData} />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>

        <ServiceTable/>

      </Box>
    </Box>
    </ServiceContext.Provider>
  )
}

export default Services