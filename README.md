<p align="center">
    <a href="https://github.com/cupid20103/elekton-contracts" target="_blank">
        elekton-contracts
    </a>
    | 
    <a href="https://github.com/cupid20103/elekton.js" target="_blank">
        elekton.js
    </a>
    | 
    <a href="https://github.com/cupid20103/elekton-dapp" target="_blank">
        elekton-dapp
    </a>
</p>

<p align="center">
    <h1 align="center">
        Elekton contracts
    </h1>
    <p align="center">Solidity smart contracts to vote anonymously on a free-gas network (Besu) using zk-SNARK.</p>
</p>

<p align="center">
    <a href="https://github.com/cupid20103/elekton-contracts" target="_blank">
        <img src="https://img.shields.io/badge/project-Elekton-blue.svg?style=flat-square">
    </a>
    <a href="https://github.com/cupid20103/elekton-contracts/blob/main/LICENSE" target="_blank">
        <img src="https://img.shields.io/github/license/cupid20103/elekton-contracts.svg?style=flat-square">
    </a>
    <a href="https://eslint.org/" target="_blank">
        <img alt="Linter eslint" src="https://img.shields.io/badge/linter-eslint-8080f2?style=flat-square&logo=eslint">
    </a>
    <a href="https://prettier.io/" target="_blank">
        <img alt="Code style prettier" src="https://img.shields.io/badge/code%20style-prettier-f8bc45?style=flat-square&logo=prettier">
    </a>
    <img alt="Repository top language" src="https://img.shields.io/github/languages/top/cupid20103/elekton-contracts?style=flat-square">
</p>

Elekton is a set of modules useful to create a simple e-voting system that uses non-interactive zero-knowledge proofs and blockchain technologies to allow users to vote anonymously in a verifiable and transparent way. In addition to this repository there is a JavaScript library ([elekton.js](https://github.com/cupid20103/elekton.js)) with the functions to interact with the Elekton contract and a simple [DApp](https://github.com/cupid20103/elekton-dapp), which in turn uses elekton.js and allows you to create users, ballots and to vote anonymously.

---

## Table of Contents

-   ⚙️ [Technologies](#technologies)
-   🚀 [Features](#features)
-   🛠 [Install](#install)
-   🕹 [Usage](#usage)
-   🔬 Development
    -   Rules
        -   [Commits](https://github.com/cupid20103/cupid20103/tree/main/git#commits-rules)
        -   [Branches](https://github.com/cupid20103/cupid20103/tree/main/git#branch-rules)
-   🧾 [MIT License](https://github.com/cupid20103/elekton-contracts/blob/main/LICENSE)
-   ☎️ [Contacts](#contacts)
    -   [Developers](#developers)


## Technologies

| Technology          | Description                                                                   |
| ------------------- | ----------------------------------------------------------------------------- |
| [Hyperledger Besu](https://besu.hyperledger.org/)    | Ethereum client with additional PoA consensus mechanisms, private transactions, permissioning and other features. |
| [zk-SNARK](https://doi.org/10.1145/2090236.2090263)    | Zero-knowledge technology used to prove possession of certain information without revealing that information and without any interaction between the prover and verifier. |
| [Iden3](https://www.iden3.io)               | A set of useful tools that make it easier to use zk-SNARK on Ethereum blockchains (Circom, SnarkJS, Circomlib). |
| [Merkle trees](https://doi.org/10.1007/3-540-48184-2_32) | Data structure used to create the proof-of-membership to allow users to vote on a ballot. |
| [EdDSA](https://doi.org/10.17487/RFC8032)               | Digital signature scheme used to sign data and to create the voter's asymmetric keys. |
| [Poseidon](https://www.poseidon-hash.info)            | ZK-friendly hash function used in the previous algorithms.                    |

In order to create anonymous transactions it is necessary to use an universal shared Ethereum account to sign them, and in order to have more scalability it is necessary to use a PoA consensus mechanism. For this reason the best solution is to use a permissioned blockchain with a free-gas network. Elekton uses [Besu](https://besu.hyperledger.org/), an Ethereum client written in Java that implements Proof of Work (Ethash) and Proof of Authority (IBFT 2.0 and Clique) consensus mechanisms.

The goal of zero-knowledge proofs is for a *verifier* to be able to convince herself that a *prover* possesses knowledge of a secret parameter. In the Elekton system the verifier is a Solidity smart contract, whereas the prover is the voter, who must create a valid off-chain proof in order to send a transaction and vote on an on-chain ballot anonymously. In recent years [zk-SNARK](https://doi.org/10.1145/2090236.2090263) has aroused a lot of interest. ZCash uses it to provide a privacy-focused cryptocurrency with a strong mechanism for creating anonymous transactions and many development tools make it easy to use for the integration with other types of blockchains as well. [Iden3](https://www.iden3.io/) provides several tools to use zk-SNARK with Ethereum, and they are just used in the Elekton system. [Circom](https://github.com/iden3/circom) is used to create the voting [circuit](https://github.com/cupid20103/elekton-contracts/blob/main/circuit/scheme.png), whereas [SnarkJS](https://github.com/iden3/snarkjs) is used to generate the proofs and export the verifier as a Solidity smart contract. The circuit requires the use of some ZK-friendly algorithms: [Merkle trees](https://doi.org/10.1007/3-540-48184-2_32), [EdDSA](https://doi.org/10.17487/RFC8032) and [Poseidon](https://www.poseidon-hash.info/). Circom actually requires a special kind of Merkle tree, the sparse Merkle tree (SMT), which can be used to create not only membership proofs, but also non-membership proofs. Elekton uses the [SMT](https://github.com/cupid20103/sparse-merkle-tree) TypeScript implementation and the [Circomlib](https://github.com/iden3/circomlib) JavaScript library, which provides several zk-friendly algorithm implementations.

## Features

| Feature           | Status | Description                                                   |
| ----------------- | :----: | ------------------------------------------------------------- |
| User registration |   ✔️   | Anyone can register himself in the contract as Elekton user.  |
| Ballot creation   |   ✔️   | All users can create ballots.                                 |
| Anonymous vote    |   ✔️   | The authorized users can vote on ballots anonymously.         |

## Install

Clone this repository and install the dependencies:

```bash
git clone https://github.com/cupid20103/elekton-contracts.git
cd elekton-contracts
yarn # or `npm i`
```

Install the binary distribution of [Besu](https://besu.hyperledger.org/en/stable/HowTo/Get-Started/Installation-Options/Install-Binaries/), used to start a development zero-gas network. The `besu` command line must be executable from the terminal.

## Usage

Create the snark artifacts (it takes a few minutes) and start the Besu development network:

```bash
yarn snark
yarn start
```

Test the contract functions and deploy a contract instance:

```bash
yarn test
yarn deploy
```

Now you can interact with the contract using Remix or Web3.js on `http://localhost:8545` or `ws://localhost:8546`.

## Contacts

### Developers

-   e-mail : webphantom20103@gmail.com
-   github : [@cupid20103](https://github.com/cupid20103)
-   website : https://kiyoshi-araki.vercel.app/
