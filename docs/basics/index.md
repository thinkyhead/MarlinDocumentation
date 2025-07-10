---
# Page Options
title:       Marlin Basics
permalink:   /docs/basics.html
regenerate:  true
description: 'Basic information about Marlin Firmware'
category:    [ basics ]
layout:      page
# Theme Options
nav_order:   2
# Left Navigation (most pages)
nav_enabled: true
# Bottom Table of Contents (for sub-pages)
has_toc: false
back_to_top: true
back_to_top_text: "Back to top"
# Not this theme??
gh_edit_link: true # show or hide edit this page link
---
<details open markdown="block">
  <summary>Page Index</summary>{: .text-delta }
  - TOC
  {:toc}
</details>

# Marlin Basics
In its most basic form Marlin is a complex C++ program built for the Arduino API. It started out as a set of Arduino sketches, "Grbl" (for motion) and "Sprinter" (for user interface).

## Marlin Architecture
Marlin runs within the context of an MCU with direct connections to electronics through its own native I/O. In other words, we have direct low level access to all the connected hardware. This requires special care to avoid mixing things up that could lead to safety issues.

Each distinct platform has to have its own Hardware Access Layer (HAL) to implement the common HAL interfaces. Through these interfaces the HAL provides support for Serial Ports, SPI, Servos, EEPROM, Timers, and other low level services that the firmware needs.
