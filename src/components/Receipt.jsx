import { useState, useEffect, useRef } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
	resetIsEdit,
	setDocToEdit,
	updateReceipt,
	updateReceiptImg,
} from "../features/userSlice";

const Receipt = ({ data }) => {
	const user = useSelector((state) => state.user);
	const dispatch = useDispatch();

	const [isItMe, setIsItMe] = useState(false);

	useEffect(() => {
		console.log(user.docToEditId === data.id, data.name);
		if (user.docToEditId === data.id) {
			setIsItMe(true);
		} else {
			setIsItMe(false);
		}
	}, [user, data.id, data.name]);

	const imgRef = useRef(null);
	const [newName, setNewName] = useState(data.name);
	const [newImg, setNewImg] = useState();
	const [newAmount, setNewAmount] = useState(data.amount);
	const [newDate, setNewDate] = useState(data.dateReceipt);
	const [wrong, setWrong] = useState({
		newName: false,
		newDate: false,
		newAmount: false,
	});

	const handleSave = () => {
		if (newImg !== undefined) {
			// Check if the image has been changed
			dispatch(updateReceiptImg({ oldImg: data.imgURL, newImg: newImg }));
			// Here is a new image to be uploaded
			console.log("New Image");
		}

		// Check inputs
		if (typeof newName !== "string" || newName.length < 3) {
			setWrong((prev) => ({ ...prev, newName: true }));
			console.log(wrong);
		} else if (parseInt(newAmount) < 1) {
			setWrong((prev) => ({ ...prev, newAmount: true }));
			console.log(wrong);
		} else {
			// Check if the inputs values !== old values
			if (
				newName !== data.name ||
				newAmount !== data.amount ||
				newDate !== data.dateReceipt
			) {
				// --- dispatch(updateReceipt(...))
				dispatch(
					updateReceipt({
						id: data.id,
						uid: data.uid,
						dateReceipt: newDate,
						name: newName,
						amount: newAmount,
						imgURL: data.imgURL,
					})
				);
			}
		}
	};

	return (
		<>
			<Card className="col px-0" sx={{ maxWidth: 345 }}>
				{isItMe ? (
					<input
						type="file"
						className="form-control w-75 mx-auto mt-3"
						ref={imgRef}
						id="receiptUpImg"
						onChange={() => {
							setNewImg(imgRef.current.files[0]);
						}}
					/>
				) : (
					<CardMedia
						component="img"
						height="140"
						image={data.imgURL}
						alt="green iguana"
					/>
				)}

				<CardContent>
					{isItMe ? (
						<TextField
							label="Name"
							variant="standard"
							value={newName}
							onChange={({ target }) => setNewName(target.value)}
						/>
					) : (
						<Typography gutterBottom variant="h5" component="div">
							{data.name}
						</Typography>
					)}
					{isItMe ? (
						<input
							className="form-control my-2"
							type="date"
							label={`Name (${
								wrong.newName === true && "at least 4 characters"
							})`}
							variant="standard"
							value={newDate}
							onChange={({ target }) => setNewDate(target.value)}
						/>
					) : (
						<Typography variant="body2" color="text.secondary">
							{data.dateReceipt}
						</Typography>
					)}

					{isItMe ? (
						<input
							className="form-control my-2"
							type="number"
							label="Name"
							variant="standard"
							value={newAmount}
							onChange={({ target }) => setNewAmount(target.value)}
						/>
					) : (
						<Typography variant="body2" color="text.secondary">
							{data.amount}MAD
						</Typography>
					)}
				</CardContent>

				<CardActions>
					{isItMe ? (
						<>
							<Button onClick={handleSave} variant="contained" color="success">
								Save
							</Button>
							<Button
								onClick={() => dispatch(resetIsEdit())}
								variant="outlined"
								color="error"
							>
								Cancel
							</Button>
						</>
					) : (
						<Button
							onClick={() => {
								dispatch(resetIsEdit());
								dispatch(setDocToEdit(data.id));
							}}
							variant="text"
						>
							Edit
						</Button>
					)}
				</CardActions>
			</Card>
		</>
	);
};

export default Receipt;
