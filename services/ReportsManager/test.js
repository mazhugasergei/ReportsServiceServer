import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager, db })

	it("Создать отчёт", async function () {
		this.timeout(30000)
		const fileId = await reportsManager.createReport({ name: "testReport", link: "https://example.com" })
		expect(fileId).to.be.a("string")
	})

	it("Получить отчёт", async () => {
		const file = await reportsManager.getReport("testReport")
		console.log(file) ////
		expect(file.name).to.equal("testReport")
	})

	it("Получить отчёты", async () => {
		const files = await reportsManager.getReports()
		console.log(files) ////
		expect(files).to.be.an("array")
		expect(files.length).to.equal(1)
		expect(files[0].name).to.be.a("string")
		await db("reports").deleteMany()
	})
}
