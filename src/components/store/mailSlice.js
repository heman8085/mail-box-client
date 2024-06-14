import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  sentMails: [],
  loading: false,
  error: null,
};

export const sendMail = createAsyncThunk(
  "mail/sendMail",
  async ({ userEmail, mailData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://react-auth-cc3df-default-rtdb.firebaseio.com/mails/${userEmail}.json`,
        {
          method: "POST",
          body: JSON.stringify(mailData),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error.message);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);



export const fetchSentMails = createAsyncThunk(
  "mail/fetchSentMails",
  async ({ userEmail }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://react-auth-cc3df-default-rtdb.firebaseio.com/mails/${userEmail}.json`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error.message);
      }
      const data = await response.json();
      return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(sendMail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state,action) => {
        state.loading = false;
         state.sentMails.push({
           id: action.meta.arg.userEmail,
           ...action.meta.arg.mailData,
         });
      })
      .addCase(sendMail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchSentMails.fulfilled, (state, action) => {
        state.sentMails = action.payload;
      });
  },
});

export default mailSlice.reducer;


