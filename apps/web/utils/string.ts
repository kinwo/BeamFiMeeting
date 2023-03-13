export function isNumber(str: any): boolean {
  const parsed = Number(str)
  return !isNaN(parsed)
}
