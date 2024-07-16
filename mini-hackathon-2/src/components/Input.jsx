/* eslint-disable react/prop-types */

// setVariable and saveVariable are both functions
function Input({ setVariable, text, id }) {
  return (
    <div className="input">
      <label>{text}</label>
      <input
        id={id}
        onChange={(e) => {
          setVariable(e.target.value);
          localStorage.setItem(id, e.target.value);
        }}
      ></input>
    </div>
  );
}

export default Input;
