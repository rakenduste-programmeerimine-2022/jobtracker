const express = require("express")
const cors = require("cors")
const cookieSession = require("cookie-session")
const dotenv = require("dotenv")
const serviceRoutes = require("./routes/service.routes")
const clientRoutes = require("./routes/client.routes")

dotenv.config()
const app = express()

let corsOptions = {
  origin: "http://localhost:3000",
  credentials: true,
}

app.use(cors(corsOptions))

app.use(express.json())

app.use(express.urlencoded({ extended: true }))

app.use(
  cookieSession({
    name: "JobTracker-session",
    secret: process.env.SECRET_KEY,
    maxAge: 2 * 60 * 60 * 1000,
    httpOnly: true,
    sameSite: "strict", //"lax", //"none",
    secure: false, //true,
  })
)

require("./routes/auth.routes")(app)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}.`)
})

const db = require("./models")

//console.log(db)

db.mongoose
  .connect(process.env.DB)
  .then(() => {
    console.log("MongoDB ühendus olemas")
  })
  .catch((err) => {
    console.error("Connection error", err)
    process.exit()
  })

app.use("/api/services", serviceRoutes)
app.use("/api/clients", clientRoutes)
