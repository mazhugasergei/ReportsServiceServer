import { expect } from "chai"
import { v1 as uuidv1 } from "uuid"

export default Test

function Test({ mongoManager, ReportsManager, TasksManager, CronManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager })
	const tasksManager = new TasksManager({ reportsManager, db })
	const cronManager = new CronManager({ tasksManager })

	it("************************", async () => {
		await db("sources").deleteMany({ name: "testName" })
		await db("tasks").deleteMany({ name: "testName" })
		await db("reports").deleteMany({ name: "testName" })
	})

	it("Создать работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ sourceId: _id, name: "testName", cron: "*/30 * * * *" })
		expect(cronManager.jobs).to.have.key(_id)
		cronManager.deleteJob(_id)
	})

	it("Редактировать работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ sourceId: _id, name: "testName", cron: "*/30 * * * *" })
		cronManager.updateJob(_id, { name: "testtt", cron: "*/45 * * * *" })
		expect(Object.keys(cronManager.jobs).length).to.equal(1)
		cronManager.deleteJob(_id)
	})

	it("Удалить работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ sourceId: _id, name: "testName", cron: "*/30 * * * *" })
		cronManager.deleteJob(_id)
		expect(cronManager.jobs).not.have.key(_id)
	})
}
