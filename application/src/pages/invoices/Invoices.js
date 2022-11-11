import React from "react"

/*
Kasutajaliideses:
1. tabel:
- kasutaja id
- klient (klienditabelist)
- arve nr (automaatselt koostab)
- koostamise kuupäev
- maksetähtaeg
- lõppsumma
- käibemaks
- summa koos käibemaksuga

2. tabel:
- arve id
- töö id

Serveri poolel:
const invoiceSchema = new Schema(
  {
    userId: { type: String, required: true},
    clientId: { type: String, required: true}, 
    invoiceNo: { type: String, required: true},
    creationDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    priceSum: { type: Decimal128, required: true },
    taxSum: { type: Decimal128, required: true },
    totalSum: { type: Decimal128, required: true },
  },
  { timestamps: true }
)

const invoiceLineSchema = new Schema(
  {
    invoiceId: { type: String, required: true}, 
    jobId: { type: String, required: true },
  },
  { timestamps: true }
)

*/

const Invoices = () => {
  return <div>Invoices</div>
}

export default Invoices
