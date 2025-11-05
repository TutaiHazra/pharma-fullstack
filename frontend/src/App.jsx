import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL; // <-- use Render backend

function App() {
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  // Fetch medicines from backend
  useEffect(() => {
    fetch(`${API_URL}/api/medicines`)
      .then((res) => res.json())
      .then((data) => setMedicines(data))
      .catch((err) => console.error(err));
  }, []);

  // Add new medicine
  const addMedicine = async () => {
    if (!name || !qty) return alert("Enter name and quantity");
    const res = await fetch(`${API_URL}/api/medicines`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, qty: Number(qty) }),
    });
    const newMed = await res.json();
    setMedicines([...medicines, newMed]);
    setName("");
    setQty("");
  };

  // Delete medicine
  const deleteMedicine = async (id) => {
    await fetch(`${API_URL}/api/medicines/${id}`, { method: "DELETE" });
    setMedicines(medicines.filter((m) => m.id !== id));
  };

  return (
    <div className="App">
      <h1>Pharmacy Management</h1>

      <div className="add-medicine">
        <input
          type="text"
          placeholder="Medicine Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Quantity"
          value={qty}
          onChange={(e) => setQty(e.target.value)}
        />
        <button onClick={addMedicine}>Add Medicine</button>
      </div>

      <h2>Medicines List</h2>
      <ul>
        {medicines.map((med) => (
          <li key={med.id}>
            {med.name} - {med.qty}{" "}
            <button onClick={() => deleteMedicine(med.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
