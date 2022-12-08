import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	addDoc,
	collection,
	getDocs,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { ref, uploadBytes } from "firebase/storage";
import { convertStorageImgURL, db, storage } from "../config/fbconfig";

// FIREBASE UPLOAD FUNCTION 👇🏻
export const uploadExpenseImg = createAsyncThunk(
	"uploadImg",
	async (thunkAPI) => {
		const baseURLforCloud = "gs://firstprj-7b27c.appspot.com"; // General Folder URL in the cloud

		const date = new Date();

		const imgDate = date.toISOString();
		const imgURL = `${baseURLforCloud}/${thunkAPI.uid}/${imgDate}.jpg`; // Img URL
		const imgRef = ref(storage, imgURL);

		await uploadBytes(imgRef, thunkAPI.img);
		return imgURL;
	}
);

// FIREBASE Firestore INSERT HERE ⚠⚠⚠
export const addReceipt = createAsyncThunk("addReceipt", async (thunkAPI) => {
	addDoc(collection(db, "Receipts"), thunkAPI);
});

// FIREBASE Firestore GET HERE ⚠⚠⚠
export const getUserReceipts = createAsyncThunk(
	"getUserReceipts",
	async (thunkAPI) => {
		const receipts = query(
			collection(db, "Receipts"),
			where("uid", "==", thunkAPI)
		);
		// Check 👆🏻
		const snapShot = await getDocs(receipts);
		let allReceipts = [];
		for (const receipt of snapShot.docs) {
			allReceipts.push({
				...receipt.data(),
				imgURL: await convertStorageImgURL(receipt.data().imgURL),
			});
		}

		return allReceipts;
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		userAuth: null,
		imgUploadedURL: null,
		imgUploaded: null,
		receiptUploaded: null,
		allReceipts: [],
		gettingReceipts: null,
	},
	reducers: {
		setUser: (state, { payload }) => {
			state.userAuth = {
				id: payload.uid,
				email: payload.email,
			};
		},
		resetUser: (state) => {
			state.userAuth = null;
		},
	},
	extraReducers: (builder) => {
		// Upload Receipt
		builder.addCase(uploadExpenseImg.fulfilled, (state, action) => {
			state.imgUploadedURL = action.payload;
			state.imgUploaded = true;
		});
		builder.addCase(uploadExpenseImg.rejected, (state, action) => {
			state.imgUploadedURL = action.payload;
			state.imgUploaded = false;
		});
		// Add Receipt
		builder.addCase(addReceipt.fulfilled, (state) => {
			state.receiptUploaded = true;
		});
		builder.addCase(addReceipt.pending, (state) => {
			state.receiptUploaded = "pending";
		});
		builder.addCase(addReceipt.rejected, (state) => {
			state.receiptUploaded = false;
		});
		// Get Receipts by user
		builder.addCase(getUserReceipts.fulfilled, (state, { payload }) => {
			state.gettingReceipts = true;
			state.allReceipts = payload;
		});
		builder.addCase(getUserReceipts.pending, (state) => {
			state.gettingReceipts = "pending";
		});
		builder.addCase(getUserReceipts.rejected, (state) => {
			state.gettingReceipts = false;
		});
	},
});

export default userSlice.reducer;
export const { setUser, resetUser } = userSlice.actions;
