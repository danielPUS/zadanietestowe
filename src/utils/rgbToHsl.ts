export const rgbToHslColor = (red: number, green: number, blue: number) => {
  // Normalize RGB values to the range of 0-1
  const normalizedRed = red / 255
  const normalizedGreen = green / 255
  const normalizedBlue = blue / 255

  // Find the minimum and maximum RGB components
  const min = Math.min(normalizedRed, normalizedGreen, normalizedBlue)
  const max = Math.max(normalizedRed, normalizedGreen, normalizedBlue)

  // Calculate the hue, saturation, and lightness
  let hue, saturation, lightness
  if (min === max) {
    // Hue is undefined for achromatic colors (when min equals max)
    hue = 0
  } else {
    if (max === normalizedRed) {
      hue = (normalizedGreen - normalizedBlue) / (max - min)
    } else if (max === normalizedGreen) {
      hue = 2 + (normalizedBlue - normalizedRed) / (max - min)
    } else {
      hue = 4 + (normalizedRed - normalizedGreen) / (max - min)
    }

    hue *= 60 // Convert hue to degrees
    if (hue < 0) {
      hue += 360 // Ensure hue is within the range of 0-359
    }
  }

  lightness = (min + max) / 2

  if (min === max) {
    saturation = 0
  } else if (lightness <= 0.5) {
    saturation = (max - min) / (max + min)
  } else {
    saturation = (max - min) / (2 - max - min)
  }

  // Round the HSL values to 2 decimal places
  hue = Math.round(hue * 100) / 100
  saturation = Math.round(saturation * 100) / 100
  lightness = Math.round(lightness * 100) / 100

  return { hue, saturation, lightness }
}
