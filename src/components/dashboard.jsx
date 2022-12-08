import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/fbconfig";
import { setUser, uploadExpenseImg } from "../features/userSlice";
import Loader from "./Loader";
import {
	Alert,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	TextField,
} from "@mui/material";

const Dashboard = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [expensesWindowStatus, setExpensesWindowStatus] = useState(false);
	const [date, setDate] = useState(new Date());
	const [name, setName] = useState("");
	const [img, setImg] = useState();
	const [amount, setAmount] = useState(0);

	const imgRef = useRef(null);

	const handleSubmit = () => {
		if (img) {
			try {
				dispatch(uploadExpenseImg(img, user.userAuth.id));
			} catch (error) {
				alert(error);
			}
		}
	};

	useEffect(() => {
		// FIREBASE HERE ⚠⚠⚠
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				dispatch(
					setUser({
						uid: user.uid,
						email: user.email,
					})
				);
			} else {
				navigate("/");
			}
		});
	}, [dispatch, navigate]);

	useEffect(() => {
		if (user.imgUploadedURL !== null) {
			setExpensesWindowStatus(false);
		}
	}, [user]);

	if (user.userAuth === null) {
		return <Loader />;
	} else {
		return (
			<div className="dashboard">
				{user?.imgUploadedURL !== null && (
					<Alert severity="success">Uploaded successfuly</Alert>
				)}

				<Navbar email={user.userAuth.email} />

				<div className="container mx-auto my-5 d-flex justify-content-around align-items-center">
					<h3 className="display-3 col">Expenses</h3>
					<i
						onClick={() => setExpensesWindowStatus(true)}
						className="bi bi-plus-circle fs-5"
					></i>
				</div>

				<Dialog
					open={expensesWindowStatus}
					onClose={() => setExpensesWindowStatus(false)}
				>
					<DialogTitle>Add a new Expense</DialogTitle>
					<DialogContent>
						<input
							type="date"
							name="date"
							id="date"
							className="form-control mb-4"
							value={date}
							onChange={({ target }) => setDate(target.value)}
						/>

						<input
							className="form-control"
							type="file"
							name="img"
							id="img"
							ref={imgRef}
							onChange={() => {
								setImg(imgRef.current.files[0]);
							}}
						/>

						<TextField
							sx={{ m: 1 }}
							id="outlined-required"
							label="Name"
							defaultValue={name}
							onChange={({ target }) => setName(target.value)}
						/>

						<FormControl sx={{ m: 1 }}>
							<InputLabel htmlFor="outlined-adornment-amount">
								Amount
							</InputLabel>
							<OutlinedInput
								id="outlined-adornment-amount"
								value={amount}
								onChange={({ target }) => setAmount(target.value)}
								startAdornment={
									<InputAdornment position="start">MAD</InputAdornment>
								}
								label="Amount"
							/>
						</FormControl>
					</DialogContent>
					<DialogActions>
						<Button onClick={handleSubmit} autoFocus variant="contained">
							Add
						</Button>
					</DialogActions>
				</Dialog>
			</div>
		);
	}
};

export default Dashboard;
