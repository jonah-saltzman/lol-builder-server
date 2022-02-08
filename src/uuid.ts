import { performance } from 'perf_hooks'

export class UUID {
	protected str: string
	constructor(str?: string) {
		this.str = str || UUID.newUuid().toString()
		let reg: RegExp = new RegExp(
			'[A-F0-9]{8}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{4}-[A-F0-9]{12}',
			'i'
		)
		if (!reg.test(this.str)) {
			throw new InvalidUuidError()
		}
	}
	toString() {
		return this.str
	}
	public static newUuid() {
		const v = 4
		let d = new Date().getTime()
		d += performance.now()
		let uuid: string = (
			'xxxxxxxx-xxxx-' +
			v.toString().substring(0, 1) +
			'xxx-yxxx-xxxxxxxxxxxx'
		).replace(/[xy]/g, (c) => {
			let r = (d + Math.random() * 16) % 16 | 0
			d = Math.floor(d / 16)
			return (c == 'x' ? r : (r & 0x3) | 0x8).toString(16)
		})

		return new UUID(uuid)
	}
}

export class InvalidUuidError extends Error {
	constructor(m?: string) {
		super(m || 'Error: invalid UUID !')
		Object.setPrototypeOf(this, InvalidUuidError.prototype)
	}
}
