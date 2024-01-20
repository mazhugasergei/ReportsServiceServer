import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager, db })

	it("Создать отчёт", async function () {
		this.timeout(30000)
		const fileId = await reportsManager.createReport({ name: "testName", link: "https://example.com" })
		const reports = await db("reports").find({ fileId }).toArray()
		expect(reports[0].name).to.equal("testName")
		expect(reports[0].fileId).to.be.a("string")
	})

	it("Получить отчёт", async () => {
		const report = await reportsManager.getReport("testName")
		expect(report.name).to.equal("testName")
	})

	it("Получить все отчёты", async () => {
		const reports = await reportsManager.getReports()
		expect(reports).to.be.an("array")
		expect(reports.length).to.be.greaterThan(0)
		await db("reports").deleteOne({ name: "testName" })
	})
}
