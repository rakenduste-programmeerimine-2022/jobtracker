import { useMemo, useState } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
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
  const [serviceData, setServiceData] = useState(null)
  const [clientData, setClientData] = useState(null)
  const SERVICE_URL = "/api/services/"
  const CLIENT_URL = "/api/clients/"

  useMemo(() => {
    const loadServiceData = async () => {
      if (userData) {
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
    /*   const loadClientData = async () => {
      if (userData) {
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
    } */
    loadServiceData()
    //loadClientData()
  }, [userData])

  const providerValue = useMemo(
    () => ({ userData, setUserData, serviceData, setServiceData }),
    [userData, setUserData, serviceData, setServiceData]
  )

  console.log(userData)
  //console.log(serviceData)

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
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  )
}

export default App
