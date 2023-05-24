import React, { useState, useEffect } from "react"
import { hexToRgbColor } from "./utils/hexToRgb"
import { rgbToHslColor } from "./utils/rgbToHsl"
import { isValidHexColor } from "./utils/isValidHexColor"
import { colorObject } from "./utils/colorObject"
import { PREDEFINED_COLORS } from "./utils/PREDEFINED_COLORS"
import "./style.scss"

export const App = () => {
  const [firstColor, setFirstColor] = useState("")
  const [allColors, setAllColors] = useState<colorObject[]>([])
  const [sortedColors, setSortedColors] = useState<colorObject[]>([])
  const [colorsAfterConstraints, setColorsAfterConstraints] = useState<
    colorObject[]
  >([])

  const [constraints, setConstraints] = useState({
    highRed: false,
    highGreen: false,
    highBlue: false,
    highSaturation: false,
  })
  useEffect(() => {
    if (localStorage.getItem("colors") === null) {
      setAllColors([...PREDEFINED_COLORS])
    } else {
      setAllColors([
        ...PREDEFINED_COLORS,
        ...JSON.parse(localStorage.getItem("colors")!),
      ])
    }
  }, [localStorage.getItem("colors")])

  useEffect(() => {
    setSortedColors(
      allColors.sort((colorA: colorObject, colorB: colorObject) => {
        if (colorA.red !== colorB.red) {
          return colorB.red - colorA.red // Sort by highest red value
        } else if (colorA.green !== colorB.green) {
          return colorB.green - colorA.green // Sort by highest green value
        } else {
          return colorB.blue - colorA.blue // Sort by highest blue value
        }
      })
    )
  }, [allColors])

  useEffect(() => {
    setColorsAfterConstraints(
      sortedColors.filter((colorObject) => {
        const { highRed, highGreen, highBlue, highSaturation } = constraints

        if (highRed && colorObject.red <= 127) {
          return false
        }
        if (highGreen && colorObject.green <= 127) {
          return false
        }
        if (highBlue && colorObject.blue <= 127) {
          return false
        }
        if (highSaturation && colorObject.saturation <= 0.5) {
          return false
        }
        return true
      })
    )
  }, [constraints, sortedColors])

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value
    const hasHashPrefix = value.startsWith("#")
    if (!hasHashPrefix) {
      value = value.substring(0, 6) // Limit to maximum 6 characters without #
    } else {
      value = value.substring(0, 7) // Limit to maximum 7 characters with #
    }
    const hexCharacterRegex = /^#[0-9A-Fa-f]*$|^[0-9A-Fa-f]+$/
    if (hexCharacterRegex.test(value) || !value) {
      setFirstColor(value)
    }
  }

  const onRemove = (colorToRemove: colorObject) => {
    const colors: colorObject[] = JSON.parse(localStorage.getItem("colors")!) // Retrieve the list of colors from local storage
    const updatedColors = colors.filter(
      (color) => color.key !== colorToRemove.key
    ) // Remove the clicked color from the list
    localStorage.setItem("colors", JSON.stringify(updatedColors)) // Update the modified list of colors in local storage
    setAllColors(updatedColors)
  }

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    let hexColor = firstColor.replace("#", "")
    if (hexColor.length === 3) {
      hexColor = hexColor
        .split("")
        .map((char) => char + char)
        .join("")
    }

    if (!isValidHexColor(hexColor)) {
      return
    }
    const { red, green, blue } = hexToRgbColor(hexColor)
    const { hue, saturation, lightness } = rgbToHslColor(red, green, blue)
    const colors = localStorage.getItem("colors")
    const existingColors: colorObject[] = colors ? JSON.parse(colors) : []
    const key = allColors.length
    const newColor = {
      key,
      hexColor: `#${hexColor.toUpperCase()}`,
      red,
      green,
      blue,
      hue,
      saturation,
      lightness,
    }
    existingColors.push(newColor)
    localStorage.setItem("colors", JSON.stringify(existingColors))
    setFirstColor("")
  }

  return (
    <div>
      <form onSubmit={onSubmit}>
        <label>
          Color:
          <input
            type="text"
            name="name"
            value={firstColor}
            onChange={onChange}
          />
        </label>
        <input type="submit" value="Submit" />
      </form>
      <div className="checkboxes">
        <label>
          Red higher than 50%
          <input
            type="checkbox"
            onChange={() => {
              setConstraints({ ...constraints, highRed: !constraints.highRed })
            }}
          />
        </label>
        <label>
          Green higher than 50%
          <input
            type="checkbox"
            onChange={() => {
              setConstraints({
                ...constraints,
                highGreen: !constraints.highGreen,
              })
            }}
          />
        </label>
        <label>
          Blue higher than 50%
          <input
            type="checkbox"
            onChange={() => {
              setConstraints({
                ...constraints,
                highBlue: !constraints.highBlue,
              })
            }}
          />
        </label>
        <label>
          Saturation higher than 50%
          <input
            type="checkbox"
            onChange={() => {
              setConstraints({
                ...constraints,
                highSaturation: !constraints.highSaturation,
              })
            }}
          />
        </label>
      </div>
      {colorsAfterConstraints?.map((color) => (
        <div className="singleColor">
          <div className="inline">
            <div
              className="coloredRectangle"
              style={{ backgroundColor: color.hexColor }}
            ></div>
            <div></div>
            {!PREDEFINED_COLORS.includes(color) && (
              <button
                onClick={() => {
                  onRemove(color)
                }}
              >
                X
              </button>
            )}
          </div>
          <div key={color?.key}>{color?.hexColor}</div>
        </div>
      ))}
    </div>
  )
}
