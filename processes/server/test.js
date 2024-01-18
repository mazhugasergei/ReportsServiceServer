import startedProcess from "./process.js"
import { expect } from "chai"

export default Test

function Test({ mongoManager, ReportsManager, TasksManager, CronManager, SourcesManager, db, config }) {
	const reportsManager = new ReportsManager({ mongoManager })
	const tasksManager = new TasksManager({ reportsManager, db })
	const cronManager = new CronManager({ tasksManager })
	const sourcesManager = new SourcesManager({ db })
	const url = `http://127.0.0.1:${config.horizen.ports.server}`

	function wait(time) {
		return new Promise((resolve) => {
			setTimeout(resolve, time)
		})
	}

	describe("Проверка бизнес-цепочки", function () {
		it("********************", async () => {
			await db("sources").deleteMany()
		})

		it("Создать ресурс", async () => {
			const response = await (
				await fetch(`${url}/api/createSource`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "testName",
						link: "https://example.com",
						cron: "*/1 * * * *"
					})
				})
			).json()
			expect(response.result._id).to.be.a("string")
			const sources = await sourcesManager.getSources()
			expect(sources.length).to.equal(1)
		})

		it("Проверить отсутствие тасков", async () => {
			const response = await (
				await fetch(`${url}/api/getTasks`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			console.log(response.result.tasks)
			expect(response.result.tasks).to.be.an("array")
			expect(response.result.tasks.length).to.equal(0)
		})
		it("Ждать выполнения cron-работы", async function () {
			this.timeout(71000)
			await wait(70000)
		})
		it("Проверить наличие выполненного таска", async () => {
			const tasks = await tasksManager.getTasks({ status: "success" })
			console.log(tasks)
			expect(tasks.length).to.be.greaterThan(0)
		})

		it("Найти ресурс по имени", async () => {
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						name: "testName"
					})
				})
			).json()
			expect(response.result.sources[0]._id).to.be.a("string")
			expect(response.result.sources[0].name).to.equal("testName")
		})

		it("Найти все ресурсы", async () => {
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			expect(response.result.sources).to.be.an("array")
			expect(response.result.sources.length).to.equal(1)
		})

		it("Редактировать ресурс", async () => {
			// найти ресурс
			const res = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			// редактировать ресурс
			await fetch(`${url}/api/updateSource`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					_id: res.result.sources[0]._id,
					name: "testNameeeeeeee",
					cron: "*/15 * * * *",
					link: "https://example.com"
				})
			})
			// проверить редактирование
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			expect(response.result.sources).to.be.an("array")
			expect(response.result.sources.length).to.equal(1)
			expect(response.result.sources[0].name).to.equal("testNameeeeeeee")
		})

		it("Удалить ресурс", async () => {
			// найти существующий ресурс
			const res = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			// удалить его
			await fetch(`${url}/api/deleteSource`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ _id: res.result.sources[0]._id })
			})
			// проверить удаление
			const response = await (
				await fetch(`${url}/api/getSources`, {
					method: "POST",
					headers: { "Content-Type": "application/json" }
				})
			).json()
			it("Проверить отсутствие ресурса", () => {
				expect(response.result.sources).to.be.an("array")
				expect(response.result.sources.length).to.equal(0)
			})
			it("Проверить отсутствие работы", () => {
				expect(Object.keys(cronManager.jobs).length).to.equal(0)
			})
		})

		it("********************", async () => {
			await db("sources").deleteMany()
		})
	})
}
