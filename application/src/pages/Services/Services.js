import React, { useEffect, useState } from "react"
import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"

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
    <Box width={"100%"}>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom fetchData={fetchData} />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>Siia tuleb tabel</Box>
    </>
  )
}

export default Services
