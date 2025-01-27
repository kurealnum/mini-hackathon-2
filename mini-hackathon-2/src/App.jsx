import { useState, useEffect } from "react";
import Input from "./components/Input";

function App() {
  const [code, setCode] = useState();
  const [consumed, setConsumed] = useState([]);
  const [calories, setCalories] = useState(0);
  const [consumedCalories, setConsumedCalories] = useState(0);
  const [fat, setFat] = useState(0);
  const [consumedFat, setConsumedFat] = useState(0);

  useEffect(() => {
    // note to self: any way to simplify this function a little bit?
    const consumedLocal = JSON.parse(localStorage.getItem("consumed"));
    const caloriesLocal = localStorage.getItem("calorie");
    const consumedCaloriesLocal = JSON.parse(
      localStorage.getItem("consumedCalories"),
    );
    const fatLocal = localStorage.getItem("fat");
    const consumedFatLocal = JSON.parse(localStorage.getItem("consumedFat"));

    if (consumedLocal) {
      setConsumed(consumedLocal);
    }
    if (caloriesLocal) {
      setCalories(caloriesLocal);
    }
    if (consumedCaloriesLocal) {
      setConsumedCalories(consumedCaloriesLocal);
    }
    if (fatLocal) {
      setFat(fatLocal);
    }
    if (consumedFatLocal) {
      setConsumedFat(consumedFatLocal);
    }

    // set the calorie and fat inputs to where the user left them
    document.getElementById("calorie").value = calories;
    document.getElementById("fat").value = fat;
  }, [fat, calories]);

  // used to make a request to the API and manage the response
  function getData() {
    const fields = "energy_serving,product_name,fat_serving";
    const response = request(code, fields);
    response.then((result) => {
      const newConsumed = result["products"][0];
      const combined = [...consumed, newConsumed];
      setConsumed(combined);
      localStorage.setItem("consumed", JSON.stringify(combined));

      // check to make sure api actually returned a number
      const newKcals = newConsumed["energy_serving"] / 4.18;
      const newFat = newConsumed["fat_serving"];
      if (!isNaN(newKcals)) {
        const totalCalories = consumedCalories + newKcals;
        setConsumedCalories(totalCalories);
        localStorage.setItem("consumedCalories", JSON.stringify(totalCalories));
      }
      if (!isNaN(newFat)) {
        const totalFat = consumedFat + newFat;
        setConsumedFat(totalFat);
        localStorage.setItem("consumedFat", JSON.stringify(totalFat));
      }
    });
  }

  // doesn't actually clear everything, only clears consumed/fat/calories. also updates the UI
  function clearLocalStorage() {
    localStorage.setItem("consumed", JSON.stringify([]));
    localStorage.setItem("consumedCalories", JSON.stringify(0));
    localStorage.setItem("consumedFat", JSON.stringify(0));

    setConsumed([]);
    setConsumedCalories(0);
    setConsumedFat(0);
  }

  return (
    <>
      <h1>Consumption Tracker</h1>
      <h2>
        Enter the amount of each nutritional value that you would like to
        consume each day
      </h2>
      <div id="inputs">
        <Input setVariable={setCalories} text={"Calories:"} id={"calorie"} />
        <Input setVariable={setFat} text={"Fat (in grams):"} id={"fat"} />
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
          consumed.map((item, index) => (
            <p key={index}>
              {item["product_name"]}: ~
              {Math.floor(item["energy_serving"] / 4.18)} calories -{" "}
              {Math.floor(item["fat_serving"])} grams of fat
            </p>
          ))
        )}
      </div>
      {}
      <div id="nutrition-list">
        You have{" "}
        {calories <= 0
          ? "???"
          : consumedCalories == 0
            ? calories
            : Math.floor(calories - consumedCalories) < 0
              ? "no"
              : Math.floor(calories - consumedCalories)}{" "}
        calories left to consume today, and you have{" "}
        {fat <= 0
          ? "???"
          : consumedFat == 0
            ? fat
            : Math.floor(fat - consumedFat) < 0
              ? "no"
              : Math.floor(fat - consumedFat)}{" "}
        grams of fat left to consume.
      </div>
      <p id="small-text">
        (Nutrition facts are based off of the suggested serving size)
      </p>
      <button onClick={clearLocalStorage}>Clear history</button>
    </>
  ); // everything inside nutrition-list is a nasty little bit of code, but it's just the logic to display how much more the user can intake based on their paramaters
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
