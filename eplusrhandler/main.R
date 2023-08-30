
	library(eplusr)
	use_eplus("E:/EnergyPlus")
	path_idf <- "E:/EnergyPlus/inputidf/1ZoneDataCenterCRAC_wApproachTemp2.idf"
	path_epw <- "E:/EnergyPlus/inputweather/USA_CA_San.Francisco.Intl.AP.724940_TMY3.epw"
	model <- read_idf(path_idf)
	job <- model$run(path_epw, dir = "E:/EnergyPlus/output/20230830225020" , wait = TRUE)
	job
	