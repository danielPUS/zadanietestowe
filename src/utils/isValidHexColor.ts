export const isValidHexColor = (value: string) => {
  const hexRegex = /^#?([0-9A-F]{3}){1,2}$/i
  return hexRegex.test(value)
}
