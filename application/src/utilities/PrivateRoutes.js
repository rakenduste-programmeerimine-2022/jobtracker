//import { JavascriptOutlined } from "@mui/icons-material"
import { useContext, useEffect } from "react"
import { Outlet, Navigate } from "react-router-dom"
import UserContext from "../Contexts/UserContext"

function PrivateRoutes() {
  const { loggedIn } = useContext(UserContext)

  return loggedIn ? <Outlet /> : <Navigate to={"login"} />
}

export default PrivateRoutes
