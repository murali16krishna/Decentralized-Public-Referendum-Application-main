// SPDX-License-Identifier: MIT
pragma solidity >=0.4.21 <0.9.0;

contract PublicReferendum {
    address public admin;
    uint256 decisionCount;
    uint256 voterCount;
    bool start;
    bool end;

    constructor() public {
        admin = msg.sender;
        decisionCount = 0;
        voterCount = 0;
        start = false;
        end = false;
    }

    function getAdmin() public view returns (address) {
        return admin;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin);
        _;
    }

    // The Structure for Decision that Govt wants to bring in
    struct Decision {
        uint256 decisionId;
        string policy;
        string impact;
        uint256 voteYesCount;
        uint256 voteNoCount;
   }

    mapping(uint256 => Decision) public decisionDetails;

    // Method to add a decision
    function addDecision(string memory _policy, string memory _impact)
        public
        onlyAdmin
    {
        Decision memory newDecision =
            Decision({
                decisionId: decisionCount,
                policy: _policy,
                impact: _impact,
                voteYesCount: 0,
                voteNoCount: 0
            });
        decisionDetails[decisionCount] = newDecision;
        decisionCount += 1;
    }

    struct PublicReferendumDetails {
        string referendumTitle;
        string ministryTitle;
    }
    PublicReferendumDetails publicReferendumDetails;

    function setPublicReferendumDetails(
        string memory _referendumTitle,
        string memory _ministryTitle
    )
        public
        onlyAdmin
    {
        publicReferendumDetails = PublicReferendumDetails(
            _referendumTitle,
            _ministryTitle
        );
        start = true;
        end = false;
    }

    // Get Public Referendum Details details
    function getPublicReferendumDetails()
    public
    view
    returns(
    string memory referendumTitle, 
    string memory ministryTitle){
        return( 
        publicReferendumDetails.referendumTitle, 
        publicReferendumDetails.ministryTitle);
    }

    // Get decision count
    function getTotalCandidate() public view returns (uint256) {
        // Returns total number of decisions
        return decisionCount;
    }

    // Get voters count
    function getTotalVoter() public view returns (uint256) {
        // Returns total number of voters
        return voterCount;
    }

    // Modeling a voter
    struct Voter {
        address voterAddress;
        string name;
        string phone;
        bool isVerified;
        bool hasVoted;
        bool isRegistered;
    }
    address[] public voters;
    mapping(address => Voter) public voterDetails;

    function registerAsVoter(string memory _name, string memory _phone) public {
        if (voterDetails[msg.sender].voterAddress == address(0)) {
        Voter memory newVoter =
            Voter({
                voterAddress: msg.sender,
                name: _name,
                phone: _phone,
                hasVoted: false,
                isVerified: false,
                isRegistered: true
            });

            voterDetails[msg.sender] = newVoter;
            voters.push(msg.sender);
            voterCount += 1;
        } else {
            // Voter already exists, update the details without incrementing voterCount
            voterDetails[msg.sender].name = _name;
            voterDetails[msg.sender].phone = _phone;
            // You can update other details as needed
        }
    }

    function verifyVoter(bool _verifedStatus, address voterAddress)
        public
        onlyAdmin
    {
        voterDetails[voterAddress].isVerified = _verifedStatus;
    }

    function vote(uint256 decisionId, string memory voteValue) public {
        require(voterDetails[msg.sender].isVerified == true);
        require(start == true);
        require(end == false);
        bytes32 yesHash = keccak256(bytes("YES"));
        bytes32 noHash = keccak256(bytes("NO"));
        bytes32 voteValueHash = keccak256(bytes(voteValue));
        require(voteValueHash == yesHash || voteValueHash == noHash, "Invalid Vote Decision Value");
        if (voteValueHash == yesHash) {
            decisionDetails[decisionId].voteYesCount += 1;
        } else if (voteValueHash == noHash) {
            decisionDetails[decisionId].voteNoCount += 1;
        }
        voterDetails[msg.sender].hasVoted = true;
    }

    // End Public Referendum
    function endElection() public onlyAdmin {
        end = true;
        start = false;
    }

    // Get Public Referendum start and end values
    function getStart() public view returns (bool) {
        return start;
    }

    function getEnd() public view returns (bool) {
        return end;
    }
}
