export default function ({ sourcesManager }) {
	return {
		endpoint: "/api/getSources",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({}),

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
			const sources = (await sourcesManager.getSources()).map((source) => {
				const { _id, ...props } = source
				return { _id: _id.toString(), ...props }
			})
			return { sources }
		}
	}
}
