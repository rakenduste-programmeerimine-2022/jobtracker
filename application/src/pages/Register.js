import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { useContext, useRef, useState } from "react"
import { Link } from "react-router-dom"
import UserContext from "../contexts/UserContext"

const Register = () => {
  const nameRef = useRef()
  const surNameRef = useRef()
  const businessNameRef = useRef()
  const registerNoRef = useRef()
  const emailRef = useRef()
  const passwordRef = useRef()
  const passwordCheckRef = useRef()
  const user = {
    name: "",
    surname: "",
    businessName: "",
    regNumber: "",
    email: "",
    password: "",
  }
  const [nameError, setNameError] = useState("")
  const [surnameError, setSurnameError] = useState("")
  const [emailError, setEmailError] = useState("")
  const [passWordError, setPassWordError] = useState("")
  const [passwordMatchError, setPasswordMatchError] = useState("")
  const { setLoggedIn, setUserData } = useContext(UserContext)

  function handleSubmit() {
    let hasError = false
    if (nameRef.current.value === "") {
      setNameError("Palun sisesta nimi")
      hasError = true
    } else {
      user.name = nameRef.current.value
      setNameError("")
    }

    if (surNameRef.current.value === "") {
      setSurnameError("Palun sisesta perekonnanimi")
      hasError = true
    } else {
      user.surname = surNameRef.current.value
      setSurnameError("")
    }

    if (!isValidEmail(emailRef.current.value)) {
      setEmailError("Palun sisesta korrektne e-mail")
      hasError = true
    } else {
      user.email = emailRef.current.value
      setEmailError("")
    }

    if (!passwordValidate(passwordRef.current.value)) {
      setPassWordError(
        "Salasõna peab sisaldama vähemalt ühte numbrit ja suurt tähte ning olema vähemalt 8 tähemärki"
      )
      hasError = true
    } else {
      user.password = passwordRef.current.value
      setPassWordError("")
    }

    if (passwordRef.current.value !== passwordCheckRef.current.value) {
      setPasswordMatchError("Salasõna ei kattu salasõna kontrolliga")
      hasError = true
    } else {
      setPasswordMatchError("")
    }

    user.businessName = businessNameRef.current.value
    user.regNumber = registerNoRef.current.value

    if (!hasError) postSignup()
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  function passwordValidate(password) {
    let check = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/
    if (password.match(check)) {
      return true
    } else {
      return false
    }
  }

  async function postSignup() {
    const requestOptions = {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }

    const response = await fetch(
      "http://localhost:8080/auth/signup",
      requestOptions
    )
    const data = await response.json()

    if (response.status === 400) {
      setEmailError("See e-posti aadress on juba võetud")
    }

    if (response.status === 200) {
      let temp = { ...data, loggedIn: true }
      setUserData(temp)
      sessionStorage.setItem("user", JSON.stringify(temp))
      setLoggedIn(true)
    }
  }

  return (
    <Box
      sx={{
        backgroundColor: "white",
        width: "500px",
        height: "600px",
        margin: "auto",
        marginTop: "10vh",
      }}
    >
      <Box sx={{ margin: "20px", backgroundColor: "white" }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              inputRef={nameRef}
              fullWidth
              required
              label="Eesnimi"
              error={nameError.length > 0 ? true : false}
              helperText={nameError}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              inputRef={surNameRef}
              fullWidth
              required
              label="Perekonnanimi"
              error={surnameError.length > 0 ? true : false}
              helperText={surnameError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              inputRef={businessNameRef}
              fullWidth
              label="Ettevõtte nimi"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputRef={registerNoRef}
              type="number"
              label="Registrinumber"
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputRef={emailRef}
              required
              type="email"
              label="E-mail"
              error={emailError.length > 0 ? true : false}
              helperText={emailError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputRef={passwordRef}
              required
              type="password"
              label="Salasõna"
              error={passWordError.length > 0 ? true : false}
              helperText={passWordError}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              inputRef={passwordCheckRef}
              required
              type="password"
              label="Kinnita salasõna"
              error={passwordMatchError.length > 0 ? true : false}
              helperText={passwordMatchError}
            />
          </Grid>
          <Grid item xs={12} marginTop={"50px"}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ height: "50px" }}
              onClick={handleSubmit}
            >
              Registreeri
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Oled juba registreerinud? <Link to="/login">Kliki siia</Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Register
