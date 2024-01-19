import { expect } from "chai"

export default Test

function Test({ SourcesManager, db }) {
	const sourcesManager = new SourcesManager({ db })

	it("Получить все ресурсы", async () => {
		const sources = await sourcesManager.getSources()
		expect(sources).to.be.an("array")
	})

	it("Создать ресурс", async () => {
		const id = await sourcesManager.createSource({ name: "testName" })
		const sources = (await sourcesManager.getSources()).filter(({ _id }) => _id === id)
		expect(sources.length).to.equal(1)
		expect(sources[0].name).to.equal("testName")
		await sourcesManager.deleteSource(id)
	})

	it("Редактировать ресурс", async () => {
		const id = await sourcesManager.createSource({ name: "testNameeeeeeeee" })
		await sourcesManager.updateSource(id, { name: "testName" })
		const sources = (await sourcesManager.getSources()).filter(({ _id }) => _id === id)
		expect(sources.length).to.equal(1)
		expect(sources[0].name).to.equal("testName")
		await sourcesManager.deleteSource(id)
	})

	it("Удалить ресурс", async () => {
		const id = await sourcesManager.createSource({ name: "testName" })
		await sourcesManager.deleteSource(id)
		const sources = (await sourcesManager.getSources()).filter(({ _id }) => _id === id)
		expect(sources.length).to.equal(0)
	})
}
