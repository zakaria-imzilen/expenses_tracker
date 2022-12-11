import { useState, useEffect, useRef } from "react";

import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import { Button, CardActions, TextField } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteReceipt,
	getUserReceipts,
	resetIsEdit,
	setDocToEdit,
	updateReceipt,
	updateReceiptImg,
} from "../features/userSlice";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

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

	const handleSave = async () => {
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
				await dispatch(
					updateReceipt({
						id: data.id,
						uid: data.uid,
						dateReceipt: newDate,
						name: newName,
						amount: newAmount,
						imgURL: data.imgURL,
					})
				);
				await dispatch(getUserReceipts(data.uid));
				await dispatch(resetIsEdit());
				setIsItMe(false);
			}
		}
	};

	// Delete Dialog togglers
	const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

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
						<div className="mb-3 d-flex gap-2 justify-content-end w-100">
							<EditIcon
								className="actionsReceipt"
								onClick={() => {
									dispatch(resetIsEdit());
									dispatch(setDocToEdit(data.id));
								}}
								fontSize="small"
								color="primary"
							/>
							<DeleteIcon
								className="actionsReceipt"
								fontSize="small"
								color="error"
								onClick={() => setOpenDeleteDialog(true)}
							/>
						</div>
					)}
				</CardActions>
			</Card>

			<Dialog
				open={openDeleteDialog}
				onClose={() => setOpenDeleteDialog(false)}
				aria-labelledby="alert-dialog-title"
				aria-describedby="alert-dialog-description"
			>
				<DialogTitle id="alert-dialog-title">
					{"Sure you want to delete this receipt"}
				</DialogTitle>
				<DialogContent>
					<DialogContentText id="alert-dialog-description">
						You cannot recover it once deleted.
					</DialogContentText>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
					<Button
						variant="contained"
						color="error"
						onClick={async () => {
							await dispatch(deleteReceipt({ id: data.id, img: data.imgURL }));
							await dispatch(getUserReceipts(data.uid));
							setOpenDeleteDialog(false);
						}}
						autoFocus
					>
						DELETE
					</Button>
				</DialogActions>
			</Dialog>
		</>
	);
};

export default Receipt;
