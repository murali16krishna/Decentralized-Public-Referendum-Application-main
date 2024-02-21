# Decentralized-Public-Referendum-Application


## Prerequisites
### Install the following:
```bash
NodeJS
truffle
ganache-cli
```

## Setting up the repository
```bash
git clone https://github.com/adarshsajjan/Decentralized-Public-Referendum-Application.git
cd Decentralized-Public-Referendum-Application
```

## Install UI Modules
```bash
cd client
npm install
```
## Run UI on local
```bash
npm run start
```

## Deploy the Smart Contract
```bash
ganache-cli
truffle migrate --reset
```

## Setting up the Accounts in Metamask
Copy private keys available on terminal through ganache-cli to Metamask extension which is connected to our local network (127.0.0.1:8545)

### Every time you want to re-create a new Referendum, run the following command
```bash
truffle migrate --reset
```
