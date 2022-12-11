import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
	addDoc,
	collection,
	deleteDoc,
	doc,
	getDocs,
	query,
	setDoc,
	where,
} from "firebase/firestore";
import { deleteObject, ref, uploadBytes } from "firebase/storage";
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
				dateReceipt: receipt.data().dateReceipt,
				id: receipt.id,
			});
		}

		return allReceipts;
	}
);

// FIREBASE Firestore UPDATE IMG HERE ⚠⚠⚠
export const updateReceiptImg = createAsyncThunk(
	"updateReceiptImg",
	async (thunkAPI) => {
		await uploadBytes(ref(storage, thunkAPI.oldImg), thunkAPI.newImg);
	}
);

// FIREBASE Firestore UPDATE HERE ⚠⚠⚠
export const updateReceipt = createAsyncThunk("updateReceipt", (thunkAPI) => {
	setDoc(doc(db, "Receipts", thunkAPI.id), {
		uid: thunkAPI.uid,
		dateReceipt: thunkAPI.dateReceipt,
		name: thunkAPI.name,
		amount: thunkAPI.amount,
		imgURL: thunkAPI.imgURL,
	});
});

// FIREBASE Firestore DELETE HERE ⚠⚠⚠
export const deleteReceipt = createAsyncThunk(
	"deleteReceipt",
	async (thunkAPI) => {
		await deleteDoc(doc(db, "Receipts", thunkAPI.id));
		await deleteObject(ref(storage, thunkAPI.img));
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
		isEdit: false,
		docToEditId: null,
		docDeleting: null,
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
		setDocToEdit: (state, { payload }) => {
			state.isEdit = true;
			state.docToEditId = payload;
		},
		resetIsEdit: (state) => {
			state.isEdit = false;
			state.docToEditId = null;
		},
		resetDocDeletingStatus: (state) => {
			state.docDeleting = null;
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
		// DELETE Receipt
		builder.addCase(deleteReceipt.pending, (state) => {
			state.docDeleting = "pending";
		});
		builder.addCase(deleteReceipt.fulfilled, (state) => {
			state.docDeleting = true;
		});
		builder.addCase(deleteReceipt.rejected, (state) => {
			state.docDeleting = false;
		});
	},
});

export default userSlice.reducer;
export const {
	setUser,
	resetUser,
	setDocToEdit,
	resetIsEdit,
	resetDocDeletingStatus,
} = userSlice.actions;
