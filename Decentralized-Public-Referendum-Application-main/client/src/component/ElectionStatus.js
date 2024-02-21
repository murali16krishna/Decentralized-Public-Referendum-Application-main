import React from "react";

const ElectionStatus = (props) => {
  const electionStatus = {
    padding: "11px",
    margin: "7px",
    width: "100%",
    border: "1px solid tomato",
    marginLeft: "auto",
    marginRight: "auto",
    textAlign: "center",
    borderRadius: "0.5em",
    overflow: "auto",
    alignItems: "center",
    justifyContent: "space-around",
    display: "flex",
  };
 
  return (
    <div className="container-main" style={{ marginTop: "0px" }}>
      <h3>Referendum Status</h3>
      <div style={electionStatus}>
        <p style={{ fontWeight: 'bold' }}> {props.elEnded ? "COMPLETED!" : props.elStarted ? "In-PROGRESS" : "YET TO START"}</p>
      </div>
      <div className="container-item" />
    </div>
  );
};

export default ElectionStatus;
