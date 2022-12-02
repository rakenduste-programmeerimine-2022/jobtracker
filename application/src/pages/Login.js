import { Box, Button, Grid, TextField, Typography } from "@mui/material"
import React, { useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"

const Login = () => {


  const emailRef = useRef()
  const passwordRef = useRef()
  const user = {email: "", password: ""}
  const [emailError, setEmailError] = useState("")
  const [passWordError, setPassWordError] = useState("")
  
  

  function handleSubmit(){
  

    if(!isValidEmail(emailRef.current.value)){
      setEmailError("Palun sisesta korrektne e-mail")
    }else{
      user.email = emailRef.current.value
      setEmailError("")
    }

    if(passwordRef.current.value === ""){
      setPassWordError("Palun sisesta salasõna")
    }else{
      user.password = passwordRef.current.value
      setPassWordError("")
    }


    if(emailError === ""){
      postLogin()
    }
  }


  function isValidEmail(email) {
    return /\S+@\S+\.\S+/.test(email);
  }



  async function postLogin(){
    const json = JSON.stringify(user)
    console.log(json)
    const requestOptions = {
      credentials: "include",
      method: "POST",
      headers: {"Content-Type": 'application/json'},
      body: JSON.stringify(user)
    }


    const response = await fetch("http://localhost:8080/auth/signin", requestOptions);
    const data = await response.json();
    if(data.message !== "User Not found."){
      window.location.href = "/jobs"
    }
    console.log(data);
  }



  return <Box sx={{backgroundColor: "white", width: "500px", height: "600px", margin: "auto", marginTop: "10vh"}}>

    <Box sx={{margin:"20px", backgroundColor: "white"}}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            inputRef={emailRef}
            required
            type="email"
            label="E-mail"
            error = {emailError.length > 0 ? true : false}
            helperText = {emailError}
                />
        </Grid>
        <Grid item xs={12}>
          <TextField 
            fullWidth
            inputRef={passwordRef}
            required
            type="password"
            label="Salasõna"
            error = {passWordError.length > 0 ? true : false}
            helperText = {passWordError}

                />
        </Grid>
        <Grid item xs={12} marginTop={"50px"}>
          <Button fullWidth variant="contained" size="large" sx={{height: "50px"}} onClick={handleSubmit}>Logi sisse</Button>
        </Grid>
        <Grid item xs={12}>
          <Typography>Pole veel registreeritud? <Link to="/register">Kliki siia</Link></Typography>
        </Grid>

      </Grid>
    </Box>

  </Box>
}

export default Login
