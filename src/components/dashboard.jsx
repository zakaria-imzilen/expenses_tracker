import Navbar from "./Navbar";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { doc, onSnapshot } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../config/fbconfig";
import {
	addReceipt,
	getUserReceipts,
	setUser,
	uploadExpenseImg,
} from "../features/userSlice";
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
import LoadingButton from "@mui/lab/LoadingButton";
import Receipt from "./Receipt";
import CachedIcon from "@mui/icons-material/Cached";

const Dashboard = () => {
	const user = useSelector((state) => state.user);
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [expensesWindowStatus, setExpensesWindowStatus] = useState(false);
	const [dateReceipt, setDateReceipet] = useState(new Date());
	const [name, setName] = useState("");
	const [img, setImg] = useState();
	const [amount, setAmount] = useState(0);

	const imgRef = useRef(null);

	useEffect(() => {
		if (user.isEdit) {
			const unsub = onSnapshot(doc(db, "Receipts", user.docToEditId), (doc) => {
				console.log("Current data: ", doc.data());
			});

			return () => unsub();
		}
	}, [user.isEdit, user.docToEditId]);

	// Loader
	const [loadNow, setLoadNow] = useState(false);
	useEffect(() => {
		if (
			user.gettingReceipts === "pending" ||
			user.receiptUploaded === "pending" ||
			user.deleteReceipt === "pending"
		) {
			setLoadNow(true);
		} else {
			setLoadNow(false);
		}
	}, [user.gettingReceipts, user.receiptUploaded, user.deleteReceipt]);

	// Loader
	const [errorAlert, setErrorAlert] = useState(false);
	useEffect(() => {
		if (
			user.gettingReceipts === false ||
			user.receiptUploaded === false ||
			user.deleteReceipt === false
		) {
			setErrorAlert(true);
		} else {
			setErrorAlert(false);
		}
	}, [user.gettingReceipts, user.receiptUploaded, user.deleteReceipt]);

	const handleSubmit = async () => {
		let imgURLReturned;
		if (img) {
			try {
				imgURLReturned = await dispatch(
					uploadExpenseImg({ img, uid: user.userAuth.id })
				);
			} catch (error) {
				alert(error);
			}
		}

		if (name.length > 4 && parseInt(amount) > 0) {
			await dispatch(
				addReceipt({
					uid: user.userAuth.id,
					dateReceipt: dateReceipt,
					name: name,
					amount: amount,
					imgURL: imgURLReturned.payload,
				})
			);
		}
	};

	useEffect(() => {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				dispatch(
					setUser({
						uid: user.uid,
						email: user.email,
					})
				);
				dispatch(getUserReceipts(user.uid));
			} else {
				navigate("/");
			}
		});
	}, [dispatch, navigate]);

	const renderAlertResultOfUpload = () => {
		if (user?.imgUploaded === true && user?.receiptUploaded === true) {
			<Alert severity="success">Uploaded successfuly</Alert>;
		} else if (user?.imgUploaded === null && user?.receiptUploaded === null) {
			return;
		} else if (
			user?.imgUploaded === true &&
			(user?.receiptUploaded === false || user?.receiptUploaded === null)
		) {
			return (
				<>
					<Alert severity="success">Image uploaded successfuly!</Alert>
					<Alert severity="error">Failed to upload the receipt</Alert>
				</>
			);
		} else if (user?.imgUploaded === false && user?.receiptUploaded === true) {
			return (
				<>
					<Alert severity="success">Receipt added successfuly!</Alert>
					<Alert severity="error">Failed to upload the image</Alert>
				</>
			);
		} else {
			return <Alert severity="error">Failed!</Alert>;
		}
	};

	useEffect(() => {
		if (user.imgUploadedURL !== null) {
			setExpensesWindowStatus(false);
		}
	}, [user]);

	const renderReceiptsCards = () => {
		if (user?.gettingReceipts === true) {
			return user?.allReceipts.map((receipt) => (
				<Receipt key={receipt.id} data={receipt} />
			));
		} else if (user?.gettingReceipts === "pending") {
			<Loader />;
		} else {
			return (
				<h6 className="text-center position-absolute top-50 left-50 translate-middle">
					No receipts yet
				</h6>
			);
		}
	};

	const rerenderReceipts = () => {
		dispatch(getUserReceipts(user.userAuth.id));
	};

	const [alertStatus, setAlertStatus] = useState(false);

	if (user.userAuth === null) {
		return <Loader />;
	} else {
		return (
			<div className="dashboard">
				{loadNow && <Loader />}
				{errorAlert && (
					<Alert color="error" onClose={() => setAlertStatus(false)}>
						Sorry, something went wrong!
					</Alert>
				)}
				{renderAlertResultOfUpload()}
				{user?.imgUploaded === true && user?.receiptUploaded === true && (
					<Alert severity="success">Added successfuly!</Alert>
				)}

				<Navbar email={user.userAuth.email} />

				<div className="container mx-auto my-5 d-flex gap-3 justify-content-around align-items-center">
					<h3 className="display-3 col">Expenses</h3>
					<i
						onClick={() => setExpensesWindowStatus(true)}
						className="bi bi-plus-circle fs-5"
					></i>
					<CachedIcon
						style={{ cursor: "pointer" }}
						color="primary"
						onClick={rerenderReceipts}
					/>
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
							value={dateReceipt}
							onChange={({ target }) => setDateReceipet(target.value)}
						/>

						<input
							className="form-control"
							type="file"
							name="img"
							id="fileImgNewReceipt"
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
							Update
						</Button>
					</DialogActions>
				</Dialog>

				{/* Display receipts */}
				<div
					className="mx-auto mb-5 receipts row row-cols-5 flex-wrap gap-3 justify-content-center"
					style={{ maxWidth: "80vw" }}
				>
					{renderReceiptsCards()}
				</div>
			</div>
		);
	}
};

export default Dashboard;
