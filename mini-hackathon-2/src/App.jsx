import { useState } from "react";
import "./App.css";

function App() {
  const [code, setCode] = useState();
  const [consumed, setConsumed] = useState([]);
  const [calories, setCalories] = useState();
  const [consumedCalories, setConsumedCalories] = useState(0);

  function getData() {
    const fields = "energy_serving,product_name";
    const response = request(code, fields);
    response.then((result) => {
      const newConsumed = result["products"][0];
      setConsumed([...consumed, newConsumed]);
      setConsumedCalories(
        consumedCalories + newConsumed["energy_serving"] / 4.18,
      );
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
      <div id="number-of-calories">
        <label>Your recommended # of calories to consume per day</label>
        <input onChange={(e) => setCalories(e.target.value)}></input>
      </div>
      <div id="listed-items">
        {consumed.length == 0 ? (
          <p>You have not entered any items yet!</p>
        ) : (
          // energy is returned from the api in kj, need to convert to calories
          consumed.map((item) => (
            <p key={item}>
              {item["product_name"]}: ~
              {Math.floor(item["energy_serving"] / 4.18)} calories
            </p>
          ))
        )}
      </div>
      <div id="nutrition-left">
        You have {Math.floor(calories - consumedCalories)} calories left to
        consume today!
      </div>
      <p>(Nutrition facts are based off of the suggested serving size)</p>
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
