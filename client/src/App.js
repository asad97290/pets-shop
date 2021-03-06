import "./App.css";

import PetList from "./components/PetList";
import { setAccount } from "./store/adoptionSlice";
import { useDispatch } from "react-redux";

function App() {
  const dispatch = useDispatch();
  window.ethereum.on("accountsChanged", function (accounts) {
    dispatch(setAccount(accounts[0]));
    window.location.reload()
  });
  return (
    <div className="App">
      <PetList />
    </div>
  );
}

export default App;
