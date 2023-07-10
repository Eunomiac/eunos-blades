type clockData = {
  size: 2 | 3 | 4 | 5 | 6 | 8 | 10 | 12,
  value: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12,
  color: "yellow" | "blue" | "red" | "white",
  display: string,
  isActive: boolean,
  isNameVisible: boolean,
  isVisible: boolean
}
type clockKeyData = {
  clocks: Record<number, clockData | null>,
  numClocks: number,
  id: string,
  display: string,
  isActive: boolean,
  isNameVisible: boolean,
  isVisible: boolean,
  scene: string
};