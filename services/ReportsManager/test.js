import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager }) {
	const reportsManager = new ReportsManager({ mongoManager })

	it("Создать и получить отчёт", async function () {
		this.timeout(60000)
		const filename = await reportsManager.createReport("https://example.com")
		const file = await mongoManager.gfs.getFile({ filename })
		console.log(file)
		expect(file.filename).to.equal(filename)
	})
}
