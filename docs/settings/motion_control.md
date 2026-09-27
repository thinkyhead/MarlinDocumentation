---
title: Motion Control
parent: Settings
layout: setting
section: motion control
settings:
- name: FT_MOTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  long: |-
    *New in Marlin 2.1.3.*

    The Fixed-Time-based Motion Control (FTM) feature provides an alternative motion system that uses a stepper event chain with sophisticated motion algorithms, allowing you to fine-tune motion control behavior. You can adjust parameters such as dynamic frequency modes, shaper types and frequencies, linear advance settings, and more with G-code [`M493`](/docs/gcode/M493.html). See the [`M493`](/docs/gcode/M493.html) documentation for a basic overview of parameters you can change.

    Enable or disable the Fixed-Time-based Motion Control (FTM) feature, which is a beta feature for advanced motion control. This can be enabled using G-code commands with `M493`.
  comment: |-
    Fixed-time-based Motion Control -- BETA FEATURE

    Enable/disable and set parameters with G-code M493. See ft_types.h for named values used by FTM options.
- name: FTM_IS_DEFAULT_MOTION
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Use FT Motion as the factory default?
- name: FTM_DEFAULT_DYNFREQ_MODE
  file: Configuration_adv.h
  type: enum
  default: dynFreqMode_DISABLED
  requires: FT_MOTION
  long: |-
    Set the default dynamic frequency calculation mode for FTM. Options include:
    - `dynFreqMode_DISABLED`: Disable dynamic frequency adjustment (default).
    - `dynFreqMode_Z_BASED`: Use a Z-based dynamic frequency algorithm.
    - `dynFreqMode_MASS_BASED`: Use a mass-based dynamic frequency algorithm.
  comment: Default mode of dynamic frequency calculation. (DISABLED, Z_BASED, MASS_BASED)
- name: FTM_DEFAULT_SHAPER_*
  file: Configuration_adv.h
  type: enum
  requires: FT_MOTION
  long: |-
    Set the default shaper modes for both X and Y axes. These control how motion commands are shaped to reduce vibrations and improve performance. Available options include:
    - `ftMotionShaper_NONE`: No shaping (default).
    - `ftMotionShaper_ZV, ZVD, ZVDD, ZVDDD`: Zero-Vibration shapers.
    - `ftMotionShaper_EI, 2HEI, 3HEI`: Enhanced Input shapers.
    - `ftMotionShaper_MZV`: Modified Zero-Vibration shaper.
  comment: Default shaper mode on X axis (NONE, ZV, ZVD, ZVDD, ZVDDD, EI, 2HEI, 3HEI, MZV)
  members:
  - id: X
    name: FTM_DEFAULT_SHAPER_X
    default: ftMotionShaper_NONE
  - id: Y
    name: FTM_DEFAULT_SHAPER_Y
    default: ftMotionShaper_NONE
- name: FTM_SHAPING_DEFAULT_FREQ_*
  file: Configuration_adv.h
  type: float
  units: Hz
  requires: FT_MOTION
  long: Set the default peak frequencies for X and Y axes, as well as default parameters for Linear Advance. These settings can be fine-tuned based on your specific printer setup.
  comment: (Hz) Default peak frequency used by input shapers
  members:
  - id: X
    name: FTM_SHAPING_DEFAULT_FREQ_X
    default: 37.0
  - id: Y
    name: FTM_SHAPING_DEFAULT_FREQ_Y
    default: 37.0
- name: FTM_LINEAR_ADV_DEFAULT_ENA
  file: Configuration_adv.h
  type: bool
  default: false
  requires: FT_MOTION
  comment: Default linear advance enable (true) or disable (false)
- name: FTM_LINEAR_ADV_DEFAULT_K
  file: Configuration_adv.h
  type: float
  default: 0.0
  requires: FT_MOTION
  comment: Default linear advance gain. (Acceleration-based scaling factor.)
- name: FTM_SHAPING_ZETA_*
  file: Configuration_adv.h
  type: float
  requires: FT_MOTION
  comment: Zeta used by input shapers for X axis
  members:
  - id: X
    name: FTM_SHAPING_ZETA_X
    default: 0.1
  - id: Y
    name: FTM_SHAPING_ZETA_Y
    default: 0.1
- name: FTM_SHAPING_V_TOL_*
  file: Configuration_adv.h
  type: float
  requires: FT_MOTION
  long: Specify the vibration tolerance levels for the X and Y axes, which are particularly important when using Enhanced Input (EI) shaper modes.
  comment: Vibration tolerance used by EI input shapers for X axis
  members:
  - id: X
    name: FTM_SHAPING_V_TOL_X
    default: 0.05
  - id: Y
    name: FTM_SHAPING_V_TOL_Y
    default: 0.05
- name: FT_MOTION_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: FT_MOTION
  comment: Provide a MarlinUI menu to set M493 parameters
- name: FTM_UNIFIED_BWS
  file: Configuration_adv.h
  type: switch
  requires: FT_MOTION
  long: These advanced settings configure various aspects of trajectory generation and stepper communication, ensuring smooth and accurate motion control. CoreXY motion needs a larger buffer size. Provided values are based on community testing and feedback.
  comment: Advanced configuration
- name: FTM_BW_SIZE
  file: Configuration_adv.h
  type: int
  default: 100
  requires: FT_MOTION && FTM_UNIFIED_BWS
  comment: Unified Window and Batch size with a ratio of 2
- name: FTM_WINDOW_SIZE
  file: Configuration_adv.h
  type: int
  default: 200
  requires: FT_MOTION
  block_clause: '!FTM_UNIFIED_BWS'
  comment: Custom Window size for trajectory generation needed by Ulendo FBS
- name: FTM_BATCH_SIZE
  file: Configuration_adv.h
  type: int
  default: 100
  requires: FT_MOTION
  block_clause: '!FTM_UNIFIED_BWS'
  comment: Custom Batch size for trajectory generation needed by Ulendo FBS
- name: FTM_FS
  file: Configuration_adv.h
  type: int
  default: 1000
  units: Hz
  requires: FT_MOTION
  comment: (Hz) Frequency for trajectory generation. (Reciprocal of `FTM_TS`)
- name: FTM_TS
  file: Configuration_adv.h
  type: float
  default: 0.001
  units: seconds
  requires: FT_MOTION
  comment: (s) Time step for trajectory generation. (Reciprocal of `FTM_FS`)
- name: FTM_STEPPER_FS
  file: Configuration_adv.h
  type: int
  default: 20000
  units: Hz
  requires: FT_MOTION && !COREXY
  comment: (Hz) Frequency for stepper I/O update
- name: FTM_STEPPERCMD_BUFF_SIZE
  file: Configuration_adv.h
  type: int
  default: 3000
  requires: FT_MOTION && !COREXY
  comment: Use this to adjust the time required to consume the command buffer. Try increasing this value if stepper motion is choppy.
- name: FTM_STEPS_PER_UNIT_TIME
  file: Configuration_adv.h
  default: (FTM_STEPPER_FS / FTM_FS)
  requires: FT_MOTION
  long: |-
    These parameters ensure that the motion control system operates within optimal ranges, providing a balance between performance and accuracy.

    By customizing these settings, you can optimize your printer's performance to suit specific needs or preferences.
  comment: Interpolated stepper commands per unit time
- name: FTM_CTS_COMPARE_VAL
  file: Configuration_adv.h
  default: (FTM_STEPS_PER_UNIT_TIME / 2)
  requires: FT_MOTION
  comment: Comparison value used in interpolation algorithm
- name: FTM_MIN_TICKS
  file: Configuration_adv.h
  default: ((STEPPER_TIMER_RATE) / (FTM_STEPPER_FS))
  requires: FT_MOTION
  comment: Minimum stepper ticks between steps
- name: FTM_MIN_SHAPE_FREQ
  file: Configuration_adv.h
  type: int
  default: 10
  requires: FT_MOTION
  comment: Minimum shaping frequency
- name: FTM_RATIO
  file: Configuration_adv.h
  default: (FTM_FS / FTM_MIN_SHAPE_FREQ)
  requires: FT_MOTION
  comment: Factor for use in `FTM_ZMAX`. DON'T CHANGE.
- name: FTM_ZMAX
  file: Configuration_adv.h
  default: (FTM_RATIO * 2)
  requires: FT_MOTION
  comment: 'Maximum delays for shaping functions (even numbers only!) Calculate as: ZV       : `FTM_RATIO` / 2 ZVD, MZV : `FTM_RATIO` 2HEI     : `FTM_RATIO` * 3 / 2 3HEI     : `FTM_RATIO` * 2'
- name: INPUT_SHAPING_*
  file: Configuration_adv.h
  type: switch
  comment: |-
    Input Shaping

    Zero Vibration (ZV) Input Shaping for X and/or Y movements.

    This option uses a lot of SRAM for the step buffer. The buffer size is calculated automatically from SHAPING_FREQ_[XYZ], `DEFAULT_AXIS_STEPS_PER_UNIT`, `DEFAULT_MAX_FEEDRATE` and `ADAPTIVE_STEP_SMOOTHING`. The default calculation can be overridden by setting `SHAPING_MIN_FREQ` and/or SHAPING_MAX_FEEDRATE. The higher the frequency and the lower the feedrate, the smaller the buffer. If the buffer is too small at runtime, input shaping will have reduced effectiveness during high speed movements.

    Tune with M593 D&lt;factor&gt; F&lt;frequency&gt;
  members:
  - id: X
    name: INPUT_SHAPING_X
    disabled: true
  - id: Y
    name: INPUT_SHAPING_Y
    disabled: true
  - id: Z
    name: INPUT_SHAPING_Z
    disabled: true
- name: SHAPING_FREQ_*
  file: Configuration_adv.h
  type: float
  units: Hz
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_X
  comment: (Hz) The default dominant resonant frequency on the X axis.
  members:
  - id: X
    name: SHAPING_FREQ_X
    default: 40.0
  - id: Y
    name: SHAPING_FREQ_Y
    default: 40.0
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Y
  - id: Z
    name: SHAPING_FREQ_Z
    default: 40.0
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Z
- name: SHAPING_ZETA_*
  file: Configuration_adv.h
  type: float
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_X
  comment: 'Damping ratio of the X axis (range: 0.0 = no damping to 1.0 = critical damping).'
  members:
  - id: X
    name: SHAPING_ZETA_X
    default: 0.15
  - id: Y
    name: SHAPING_ZETA_Y
    default: 0.15
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Y
  - id: Z
    name: SHAPING_ZETA_Z
    default: 0.15
    requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z) && INPUT_SHAPING_Z
- name: SHAPING_MIN_FREQ
  file: Configuration_adv.h
  type: float
  default: 20.0
  units: Hz
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: (Hz) By default the minimum of the shaping frequencies. Override to affect SRAM usage.
- name: SHAPING_MAX_STEPRATE
  file: Configuration_adv.h
  type: int
  default: 10000
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: By default the maximum total step rate of the shaped axes. Override to affect SRAM usage.
- name: SHAPING_MENU
  file: Configuration_adv.h
  type: switch
  disabled: true
  requires: ANY(INPUT_SHAPING_X, INPUT_SHAPING_Y, INPUT_SHAPING_Z)
  comment: Add a menu to the LCD to set shaping parameters.
---

Options in the `motion control` section of the Marlin configuration files.
