import { Button, Dialog } from "@mui/material";
import { EmailAuthProvider, GoogleAuthProvider } from "firebase/auth";
import { useState } from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import { auth } from "../config/fbconfig";

const Home = () => {
	const [login, setLogin] = useState(false);

	// FIREBASE HERE ⚠⚠⚠
	const uiConfig = {
		signInFlow: "popup", // to get the user to fill his info in a pop up instead of a redirection page
		signInSuccessUrl: "/dashboard",
		signInOptions: [EmailAuthProvider.PROVIDER_ID, GoogleAuthProvider.PROVIDER_ID],
	};

	return (
		<>
			<div
				style={{ height: "100vh" }}
				className="container-fluid position-relative bg-primary bg-opacity-50 text-center"
			>
				<div className="position-absolute top-50 start-50 translate-middle">
					<h1 className="display-4 my-5 text-dark">
						Hello 👋🏻, it's the first time ZAKARIA is working 👨🏻‍💻
						<br /> with Firebase Authentication 👨🏻‍💻, Storage 🕸 & Firestore
						 Storage 🚀
					</h1>

					<Button
						variant="contained"
						color="primary"
						onClick={() => setLogin(true)}
					>
						Login IN / Register
					</Button>
				</div>
			</div>
			<Dialog open={login} onClose={() => setLogin(false)}>
				{/* FIREBASE HERE ⚠⚠⚠ */}
				<StyledFirebaseAuth
					uiConfig={uiConfig}
					firebaseAuth={auth}
				></StyledFirebaseAuth>
			</Dialog>
		</>
	);
};

export default Home;
