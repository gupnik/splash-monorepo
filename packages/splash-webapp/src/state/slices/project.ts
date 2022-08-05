import { createSlice } from "@reduxjs/toolkit"

export interface ProjectState {
  id: string;
  uri: string;
  price: string;
  name: string;
  description: string;
  image: string;
  supply: string;
  consumers: ProjectState[];
  constituents: ProjectState[];
}

const initialState: ProjectState = {
  id: '0',
  uri: "https://ipfs.io/ipfs/QmVFKiZ48nq9F343UY4Ykiirnfqd4MYm8Qydz1ifGbbR6C",
  price: '0',
  name: '',
  description: '',
  image: 'https://ipfs.io/ipfs/QmZWexPEudXMLm3Fn51YrDmoEGMe32AT4GwE3UHiP1VgHi', 
  supply: '0',
  consumers: [],
  constituents: [],
}

export const projectSlice = createSlice({
  name: 'project',
  initialState,
  reducers: {

  }
});

export default projectSlice.reducer;