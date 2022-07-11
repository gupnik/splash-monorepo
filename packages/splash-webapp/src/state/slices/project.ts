import { createSlice } from "@reduxjs/toolkit"

export interface ProjectState {
  uri: string;
}

const initialState: ProjectState = {
  uri: "https://ipfs.io/ipfs/QmVFKiZ48nq9F343UY4Ykiirnfqd4MYm8Qydz1ifGbbR6C"
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  }
});

export default projectSlice.reducer;