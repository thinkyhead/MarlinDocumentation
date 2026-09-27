---
title: Kinematics
parent: Settings
layout: setting
section: kinematics
settings:
- name: COREXY
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    ![Kinematics](/assets/images/config/kinematics.jpg){: .float-right .framed }

    Marlin supports four kinematic motion systems: Cartesian, Core (H-Bot), Delta, and SCARA. Cartesian is the simplest, applying each stepper directly to an axis. CoreXY uses a special belt arrangement to do XY motion, requiring a little extra maths. Delta robots convert the motion of three vertical carriages into XYZ motion in an "effector" attached to the carriages by six arms. SCARA robots move an arm in the XY plane using two angular joints.

    Enable the option that applies to the specific Core setup. Both normal and reversed options are included for completeness.
  comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREXZ
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREYZ
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREYX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREZX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: COREZY
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: Enable one of the options below for CoreXY, CoreXZ, or CoreYZ kinematics, either in the usual order or reversed
- name: MARKFORGED_XY
  file: Configuration.h
  type: switch
  disabled: true
  comment: |-
    MarkForged Kinematics

    - <https://reprap.org/forum/read.php?152,504042>
- name: MARKFORGED_YX
  file: Configuration.h
  type: switch
  disabled: true
  shared_comment: |-
    MarkForged Kinematics

    - <https://reprap.org/forum/read.php?152,504042>
- name: MARKFORGED_INVERSE
  file: Configuration.h
  type: switch
  disabled: true
  requires: ANY(MARKFORGED_XY, MARKFORGED_YX)
  comment: Enable for an inverted Markforged kinematics belt path
- name: BELTPRINTER
  file: Configuration.h
  type: switch
  disabled: true
  long: Enable for a belt style printer with endless "Z" motion
  comment: Enable for a belt style printer with endless "Z" motion
- name: ARTICULATED_ROBOT_ARM
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable for articulated robots or for machines with `I_DRIVER_TYPE` defined, if feed rate interpretation should be
    compatible with firmwares (e.g., grblHAL/grblHAL, Duet-3D/RepRapFirmware, synthetos/g2) that behave different
    from LinuxCNC. When enabled, feedrate `F` is defined as follows: Let `dX`, `dY`, ... be displacements along the
    X, Y, ... axes. Let `T` be the time required for the move at the specified nominal feedrate.
    Then `F = sqrt(dX^2 + dY^2 + dZ^2 + dA^2 + dB^2 + dC^2 + dU^2 + dV^2 + dW^2) / T`.
    Moves should finish in `T` plus any time required for acceleration and deceleration.
  comment: Articulated robot (arm). Joints are directly mapped to axes with no kinematics.
- name: FOAMCUTTER_XYUV
  file: Configuration.h
  type: switch
  disabled: true
  long: |-
    Enable for a 4 axis hot wire foam cutter with parallel horizontal axes X, U where the heights of the wire ends
    are controlled by vertical axes Y, V. Requires `I_DRIVER_TYPE`, J_DRIVER_TYPE, `AXIS4_NAME 'U'` and `AXIS5_NAME 'V'`. The Z axis is unused.
    The LASER features (see section "Spindle / Laser") can be used to control the heating element for the tool.
  comment: For a hot wire cutter with parallel horizontal axes (X, I) where the heights of the two wire ends are controlled by parallel axes (Y, J). Joints are directly mapped to axes (no kinematics).
---

Options in the `kinematics` section of the Marlin configuration files.
