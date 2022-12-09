import { useContext, useEffect, useRef, useState } from "react"
import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import { Link, Navigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

const Login = () => {
  const emailRef = useRef()
  const passwordRef = useRef()
  const user = { email: "", password: "" }
  const [emailError, setEmailError] = useState("")
  const [passWordError, setPassWordError] = useState("")
  const { loggedIn, setLoggedIn, setUserData } = useContext(UserContext)

  function handleSubmit() {
    let hasError = false
    if (!isValidEmail(emailRef.current.value)) {
      setEmailError("Palun sisesta korrektne e-mail")
      hasError = true
    } else {
      user.email = emailRef.current.value
      setEmailError("")
    }

    if (passwordRef.current.value === "") {
      setPassWordError("Palun sisesta salasõna")
      hasError = true
    } else {
      user.password = passwordRef.current.value
      setPassWordError("")
    }

    if (!hasError) {
      postLogin()
    }
  }

  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email)
  }

  async function postLogin() {
    //const json = JSON.stringify(user)
    const requestOptions = {
      credentials: "include",
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    }

    const response = await fetch(
      "http://localhost:8080/auth/signin",
      requestOptions
    )
    const data = await response.json()

    if (response.status === 401 || response.status === 404)
      setPassWordError("Vale salasõna või kasutajatunnus")

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
          <Grid item xs={12} marginTop={"50px"}>
            <Button
              fullWidth
              variant="contained"
              size="large"
              sx={{ height: "50px" }}
              onClick={handleSubmit}
            >
              Logi sisse
            </Button>
          </Grid>
          <Grid item xs={12}>
            <Typography>
              Pole veel registreeritud? <Link to="/register">Kliki siia</Link>
            </Typography>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

export default Login
