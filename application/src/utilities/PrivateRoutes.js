import { useEffect, useState } from "react"

import { Outlet, Navigate } from "react-router-dom"

function PrivateRoutes() {
  const [auth, setAuth] = useState([false])

  /*     useEffect(() => {
        fetch("http://localhost:8080/auth/tokencheck")
    .then(response => response.json())
    .then(data => console.log(data)).then(data => setAuth(data)).then(console.log(auth));


    },[]) */

  useEffect(() => {
    async function fetchData() {
      const data = await fetch("http://localhost:8080/auth/tokencheck", {
        credentials: "include",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })
      //console.log(data)
      const json = await data.json()

      //console.log(json)
      setAuth(json.success)
      //console.log(auth)
    }

    fetchData()
  }, [auth])

  //console.log(auth)

  return auth && auth ? <Outlet /> : <Navigate to={"login"} />
}

export default PrivateRoutes
