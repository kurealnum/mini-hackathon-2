import { useState } from "react";
import Input from "./components/Input";

function App() {
  const [code, setCode] = useState();
  const [consumed, setConsumed] = useState([]);
  const [calories, setCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [fat, setFat] = useState(0);

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
      <h2>
        Enter the amount of each nutritional value that you would like to
        consume each day
      </h2>
      <div id="inputs">
        <Input setVariable={setCalories} text={"Calories:"} />
        <Input setVariable={setFat} text={"Fat:"} />
      </div>
      <h2>Then enter a barcode for a food or drink</h2>
      <form id="barcode" onSubmit={(e) => e.preventDefault()}>
        <label>Input a barcode</label>
        <input onChange={(e) => setCode(e.target.value)}></input>
        <button type="submit" onClick={getData}>
          Submit
        </button>
      </form>
      <div id="listed-items">
        <h2>All consumed items</h2>
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
        You have{" "}
        {consumedCalories == 0 || calories == 0
          ? "???"
          : Math.floor(calories - consumedCalories) < 0
            ? "no"
            : Math.floor(calories - consumedCalories)}{" "}
        calories left to consume today!
      </div>
      <p2>(Nutrition facts are based off of the suggested serving size)</p2>
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
