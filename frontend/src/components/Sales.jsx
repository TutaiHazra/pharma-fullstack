import { useEffect, useState } from "react";

function Sales() {
  const [sales, setSales] = useState([]);
  const [medId, setMedId] = useState("");
  const [qty, setQty] = useState("");

  const fetchSales = async () => {
    const res = await fetch("https://pharma-fullstack.onrender.com/api/sales");
    const data = await res.json();
    setSales(data);
  };

  const addSale = async () => {
    if (!medId || !qty) return;
    await fetch("https://pharma-fullstack.onrender.com/api/sales", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ medId, qty: Number(qty) }),
    });
    setMedId("");
    setQty("");
    fetchSales();
  };

  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div>
      <h2>Sales</h2>
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
      <button onClick={addSale}>Add Sale</button>

      <ul>
        {sales.map((s) => (
          <li key={s.id}>
            Medicine ID: {s.medId}, Quantity: {s.qty}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sales;
