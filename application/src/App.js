import { useCallback, useEffect, useMemo, useState } from "react"
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom"
import axios from "./api/axios"
import Layout from "./layouts/Layout"
import Clients from "./pages/clients/Clients"
import Invoices from "./pages/invoices/Invoices"
import Jobs from "./pages/jobs/Jobs"
import Login from "./pages/Login"
import NotFound from "./pages/NotFound"
import Register from "./pages/Register"
import Services from "./pages/services/Services"
import ServiceForm from "./pages/services/ServiceForm"
import Settings from "./pages/Settings"
import PrivateRoutes from "./utilities/PrivateRoutes"
import UserContext from "./contexts/UserContext"

const userDataInitialValue = {
  id: "",
  loggedIn: false,
  user: {
    address: "",
    businessName: "",
    email: "",
    iban: "",
    name: "",
    regNumber: "",
    surname: "",
    vat: "",
  },
}

function App() {
  const [userData, setUserData] = useState(null)
  const [loggedIn, setLoggedIn] = useState(null)
  const [serviceData, setServiceData] = useState("")
  const [clientData, setClientData] = useState("")
  const [jobData, setJobData] = useState("")
  const SERVICE_URL = "/api/services/"
  const CLIENT_URL = "/api/clients/"
  const JOB_URL = "/api/jobs/"

  const tokenCheck = useCallback(async () => {
    if (loggedIn) {
      const data = await fetch("http://localhost:8080/auth/tokencheck", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const json = await data.json()
      if (json.success === false) {
        sessionStorage.removeItem("user")
        setUserData(null)
        setLoggedIn(false)
      }
    }
  }, [loggedIn])

  useEffect(() => {
    tokenCheck()
  }, [userData, loggedIn, setLoggedIn, setUserData, tokenCheck])

  useEffect(() => {
    let sessionData = sessionStorage.getItem("user")
    if (loggedIn === null && !sessionData) {
      setLoggedIn(false)
    }
    if (loggedIn === null && sessionData) {
      tokenCheck()
      sessionData = sessionStorage.getItem("user")
      if (sessionData) {
        let temp = JSON.parse(sessionData)
        setUserData(temp)
        setLoggedIn(true)
        console.log("Kasutaja taastamine sessioonmälust")
      } else {
        console.log("Kasutaja seanss on aegnud")
      }
    }

    const loadServiceData = async () => {
      if (loggedIn) {
        try {
          const USER_SERVICE_URL = SERVICE_URL + userData.id
          const response = await axios.get(USER_SERVICE_URL)
          setServiceData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    const loadClientData = async () => {
      if (loggedIn) {
        try {
          const USER_CLIENT_URL = CLIENT_URL + userData.id
          const response = await axios.get(USER_CLIENT_URL)
          setClientData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    const loadJobData = async () => {
      if (loggedIn) {
        try {
          const USER_JOB_URL = JOB_URL + userData.id
          const response = await axios.get(USER_JOB_URL)
          setJobData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }

    loadServiceData()
    loadClientData()
    loadJobData()
  }, [userData, loggedIn, tokenCheck])

  //console.log("Kasutaja: ", userData)
  //console.log("Teenused: ", serviceData)
  //console.log("Kliendid: ", clientData)
  //console.log("Tööd: ", jobData)

  const providerValue = useMemo(
    () => ({
      userData,
      setUserData,
      loggedIn,
      setLoggedIn,
      serviceData,
      setServiceData,
      clientData,
      setClientData,
      jobData,
      setJobData,
    }),
    [userData, serviceData, clientData, loggedIn, jobData]
  )

  return (
    <UserContext.Provider value={providerValue}>
      {loggedIn !== null && (
        <BrowserRouter>
          <Routes>
            <Route element={<PrivateRoutes />}>
              <Route path="/" element={<Layout />}>
                <Route index element={<Jobs />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/invoices" element={<Invoices />} />
                <Route path="/clients" element={<Clients />} />
                <Route path="/services" element={<Services />} />
                {/* <Route path="/services/:id" exact element={<ServiceForm />} /> */}
                <Route path="/services/:id" element={<ServiceForm />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Route>
            <Route
              path="/register"
              element={loggedIn ? <Navigate replace to="/" /> : <Register />}
            />
            <Route
              path="/login"
              element={loggedIn ? <Navigate replace to="/" /> : <Login />}
            />
          </Routes>
        </BrowserRouter>
      )}
    </UserContext.Provider>
  )
}

export default App
