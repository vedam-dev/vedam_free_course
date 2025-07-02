import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  user_id: string | null;
  mobile: string | null;
  isLoggedIn: boolean;
  username: string | null;
}

const initialState: UserState = {
  user_id: null,
  mobile: null,
  isLoggedIn: false,
  username: null,
};

const getInitialState = (): UserState => {
  if(typeof window !== 'undefined') {
    const user_id = localStorage.getItem('userId');
    const mobile = localStorage.getItem('mobile');
    const isLoggedIn = localStorage.getItem('isLoggedIn') == 'true';
    const username = localStorage.getItem('username');
    return {
      user_id: user_id || null,
      mobile: mobile || null,
      isLoggedIn: isLoggedIn,
      username: username || null,
    };
  }
  return initialState;
};

const userSlice = createSlice({
  name: 'user',
  initialState: getInitialState(),
  reducers: {
    setUserId(state, action: PayloadAction<string>) {
      state.user_id = action.payload;
    },
    setMobile(state, action: PayloadAction<string>) {
      state.mobile = action.payload;
    },
    setIsLoggedIn(state, action: PayloadAction<boolean>) {
      state.isLoggedIn = action.payload;
    },
    setUsername(state, action: PayloadAction<string>) {
      state.username = action.payload;
    },
    resetUser(state) {
      state.user_id = null;
      state.mobile = null;
      state.isLoggedIn = false;
      state.username = null;
    },
  },
});

export const { setUserId, setMobile, setIsLoggedIn, setUsername, resetUser } = userSlice.actions;

export const store = configureStore({
  reducer: {
    user: userSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;