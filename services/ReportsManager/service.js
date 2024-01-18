import puppeteer from "puppeteer"

export default function Manager({ mongoManager }) {
	this.createReport = createReport
	this.getReport = getReport

	async function createReport(link) {
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
		const filename = await mongoManager.gfs.insertFile({
			blob: new Blob([imageBuffer], { type: "image/jpeg" }),
			metadata: { isMeta: true },
			created: Date.now()
		})
		return filename
	}

	async function getReport(filename) {
		return await mongoManager.gfs.getFile({ filename })
		// return await mongoManager.gfs.getFile({ name })
		// .sort({ created: -1 }).toArray())[0]
	}
}
