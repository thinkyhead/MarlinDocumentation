---
title: G29 - Mesh Bed Leveling
description: Manual mesh bed leveling for machines without a probe
parent: G-code Commands
grand_parent: G-code Commands
---

# G29 - Mesh Bed Leveling (MBL)

Mesh Bed Leveling provides an economical interactive manual mesh-based leveling system for small boards or machines without a probe. Marlin provides a UI but an LCD controller is not required.

:::warning
Homing is required before bed leveling. Use [`G28`](/docs/gcode/G028.html) first to establish the machine position.
:::

## How It Works

1. The printer probes a grid of points manually (using the LCD or host)
2. The height at each point is recorded
3. A 3D mesh is created from the probe points
4. The nozzle follows the bed contours by dynamically adjusting the Z position during printing

## Syntax

```gcode
G29 [A] [C] [D] [E] [F{point}] [I{grid_points}] [J{grid_points}] [L] [O] [P{level}] [Q] [R{point}] [S{point}] [T] [U] [V{level}] [W]
```

## Parameters

| Parameter | Description | Type | Optional |
|-----------|-------------|------|----------|
| `A` | Abort leveling procedure | flag | Yes |
| `C` | Create fake points for testing | flag | Yes |
| `D` | Dry-Run mode (probe but don't update) | flag | Yes |
| `E` | Engage/disengage probe for each sample | flag | Yes |
| `F` | Move to point before starting | int | Yes |
| `I` | Number of points along X axis | int | Yes |
| `J` | Number of points along Y axis | int | Yes |
| `L` | Leveling level (1-9) | int | Yes |
| `O` | Skip if leveling is already enabled | flag | Yes |
| `P` | Probe depth (mm) | float | Yes |
| `Q` | Query leveling state | flag | Yes |
| `R` | Move to point before starting | int | Yes |
| `S` | Move to point before starting | int | Yes |
| `T` | Enable probe temperature compensation | flag | Yes |
| `U` | UBL-specific: probe with UBL style | flag | Yes |
| `V` | Verbose level (0-4) | int | Yes |
| `W` | Warm up the bed before probing | flag | Yes |

## Examples

### Basic Mesh Bed Leveling

```gcode
G28              ; Home all axes
G29              ; Start mesh bed leveling (interactive)
```

### Custom Grid Size

```gcode
G28              ; Home all axes
G29 I3 J3        ; Probe a 3x3 grid (9 points)
```

### Dry Run (No Compensation)

```gcode
G28              ; Home all axes
G29 D            ; Probe but don't save leveling data
```

## Notes

- Mesh Bed Leveling is ideal for small print beds or machines without a probe.
- The LCD provides a user interface for the leveling procedure.
- For best results, probe at least 4x4 points across the bed.
- Save your mesh to EEPROM with [`M500`](/docs/gcode/M500.html) to persist between restarts.

## Related Commands

- [`G28`](/docs/gcode/G028.html) - Auto home (required before G29)
- [`M420`](/docs/gcode/M420.html) - Enable/disable bed leveling
- [`M500`](/docs/gcode/M500.html) - Save settings to EEPROM

## See Also

- [G-code Commands](/docs/gcode/) - Complete G-code reference
- [Configuration](/docs/configuration.html) - Configure Marlin for your printer
- [Auto Bed Leveling](/docs/features/auto_bed_leveling.html) - Bed leveling feature guide

---

*Available since: Marlin 1.0.0-beta*
