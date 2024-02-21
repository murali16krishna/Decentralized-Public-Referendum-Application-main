import React, { Component } from "react";
import { Link } from "react-router-dom";
import Navbar from "../Navbar/Navigation";
import NavbarAdmin from "../Navbar/NavigationAdmin";
import NotInit from "../NotInit";
import getWeb3 from "../../getWeb3";
import Election from "../../contracts/PublicReferendum.json";
import "./Results.css";

export default class Result extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ElectionInstance: undefined,
      account: null,
      web3: null,
      isAdmin: false,
      candidateCount: undefined,
      candidates: [],
      isElStarted: false,
      isElEnded: false,
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

      this.setState({ web3, ElectionInstance: instance, account: accounts[0] });

      const candidateCount = await this.state.ElectionInstance.methods
        .getTotalCandidate()
        .call();
      this.setState({ candidateCount: candidateCount });

      const start = await this.state.ElectionInstance.methods.getStart().call();
      this.setState({ isElStarted: start });
      const end = await this.state.ElectionInstance.methods.getEnd().call();
      this.setState({ isElEnded: end });

      for (let i = 1; i <= this.state.candidateCount; i++) {
        const candidate = await this.state.ElectionInstance.methods
          .decisionDetails(i - 1)
          .call();
        this.state.candidates.push({
          id: candidate.decisionId,
          header: candidate.policy,
          slogan: candidate.impact,
          voteYesCount: candidate.voteYesCount,
          voteNoCount: candidate.voteNoCount
        });
      }

      this.setState({ candidates: this.state.candidates });

      const admin = await this.state.ElectionInstance.methods.getAdmin().call();
      if (this.state.account === admin) {
        this.setState({ isAdmin: true });
      }
    } catch (error) {
      alert(
        `Loading web3, accounts, or the contract has encountered an issue. Refer to the console for additional information.`
      );
      console.error(error);
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

    return (
      <>
        {this.state.isAdmin ? <NavbarAdmin /> : <Navbar />}
        <br />
        <div>
          {!this.state.isElStarted && !this.state.isElEnded ? (
            <NotInit />
          ) : this.state.isElStarted && !this.state.isElEnded ? (
            <div className="container-item attention" style={{ border: "none" }}>
              <center>
                <h3>The Public Referendum is In-Progress</h3>
                <br />
                <Link
                  to="/Voting"
                  style={{ color: "blue", textDecoration: "underline" }}
                >
                  Go to Voting Page
                </Link>
              </center>
            </div>
          ) : !this.state.isElStarted && this.state.isElEnded ? (
            displayResults(this.state.candidates)
          ) : null}
        </div>
      </>
    );
  }
}

function displayWinner(candidates) {
  const getWinner = (candidates) => {
      if (candidates.voteYesCount > candidates.voteNoCount) {
        return {
          message: 'Yayy! Public APPROVED the New Policy ',
          policy: candidates.header,
          yesCount: candidates.voteYesCount,
          noCount: candidates.voteNoCount
        };
      } else  if (candidates.voteYesCount < candidates.voteNoCount){
        return {
          message: 'Public REJECTED the New Policy ',
          policy: candidates.header,
          yesCount: candidates.voteYesCount,
          noCount: candidates.voteNoCount
        };
      } else {
        return {
          message: 'It\'s a TIE! Public is evenly split on the New Policy',
          policy: candidates.header,
          yesCount: candidates.voteYesCount,
          noCount: candidates.voteNoCount
        };
      }
  };
  

  const renderWinner = (winner) => {
    return (
      <div className="container-result">
        <div className="result-info">
          <p className="result-message"  style={{
            fontStyle: 'italic',
            fontWeight: 'bold',
            fontSize: '24px',
            color: 'rgb(120, 18, 0)',
            textShadow: '1px 1px 1px rgba(0, 0, 255, 0.5)',
          }}>{winner.message + "  " + "'" + winner.policy + "'"}</p>
        </div>
      </div>
    );
  };
  const winnerCandidate = getWinner(candidates[0]);
  return <>{renderWinner(winnerCandidate)}</>;
}

export function displayResults(candidates) {
  const renderResults = (candidate) => {
    return (
      <tr>
        <td>{candidate.header}</td>
        <td>{candidate.voteYesCount}</td>
        <td>{candidate.voteNoCount}</td>
      </tr>
    );
  };
  return (
    <>
      {candidates.length > 0 ? (
        <div className="container-main">{displayWinner(candidates)}</div>
      ) : null}
      <div className="container-main" style={{ borderTop: "1px solid" }}>
        <h2>Results</h2>
        {candidates.length < 1 ? (
          <div className="container-item attention">
            <center>No Decisions to be Enforced.</center>
          </div>
        ) : (
          <>
            <div className="container-item">
              <table>
                <tr>
                  <th>Decision Enforced</th>
                  <th>YES</th>
                  <th>NO</th>
                </tr>
                {candidates.map(renderResults)}
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
