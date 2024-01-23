import Horizen from "horizen-framework/backend"
import config from "../../config.json" assert { type: "json" }
import cron from "node-cron"

const horizen = new Horizen(config.horizen)

export default horizen.init(async function (props, options) {
	const { localServices, controllers } = props
	const deps = { ...props, config }

	const daemonsManager = new localServices.DaemonsManager()
	const sourcesManager = new localServices.SourcesManager({ ...props })
	const reportsManager = new localServices.ReportsManager({ ...props })
	const tasksManager = new localServices.TasksManager({ reportsManager, ...props })
	const cronManager = new localServices.CronManager({ tasksManager, ...props })

	;(await sourcesManager.getSources()).forEach((source) => {
		const { _id, name, link, cron } = source
		cronManager.addJob({ sourceId: _id, name, link, cron })
	})

	daemonsManager.addDaemon({ name: "execActiveTasks", daemon: tasksManager.execActiveTasks })

	cron.schedule("59 23 * * *", () => {
		process.exit(-1)
	})

	return {
		port: config.horizen.ports.server,

		controllers: {
			get: [controllers.GetReports({ reportsManager, ...deps })],
			post: [
				controllers.GetSources({ sourcesManager, ...deps }),
				controllers.CreateSource({ cronManager, sourcesManager, ...deps }),
				controllers.UpdateSource({ cronManager, sourcesManager, ...deps }),
				controllers.DeleteSource({ cronManager, sourcesManager, ...deps }),
				controllers.GetTasks({ tasksManager, ...deps }),
				controllers.RebuildTask({ tasksManager, ...deps }),
				controllers.GetReport({ reportsManager, ...deps })
			]
		}
	}
})
