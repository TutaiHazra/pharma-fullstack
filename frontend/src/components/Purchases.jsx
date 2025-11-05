import { useEffect, useState } from "react";

function Purchases() {
  const [purchases, setPurchases] = useState([]);
  const [medId, setMedId] = useState("");
  const [qty, setQty] = useState("");

  const fetchPurchases = async () => {
    const res = await fetch("https://pharma-fullstack.onrender.com/api/purchases");
    const data = await res.json();
    setPurchases(data);
  };

  const addPurchase = async () => {
    if (!medId || !qty) return;
    await fetch("https://pharma-fullstack.onrender.com/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medId, qty: Number(qty) }),
    });
    setMedId("");
    setQty("");
    fetchPurchases();
  };

  useEffect(() => {
    fetchPurchases();
  }, []);

  return (
    <div>
      <h2>Purchases</h2>
      <input
        placeholder="Medicine ID"
        value={medId}
        onChange={(e) => setMedId(e.target.value)}
      />
      <input
        placeholder="Quantity"
        value={qty}
        type="number"
        onChange={(e) => setQty(e.target.value)}
      />
      <button onClick={addPurchase}>Add Purchase</button>

      <ul>
        {purchases.map((p) => (
          <li key={p.id}>
            Medicine ID: {p.medId}, Quantity: {p.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Purchases;

