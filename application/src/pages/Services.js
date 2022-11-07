import React from "react"

/*
Kasutajaliideses:
- kasutaja id
- kood
- kirjeldus
- ühiku nimi
- ühiku hind
- maksumäär (0, 9, 20)

Serveri poolel:
const serviceSchema = new Schema(
  {
    userId: { type: String, required: true},
    code: { type: String, required: true, unique: true }, 
    description: { type: String, required: true },
    unit: { type: String, required: true },
    price: { type: Decimal128, required: true },
    tax: { type: Decimal128, enum: ["0.0", "9.0", 20.0"], default: "20.0" },
  },
  { timestamps: true }
)
*/

const Services = () => {
  return <div>Services</div>
}

export default Services
