import React from "react";

function UserHome(props) {
  return (
    <div>
      <div className="container-main">
        <div className="container-list title" style={{ fontFamily: 'Arial, sans-serif', fontSize: '20px' }}>
          <h1 style={{ fontSize: '50px', fontWeight: 'bold' }}>{props.el.electionTitle}</h1>
          <br />
          <center className="slogan" style={{ fontSize: '30px', fontStyle: 'italic' }}>{props.el.organizationTitle}</center>
        </div>
      </div>
    </div>
  );
}

export default UserHome;
