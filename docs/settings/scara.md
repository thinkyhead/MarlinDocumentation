---
title: SCARA
parent: Settings
layout: setting
section: scara
settings:
- name: MORGAN_SCARA
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    `MORGAN_SCARA` was developed by QHARLEY in South Africa in 2012-2013. Implemented and slightly reworked by JCERNY in June, 2014.

    Mostly Printed SCARA is an open source design by Tyler Williams. See:

    - <https://www.thingiverse.com/thing:2487048>
    - <https://www.thingiverse.com/thing:1241491>
- name: MP_SCARA
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: |-
    `MORGAN_SCARA` was developed by QHARLEY in South Africa in 2012-2013. Implemented and slightly reworked by JCERNY in June, 2014.

    Mostly Printed SCARA is an open source design by Tyler Williams. See:

    - <https://www.thingiverse.com/thing:2487048>
    - <https://www.thingiverse.com/thing:1241491>
- name: DEFAULT_SEGMENTS_PER_SECOND
  file: Configuration.h
  type: int
  default: 200
  requires: ANY(MORGAN_SCARA, MP_SCARA)
  comment: If movement is choppy try lowering this value
- name: SCARA_LINKAGE_*
  file: Configuration.h
  type: int
  units: mm
  requires: ANY(MORGAN_SCARA, MP_SCARA)
  comment: Length of inner and outer support arms. Measure arm lengths precisely.
  members:
  - id: '1'
    name: SCARA_LINKAGE_1
    default: 150
  - id: '2'
    name: SCARA_LINKAGE_2
    default: 150
- name: SCARA_OFFSET_*
  file: Configuration.h
  type: int
  units: mm
  requires: ANY(MORGAN_SCARA, MP_SCARA)
  comment: SCARA tower offset (position of Tower relative to bed zero position) This needs to be reasonably accurate as it defines the printbed position in the SCARA space.
  members:
  - id: X
    name: SCARA_OFFSET_X
    default: 100
  - id: Y
    name: SCARA_OFFSET_Y
    default: -56
- name: DEBUG_SCARA_KINEMATICS
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(MORGAN_SCARA, MP_SCARA) && MORGAN_SCARA
- name: FEEDRATE_SCALING
  file: Configuration.h
  type: switch
  requires: ANY(MORGAN_SCARA, MP_SCARA) && MORGAN_SCARA
  comment: Convert XY feedrate from mm/s to degrees/s on the fly
- name: MIDDLE_DEAD_ZONE_R
  file: Configuration.h
  type: int
  default: 0
  units: mm
  requires: ANY(MORGAN_SCARA, MP_SCARA) && MORGAN_SCARA
  comment: Radius around the center where the arm cannot reach
- name: SCARA_OFFSET_THETA1
  file: Configuration.h
  type: int
  default: 12
  requires: ANY(MORGAN_SCARA, MP_SCARA) && MP_SCARA
  block_clause: '!MORGAN_SCARA'
  comment: degrees
- name: SCARA_OFFSET_THETA2
  file: Configuration.h
  type: int
  default: 131
  requires: ANY(MORGAN_SCARA, MP_SCARA) && MP_SCARA
  block_clause: '!MORGAN_SCARA'
  comment: degrees
---

Options in the `scara` section of the Marlin configuration files.
