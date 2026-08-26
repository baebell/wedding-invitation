library(tidyverse)
library(ggplot2)

# ✅ 데이터 입력 (event 이름 그대로 유지)
df <- tribble(
  ~Outcome, ~Operation, ~HR, ~Lower, ~Upper,
  
  "All cause Death for 10 Years", "Fusion", 2.081, 1.299, 3.335,
  "All cause Death for 10 Years", "Decompression", 2.843, 1.960, 4.124,
  
  "Surgical Site Infection for 6months", "Fusion", 2.508, 1.317, 4.777,
  "Surgical Site Infection for 6months", "Decompression", 1.517, 0.935, 2.460,
  
  "Urinary Tract Infection for 6months", "Fusion", 2.578, 1.333, 4.984,
  "Urinary Tract Infection for 6months", "Decompression", 1.109, 0.694, 1.774,
  
  "Delirium for 6months", "Fusion", 4.357, 1.179, 16.108,
  "Delirium for 6months", "Decompression", 2.654, 0.932, 7.553,
  
  "Deep Vein Thrombosis for 6months", "Fusion", 1.940, 0.538, 6.995,
  "Deep Vein Thrombosis for 6months", "Decompression", 1.354, 0.387, 4.733,
  
  "ICU Admission for 6months", "Fusion", 3.839, 1.571, 9.384,
  "ICU Admission for 6months", "Decompression", 3.962, 1.870, 8.395,
  
  "Reoperation for 6months", "Fusion", 1.293, 0.359, 4.652,
  "Reoperation for 6months", "Decompression", 1.646, 0.604, 4.486
)

# ✅ Outcome 순서 고정 (입력 순서 유지)
df$Outcome <- factor(df$Outcome, levels = rev(unique(df$Outcome)))

# ✅ 계층형 y축 (Outcome + subgroup)
df <- df %>%
  arrange(Outcome, Operation) %>%
  mutate(
    Operation_label = paste0("   ", Operation),  # indent
    y_axis = interaction(Outcome, Operation_label, sep = "\n")
  )

# ✅ forest plot
ggplot(df, aes(x = HR, y = y_axis, color = Operation)) +
  
  geom_point(size = 3) +
  
  geom_errorbarh(aes(xmin = Lower, xmax = Upper),
                 height = 0.2) +
  
  geom_vline(xintercept = 1,
             linetype = "dashed",
             color = "grey40") +
  
  scale_x_log10(breaks = c(0.5, 1, 2, 5, 10, 20)) +
  
  labs(
    title = "Forest plot of postoperative outcomes",
    x = "Adjusted Hazard Ratio",
    y = NULL
  ) +
  
  scale_color_manual(values = c(
    "Fusion" = "#E64B35",
    "Decompression" = "#00A087"
  )) +
  
  theme_classic(base_size = 13) +
  
  theme(
    legend.position = "top",
    legend.title = element_blank(),
    plot.title = element_text(hjust = 0.5)
  )