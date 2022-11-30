import { useEffect, useState } from "react"
import { NavLink, Outlet } from "react-router-dom"
import {
  AppBar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  styled,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material"
import {
  Group as GroupIcon,
  ListAlt as ListAltIcon,
  Menu as MenuIcon,
  ReceiptLong as ReceiptIcon,
  Settings as SettingsIcon,
  Work as WorkIcon,
} from "@mui/icons-material"
import { v4 as uuid } from "uuid"

const drawerWidth = 260

const Layout = ({ children, window }) => {
  const theme = useTheme()

  const mdOnly = useMediaQuery(theme.breakpoints.down("md"))

  const [open, setOpen] = useState(() => (mdOnly ? false : true))

  const handleDrawerToggle = () => {
    mdOnly && setOpen(!open)
  }

  async function logOutClick() {
    const data = await fetch("http://localhost:8080/auth/signout", {
      credentials: "include",
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
    const json = await data.json()

    console.log(json)
  }

  useEffect(() => {
    mdOnly ? setOpen(false) : setOpen(true)
  }, [mdOnly])

  const container =
    window !== undefined ? () => window().document.body : undefined

  const MenuListItem = styled(ListItem)({
    color: "black",
    [theme.breakpoints.up("md")]: {
      color: "white",
    },
    "&:hover": {
      textDecoration: "underline",
    },
    "&.active": {
      textDecoration: "underline",
    },
  })

  const navList = [
    [
      { name: "Tööd", target: "/jobs", icon: <ListAltIcon /> },
      { name: "Arved", target: "/invoices", icon: <ReceiptIcon /> },
    ],
    [
      { name: "Kliendid", target: "/clients", icon: <GroupIcon /> },
      { name: "Teenused", target: "/services", icon: <WorkIcon /> },
    ],
  ]

  const navList2 = [
    { name: "Seaded", target: "/settings", icon: <SettingsIcon /> },
  ]

  return (
    <>
      <Box sx={{ display: "flex" }}>
        <Box component="nav">
          {mdOnly && (
            <AppBar
              position="fixed"
              sx={{
                zIndex: (theme) => theme.zIndex.drawer + 1,
              }}
            >
              <Toolbar>
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
                <Typography
                  component={NavLink}
                  to={"/jobs"}
                  variant="h6"
                  noWrap
                  sx={{ color: "white", textDecoration: "none" }}
                >
                  JobTracker
                </Typography>
              </Toolbar>
            </AppBar>
          )}

          <Drawer
            container={container}
            variant={mdOnly ? "temporary" : "permanent"}
            open={open}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              width: drawerWidth,
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
                background: "white",
                color: "white",
                [theme.breakpoints.down(400)]: {
                  width: "100vw",
                },
                [theme.breakpoints.up("md")]: {
                  background: theme.palette.primary.main,
                  color: "white",
                },
              },
            }}
          >
            <Toolbar>
              <Typography
                component={NavLink}
                to={"/jobs"}
                variant="h6"
                noWrap
                sx={{ color: "white", textDecoration: "none" }}
              >
                JobTracker
              </Typography>
            </Toolbar>
            <Stack
              direction="column"
              justifyContent="space-between"
              sx={{ height: "100vh" }}
            >
              <Box>
                {navList.map((element, index, elements) => (
                  <Box key={uuid()}>
                    <List key={uuid()} onClick={handleDrawerToggle}>
                      {element.map((item) => (
                        <MenuListItem
                          key={uuid()}
                          component={NavLink}
                          to={item.target}
                        >
                          <ListItemIcon
                            sx={{
                              color: "black",
                              [theme.breakpoints.up("md")]: {
                                color: "white",
                              },
                            }}
                          >
                            {item.icon}
                          </ListItemIcon>
                          <ListItemText primary={item.name} />
                        </MenuListItem>
                      ))}
                    </List>
                    {elements[index + 1] && <Divider />}
                  </Box>
                ))}
              </Box>
              <List onClick={handleDrawerToggle}>
                {navList2.map((item, index) => (
                  <MenuListItem
                    key={item.name}
                    component={NavLink}
                    to={item.target}
                  >
                    <ListItemIcon
                      sx={{
                        color: "black",
                        [theme.breakpoints.up("md")]: {
                          color: "white",
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText primary={item.name} />
                  </MenuListItem>
                ))}
                <MenuListItem>
                  <ListItemIcon />
                  <Typography
                    sx={{ "&:hover": { cursor: "pointer" } }}
                    onClick={logOutClick}
                  >
                    Logi välja
                  </Typography>
                </MenuListItem>
              </List>
            </Stack>
          </Drawer>
        </Box>
        <Box component="main" sx={{ p: 3 }}>
          {mdOnly && <Toolbar />}
          <Outlet />
        </Box>
      </Box>
    </>
  )
}

export default Layout
