
		library(eplusr)
		use_eplus("E:/EnergyPlus")
		path <- "E:/EnergyPlus/inputweather/USA_NY_New.York-Central.Park.725033_TMY3.epw"
		epw <- read_epw(path)
		epw$data()$wind_speed
	