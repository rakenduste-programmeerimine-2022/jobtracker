const express = require("express")
const cors = require("cors")
const cookieSession = require("cookie-session")
const dotenv = require("dotenv")

dotenv.config()
const app = express()

let corsOptions = {
  origin: "http://localhost:3000",
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
  })
)

require("./Routes/auth.routes")(app)

const PORT = process.env.PORT || 8080

app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}.`)
})

const db = require("./Models")

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
