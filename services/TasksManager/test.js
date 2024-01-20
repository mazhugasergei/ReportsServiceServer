import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager, TasksManager, db }) {
	const reportsManager = new ReportsManager({ mongoManager, db })
	const tasksManager = new TasksManager({ reportsManager, db })

	it("Получить список всех доступных провайдеров", async () => {
		const providers = await tasksManager.getProviders()
		expect(providers).to.be.an("object")
	})

	it("Получить таски", async () => {
		const tasks = await tasksManager.getTasks()
		expect(tasks).to.be.an("array")
	})

	it("Создать таск", async () => {
		const _id = await tasksManager.addTask({ name: "testName" })
		const tasks = (await tasksManager.getTasks()).filter((task) => task._id === _id)
		expect(tasks.length).to.equal(1)
		expect(tasks[0].name).to.equal("testName")
		expect(tasks[0].status).to.equal("waiting")
		await db("tasks").deleteOne({ _id })
	})

	it("Редактировать таск", async () => {
		const _id = await tasksManager.addTask({ name: "testNameeeeeeeee" })
		await tasksManager.updateTask(_id, { name: "testName" })
		const tasks = (await tasksManager.getTasks()).filter((task) => task._id === _id)
		expect(tasks.length).to.equal(1)
		expect(tasks[0].name).to.equal("testName")
		await db("tasks").deleteOne({ _id })
	})

	it("Удалить таск", async () => {
		const _id = await tasksManager.addTask({ name: "testName" })
		await tasksManager.deleteTask(_id)
		const tasks = (await tasksManager.getTasks()).filter((task) => task._id === _id)
		expect(tasks.length).to.equal(0)
	})

	it("Выполнение тасков (с ошибкой)", async () => {
		const _id = await tasksManager.addTask({ type: "nonexistentTaskType" })
		await tasksManager.execActiveTasks()
		const tasks = (await tasksManager.getTasks()).filter((task) => task._id === _id)
		expect(tasks.length).to.equal(1)
		expect(tasks[0].status).to.equal("errored")
		await db("tasks").deleteOne({ _id })
	})

	describe("Провайдер CreateReport", () => {
		it("Получить отчёт", async function () {
			this.timeout(60000)
			const _id = await tasksManager.addTask({ name: "testName", type: "createReport", link: "https://example.com" })
			await tasksManager.execActiveTasks()
			const tasks = (await tasksManager.getTasks()).filter((task) => task._id === _id)
			expect(tasks.length).to.equal(1)
			expect(tasks[0].status).to.equal("success")
			expect(tasks[0].fileId).to.be.a("string")
			await db("tasks").deleteOne({ _id })
			await db("reports").deleteOne({ name: "testName" })
		})
	})
}
