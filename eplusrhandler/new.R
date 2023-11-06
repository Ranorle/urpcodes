
        library(eplusr)
        use_eplus("/Applications/EnergyPlus-9-6-0")
        path <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/idfinput/wenjiaojianzhutest.idf"
        model <- read_idf(path)
        model$set(.("Run Period 1") := .(..2 = 1, ..3 = 1, ..5 = 12, ..6 = 31))
        model$objects(c("Run Period 1"))
        model$save(overwrite = TRUE)
    