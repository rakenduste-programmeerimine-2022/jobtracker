import { useContext, useEffect, useLayoutEffect, useState } from "react"
import { Outlet, Navigate } from "react-router-dom"
import UserContext from "../contexts/UserContext"

function PrivateRoutes() {
  const [auth, setAuth] = useState([false])
  const { userData } = useContext(UserContext)

  //console.log(auth)

  useEffect(() => {
    async function fetchData() {
      const data = await fetch("http://localhost:8080/auth/tokencheck", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      const json = await data.json()
      //console.log(json.success)
      setAuth(json.success)
    }
    fetchData()
    //console.log(auth)
  })
  //}, [userData])

  return auth ? <Outlet /> : <Navigate to={"login"} />
}

export default PrivateRoutes
