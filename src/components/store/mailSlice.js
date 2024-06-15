
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  sentMails: [],
  receivedMails: [],
  loading: false,
  error: null,
};

export const sendMail = createAsyncThunk(
  "mail/sendMail",
  async ({ userEmail, mailData }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://mail-box-b3a52-default-rtdb.firebaseio.com/mails/${userEmail}.json`,
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
        `https://mail-box-b3a52-default-rtdb.firebaseio.com/mails/${userEmail}.json`,
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
      console.log("Sent Mails:", data);
      return Object.keys(data).map((key) => ({ id: key, ...data[key] }));
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchReceivedMails = createAsyncThunk(
  "mail/fetchReceivedMails",
  async ({ userEmail }, { rejectWithValue }) => {
    try {
      const response = await fetch(
        `https://mail-box-b3a52-default-rtdb.firebaseio.com/mails.json`,
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
      const receivedMails = [];

      for (const senderEmail in data) {
        for (const mailId in data[senderEmail]) {
          if (data[senderEmail][mailId].to.replace(/\./g, "_") === userEmail) {
            receivedMails.push({ id: mailId, ...data[senderEmail][mailId] });
          }
        }
      }

      return receivedMails;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const mailSlice = createSlice({
  name: "mail",
  initialState,
  reducers: {
    markAsRead: (state, action) => {
      const mail = state.receivedMails.find((m) => m.id === action.payload);
      if (mail) {
        mail.read = true;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendMail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sendMail.fulfilled, (state, action) => {
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
      })
      .addCase(fetchReceivedMails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReceivedMails.fulfilled, (state, action) => {
        state.loading = false;
        state.receivedMails = action.payload;
      })
      .addCase(fetchReceivedMails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { markAsRead } = mailSlice.actions;
export default mailSlice.reducer;

