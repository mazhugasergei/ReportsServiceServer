import { expect } from "chai"

export default Test

function Test({ SourcesManager, db }) {
	const sourcesManager = new SourcesManager({ db })

	it("Получить ресурсы", async () => {
		it("Получить все", async () => {
			const sources = await sourcesManager.getSources()
			expect(sources).to.be.an("array")
		})
		it("Получить по имени", async () => {
			const _id = await sourcesManager.createSource({ name: "testSource" })
			const sources = await sourcesManager.getSources({ name: "testSource" })
			expect(sources).to.be.an("array")
			expect(sources.length).to.equal(1)
			await sourcesManager.deleteSource(_id)
		})
	})

	it("Создать ресурс", async () => {
		const _id = await sourcesManager.createSource({ name: "testSource" })
		const sources = await sourcesManager.getSources({ _id })
		expect(sources.length).to.equal(1)
		expect(sources[0].name).to.equal("testSource")
		await sourcesManager.deleteSource(_id)
	})

	it("Редактировать ресурс", async () => {
		const _id = await sourcesManager.createSource({ name: "testSourceeeeeeeee" })
		await sourcesManager.updateSource(_id, { name: "testSource" })
		const sources = await sourcesManager.getSources({ _id })
		expect(sources.length).to.equal(1)
		expect(sources[0].name).to.equal("testSource")
		await sourcesManager.deleteSource(_id)
	})

	it("Удалить ресурс", async () => {
		const _id = await sourcesManager.createSource({ name: "testSource" })
		await sourcesManager.deleteSource(_id)
		const sources = await sourcesManager.getSources({ _id })
		expect(sources.length).to.equal(0)
	})
}
