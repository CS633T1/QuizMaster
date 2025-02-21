"use client";

import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircle from "@mui/icons-material/AccountCircle";
import Switch from "@mui/material/Switch";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import {
  Button,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useFirebaseAuth } from "@/hooks/useFirebaseAuth";

export default function MenuAppBar() {
  const { user, logOut } = useFirebaseAuth(); //if there is a user, then you are logged in
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const router = useRouter();

  // Different Nav Options to different users
  const navMap_options = {
    guest: {
      Home: "/",
    },
    user: {
      Home: "/",
      Quizzes: "/user/past-quizzes",
    },
    admin: {
      Home: "/",
      Admin: "/admin",
    },
  };

  // Based on some configurations, choose which navMap to render
  const navMap =
    navMap_options?.[
      user !== null
        ? user.email === "admin@gmail.com"
          ? "admin"
          : "user"
        : "guest"
    ];
  const drawerWidth = 240;

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  // Logs user out, redirect to home
  const handleLogOut = () => {
    console.log("Log out hit ");
    logOut();
    router.push("/");
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const drawer = (
    <Box onClick={() => handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography
        variant="h6"
        sx={{ my: 2, cursor: "pointer" }}
        onClick={() => router.push("/")}
      >
        QuizMaster
      </Typography>
      <Divider />
      <List>
        {Object?.keys(navMap).map((item) => (
          <ListItem key={item} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              onClick={() => handleMenuRouting(item)}
            >
              <ListItemText primary={item} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  const handleMenuRouting = (key: string): void => {
    const routeUrl = (navMap as any)?.[key];
    console.log("Naving to Route", routeUrl);
    // we should validate the route but ....its ok
    router.push(routeUrl);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2, display: { xs: "block", sm: "none" } }}
            onClick={handleDrawerToggle}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, cursor: "pointer" }}
            onClick={() => router.push("/")}
          >
            QuizMaster
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {Object?.keys(navMap).map((item) => (
              <Button
                key={item}
                onClick={() => handleMenuRouting(item)}
                sx={{ color: "#fff" }}
              >
                {item}
              </Button>
            ))}
          </Box>
          {!user && (
            <Button color="inherit" onClick={() => router.push("/login")}>
              Login
            </Button>
          )}
          {user && (
            <Box sx={{ display: "flex" }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
                sx={{ gap: "10px" }}
              >
                <Typography
                  variant="body1"
                  component="div"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  {user?.email}
                </Typography>
                <AccountCircle />
              </IconButton>

              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => router.push("/user/settings")}>
                  Settings
                </MenuItem>
                <MenuItem onClick={handleLogOut}>Logout</MenuItem>
              </Menu>
            </Box>
          )}
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}
