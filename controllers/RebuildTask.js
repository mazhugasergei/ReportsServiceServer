export default function ({ tasksManager }) {
	return {
		endpoint: "/api/rebuildTask",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			_id: string(/.{1,100}/),
			link: string(/.{1,100}/)
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({}),

		controller: async function ({ body, auth, req, res }) {
			const { _id, link } = body
			await tasksManager.updateTask(_id, { status: "waiting", link })
		}
	}
}
