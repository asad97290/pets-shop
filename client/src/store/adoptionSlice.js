import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Web3 from "web3";
import Adoption from "../contracts/Adoption.json";

export const initWeb3 = createAsyncThunk("InitWeb3", async (_, thunkAPI) => {
  try {
    if (Web3.givenProvider) {
      const web3 = new Web3(Web3.givenProvider);
      await Web3.givenProvider.enable();
      const networkId = await web3.eth.net.getId();
      const contract = new web3.eth.Contract(
        Adoption.abi,
        Adoption.networks[networkId].address
      );
      const addresses = await web3.eth.getAccounts();

      return {
        web3,
        contract,
        address: addresses[0],
      };
    }
  } catch (e) {
    console.log(e);
  }
});

export const getAdopters = createAsyncThunk(
  "GetAdopters",
  async (_, thunkAPI) => {
    try {
      const { contract } = thunkAPI.getState().adoptionReducer;
      let adoptersArray = await contract.methods.getAdopters().call();
      return adoptersArray;
    } catch (e) {
      console.log(e);
    }
  }
);

export const adoptPet = createAsyncThunk(
  "AdoptPet",
  async (petId, thunkAPI) => {
    const { contract, address } = thunkAPI.getState().adoptionReducer;
    let result = await contract.methods.adopt(petId).send({ from: address });

    return { from: result.from, petId };
  }
);
export const unAdoptPet = createAsyncThunk(
  "UnAdoptPet",
  async (petId, thunkAPI) => {
    const { contract, address } = thunkAPI.getState().adoptionReducer;
    let result = await contract.methods.unAdopt(petId).send({ from: address });

    return { from: result.from, petId };
  }
);
const adoptionSlice = createSlice({
  name: "AdoptionSlice",
  initialState: {
    web3: null,
    contract: null,
    address: null,
    adopters: [],
    isLoading: false,
    errorMessage: "",
    error: false,
  },
  reducers: {},
  extraReducers: {
    [initWeb3.fulfilled]: (state, action) => {
      state.web3 = action.payload.web3;
      state.contract = action.payload.contract;
      state.address = action.payload.address;
    },
    [getAdopters.fulfilled]: (state, action) => {
      state.adopters = action.payload;
    },
    [adoptPet.fulfilled]: (state, action) => {
      state.adopters[action.payload.petId] = action.payload.from;
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
   
    [adoptPet.pending]: (state, action) => {
      state.isLoading = true;
    },
    [adoptPet.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
    [unAdoptPet.rejected]: (state, action) => {
      state.errorMessage = action.error.message;
      state.error = true;
      state.isLoading = false;
    },
    [unAdoptPet.pending]: (state, action) => {
      state.isLoading = true;
    },
    [unAdoptPet.fulfilled]: (state, action) => {
      state.adopters[action.payload.petId] =
        "0x0000000000000000000000000000000000000000";
      state.isLoading = false;
      state.error = false;
      state.errorMessage = "";
    },
  },
});

export const { adopt } = adoptionSlice.actions;
export const adoptionReducer = adoptionSlice.reducer;
