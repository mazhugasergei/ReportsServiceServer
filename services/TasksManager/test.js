import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager, TasksManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager, db })
	const tasksManager = new TasksManager({ reportsManager, db })

	it("Получить таски", async () => {
		const tasks = await tasksManager.getTasks()
		expect(tasks).to.be.an("array")
	})

	it("Получить список всех доступных провайдеров", async () => {
		const providers = await tasksManager.getProviders()
		expect(typeof providers).to.equal("object")
	})

	it("Добавить таск", async () => {
		const _id = await tasksManager.addTask({ name: "testName", type: "someTask", link: "https://example.com" })
		const tasks = await tasksManager.getTasks()
		expect(tasks.length).to.equal(1)
		expect(tasks[0].name).to.equal("testName")
		expect(tasks[0].status).to.equal("waiting")
		expect(tasks[0].type).to.equal("someTask")
		expect(tasks[0].link).to.equal("https://example.com")
		await tasksManager.deleteTask({ _id })
	})

	it("Редактировать таск", async () => {
		const _id = await tasksManager.addTask({ name: "testNameeeeeeeee" })
		await tasksManager.updateTask({ _id }, { name: "testName" })
		const tasks = await tasksManager.getTasks()
		expect(tasks.length).to.equal(1)
		expect(tasks[0].status).to.equal("waiting")
		expect(tasks[0].name).to.equal("testName")
		await tasksManager.deleteTask({ _id })
	})

	it("Удалить таск", async () => {
		const _id = await tasksManager.addTask({ type: "testName" })
		await tasksManager.deleteTask({ _id })
		const tasks = await tasksManager.getTasks()
		expect(tasks.length).to.equal(0)
	})

	it("Выполнение тасков. [Ошибка]", async () => {
		const _id = await tasksManager.addTask({ type: "nonexistentTask" })
		await tasksManager.execActiveTasks()
		const tasks = await tasksManager.getTasks()
		expect(tasks.length).to.equal(1)
		expect(tasks[0].status).to.equal("errored")
		await tasksManager.deleteTask({ _id })
	})

	describe("Провайдер CreateReport", () => {
		it("Получить отчёт", async function () {
			this.timeout(60000)
			const _id = await tasksManager.addTask({ name: "testName", type: "createReport", link: "https://example.com" })
			await tasksManager.execActiveTasks()
			const tasks = await tasksManager.getTasks()
			expect(tasks.length).to.equal(1)
			expect(tasks[0].status).to.equal("success")
			expect(tasks[0].filename).to.be.a("string")
			await tasksManager.deleteTask({ _id })
			await db("reports").deleteOne({ name: "testName" })
		})
	})
}
