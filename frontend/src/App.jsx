import { useState } from "react";
import Navbar from "./components/Navbar";
import Medicines from "./components/Medicines";
import Purchases from "./components/Purchases";
import Sales from "./components/Sales";
import "./App.css";

function App() {
  const [view, setView] = useState("medicines"); // default view

  return (
    <div id="root">
      <Navbar setView={setView} />
      {view === "medicines" && <Medicines />}
      {view === "purchases" && <Purchases />}
      {view === "sales" && <Sales />}
    </div>
  );
}

export default App;

