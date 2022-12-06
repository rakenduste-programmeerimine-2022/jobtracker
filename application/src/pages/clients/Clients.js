import ClientForm from "./ClientForm"
import { Box, Divider } from "@mui/material"
import ClientTable from "../../components/tables/ClientTable"

const Clients = () => {
  return (
    <>
      <Box sx={{ m: 3, p: 3 }}>
        <ClientForm />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>
        <ClientTable />
      </Box>
    </>
  )
}

export default Clients
