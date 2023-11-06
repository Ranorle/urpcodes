
	library(eplusr)
	use_eplus("/Applications/EnergyPlus-9-6-0")
	path_idf <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/idfinput/wenjiaojianzhuchuban.idf"
	path_epw <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/epwinput/CHN_Beijing.Beijing.545110_CSWD.epw"
	model <- read_idf(path_idf)
	job <- model$run(path_epw, dir = "/Users/dengshengyuan/Desktop/EnergyPlusOutput/20231029092529" , wait = TRUE)
	job
	