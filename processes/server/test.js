import startedProcess from "./process.js"
import { expect } from "chai"

export default Test

function Test({ DaemonsManager, mongoManager, ReportsManager, TasksManager, CronManager, SourcesManager, db, config }) {
	const reportsManager = new ReportsManager({ mongoManager, db })
	const tasksManager = new TasksManager({ reportsManager, db })
	const cronManager = new CronManager({ tasksManager })
	const sourcesManager = new SourcesManager({ db })
	const daemonsManager = new DaemonsManager()
	const url = `http://127.0.0.1:${config.horizen.ports.server}`

	function wait(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time)
		})
	}

	describe("Проверка бизнес-цепочки", function () {
		it("Добавить демон", async () => {
			daemonsManager.addDaemon({ name: "execActiveTasks", daemon: tasksManager.execActiveTasks })
		})

		it("Создать ресурс", async () => {
			const response = await (
				await fetch(`${url}/api/createSource`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "testName",
						link: "https://example.com",
						cron: "* * * * *"
					})
				})
			).json()
			const { _id } = response.result
			expect(_id).to.be.a("string")
			const sources = (await sourcesManager.getSources()).filter((source) => source._id === _id)
			expect(sources.length).to.equal(1)
		})

		it("Найти все ресурсы", async () => {
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const sources = response.result.sources
			expect(sources.length).to.be.greaterThan(0)
		})

		it("Ждать выполнения cron-работы", async function () {
			this.timeout(70000)
			while (!(await db("tasks").find({ name: "testName" }).toArray()).length) await wait(1000)
		})

		it("Проверить наличие тасков", async () => {
			const response = await (
				await fetch(`${url}/api/getTasks`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const tasks = response.result.tasks
			expect(tasks.length).to.be.greaterThan(0)
		})

		it("Проверить поиск отчётов", async function () {
			this.timeout(30000)
			while (!(await db("reports").find({ name: "testName" }).toArray()).length) wait(1000)
			const response = await (
				await fetch(`${url}/api/getReports`, {
					method: "GET",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { reports } = response.result
			expect(reports.length).to.be.greaterThan(0)
			expect(reports[0].fileId).to.be.a("string")
		})

		it("Проверить поиск отчёта", async function () {
			const response = await (
				await fetch(`${url}/api/getReport`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "testName"
					})
				})
			).json()
			const report = response.result
			expect(report.fileId).to.be.a("string")
			await db("reports").deleteOne(report)
		})

		it("Редактировать ресурс", async () => {
			// найти ресурс
			const res = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { _id } = res.result.sources.filter(({ name }) => name === "testName")[0]
			// редактировать ресурс
			await fetch(`${url}/api/updateSource`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					_id,
					name: "testNameeeeeeee",
					cron: "*/15 * * * *",
					link: "https://example.com?q=123"
				})
			})
			// проверить редактирование
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { name, cron, link } = response.result.sources.filter(({ name }) => name === "testNameeeeeeee")[0]
			expect(name).to.equal("testNameeeeeeee")
			expect(cron).to.equal("*/15 * * * *")
			expect(link).to.equal("https://example.com?q=123")
		})

		it("Удалить ресурс", async () => {
			// найти ресурс
			const res = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { _id } = res.result.sources.filter(({ name }) => name === "testNameeeeeeee")[0]
			// удалить его
			await fetch(`${url}/api/deleteSource`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ _id })
			})
			// проверить удаление
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const sources = response.result.sources.filter((source) => source._id === _id)
			it("Проверить отсутствие ресурса", () => {
				expect(sources).to.be.an("array")
				expect(sources.length).to.equal(0)
			})
			it("Проверить отсутствие работы", () => {
				expect(Object.keys(cronManager.jobs)).not.have(_id)
			})
		})

		it("Пересобрать таск", async () => {
			// найти таск
			const res = await (
				await fetch(`${url}/api/getTasks`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { _id } = res.result.tasks.filter(({ name }) => name === "testName")[0]
			// пересобрать
			await (
				await fetch(`${url}/api/rebuildTask`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						_id,
						link: "https://example.com?q=123"
					})
				})
			).json()
			// проверить редактирование
			const response = await (
				await fetch(`${url}/api/getTasks`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			const { link } = response.result.tasks.filter(({ name }) => name === "testName")[0]
			expect(link).to.equal("https://example.com?q=123")
			await db("tasks").deleteOne({ _id })
		})

		// it("************************", async () => {
		// 	await db("sources").deleteMany({ name: "testName" })
		// 	await db("sources").deleteMany({ name: "testNameeeeeeee" })
		// 	await db("tasks").deleteMany({ name: "testName" })
		// 	await db("reports").deleteMany({ name: "testName" })
		// })
	})
}
