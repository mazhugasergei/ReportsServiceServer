import Horizen from "horizen-framework/backend"
import config from "../../config.json" assert { type: "json" }

const horizen = new Horizen(config.horizen)

export default horizen.init(async function (props, options) {
	const { localServices, controllers } = props
	const deps = { ...props, config }

	const daemonsManager = new localServices.DaemonsManager()
	const sourcesManager = new localServices.SourcesManager({ ...props })
	const reportsManager = new localServices.ReportsManager({ ...props })
	const tasksManager = new localServices.TasksManager({ reportsManager, ...props })
	const cronManager = new localServices.CronManager({ tasksManager, ...props })

	daemonsManager.addDaemon({ name: "execActiveTasks", daemon: tasksManager.execActiveTasks })

	return {
		port: config.horizen.ports.server,

		controllers: {
			get: [],
			post: [
				controllers.GetSources({ sourcesManager, ...deps }),
				controllers.CreateSource({ cronManager, sourcesManager, ...deps }),
				controllers.UpdateSource({ cronManager, sourcesManager, ...deps }),
				controllers.DeleteSource({ cronManager, sourcesManager, ...deps }),
				controllers.GetTasks({ tasksManager, ...deps })
			]
		}
	}
})
