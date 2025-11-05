import { useEffect, useState } from "react";

function Medicines() {
  const [medicines, setMedicines] = useState([]);
  const [name, setName] = useState("");
  const [qty, setQty] = useState("");

  const fetchMedicines = async () => {
    const res = await fetch("https://pharma-fullstack.onrender.com/api/medicines");
    const data = await res.json();
    setMedicines(data);
  };

  const addMedicine = async () => {
    if (!name || !qty) return;
    await fetch("https://pharma-fullstack.onrender.com/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, qty: Number(qty) }),
    });
    setName("");
    setQty("");
    fetchMedicines();
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  return (
    <div>
      <h2>Medicines</h2>
      <input
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        placeholder="Quantity"
        value={qty}
        type="number"
        onChange={(e) => setQty(e.target.value)}
      />
      <button onClick={addMedicine}>Add Medicine</button>

      <ul>
        {medicines.map((med) => (
          <li key={med.id}>
            {med.name} - {med.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Medicines;


