
	library(eplusr)
	use_eplus("E:/EnergyPlus")
	path_idf <- "E:/EnergyPlus/inputidf/5Zone_IdealLoadsAirSystems_ReturnPlenum.idf"
	model <- read_idf(path_idf)
	geom <- model$geometry()
	viewer <- geom$view()
	viewer$viewpoint("iso")
	viewer$x_ray(TRUE)
	Sys.sleep(30)
	