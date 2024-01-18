import { expect } from "chai"
import { v1 as uuidv1 } from "uuid"

export default Test

function Test({ mongoManager, ReportsManager, TasksManager, CronManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager })
	const tasksManager = new TasksManager({ reportsManager, db })
	const cronManager = new CronManager({ tasksManager })

	it("Создать работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ _id, name: "test", link: "https://example.com", cron: "*/15 * * * *" })
		expect(cronManager.jobs).to.have.key(_id)
		cronManager.deleteJob(_id)
	})

	it("Редактировать работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ _id, name: "test", link: "https://google.com", cron: "*/15 * * * *" })
		cronManager.updateJob(_id, { name: "testtt", link: "https://example.com", cron: "*/30 * * * *" })
		expect(Object.keys(cronManager.jobs).length).to.equal(1)
		cronManager.deleteJob(_id)
	})

	it("Удалить работу", () => {
		const _id = uuidv1()
		cronManager.addJob({ _id, name: "test", link: "https://example.com", cron: "*/15 * * * *" })
		cronManager.deleteJob(_id)
		expect(cronManager.jobs).not.have.key(_id)
	})
}
