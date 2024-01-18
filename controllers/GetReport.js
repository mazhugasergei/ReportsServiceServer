export default function ({ reportsManager }) {
	return {
		endpoint: "/api/getReport",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			name: string(/.{1,100}/)
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({
			name: string(/.{1,100}/),
			created: number(/.{1,100}/),
			file: string(/.{1,100}/)
		}),

		controller: async function ({ body, auth, req, res }) {
			const report = await reportsManager.getReport(body.name)
			const { name, created, file } = report
			return { name, created, file }
		}
	}
}
