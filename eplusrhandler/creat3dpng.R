library(eplusr)
use_eplus("/Applications/EnergyPlus-9-6-0")
path <- "/Users/dengshengyuan/Desktop/EnergyPlusInput/idfinput/newjuminlou.idf"
model <- read_idf(path)
geom <- model$geometry()

viewer <- geom$view()

file_name <- basename(path)
output_dir <- file.path("./assests", file_name)
dir.create(output_dir, recursive = TRUE, showWarnings = FALSE)


# 视点名称列表
viewpoints <- c("top", "bottom", "left", "right", "front", "back", "iso")

viewer$ground(TRUE)
viewer$win_size(0, 0, 800, 800)

# 遍历视点并保存截图
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"surface_type", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}

viewer$x_ray(TRUE)
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"x-ray", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}
viewer$x_ray(FALSE)
viewer$render_by("zone")
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"zone", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}
viewer$render_by("boundary")
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"boundary", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}
viewer$render_by("construction")
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"construction", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}
viewer$render_by("space")
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"space", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}
viewer$render_by("normal")
for (viewpoint in viewpoints) {
  snapshot_path <- file.path(output_dir,"normal", paste(viewpoint, ".png", sep = ""))
  viewer$viewpoint(viewpoint)
  viewer$snapshot(snapshot_path)
}

viewer$close()