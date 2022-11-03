import { AppBar, Box, Button, Toolbar, Typography } from "@mui/material"
import { useNavigate, NavLink } from "react-router-dom"

const Layout = ({ children }) => {
  return (
    <>
      <AppBar sx={{ position: "static", height: "10%", zIndex: "auto" }}>
        <Toolbar>
          <Box
            component="ul"
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              listStyle: "none",
              gap: "20px",
            }}
          >
            <Box component="li">
              <NavLink to="jobs">Tööd</NavLink>
            </Box>

            <Box component="li">
              <NavLink to="invoices">Arved</NavLink>
            </Box>
            <Box component="li">
              <NavLink to="clients">Kliendid</NavLink>
            </Box>
            <Box component="li">
              <NavLink to="services">Teenused</NavLink>
            </Box>
            <Box component="li">
              <NavLink to="settings">Seaded</NavLink>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      {children}
    </>
  )
}

export default Layout
