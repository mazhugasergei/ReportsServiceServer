import puppeteer from "puppeteer"
import { v1 as uuidv1 } from "uuid"

export default function Manager({ mongoManager, db }) {
	this.createReport = createReport
	this.getReport = getReport
	this.getReports = getReports

	async function createReport({ name, sourceId, taskId, link, created }) {
		const browser = await puppeteer.launch({ headless: "new", executablePath: puppeteer.executablePath() })
		const page = await browser.newPage()
		page.setViewport({ width: 1600, height: 900 })
		await page.goto(link, { waitUntil: "networkidle0", timeout: 60000 })
		const pageSize = await page.evaluate(() => ({
			width: window.document.body.scrollWidth,
			height: window.document.body.scrollHeight
		}))
		page.setViewport(pageSize)
		await page.goto(link, { waitUntil: "networkidle0", timeout: 60000 })
		const imageBuffer = await page.screenshot({ type: "jpeg" })
		await browser.close()
		const fileId = await mongoManager.gfs.insertFile({
			blob: new Blob([imageBuffer], { type: "image/jpeg" }),
			metadata: { isMeta: true },
			created: Date.now()
		})
		await db("reports").insertOne({
			_id: uuidv1(),
			name,
			sourceId,
			taskId,
			fileId,
			created
		})
		return fileId
	}

	async function getReport(name) {
		return (await db("reports").find({ name }).sort({ created: -1 }).toArray())[0]
	}

	async function getReports() {
		return (await db("reports").find().sort({ created: -1 })).toArray()
	}
}
