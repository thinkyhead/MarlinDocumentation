---
title:       Marlin Features
parent:      Marlin Basics
permalink:   /docs/basics/features.html
regenerate:  true
description: 'Features of Marlin Firmware'
category:    [ basics ]
layout:      page
nav_enabled: true
gh_edit_link: true # show or hide edit this page link
nav_order:   3
---
<details open markdown="block">
  <summary>Page Index</summary>{: .text-delta }
  - TOC
  {:toc}
</details>

# Marlin Features
In its most basic form Marlin is a complex C++ program built for the Arduino API. It started out as a set of Arduino sketches, "Grbl" (for motion) and "Sprinter" (for user interface).

## Basic Features
Marlin runs within the context of an MCU with direct connections to electronics through its own native I/O. In other words, we have direct low level access to all the connected hardware. This requires special care to avoid mixing things up that could lead to safety issues.

## Super Features
Each distinct platform has to have its own Hardware Access Layer (HAL) to implement the common HAL interfaces. Through these interfaces the HAL provides support for Serial Ports, SPI, Servos, EEPROM, Timers, and other low level services that the firmware needs.
