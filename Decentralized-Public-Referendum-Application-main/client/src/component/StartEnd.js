import React from "react";
import { Link } from "react-router-dom";

const StartEnd = (props) => {
  const btn = {
    backgroundColor: '#4CAF50',
    fontWeight: 'bold',
    color: 'white',
    display: "block",
    padding: "21px",
    margin: "7px",
    minWidth: "max-content",
    textAlign: "center",
    width: "333px",
    alignSelf: "center",
  }; 
  
  return (
    <div
      className="container-main"
      style={{ borderTop: "0px solid", marginTop: "0px" }}
    >
      {!props.elStarted ? ( // Check if the election has not started
        <>
          {!props.elEnded ? ( // Check if the election has not ended
            <>
              <div className="container-item">
                <button type="submit" style={btn}>
                  <strong>START ELECTION</strong> {props.elEnded ? "Again" : null}
                </button>
              </div>
            </>
          ) : (
            <div className="container-item">
              <center>
                <p style={{ fontWeight: 'bold' }}>RE-DEPLOY FOR A NEW REFERENDUM</p>
              </center>
            </div>
          )}
          {props.elEnded ? (
            <div className="container-item">
              <center>
                <p>-- ELECTION COMPLETED --</p>
              </center>
            </div>
          ) : null}
        </>
      ) : (
        <>
          <div className="container-item">
            <center>
              <p>The election started.</p>
            </center>
          </div>
          <div className="container-item">
            <button
              type="button"
              onClick={props.endElFn}
              style={{ cursor: 'pointer', ...btn }}
            >
              End
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default StartEnd;
