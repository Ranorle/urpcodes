library(eplusr)

use_eplus("/Applications/EnergyPlus-9-6-0")

path <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/idfinput/1ZoneDataCenterCRAC_wApproachTemp.idf"

model <- read_idf(path)

model$del("Mar")

model$objects(c("Jan"))

model$save(overwrite = TRUE)
