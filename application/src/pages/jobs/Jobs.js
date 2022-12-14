import JobForm from "./JobForm"
import JobTable from "../../components/tables/JobTable"
import { Box, Divider } from "@mui/material"

/*
Kasutajaliideses:
- kasutaja id
- klient (klienditabelist)
- teenuse kood (teenusetabelist)
- kirjeldus (teenust valides täidab selle teenuse kirjeldusega)
- ühik (teenust valides täidab selle teenuse ühikuga)
- kogus
- ühikuhind (teenust valides täidab selle teenuse ühikuhinnaga)
- maksumus
- maksumäär (teenust valides täidab selle teenuse maksumääraga, saab muuta: 0, 9, 20)
- tähtaeg
- olek (töös, valmis)
- arve nr (kui arve on koostatud)

const jobSchema = new Schema(
  {
    userId: { type: String, required: true},
    clientId: { type: String, required: true},
    serviceId: { type: String, required: true},
    description: { type: String, required: true},
    unit: { type: String, required: true },
    price: { type: Decimal128, required: true },
    tax: { type: Decimal128, enum: ["0.0", "9.0", 20.0"] },
    total: { type: Decimal128, required: true },
    dueDate: { type: Date, required: true },
    status: { type: String, enum: ["active", "finished"], default: "active" },
    invoiceID: { type: String},
    invoiceNo: { type: String},
  },
  { timestamps: true }
)
*/

const Jobs = () => {
  return (
    <>
      <Box sx={{ m: 3, p: 3 }}>
        <JobForm />
      </Box>

      <Divider />

      <Box sx={{ m: 3, p: 3 }}><JobTable/></Box>
    </>
  )
}

export default Jobs
