import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState();
  const [consumed, setConsumed] = useState([]);

  function getData() {
    const fields = "energy_serving,product_name";
    const response = request(code, fields);
    response.then((result) => {
      setConsumed([...consumed, result["products"][0]]);
    });
  }

  return (
    <>
      <h1>Consumption Tracker</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Input a barcode</label>
        <input onChange={(e) => setCode(e.target.value)}></input>
        <button type="submit" onClick={getData}>
          Submit
        </button>
      </form>
      <div id="listed-items">
        {consumed.length == 0 ? (
          <p>You have not entered any items yet!</p>
        ) : (
          consumed.map((item) => (
            <p key={item}>
              {item["product_name"]}: {item["energy_serving"]} kcals
            </p>
          ))
        )}
      </div>
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
