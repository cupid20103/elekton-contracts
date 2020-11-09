import { expect } from "chai"
import { Contract } from "ethers"
import { createElektonProof, delay, deployContract, getAccounts, getSmt } from "../scripts/utils"

describe("Core tests", function () {
	let elekton: Contract
	let accounts: any[]
	let elektonUser1: Contract

	before(async function () {
		elekton = await deployContract("Elekton")
		accounts = await getAccounts()
		elektonUser1 = elekton.connect(accounts[1].signer)
	})

	describe("#createUser()", function () {
		let user1Address: string

		before(async function () {
			user1Address = await accounts[1].signer.getAddress()
		})

		for (let userId = 1; userId < 5; userId++) {
			it(`User ${userId} should add himself`, async function () {
				const elektonUser = elekton.connect(accounts[userId].signer)
				const userAddress = await accounts[userId].signer.getAddress()

				await expect(elektonUser.createUser(userId))
					.to.emit(elekton, "UserCreated")
					.withArgs(userAddress, userId)
			})
		}

		it(`An user should not add himself with an id = 0`, async function () {
			await expect(elektonUser1.createUser(0)).to.be.revertedWith("E000")
		})

		it(`User 1 should not update his id to 1`, async function () {
			await expect(elektonUser1.createUser(1)).to.be.revertedWith("E001")
		})

		it(`User 1 should update his id to 5`, async function () {
			await expect(elektonUser1.createUser(5)).to.emit(elekton, "UserUpdated").withArgs(user1Address, 5)
		})

		it(`User 5 should update again his id to 1`, async function () {
			await expect(elektonUser1.createUser(1)).to.emit(elekton, "UserUpdated").withArgs(user1Address, 1)
		})
	})

	describe("#createBallot()", function () {
		let ballotId: bigint
		let smt: any

		before(async function () {
			ballotId = 1n
			smt = await getSmt(accounts.slice(1, 5).map((account) => account.voter.publicKey))
		})

		it("An unregistered user should not create a ballot", async function () {
			const startDate = Math.floor(Date.now() / 1000) + 12
			const endDate = Math.floor(Date.now() / 1000) + 100

			await expect(elekton.createBallot(ballotId, smt.root, startDate, endDate)).to.be.revertedWith("E101")
		})

		it("A ballot should not start in the past", async function () {
			const startDate = Math.floor(Date.now() / 1000) - 10
			const endDate = Math.floor(Date.now() / 1000) + 1000

			await expect(elektonUser1.createBallot(ballotId, smt.root, startDate, endDate)).to.be.revertedWith("E102")
		})

		it("A ballot should not last less than 10 seconds", async function () {
			const startDate = Math.floor(Date.now() / 1000) + 12
			const endDate = Math.floor(Date.now() / 1000) + 21

			await expect(elektonUser1.createBallot(ballotId, smt.root, startDate, endDate)).to.be.revertedWith("E103")
		})

		it("User 1 should create ballot 1 with 4 voters (users 1, 2, 3, 4)", async function () {
			const startDate = Math.floor(Date.now() / 1000) + 13
			const endDate = Math.floor(Date.now() / 1000) + 60

			await expect(elektonUser1.createBallot(ballotId, smt.root, startDate, endDate))
				.to.emit(elekton, "BallotCreated")
				.withArgs(ballotId)
		})

		it("A ballot should not be created with an already existing id", async function () {
			const startDate = Math.floor(Date.now() / 1000) + 100
			const endDate = Math.floor(Date.now() / 1000) + 1000

			await expect(elekton.createBallot(ballotId, smt.root, startDate, endDate)).to.be.revertedWith("E100")
		})
	})

	describe("#vote()", function () {
		it("An user should not vote for a non-existent ballot", async function () {
			const ballotId = 2n
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(1, 5).map((account) => account.voter.publicKey),
				ballotId,
				accounts[1].voter,
				vote
			)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E200")
		})

		it("An user should not vote in advance", async function () {
			const ballotId = 2n
			const smt = await getSmt(accounts.slice(1, 5).map((account) => account.voter.publicKey))
			const startDate = Math.floor(Date.now() / 1000) + 100
			const endDate = Math.floor(Date.now() / 1000) + 1000
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(1, 5).map((account) => account.voter.publicKey),
				ballotId,
				accounts[1].voter,
				vote
			)

			await elektonUser1.createBallot(ballotId, smt.root, startDate, endDate)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E201")
		})

		it("An user should not vote late", async function () {
			const ballotId = 3n
			const smt = await getSmt(accounts.slice(1, 5).map((account) => account.voter.publicKey))
			const startDate = Math.floor(Date.now() / 1000) + 17
			const endDate = Math.floor(Date.now() / 1000) + 27
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(1, 5).map((account) => account.voter.publicKey),
				ballotId,
				accounts[1].voter,
				vote
			)

			await elektonUser1.createBallot(ballotId, smt.root, startDate, endDate)

			await delay(12000)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E202")
		})

		it("An user should not vote in ballot with a wrong smt root", async function () {
			const ballotId = 1n
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(2, 6).map((account) => account.voter.publicKey),
				ballotId,
				accounts[1].voter,
				vote
			)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E203")
		})

		for (let userId = 1; userId < 5; userId++) {
			it(`User ${userId} should vote anonymously in ballot 1`, async function () {
				const ballotId = 1n
				const vote = BigInt(userId % 2)
				const proof = await createElektonProof(
					accounts.slice(1, 5).map((account) => account.voter.publicKey),
					ballotId,
					accounts[userId].voter,
					vote
				)

				await expect(elekton.vote(...proof))
					.to.emit(elekton, "VoteAdded")
					.withArgs(ballotId, vote)
			})
		}

		it("An user should not vote twice", async function () {
			const ballotId = 1n
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(1, 5).map((account) => account.voter.publicKey),
				ballotId,
				accounts[1].voter,
				vote
			)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E204")
		})

		it("An user should not vote with a invalid proof", async function () {
			const ballotId = 1n
			const vote = 2n
			const proof = await createElektonProof(
				accounts.slice(1, 5).map((account) => account.voter.publicKey),
				ballotId,
				accounts[0].voter,
				vote
			)

			await expect(elekton.vote(...proof)).to.be.revertedWith("E205")
		})
	})

	describe("#publishPollKey()", function () {
		it("An user should not publish a poll key in a ballot of another user", async function () {
			const elektonUser2 = elekton.connect(accounts[2].signer)
			const ballotId = 1n
			const pollKey = 122n

			await expect(elektonUser2.publishPollKey(ballotId, pollKey)).to.be.revertedWith("E104")
		})

		it("User 1 should not publish the poll key before his ballot ends", async function () {
			const ballotId = 1n
			const pollKey = 122n

			await expect(elektonUser1.publishPollKey(ballotId, pollKey)).to.be.revertedWith("E105")
		})

		it("User 1 should publish the poll key when his ballot ends", async function () {
			const ballotId = 1n
			const pollKey = 122n

			await delay(5000)

			await expect(elektonUser1.publishPollKey(ballotId, pollKey))
				.to.emit(elekton, "PollKeyPublished")
				.withArgs(ballotId, pollKey)
		})
	})
})
