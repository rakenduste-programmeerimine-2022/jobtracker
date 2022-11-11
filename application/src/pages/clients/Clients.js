import ClientForm from "./ClientForm"
import { Box, Divider } from "@mui/material"

/*
Kasutajaliideses:
- kasutaja id
- nimi
- registrikood
- KMKR nr
- aadress
- maksetähtaeg päevades (vaikimisi 14)

Serveri poolel:
const clientSchema = new Schema(
  {
    userId: { type: String, required: true},
    name: { type: String, required: true, unique: true }, 
    regcode: { type: String, unique: true, required: true },
    vatno: { type: String, unique: true },
    address: { type: String},
    term: { type: Int32, default: "14" },
  },
  { timestamps: true }
)

*/

const Clients = () => {
  return (
    <>
      <Box sx={{ m: 3, p: 3 }}>
        <ClientForm />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}>Siia tuleb tabel</Box>
    </>
  )
}

export default Clients
