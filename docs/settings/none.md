---
title: Uncategorized
parent: Settings
layout: setting
section: none
settings:
- name: CONFIGURATION_H_VERSION
  file: Configuration.h
  type: int
  default: 2010300
  since: 1.1.0
  brief: Configuration version.
  long: |-
    This option is used to check that the correct Configurations files match the version of Marlin being built.

    Marlin now checks for a configuration version and won't compile without this setting.
    If you want to upgrade from an earlier version of Marlin, add this line to your old
    configuration file and set it to the current version. During the build Marlin will throw
    errors explaining what needs to be changed.
  comment: |-
    Configuration.h

    Basic settings such as:

    - Type of electronics
    - Type of temperature sensor
    - Printer geometry
    - Endstop configuration
    - LCD controller
    - Extra features

    Advanced settings can be found in Configuration_adv.h
  example:
  - value: '02010200'
- name: REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  since: 1.1.0
  brief: The common EXP1/2 Full Graphic LCD controller (with SD Card slot).
  comment: Simulator currently supports these displays. Choose one!
- name: REPRAP_DISCOUNT_SMART_CONTROLLER
  file: Configuration.h
  type: switch
  disabled: true
  since: 1.1.0
  brief: The common EXP1/2 HD44780 LCD controller (with SD Card slot)
  long: |-
    ![LCD Controllers](/assets/images/config/controllers.png){: .float-right .framed }

    Marlin includes support for several controllers. The two most popular controllers supported by Marlin are:

    - `REPRAP_DISCOUNT_SMART_CONTROLLER` A 20 x 4 character-based LCD controller with click-wheel.
    - `REPRAP_DISCOUNT_FULL_GRAPHIC_SMART_CONTROLLER` A monochrome 128 x 64 pixel-based LCD controller with click-wheel. Able to display simple bitmap graphics and up to 5 lines of text.

    Most other LCD controllers are variants of these. Enable just one of the following options for your specific controller:
  shared_comment: Simulator currently supports these displays. Choose one!
- name: TFT_CLASSIC_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with emulated DOGM - 128x64 Upscaled.
  shared_comment: Simulator currently supports these displays. Choose one!
- name: TFT_COLOR_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with Marlin Default Menus, Touch Friendly, using full TFT capabilities.
  shared_comment: Simulator currently supports these displays. Choose one!
- name: TFT_LVGL_UI
  file: Configuration.h
  type: switch
  disabled: true
  brief: TFT with a modern UI using LVGL.
  shared_comment: Simulator currently supports these displays. Choose one!
- name: TFT_GENERIC
  file: Configuration.h
  type: switch
  requires: ANY(TFT_CLASSIC_UI, TFT_COLOR_UI, TFT_LVGL_UI)
  brief: Generic TFT with detailed sub-options.
  comment: Enable parent LCD based on your selection above
- name: TOUCH_SCREEN
  file: Configuration.h
  type: switch
  requires: ANY(TFT_CLASSIC_UI, TFT_COLOR_UI, TFT_LVGL_UI)
  brief: Enable touch interface processing for displays that support it.
  shared_comment: Enable parent LCD based on your selection above
- name: CONFIG_EXAMPLES_DIR
  file: Configuration_adv.h
  type: string
  default: '"Simulator"'
  comment: |-
    Marlin 3D Printer Firmware

    Copyright (c) 2021 MarlinFirmware [https://github.com/MarlinFirmware/Marlin]

    Based on Sprinter and grbl. Copyright (c) 2011 Camiel Gubbels / Erik van der Zalm

    This program is free software: you can redistribute it and/or modify it under the terms of the GNU General Public License as published by the Free Software Foundation, either version 3 of the License, or (at your option) any later version.

    This program is distributed in the hope that it will be useful, but WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more details.

    You should have received a copy of the GNU General Public License along with this program.  If not, see &lt;https://www.gnu.org/licenses/&gt;.
- name: CONFIGURATION_ADV_H_VERSION
  file: Configuration_adv.h
  type: int
  default: 2010300
  comment: |-
    Configuration_adv.h

    Advanced settings. Only change these if you know exactly what you're doing. Some of these settings can damage your printer if improperly set!

    Basic settings can be found in Configuration.h
---

Options in the `none` section of the Marlin configuration files.
