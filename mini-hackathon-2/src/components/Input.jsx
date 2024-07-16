/* eslint-disable react/prop-types */

function Input({ setVariable, text }) {
  return (
    <div className="input">
      <label>{text}</label>
      <input onChange={(e) => setVariable(e.target.value)}></input>
    </div>
  );
}

export default Input;
