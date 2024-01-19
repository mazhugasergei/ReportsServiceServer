import { expect } from "chai"

export default Test

function Test({ DaemonsManager }) {
	const daemonsManager = new DaemonsManager()

	it(`Базовая проверка работоспособности`, async () => {
		let test = 0
		const id = await daemonsManager.addDaemon({
			name: "testName",
			daemon: () => (test += 1),
			upTime: 500
		})

		expect(test).to.be.equal(1)
		await wait(600)

		expect(test).to.be.equal(2)

		daemonsManager.destroyDaemon(id)
		await wait(600)

		expect(test).to.be.equal(2)
	})
}

function wait(time) {
	return new Promise((resolve) => {
		setTimeout(resolve, time)
	})
}
