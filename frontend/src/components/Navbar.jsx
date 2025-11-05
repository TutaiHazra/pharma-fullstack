function Navbar({ setView }) {
  return (
    <nav className="navbar">
      <button onClick={() => setView("medicines")}>Medicines</button>
      <button onClick={() => setView("purchases")}>Purchases</button>
      <button onClick={() => setView("sales")}>Sales</button>
    </nav>
  );
}

export default Navbar;


