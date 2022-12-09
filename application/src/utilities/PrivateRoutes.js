//import { JavascriptOutlined } from "@mui/icons-material"
import { useContext, useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function PrivateRoutes() {
  const { userData, setUserData, loggedIn, setLoggedIn } =
    useContext(UserContext)

  useEffect(() => {
    async function fetchData() {
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
    fetchData()
  }, [userData, loggedIn, setLoggedIn, setUserData])

  return loggedIn ? <Outlet /> : <Navigate to={"login"} />
}

export default PrivateRoutes
