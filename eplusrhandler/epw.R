library(eplusr)

use_eplus("E:/EnergyPlus")

path <- "E:/EnergyPlus/inputweather/USA_CA_San.Francisco.Intl.AP.724940_TMY3.epw"

epw <- read_epw(path)

epw