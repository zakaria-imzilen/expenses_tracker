import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { Button } from "@mui/material";
import { signOut } from "firebase/auth";
import { auth } from "../config/fbconfig";
import { useDispatch } from "react-redux";
import { resetUser } from "../features/userSlice";

export default function Navbar({email}) {
	const dispatch = useDispatch();

	const handleLogout = () => {
		// FIREBASE HERE ⚠⚠⚠
		signOut(auth).then(() => {
			dispatch(resetUser());
		})
	}

	return (
		<Box sx={{ flexGrow: 1 }}>
			<AppBar position="static">
				<Toolbar variant="dense">
					<IconButton
						edge="start"
						color="inherit"
						aria-label="menu"
						sx={{ mr: 2 }}
					>
						<MenuIcon />
					</IconButton>
					<Typography variant="h6" color="inherit" component="div">
						Welcome {email}
					</Typography>
					<Button onClick={handleLogout} variant="contained" color="error"> Log OUT</Button>
				</Toolbar>
			</AppBar>
		</Box>
	);
}
