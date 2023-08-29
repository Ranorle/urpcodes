library(eplusr)

use_eplus("E:/EnergyPlus")

path <- "E:/EnergyPlus/inputidf/1ZoneDataCenterCRAC_wApproachTemp2.idf"

model <- read_idf(path)


model$set(.("Jan") := .(..2 = 7))

model$objects(c("Jan"))
