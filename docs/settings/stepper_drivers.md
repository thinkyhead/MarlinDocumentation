---
title: Stepper Drivers
parent: Settings
layout: setting
section: stepper drivers
settings:
- name: '*_DRIVER_TYPE'
  file: Configuration.h
  type: enum
  since: 2.0.0
  long: |-
    These settings allow Marlin to tune stepper driver timing and enable advanced options for stepper drivers that support them.
    You may also override timing options in `Configuration_adv.h`. Each driver is associated with an axis (internal axis identifiers:
    `X`, `Y`, `Z`, `I`, `J`, `K`, `U`, `V`, `W`) or an extruder (`E0` to `E7`).

    Each axis gets its own stepper control and endstops depending on the following settings:

    Steppers: `*_STEP_PIN`, `*_ENABLE_PIN`, `*_DIR_PIN`, `*_ENABLE_ON`
    Endstops: `*_STOP_PIN`, `USE_*MIN_PLUG`, `USE_*MAX_PLUG`
    Axes: `*_MIN_POS`, `*_MAX_POS`, `INVERT_*_DIR`
    Planner: `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE`, `DEFAULT_MAX_ACCELERATION`, `AXIS_RELATIVE_MODES`, `MICROSTEP_MODES`, `MANUAL_FEEDRATE`

    For multi-axis-machines (option `I_DRIVER_TYPE` ... enabled), more information can be found at https://github.com/DerAndere1/Marlin/wiki.

    Use TMC2208/TMC2208_STANDALONE for TMC2225 drivers and TMC2209/TMC2209_STANDALONE for TMC2226 drivers.
  comment: |-
    Stepper Drivers

    These settings allow Marlin to tune stepper driver timing and enable advanced options for stepper drivers that support them. You may also override timing options in Configuration_adv.h.

    Use TMC2208/TMC2208_STANDALONE for TMC2225 drivers and TMC2209/TMC2209_STANDALONE for TMC2226 drivers.

    Options: A4988, A5984, DRV8825, LV8729, TB6560, TB6600, TMC2100, TMC2130, TMC2130_STANDALONE, TMC2160, TMC2160_STANDALONE, TMC2208, TMC2208_STANDALONE, TMC2209, TMC2209_STANDALONE, TMC2660, TMC2660_STANDALONE, TMC5130, TMC5130_STANDALONE, TMC5160, TMC5160_STANDALONE
  members:
  - id: X
    name: X_DRIVER_TYPE
    default: A4988
  - id: Y
    name: Y_DRIVER_TYPE
    default: A4988
  - id: Z
    name: Z_DRIVER_TYPE
    default: A4988
  - id: X2
    name: X2_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: Y2
    name: Y2_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: Z2
    name: Z2_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: Z3
    name: Z3_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: Z4
    name: Z4_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: I
    name: I_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: J
    name: J_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: K
    name: K_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: U
    name: U_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: V
    name: V_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: W
    name: W_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E0
    name: E0_DRIVER_TYPE
    default: A4988
  - id: E1
    name: E1_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E2
    name: E2_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E3
    name: E3_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E4
    name: E4_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E5
    name: E5_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E6
    name: E6_DRIVER_TYPE
    default: A4988
    disabled: true
  - id: E7
    name: E7_DRIVER_TYPE
    default: A4988
    disabled: true
  options:
  - value: A4988
  - value: A5984
  - value: DRV8825
  - value: LV8729
  - value: TB6560
  - value: TB6600
  - value: TMC2100
  - value: TMC2130
  - value: TMC2130_STANDALONE
  - value: TMC2160
  - value: TMC2160_STANDALONE
  - value: TMC2208
  - value: TMC2208_STANDALONE
  - value: TMC2209
  - value: TMC2209_STANDALONE
  - value: TMC2660
  - value: TMC2660_STANDALONE
  - value: TMC5130
  - value: TMC5130_STANDALONE
  - value: TMC5160
  - value: TMC5160_STANDALONE
- name: AXIS*_NAME
  file: Configuration.h
  type: char
  requires: I_DRIVER_TYPE
  long: |-
    Define `AXISn_ROTATES` for all axes that rotate or pivot.
    Rotational axis coordinates are expressed in degrees.

    `AXISn_NAME` defines the letter used to refer to the axis in (most) G-code commands.
    By convention the names and roles are typically:
    - 'A' : Rotational axis parallel to X
    - 'B' : Rotational axis parallel to Y
    - 'C' : Rotational axis parallel to Z
    - 'U' : Secondary linear axis parallel to X
    - 'V' : Secondary linear axis parallel to Y
    - 'W' : Secondary linear axis parallel to Z

    Regardless of these settings the axes are internally named I, J, K, U, V, W.
  comment: |-
    Additional Axis Settings

    Define AXISn_ROTATES for all axes that rotate or pivot. Rotational axis coordinates are expressed in degrees.

    AXISn_NAME defines the letter used to refer to the axis in (most) G-code commands. By convention the names and roles are typically:

    | Value | Description |
    |------:|-------------|
    | `'A'` | Rotational axis parallel to X |
    | `'B'` | Rotational axis parallel to Y |
    | `'C'` | Rotational axis parallel to Z |
    | `'U'` | Secondary linear axis parallel to X |
    | `'V'` | Secondary linear axis parallel to Y |
    | `'W'` | Secondary linear axis parallel to Z |

    Regardless of these settings the axes are internally named I, J, K, U, V, W.
  members:
  - id: '4'
    name: AXIS4_NAME
    default: '''A'''
  - id: '5'
    name: AXIS5_NAME
    default: '''B'''
    requires: J_DRIVER_TYPE
  - id: '6'
    name: AXIS6_NAME
    default: '''C'''
    requires: K_DRIVER_TYPE
  - id: '7'
    name: AXIS7_NAME
    default: '''U'''
    requires: U_DRIVER_TYPE
  - id: '8'
    name: AXIS8_NAME
    default: '''V'''
    requires: V_DRIVER_TYPE
  - id: '9'
    name: AXIS9_NAME
    default: '''W'''
    requires: W_DRIVER_TYPE
  options:
  - value: A
  - value: B
  - value: C
  - value: U
  - value: V
  - value: W
- name: AXIS*_ROTATES
  file: Configuration.h
  type: switch
  requires: I_DRIVER_TYPE
  comment: |-
    Additional Axis Settings

    Define AXISn_ROTATES for all axes that rotate or pivot. Rotational axis coordinates are expressed in degrees.

    AXISn_NAME defines the letter used to refer to the axis in (most) G-code commands. By convention the names and roles are typically:

    | Value | Description |
    |------:|-------------|
    | `'A'` | Rotational axis parallel to X |
    | `'B'` | Rotational axis parallel to Y |
    | `'C'` | Rotational axis parallel to Z |
    | `'U'` | Secondary linear axis parallel to X |
    | `'V'` | Secondary linear axis parallel to Y |
    | `'W'` | Secondary linear axis parallel to Z |

    Regardless of these settings the axes are internally named I, J, K, U, V, W.
  members:
  - id: '4'
    name: AXIS4_ROTATES
  - id: '5'
    name: AXIS5_ROTATES
    requires: J_DRIVER_TYPE
  - id: '6'
    name: AXIS6_ROTATES
    requires: K_DRIVER_TYPE
  - id: '7'
    name: AXIS7_ROTATES
    disabled: true
    requires: U_DRIVER_TYPE
  - id: '8'
    name: AXIS8_ROTATES
    disabled: true
    requires: V_DRIVER_TYPE
  - id: '9'
    name: AXIS9_ROTATES
    disabled: true
    requires: W_DRIVER_TYPE
- name: '*_ENABLE_ON'
  file: Configuration.h
  type: state
  long: These options set the pin states used for stepper enable. The most common setting is 0 (`LOW`) for Active Low. For Active High use 1 or `HIGH`.
  comment: For Inverting Stepper Enable Pins (Active Low) use 0, Non Inverting (Active High) use 1
  members:
  - id: X
    name: X_ENABLE_ON
    default: LOW
  - id: Y
    name: Y_ENABLE_ON
    default: LOW
  - id: Z
    name: Z_ENABLE_ON
    default: LOW
  - id: I
    name: I_ENABLE_ON
    default: LOW
    disabled: true
  - id: J
    name: J_ENABLE_ON
    default: LOW
    disabled: true
  - id: K
    name: K_ENABLE_ON
    default: LOW
    disabled: true
  - id: U
    name: U_ENABLE_ON
    default: LOW
    disabled: true
  - id: V
    name: V_ENABLE_ON
    default: LOW
    disabled: true
  - id: W
    name: W_ENABLE_ON
    default: LOW
    disabled: true
  options: n_enable_on
- name: E_ENABLE_ON
  file: Configuration.h
  type: state
  default: LOW
  comment: For all extruders
  options: n_enable_on
- name: DISABLE_*
  file: Configuration.h
  type: switch
  long: |-
    Use these options to disable steppers when not being issued a movement. This was implemented as a hack to run steppers at higher-than-normal current in an effort to produce more torque at the cost of increased heat for drivers and steppers.

    Disabling the steppers between moves gives the motors and drivers a chance to cool off. It sounds good in theory, but in practice it has drawbacks. Disabled steppers can't hold the carriage stable. This results in poor accuracy and carries a strong probability of axial drift (i.e., lost steps).

    Most 3D printers use an "open loop" control system, meaning the software can't ascertain the actual carriage position at a given time. It simply sends commands and assumes they have been obeyed. In practice with a well-calibrated machine this is not an issue and using open loop is a major cost saving with excellent quality.

    **We don't recommend this hack.** There are much better ways to address the problem of stepper/driver overheating. Some examples: stepper/driver heatsink, active cooling, dual motors on the axis, reduce micro-stepping, check belt for over tension, check components for smooth motion, etc.
  comment: |-
    Disable axis steppers immediately when they're not being stepped.

    WARNING: When motors turn off there is a chance of losing position accuracy!
  members:
  - id: X
    name: DISABLE_X
    disabled: true
  - id: Y
    name: DISABLE_Y
    disabled: true
  - id: Z
    name: DISABLE_Z
    disabled: true
  - id: I
    name: DISABLE_I
    disabled: true
  - id: J
    name: DISABLE_J
    disabled: true
  - id: K
    name: DISABLE_K
    disabled: true
  - id: U
    name: DISABLE_U
    disabled: true
  - id: V
    name: DISABLE_V
    disabled: true
  - id: W
    name: DISABLE_W
    disabled: true
- name: DISABLE_REDUCED_ACCURACY_WARNING
  file: Configuration.h
  type: switch
  disabled: true
  long: Enable this option to suppress the warning given in cases when reduced accuracy is likely to occur.
  comment: Turn off the display blinking that warns about possible accuracy reduction
lists:
  n_enable_on:
  - value: LOW
  - value: HIGH
---

Options in the `stepper drivers` section of the Marlin configuration files.
