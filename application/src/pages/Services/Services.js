import ServiceFrom from "./ServiceForm"
import { Box, Divider } from "@mui/material"
import ServiceTable from "../../components/tables/ServiceTable"

const Services = () => {
  return (
    <Box width={"100%"}>
      <Box sx={{ m: 3, p: 3 }}>
        <ServiceFrom />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>
        <ServiceTable />
      </Box>
    </Box>
  )
}

export default Services
