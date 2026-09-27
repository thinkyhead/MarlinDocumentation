---
title: TPARA
parent: Settings
layout: setting
section: tpara
settings:
- name: AXEL_TPARA
  file: Configuration.h
  type: switch
  disabled: true
  comment: Enable for TPARA kinematics and configure below
- name: DEBUG_TPARA_KINEMATICS
  file: Configuration.h
  type: switch
  requires: AXEL_TPARA
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 200
  requires: AXEL_TPARA
- name: TPARA_LINKAGE_*
  file: Configuration.h
  type: int
  units: mm
  requires: AXEL_TPARA
  comment: Length of inner and outer support arms. Measure arm lengths precisely.
  members:
  - id: '1'
    name: TPARA_LINKAGE_1
    default: 120
  - id: '2'
    name: TPARA_LINKAGE_2
    default: 120
- name: TPARA_OFFSET_*
  file: Configuration.h
  type: int
  units: mm
  requires: AXEL_TPARA
  comment: TPARA tower offset (position of Tower relative to bed zero position) This needs to be reasonably accurate as it defines the printbed position in the TPARA space.
  members:
  - id: X
    name: TPARA_OFFSET_X
    default: 0
  - id: Y
    name: TPARA_OFFSET_Y
    default: 0
  - id: Z
    name: TPARA_OFFSET_Z
    default: 0
- name: FEEDRATE_SCALING
  file: Configuration.h
  type: switch
  requires: AXEL_TPARA
  comment: Convert XY feedrate from mm/s to degrees/s on the fly
- name: MIDDLE_DEAD_ZONE_R
  file: Configuration.h
  type: int
  default: 0
  units: mm
  requires: AXEL_TPARA
  comment: Radius around the center where the arm cannot reach
---

Options in the `tpara` section of the Marlin configuration files.
