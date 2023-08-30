library(eplusr)

use_eplus("/Applications/EnergyPlus-9-6-0")

path <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/epwinput/CHN_Beijing.Beijing.545110_CSWD.epw"

epw <- read_epw(path)

epw