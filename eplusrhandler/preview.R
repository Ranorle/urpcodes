
	library(eplusr)
	use_eplus("/Applications/EnergyPlus-9-6-0")
	path_idf <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/idfinput/5Zone_IdealLoadsAirSystems_ReturnPlenum.idf"
	model <- read_idf(path_idf)
	geom <- model$geometry()
	viewer <- geom$view()
	viewer$viewpoint("iso")
	viewer$render_by("normal")
	Sys.sleep(30)
	