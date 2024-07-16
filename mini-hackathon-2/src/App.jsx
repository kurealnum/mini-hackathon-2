import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState();

  function getData() {
    const fields = "energy_serving";
    const response = request(code, fields);
    response.then((it) => console.log(it));
  }

  return (
    <>
      <label>Input a barcode</label>
      <input onChange={(e) => setCode(e.target.value)}></input>
      <button type="submit" onClick={getData}>
        Submit
      </button>
    </>
  );
}

async function request(code, fields) {
  const response = await fetch(
    "https://world.openfoodfacts.org/api/v2/search?code=" +
      code +
      "&fields=" +
      fields,
  );

  return response.json();
}

export default App;
