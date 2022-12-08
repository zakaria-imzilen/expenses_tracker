import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ref, uploadBytes, getStorage } from "firebase/storage";

export const uploadExpenseImg = createAsyncThunk(
	"uploadImg",
	async (img, uid) => {
		const storage = getStorage();
		const baseURLforCloud = "gs://firstprj-7b27c.appspot.com"; // General Folder URL in the cloud

		const date = new Date();

		const imgDate = date.toISOString();
		const imgURL = `${baseURLforCloud}/testing/${imgDate}.jpg`; // Img URL
		const imgRef = ref(storage, imgURL);

		await uploadBytes(imgRef, img);
		return imgURL;
	}
);

const userSlice = createSlice({
	name: "user",
	initialState: {
		userAuth: null,
		imgUploadedURL: null,
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
		builder.addCase(uploadExpenseImg.fulfilled, (state, action) => {
			state.imgUploadedURL = action.payload;
		});
		builder.addCase(uploadExpenseImg.rejected, (state, action) => {
			state.imgUploadedURL = action.payload;
		});
	},
});

export default userSlice.reducer;
export const { setUser, resetUser } = userSlice.actions;
