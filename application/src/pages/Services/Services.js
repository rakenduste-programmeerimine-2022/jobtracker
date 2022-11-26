import React, { useEffect, useState } from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"
import axios from "../../api/axios"

const SERVICE_URL = "/api/services/"

const Services = () => {
  const [services, setServices] = useState([])

  const fetchData = async () => {
    const response = await axios.get(SERVICE_URL)
    setServices(response.data)
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom fetchData={fetchData} />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>
        <div>See tuleks asendada kas tabeli või korraliku listiga</div>
        {services.map((service) => {
          return (
            <div key={service._id}>
              <span>{service.code}</span>
              <span>{service.description}</span>
            </div>
          )
        })}
      </Box>
    </>
  )
}

export default Services
