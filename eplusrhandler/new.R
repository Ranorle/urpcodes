
		library(eplusr)
		use_eplus("E:/EnergyPlus")
		path <- "E:/EnergyPlus/inputidf/1ZoneDataCenterCRAC_wApproachTemp2.idf"
		model <- read_idf(path)

		model$add( RunPeriod = .(
		name = "March", ..2 = 3, ..3 = 1, ..5 = 3, ..6 = 3)
		)
		model$objects(c("March"))
		model$save(overwrite = TRUE)
	