import { createSlice } from "@reduxjs/toolkit"

export interface ProjectState {
  id: string;
  uri: string;
  price: string;
  data: any;
}

const initialState: ProjectState = {
  id: '0',
  uri: "https://ipfs.io/ipfs/QmVFKiZ48nq9F343UY4Ykiirnfqd4MYm8Qydz1ifGbbR6C",
  price: '0',
  data: {}
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  }
});

export default projectSlice.reducer;