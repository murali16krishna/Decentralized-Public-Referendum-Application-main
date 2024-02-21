import React, { Component } from "react";
import getWeb3 from "../../../getWeb3";
import Election from "../../../contracts/PublicReferendum.json";
import AdminOnly from "../../AdminOnly";
import Navbar from "../../Navbar/Navigation";
import NavbarAdmin from "../../Navbar/NavigationAdmin";

import "./AddCandidate.css";

export default class AddCandidate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      web3: null,
      accounts: null,
      isAdmin: false,
      header: "",
      slogan: "",
      candidates: [],
      candidateCount: undefined,
      isButtonDisabled: false
    };
  }

  componentDidMount = async () => {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      const web3 = await getWeb3();
      const accounts = await web3.eth.getAccounts();    
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Election.networks[networkId];
      const instance = new web3.eth.Contract(
        Election.abi,
        deployedNetwork && deployedNetwork.address
      );
      this.setState({
        web3: web3,
        ElectionInstance: instance,
        account: accounts[0],
      });

      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });
      if(candidateCount >= 1) {
        this.setState({isButtonDisabled : true})
      }

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }

      for (let i = 0; i < this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .decisionDetails(i)
          .call();
        this.state.candidates.push({
          id: candidate.decisionId,
          header: candidate.policy,
          slogan: candidate.impact,
        });
      }

      this.setState({ candidates: this.state.candidates });
    } catch (error) {
      console.error(error);
      alert(
        `Loading web3, accounts, or the contract has encountered an issue. Refer to the console for additional information.`
      );
    }
  };
  updateHeader = (event) => {
    this.setState({ header: event.target.value });
  };
  updateSlogan = (event) => {
    this.setState({ slogan: event.target.value });
  };

  AddCandidate = async () => {
    if (this.state.isButtonDisabled) {
      return;
    }
    const decisionCount = await this.state.ElectionInstance.methods.getTotalCandidate().call();
    console.log("candidateCount: " + this.state.candidateCount)
    console.log("isBUttonDisabled: " + this.state.isButtonDisabled)
    console.log(this.state.candidateCount === 1 || this.state.isButtonDisabled || this.state.header.length < 3)
    if (decisionCount === "0") {
      await this.state.ElectionInstance.methods
        .addDecision(this.state.header, this.state.slogan)
        .send({ from: this.state.account, gas: 1000000 });
      this.setState({ isButtonDisabled: true });
      window.location.reload();
    } else {
      this.setState({ isButtonDisabled: true });
      console.log("Cannot add a new Decision. Only one decision per Referendum.");
    }
  };
  

  render() {
    if (!this.state.web3) {
      return (
        <>
          {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
          <center>Loading Web3, accounts, and contract...</center>
        </>
      );
    }
    if (!this.state.isAdmin) {
      return (
        <>
          <Navbar />
          <AdminOnly page="Add Referendum Page." />
        </>
      );
    }
    return (
      <>
        <NavbarAdmin />
        <div className="container-main">
          <h2>New Decision/Policy to be Enforced!</h2>
          {Number(this.state.candidateCount) !== 1 && (
            <div className="container-item">
              {console.log("Candidate Count:", this.state.candidateCount)}
                <form className="form">
                  <label className={"label-ac"}>
                  <strong>Policy</strong>
                    <input
                      className={"input-ac"}
                      type="text"
                      placeholder="eg. Free Education"
                      value={this.state.header}
                      onChange={this.updateHeader}
                    />
                  </label>
                  <label className={"label-ac"}>
                    <strong>Impact</strong>
                    <input
                      className={"input-ac"}
                      type="text"
                      placeholder="eg. Education the poor"
                      value={this.state.slogan}
                      onChange={this.updateSlogan}
                    />
                  </label>
                  <button
                    className="btn-add"
                    disabled={
                      this.state.candidateCount === 1 || this.state.isButtonDisabled || this.state.header.length < 3
                    }
                    style={{
                      display: this.state.isButtonDisabled ? 'none' : 'inline-block'
                    }}
                    onClick={this.AddCandidate}
                  >
                    Add
                  </button>
                </form>
            </div>
          )}
        </div>
        {loadAdded(this.state.candidates)}
      </>
    );
  }
}
export function loadAdded(candidates) {
  const renderAdded = (candidate) => {
    return (
      <>
        <div className="container-list success">
          <div
            style={{
              maxHeight: "21px",
              overflow: "auto",
            }}
          >
            <strong>{candidate.header}</strong>:{" "}
            {candidate.slogan}
          </div>
        </div>
      </>
    );
  };
  return (
    <div className="container-main" style={{ borderTop: "0px solid" }}>
      <div className="container-item info">
        <center>Added Referendums:</center>
      </div>
      {candidates.length < 1 ? (
        <p></p>
      ) : (
        <div
          style={{
            display: "block",
            backgroundColor: "#DDFFFF",
            borderTop: "0px solid",
          }}
        >
          {candidates.map(renderAdded)}
        </div>
      )}
    </div>
  );
}
