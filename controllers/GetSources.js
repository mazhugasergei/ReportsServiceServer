export default function ({ sourcesManager }) {
	return {
		endpoint: "/api/getSources",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			name: string(/.{1,100}/).optional()
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({
			sources: array(
				object({
					_id: string(/.{1,100}/),
					name: string(/.{1,100}/),
					link: string(/.{1,100}/),
					cron: string(/.{1,100}/),
					created: number(/.{1,100}/)
				})
			)
		}),

		controller: async function ({ body, auth, req, res }) {
			const sources = await sourcesManager.getSources(body)
			return { sources }
		}
	}
}
