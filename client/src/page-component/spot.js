import React from "react";
const spotStyle = {
  fontFamily: '"Montserrat", sans-serif',
  width: "100px",
  eight: "100px",
  boxShadow: "0 0 0 1px #333333",
  border: "1px solid #333333",
  cursor: "pointer",
  lineHeight: "100px",
  fontSize: "60px",
  textAlign: "center",
  boxSizing: "initial",
};

function Spot(props) {
  return (
    <div
      className="spot"
      style={spotStyle}
      id={props.id}
      onClick={props.onClick}
    >
      {props.value}
    </div>
  );
}

export default Spot;
