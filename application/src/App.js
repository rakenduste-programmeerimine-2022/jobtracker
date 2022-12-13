import { useEffect, useMemo, useState } from "react"
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

function App() {
  const [userData, setUserData] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)
  const [serviceData, setServiceData] = useState("")
  const [clientData, setClientData] = useState("")
  const [jobData, setJobData] = useState("")
  const SERVICE_URL = "/api/services/"
  const CLIENT_URL = "/api/clients/"
  const JOB_URL = "/api/jobs/"

  const tokenCheck = async () => {
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
        setUserData(null)
        sessionStorage.removeItem("userId")
        setLoggedIn(false)
      }
    }
  }

  useMemo(() => {
    tokenCheck()
  }, [userData, loggedIn, setLoggedIn, setUserData])

  useMemo(() => {
    if (userData === null && !sessionStorage.getItem("user")) {
      setLoggedIn(false)
      return
    }
    if (userData === null && sessionStorage.getItem("user")) {
      let temp = JSON.parse(sessionStorage.getItem("user"))
      setUserData(temp)
      setLoggedIn(true)
      console.log("Kasutaja taastamine sessioonmälust")
    }

    const loadServiceData = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(SERVICE_URL, {
            params: {
              userId: userData.id,
            },
          })
          setServiceData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    const loadClientData = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(CLIENT_URL, {
            params: {
              userId: userData.id,
            },
          })
          setClientData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }
    const loadJobData = async () => {
      if (loggedIn) {
        try {
          const response = await axios.get(JOB_URL, {
            params: {
              userId: userData.id,
            },
          })
          setJobData(response.data)
        } catch (error) {
          console.log(error)
        }
      }
    }

    loadServiceData()
    loadClientData()
    loadJobData()
  }, [userData, loggedIn])

  //console.log("Kasutaja: ", userData)
  //console.log("Teenused: ", serviceData)
  //console.log("Kliendid: ", clientData)
  console.log("Tööd: ", jobData)

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
    <BrowserRouter>
      <UserContext.Provider value={providerValue}>
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
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
