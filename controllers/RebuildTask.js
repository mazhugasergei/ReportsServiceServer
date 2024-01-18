export default function ({ tasksManager }) {
	return {
		endpoint: "/api/rebuildTask",
		auth: "bypass",
		description: "",
		errors: {},

		reqSchema: ({ string, object, array, number, any }, {}) => ({
			name: string(/.{1,100}/),
			link: string(/.{1,100}/).optional(),
			type: string(/.{1,100}/).optional()
		}),

		resSchema: ({ string, object, array, number, any }, {}) => ({}),

		controller: async function ({ body, auth, req, res }) {
			await tasksManager.addTask(body)
		}
	}
}
