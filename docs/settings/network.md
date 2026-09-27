---
title: Network
parent: Settings
layout: setting
section: network
settings:
- name: MAC_ADDRESS
  file: Configuration_adv.h
  type: array
  default: '{ 0xDE, 0xAD, 0xBE, 0xEF, 0xF0, 0x0D }'
  requires: HAS_ETHERNET
  comment: Ethernet. Use M552 to enable and set the IP address.
- name: WIFISUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: Native ESP32 board with WiFi or add-on ESP32 WiFi-101 module
- name: ESP3D_WIFISUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  comment: ESP3D Library WiFi management (https://github.com/luc-github/ESP3DLib)
- name: WEBSUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  comment: |-
    Extras for an ESP32-based motherboard with WIFISUPPORT

    These options don't apply to add-on WiFi modules based on ESP32 WiFi101.
- name: OTASUPPORT
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  comment: Support over-the-air firmware updates
- name: WIFI_CUSTOM_COMMAND
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(WIFISUPPORT, ESP3D_WIFISUPPORT)
  comment: Accept feature config commands (e.g., WiFi ESP3D) from the host
---

Options in the `network` section of the Marlin configuration files.
