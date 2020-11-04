/** Declaration file generated by dts-gen */

declare module "circomlib" {
	export class SMT {
		constructor(...args: any[])

		delete(...args: any[]): void

		find(...args: any[]): void

		insert(...args: any[]): void

		update(...args: any[]): void
	}

	export class SMTMemDB {
		constructor(...args: any[])

		get(...args: any[]): void

		getRoot(...args: any[]): void

		multiDel(...args: any[]): void

		multiGet(...args: any[]): void

		multiIns(...args: any[]): void

		setRoot(...args: any[]): void
	}

	export function poseidon(inputs: any): any

	export namespace babyJub {
		const A: any

		const Base8: any[]

		const D: any

		const Generator: any[]

		const order: any

		const p: any

		const subOrder: any

		function addPoint(a: any, b: any): any

		function inCurve(P: any): any

		function inSubgroup(P: any): any

		function mulPointEscalar(base: any, e: any): any

		function packPoint(P: any): any

		function unpackPoint(_buff: any): any

		namespace F {
			const R: any

			const bitLength: number

			const half: any

			const mask: any

			const minusone: any

			const n64: number

			const nqr: any

			const nqr_to_t: any

			const one: any

			const p: any

			const s: number

			const t: any

			const two: any

			const zero: any

			function add(...args: any[]): void

			function band(...args: any[]): void

			function bnot(...args: any[]): void

			function bor(...args: any[]): void

			function bxor(...args: any[]): void

			function div(...args: any[]): void

			function e(...args: any[]): void

			function eq(...args: any[]): void

			function geq(...args: any[]): void

			function gt(...args: any[]): void

			function idiv(...args: any[]): void

			function inv(...args: any[]): void

			function isZero(...args: any[]): void

			function land(...args: any[]): void

			function leq(...args: any[]): void

			function lnot(...args: any[]): void

			function lor(...args: any[]): void

			function lt(...args: any[]): void

			function mod(...args: any[]): void

			function mul(...args: any[]): void

			function mulScalar(...args: any[]): void

			function neg(...args: any[]): void

			function neq(...args: any[]): void

			function normalize(...args: any[]): void

			function pow(...args: any[]): void

			function random(...args: any[]): void

			function shl(...args: any[]): void

			function shr(...args: any[]): void

			function sqrt(...args: any[]): void

			function square(...args: any[]): void

			function sub(...args: any[]): void

			function toString(...args: any[]): void
		}
	}

	export namespace eddsa {
		function packSignature(sig: any): any

		function pruneBuffer(_buff: any): any

		function prv2pub(prv: any): any

		function sign(prv: any, msg: any): any

		function signMiMC(prv: any, msg: any): any

		function signMiMCSponge(prv: any, msg: any): any

		function signPoseidon(prv: any, msg: any): any

		function unpackSignature(sigBuff: any): any

		function verify(msg: any, sig: any, A: any): any

		function verifyMiMC(msg: any, sig: any, A: any): any

		function verifyMiMCSponge(msg: any, sig: any, A: any): any

		function verifyPoseidon(msg: any, sig: any, A: any): any
	}

	export namespace mimc7 {
		function getConstants(seed: any, nRounds: any): any

		function getIV(seed: any): any

		function hash(_x_in: any, _k: any): any

		function multiHash(arr: any, key: any): any

		namespace F {
			const R: any

			const bitLength: number

			const half: any

			const mask: any

			const minusone: any

			const n64: number

			const nqr: any

			const nqr_to_t: any

			const one: any

			const p: any

			const s: number

			const t: any

			const two: any

			const zero: any

			function add(...args: any[]): void

			function band(...args: any[]): void

			function bnot(...args: any[]): void

			function bor(...args: any[]): void

			function bxor(...args: any[]): void

			function div(...args: any[]): void

			function e(...args: any[]): void

			function eq(...args: any[]): void

			function geq(...args: any[]): void

			function gt(...args: any[]): void

			function idiv(...args: any[]): void

			function inv(...args: any[]): void

			function isZero(...args: any[]): void

			function land(...args: any[]): void

			function leq(...args: any[]): void

			function lnot(...args: any[]): void

			function lor(...args: any[]): void

			function lt(...args: any[]): void

			function mod(...args: any[]): void

			function mul(...args: any[]): void

			function mulScalar(...args: any[]): void

			function neg(...args: any[]): void

			function neq(...args: any[]): void

			function normalize(...args: any[]): void

			function pow(...args: any[]): void

			function random(...args: any[]): void

			function shl(...args: any[]): void

			function shr(...args: any[]): void

			function sqrt(...args: any[]): void

			function square(...args: any[]): void

			function sub(...args: any[]): void

			function toString(...args: any[]): void
		}
	}

	export namespace mimcsponge {
		function getConstants(seed: any, nRounds: any): any

		function getIV(seed: any): any

		function hash(_xL_in: any, _xR_in: any, _k: any): any

		function multiHash(arr: any, key: any, numOutputs: any): any
	}

	export namespace pedersenHash {
		function getBasePoint(baseHashType: any, pointIdx: any): any

		function hash(msg: any, options: any): any
	}

	export namespace smt {
		class SMT {
			constructor(...args: any[])

			delete(...args: any[]): void

			find(...args: any[]): void

			insert(...args: any[]): void

			update(...args: any[]): void
		}

		class SMTMemDB {
			constructor(...args: any[])

			get(...args: any[]): void

			getRoot(...args: any[]): void

			multiDel(...args: any[]): void

			multiGet(...args: any[]): void

			multiIns(...args: any[]): void

			setRoot(...args: any[]): void
		}

		function loadFromFile(fileName: any): void

		function newMemEmptyTrie(): any
	}
}