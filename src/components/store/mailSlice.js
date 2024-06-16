import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  mails: [],
  sentMails: [],
  receivedMails: [],
  loading: false,
  unreadCount:0,
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

export const removeSentMail = createAsyncThunk(
  "mail/removeSentMail",
    async ({ userEmail ,id}, { rejectWithValue }) => {
     try {
    await fetch(`https://mail-box-b3a52-default-rtdb.firebaseio.com/mails/${userEmail}/${id}.json`, {
      method: "DELETE"
    })
    return id;
  
  } catch (error) {
    return rejectWithValue(error.message);
  }
}
)

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


export const markAsRead = createAsyncThunk(
  "mail/markAsRead",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const mail = state.mail.receivedMails.find((mail) => mail.id === id);

    try {
      const response = await fetch(
        `https://mail-box-b3a52-default-rtdb.firebaseio.com/mails/${mail.from.replace(
          /\./g,
          "_"
        )}/${id}.json`,
        {
          method: "PATCH",
          body: JSON.stringify({ read: true }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error.message);
      }

      return { id, read: true };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


export const deleteMail = createAsyncThunk(
  "mail/deleteMail",
  async (id, { getState, rejectWithValue }) => {
    const state = getState();
    const mail = state.mail.receivedMails.find((mail) => mail.id === id);

    try {
      const response = await fetch(
        `https://mail-box-b3a52-default-rtdb.firebaseio.com/mails/${mail.from.replace(
          /\./g,
          "_"
        )}/${id}.json`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData.error.message);
      }

      return id;
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
        state.receivedMails = action.payload || [];
         state.unreadCount = action.payload.filter((mail) => !mail.read).length;

      })
      .addCase(fetchReceivedMails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(markAsRead.fulfilled, (state, action) => {
        const index = state.receivedMails.findIndex(
          (mail) => mail.id === action.payload.id
        );
        if (index !== -1) {
          state.receivedMails[index].read = action.payload.read;
          state.unreadCount -= 1;
        }
      })
      .addCase(deleteMail.fulfilled, (state, action) => {
        state.receivedMails = state.receivedMails.filter(
          (mail) => mail.id !== action.payload
        );
      })
      .addCase(removeSentMail.fulfilled, (state, action) => {
        state.sentMails = state.sentMails.filter(
          (mail) => mail.id !== action.payload
        )
      });
  },
});

export default mailSlice.reducer;
