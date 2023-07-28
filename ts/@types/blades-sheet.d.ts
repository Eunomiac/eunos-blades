
interface BladesActorSheetData {
	isOwner: boolean,
	attributes: Record<Attributes,Record<Actions,ValueMax>>
}

interface DotlineData {
	data: ValueMax,
	target: string,

  isLocked?: boolean,

	svgKey?: string,
	svgFull?: string,
	svgEmpty?: string,

	iconEmpty?: string,
  iconEmptyHover?: string,
	iconFull?: string,
  iconFullHover?: string,
  altIconFull?: string,
  altIconFullHover?: string,
  altIconStep?: number
}