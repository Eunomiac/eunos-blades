// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C from "./constants.js";
import {gsap} from "gsap/all";
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

declare global {
	type int = number;
	type float = number;
	type posInt = number;
	type posFloat = number;
	type key = string | number | symbol;
	type SmallInt = -10 | -9 | -8 | -7 | -6 | -5 | -4 | -3 | -2 | -1 | 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;

	type HTMLCode = string;
	type HEXColor = string;
	type RGBColor = string;
	type jQueryTextTerm = string | number | boolean | ((this: Element, index: number, text: string) => string | number | boolean);

	type keyFunc = (key: number | string, val?: any) => unknown;
	type valFunc = (val: any, key?: number | string) => any;
	type testFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => boolean;
	type mapFunc<Type extends keyFunc | valFunc> = (...args: Parameters<Type>) => unknown;
	type checkTest = ((...args: any[]) => any) | testFunc<keyFunc> | testFunc<valFunc> | RegExp | number | string;

	type List<Type = any> = Record<number | string | symbol, Type>
	type Index<Type = any> = List<Type> | Type[];

	type FreezeProps<T> = {
		[Prop in keyof T as string extends Prop ? never : number extends Prop ? never : Prop]: T[Prop]
	};
	type KeyOf<T> = keyof T;

	type gsapAnim = gsap.core.Tween | gsap.core.Timeline;
}

// #region ▮▮▮▮▮▮▮ [HELPERS] Internal Functions, Data & References Used by Utility Functions ▮▮▮▮▮▮▮ ~
/* eslint-disable array-element-newline */
// _noCapWords -- Patterns matching words that should NOT be capitalized when converting to TITLE case.
const _noCapWords = "a|above|after|an|and|at|below|but|by|down|for|for|from|in|nor|of|off|on|onto|or|out|so|the|to|under|up|with|yet"
	.split("|")
	.map((word) => new RegExp(`\\b${word}\\b`, "gui")) as RegExp[];

// _capWords -- Patterns matching words that should ALWAYS be capitalized when converting to SENTENCE case.
const _capWords = [
	"I", /[^a-z]{3,}|[\.0-9]/gu
].map((word) => (/RegExp/.test(Object.prototype.toString.call(word)) ? word : new RegExp(`\\b${word}\\b`, "gui"))) as RegExp[];

// _loremIpsumText -- Boilerplate lorem ipsum
const _loremIpsumText = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse ultricies
nibh sed massa euismod lacinia. Aliquam nec est ac nunc ultricies scelerisque porta vulputate odio.
Integer gravida mattis odio, semper volutpat tellus. Ut elit leo, auctor eget fermentum hendrerit,
aliquet ac nunc. Suspendisse porta turpis vitae mi posuere molestie. Cras lectus lacus, vulputate a
vestibulum in, mattis vel mi. Mauris quis semper mauris. Praesent blandit nec diam eget tincidunt. Nunc
aliquet consequat massa ac lacinia. Ut posuere velit sagittis, vehicula nisl eget, fringilla nibh. Duis
volutpat mattis libero, a porttitor sapien viverra ut. Phasellus vulputate imperdiet ligula, eget
eleifend metus tempor nec. Nam eget sapien risus. Praesent id suscipit elit. Sed pellentesque ligula
diam, non aliquet magna feugiat vitae. Pellentesque ut tortor id erat placerat dignissim. Pellentesque
ut dui vel leo laoreet sodales nec ac tellus. In hac habitasse platea dictumst. Proin sed ex sed augue
sollicitudin interdum. Sed id lacus porttitor nisi vestibulum tincidunt. Nulla facilisi. Vestibulum
feugiat finibus magna in pretium. Proin consectetur lectus nisi, non commodo lectus tempor et. Cras
viverra, mi in consequat aliquet, justo mauris fringilla tellus, at accumsan magna metus in eros. Sed
vehicula, diam ut sagittis semper, purus massa mattis dolor, in posuere.` as const;

// _randomWords -- A collection of random words for various debugging purposes.
const _randomWords = `
aboveboard|account|achiever|acoustics|act|action|activity|actor|addition|adjustment|advertisement|advice|afterglow|afterimage|afterlife|aftermath|afternoon|afterthought|agreement
air|aircraft|airfield|airlift|airline|airmen|airplane|airport|airtime|alarm|allover|allspice|alongside|also|amount|amusement|anger|angle|animal|another|ants|anyhow|anymore
anyone|anyplace|anytime|anywhere|apparatus|apparel|appliance|approval|arch|argument|arithmetic|arm|army|around|art|ashtray|attack|attraction|aunt|authority|babies|baby|babysitter
back|backache|backbone|backbreaker|backdrop|backfire|background|backhand|backlash|backlog|backpack|backside|backslap|backslide|backspace|backspin|backstroke|backtrack|backward
badge|bag|bait|balance|ball|ballroom|bankbook|bankroll|base|baseball|basin|basket|basketball|bat|bath|battle|beachcomb|bead|bear|because|become|bed|bedrock|bedroll|bedroom
beds|bee|beef|beginner|behavior|belief|believe|bell|bellboy|bellhop|bells|below|berry|bike|bikes|bird|birds|birth|birthday|bit|bite|blackball|blackberries|blackbird|blackboard
blackjack|blacklist|blackmail|blackout|blacksmith|blacktop|blade|blood|blow|blowgun|bluebell|blueberry|bluebird|bluefish|bluegrass|blueprint|board|boardwalk|boat|bodyguard
bomb|bone|book|bookcase|bookend|bookkeeper|bookmark|bookmobile|books|bookseller|bookshelf|bookworm|boot|border|bottle|boundary|bowlegs|bowtie|box|boy|brainchild|brake|branch
brass|breath|brick|bridge|brother|bubble|bucket|bugspray|building|bulb|burst|bushes|business|butter|butterball|buttercup|butterfingers|buttermilk|butternut|butterscotch|button
bypass|cabbage|cabdriver|cable|cactus|cake|cakes|calculator|calendar|camera|camp|can|cancan|candlelight|candlestick|cannon|cannot|canvas|cap|caption|car|card|cardsharp|care
carefree|careworn|carfare|carload|carpenter|carpool|carport|carriage|cars|carsick|cart|cartwheel|cast|cat|cats|cattle|catwalk|cause|cave|caveman|celery|cellar|cemetery|cent
centercut|chalk|chance|change|channel|cheese|cheeseburger|cherries|cherry|chess|chicken|chickens|children|chin|church|circle|clam|class|clockwise|cloth|clover|club|coach|coal
coast|coat|cobweb|coffeemaker|coil|collar|color|comeback|committee|commonplace|commonwealth|company|comparison|competition|condition|connection|control|cook|copper|corn|cornmeal
cough|country|courthouse|cover|cow|cows|crack|cracker|crate|crayon|cream|creator|creature|credit|crewcut|crib|crime|crook|crossbow|crossbreed|crosscut|crossover|crosswalk
crow|crowd|crown|cub|cup|current|curtain|curve|cushion|dad|dairymaid|daisywheel|daughter|day|daybed|daybook|daybreak|daydream|daylight|daytime|deadend|deadline|death|debt
decision|deer|degree|design|desire|desk|destruction|detail|development|digestion|dime|dinner|dinosaurs|direction|dirt|discovery|discussion|dishcloth|dishpan|dishwasher|dishwater
diskdrive|distance|distribution|division|dock|doctor|dog|dogs|doll|dolls|donkey|door|doorstop|downtown|downunder|drain|drawbridge|drawer|dress|drink|driveway|driving|drop
duck|duckbill|duckpin|ducks|dust|ear|earache|earring|earth|earthquake|earthward|earthworm|edge|education|effect|egg|egghead|eggnog|eggs|eggshell|elbow|end|engine|error|event
everything|example|exchange|existence|expansion|experience|expert|eye|eyeballs|eyecatching|eyeglasses|eyelash|eyelid|eyes|eyesight|eyewitness|face|fact|fairies|fall|fang|farm
fatherland|fear|feeling|field|finger|fire|fireball|fireboat|firebomb|firebreak|firecracker|firefighter|firehouse|fireman|fireproof|fireworks|fish|fishbowl|fisherman|fisheye
fishhook|fishmonger|fishnet|fishpond|fishtail|flag|flame|flavor|flesh|flight|flock|floor|flower|flowers|fly|fog|fold|food|foot|football|foothill|footlights|footlocker|footprints
forbearer|force|forearm|forebear|forebrain|forecast|foreclose|foreclosure|foredoom|forefather|forefeet|forefinger|forefoot|forego|foregone|forehand|forehead|foreknowledge
foreleg|foreman|forepaws|foresee|foreshadow|forestall|forethought|foretold|forever|forewarn|foreword|forget|fork|forklift|form|fowl|frame|friction|friend|friends|frog|frogs
front|fruit|fruitcup|fuel|furniture|gate|gearshift|geese|ghost|giants|giraffe|girl|girls|glass|glassmaking|glove|gold|goodbye|goodnight|government|governor|grade|grain|grandaunt
granddaughter|grandfather|grandmaster|grandmother|grandnephew|grandparent|grandson|grandstand|granduncle|grape|grass|grassland|graveyard|grip|ground|group|growth|guide|guitar
gumball|gun|hair|haircut|hall|hamburger|hammer|hand|handbook|handgun|handmade|handout|hands|harbor|harmony|hat|hate|head|headache|headlight|headline|headquarters|health|heat
hereafter|hereby|herein|hereupon|highchair|highland|highway|hill|himself|history|hobbies|hole|holiday|home|homemade|hometown|honey|honeybee|honeydew|honeysuckle|hook|hookup
hope|horn|horse|horseback|horsefly|horsehair|horseman|horseplay|horsepower|horseradish|horses|hose|hospital|hot|hour|house|houseboat|household|housekeeper|houses|housetop
however|humor|hydrant|ice|icicle|idea|impulse|income|increase|industry|ink|insect|inside|instrument|insurance|intake|interest|invention|iron|island|itself|jail|jailbait|jam
jar|jeans|jelly|jellybean|jellyfish|jetliner|jetport|jewel|join|judge|juice|jump|jumpshot|kettle|key|keyboard|keyhole|keynote|keypad|keypunch|keystone|keystroke|keyword|kick
kiss|kittens|kitty|knee|knife|knot|knowledge|laborer|lace|ladybug|lake|lamp|land|language|laugh|leather|leg|legs|letter|letters|lettuce|level|library|lifeblood|lifeguard|lifelike
lifeline|lifelong|lifetime|lifework|limelight|limestone|limit|line|linen|lip|liquid|loaf|lock|locket|longhand|look|loss|love|low|lukewarm|lumber|lunch|lunchroom|machine|magic
maid|mailbox|mainline|man|marble|mark|market|mask|mass|match|matchbox|meal|meantime|meanwhile|measure|meat|meeting|memory|men|metal|mice|middle|milk|mind|mine|minister|mint
minute|mist|mitten|mom|money|monkey|month|moon|moonbeam|moonlight|moonlit|moonscape|moonshine|moonstruck|moonwalk|moreover|morning|mother|motion|motorcycle|mountain|mouth
move|muscle|name|nation|nearby|neck|need|needle|nerve|nest|nevermore|newsboy|newsbreak|newscaster|newsdealer|newsletter|newsman|newspaper|newsprint|newsreel|newsroom|night
nightfall|nobody|noise|noisemaker|north|northeast|nose|note|notebook|nowhere|number|nursemaid|nut|nutcracker|oatmeal|observation|ocean|offer|office|oil|oneself|onetime|orange
oranges|order|oven|overboard|overcoat|overflow|overland|pacemaker|page|pail|pan|pancake|paper|parcel|part|partner|party|passbook|passenger|passkey|Passover|passport|payment
peace|pear|pen|pencil|peppermint|person|pest|pet|pets|pickle|pickup|picture|pie|pies|pig|pigs|pin|pinhole|pinstripe|pinup|pinwheel|pipe|pizzas|place|plane|planes|plant|plantation
plants|plastic|plate|play|playback|playground|playhouse|playthings|pleasure|plot|plough|pocket|point|poison|pollution|ponytail|popcorn|porter|position|postcard|pot|potato
powder|power|price|produce|profit|property|prose|protest|pull|pump|punishment|purpose|push|quarter|quartz|queen|question|quicksand|quiet|quill|quilt|quince|quiver|rabbit|rabbits
racquetball|rail|railroad|railway|rain|raincheck|raincoat|rainstorm|rainwater|rake|range|rat|rate|rattlesnake|rattletrap|ray|reaction|reading|reason|receipt|recess|record
regret|relation|religion|repairman|representative|request|respect|rest|reward|rhythm|rice|riddle|rifle|ring|rings|river|riverbanks|road|robin|rock|rod|roll|roof|room|root
rose|route|rub|rubberband|rule|run|sack|sail|sailboat|salesclerk|salt|sand|sandlot|sandstone|saucepan|scale|scapegoat|scarecrow|scarf|scene|scent|school|schoolbook|schoolboy
schoolbus|schoolhouse|science|scissors|screw|sea|seashore|seat|secretary|seed|selection|self|sense|servant|shade|shadyside|shake|shame|shape|sharecropper|sharpshooter|sheep
sheepskin|sheet|shelf|ship|shirt|shock|shoe|shoelace|shoemaker|shoes|shop|shortbread|show|showoff|showplace|side|sidekick|sidewalk|sign|silk|silver|silversmith|sink|sister
sisterhood|sisters|sixfold|size|skate|skateboard|skin|skintight|skirt|sky|skylark|skylight|slave|sleep|sleet|slip|slope|slowdown|slumlord|smash|smell|smile|smoke|snail|snails
snake|snakes|snakeskin|sneeze|snow|snowball|snowbank|snowbird|snowdrift|snowshovel|soap|society|sock|soda|sofa|softball|somebody|someday|somehow|someone|someplace|something
sometimes|somewhat|somewhere|son|song|songs|sort|sound|soundproof|soup|southeast|southwest|soybean|space|spacewalk|spade|spark|spearmint|spiders|spillway|spokesperson|sponge
spoon|spot|spring|spy|square|squirrel|stage|stagehand|stamp|standby|standoff|standout|standpoint|star|starfish|start|statement|station|steam|steamship|steel|stem|step|stepson
stew|stick|sticks|stitch|stocking|stockroom|stomach|stone|stop|stoplight|stopwatch|store|story|stove|stranger|straw|stream|street|stretch|string|stronghold|structure|substance
subway|sugar|suggestion|suit|summer|sun|sunbaked|sunbathe|sundial|sundown|sunfish|sunflower|sunglasses|sunlit|sunray|sunroof|sunup|supercargo|supercharge|supercool|superego
superfine|supergiant|superhero|superhighways|superhuman|superimpose|supermarket|supermen|supernatural|superpower|superscript|supersensitive|supersonic|superstar|superstrong
superstructure|supertanker|superweapon|superwoman|support|surprise|sweater|sweetheart|sweetmeat|swim|swing|system|table|tablecloth|tablespoon|tabletop|tableware|tail|tailcoat
tailgate|taillight|taillike|tailpiece|tailspin|takeoff|takeout|takeover|talebearer|taleteller|talk|tank|tapeworm|taproom|taproot|target|taskmaster|taste|tax|taxicab|taxpayer
teaching|teacup|team|teammate|teamwork|teapot|teaspoon|teenager|teeth|telltale|temper|tendency|tenderfoot|tenfold|tent|territory|test|textbook|texture|theory|therefore|thing
things|thought|thread|thrill|throat|throne|throwaway|throwback|thumb|thunder|thunderbird|thunderstorm|ticket|tiger|time|timekeeper|timesaving|timeshare|timetable|tin|title
toad|toe|toes|together|tomatoes|tongue|toolbox|tooth|toothbrush|toothpaste|toothpick|top|touch|touchdown|town|township|toy|toys|trade|trail|train|trains|tramp|transport|tray
treatment|tree|trees|trick|trip|trouble|trousers|truck|trucks|tub|turkey|turn|turnabout|turnaround|turnbuckle|turndown|turnkey|turnoff|turntable|twig|twist|typewriter|umbrella
uncle|underachieve|underage|underarm|underbelly|underbid|undercharge|underclothes|undercover|undercut|underdevelop|underestimate|underexpose|underfoot|underground|underwear
unit|upbeat|upbringing|upcoming|update|upend|upgrade|upheaval|uphill|uphold|upkeep|upland|uplift|upload|upmarket|upon|uppercase|upperclassman|uppercut|uproar|uproot|upset
upshot|upside|upstage|upstairs|upstanding|upstart|upstate|upstream|uptake|upthrust|uptight|uptime|uptown|upward|upwind|use|vacation|value|van|vase|vegetable|veil|vein|verse
vessel|vest|view|visitor|voice|volcano|volleyball|voyage|waistline|walk|walkways|wall|walleyed|wallpaper|war|wardroom|warfare|warmblooded|warpath|wash|washbowl|washcloth|washhouse
washout|washrag|washroom|washstand|washtub|waste|wastebasket|wasteland|wastepaper|wastewater|watch|watchband|watchdog|watchmaker|watchman|watchtower|watchword|water|watercolor
watercooler|watercraft|waterfall|waterfront|waterline|waterlog|watermelon|waterpower|waterproof|waterscape|watershed|waterside|waterspout|watertight|wave|wavelike|waves|wax
waxwork|way|waybill|wayfarer|waylaid|wayside|wayward|wealth|weather|weathercock|weatherman|weatherproof|week|weekday|weekend|weeknight|weight|whatever|whatsoever|wheel|wheelchair
wheelhouse|whip|whistle|whitecap|whitefish|whitewall|whitewash|widespread|wilderness|wind|window|wine|wing|winter|wipeout|wire|wish|without|woman|women|wood|woodshop|wool
word|work|worm|wound|wren|wrench|wrist|writer|writing|yak|yam|yard|yarn|year|yoke|zebra|zephyr|zinc|zipper|zoo
`.split("|");
const _numberWords = {
	ones: [
		"zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine",
		"ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen",
		"twenty"
	],
	tens: ["", "", "twenty", "thirty", "forty", "fifty", "sixty", "seventy", "eighty", "ninety"],
	tiers: ["", "thousand", "million", "billion", "trillion", "quadrillion", "quintillion", "sextillion", "septillion", "octillion", "nonillion"],
	bigPrefixes: ["", "un", "duo", "tre", "quattuor", "quin", "sex", "octo", "novem"],
	bigSuffixes: ["", "decillion", "vigintillion", "trigintillion", "quadragintillion", "quinquagintillion", "sexagintillion", "septuagintillion", "octogintillion", "nonagintillion", "centillion"]
} as const;
const _ordinals = {
	zero: "zeroeth", one: "first", two: "second", three: "third", four: "fourth", five: "fifth", eight: "eighth", nine: "ninth", twelve: "twelfth",
	twenty: "twentieth", thirty: "thirtieth", forty: "fortieth", fifty: "fiftieth", sixty: "sixtieth", seventy: "seventieth", eighty: "eightieth", ninety: "ninetieth"
} as const;
const _romanNumerals = {
	grouped: [
		["", "Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"],
		["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
		["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
		["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
		["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
		["", "ↈ", "ↈↈ", "ↈↈↈ"]
	],
	ungrouped: [
		["", "Ⅰ", "ⅠⅠ", "ⅠⅠⅠ", "ⅠⅤ", "Ⅴ", "ⅤⅠ", "ⅤⅠⅠ", "ⅤⅠⅠⅠ", "ⅠⅩ"],
		["", "Ⅹ", "ⅩⅩ", "ⅩⅩⅩ", "ⅩⅬ", "Ⅼ", "ⅬⅩ", "ⅬⅩⅩ", "ⅬⅩⅩⅩ", "ⅩⅭ"],
		["", "Ⅽ", "ⅭⅭ", "ⅭⅭⅭ", "ⅭⅮ", "Ⅾ", "ⅮⅭ", "ⅮⅭⅭ", "ⅮⅭⅭⅭ", "ⅭⅯ"],
		["", "Ⅿ", "ⅯⅯ", "ⅯⅯⅯ", "Ⅿↁ", "ↁ", "ↁⅯ", "ↁⅯⅯ", "ↁⅯⅯⅯ", "ↁↂ"],
		["", "ↂ", "ↂↂ", "ↂↂↂ", "ↂↇ", "ↇ", "ↇↂ", "ↇↂↂ", "ↇↂↂↂ", "ↇↈ"],
		["", "ↈ", "ↈↈ", "ↈↈↈ"]
	]
} as const;
const UUIDLOG: Array<[string, string, number]> = [];
/* eslint-enable array-element-newline, object-property-newline */
// #endregion ▮▮▮▮[HELPERS]▮▮▮▮

// #region ████████ GETTERS: Basic Data Lookup & Retrieval ████████ ~
// @ts-expect-error Leauge of foundry developers is wrong about user not being on game.
const GMID = (): string | false => game?.user?.find((user) => user.isGM)?.id ?? false;
// #endregion ▄▄▄▄▄ GETTERS ▄▄▄▄▄

// #region ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████ ~

const isNumber = (ref: unknown): ref is number => typeof ref === "number" && !isNaN(ref);
const isArray = (ref: unknown): ref is unknown[] => Array.isArray(ref);
const isSimpleObj = (ref: unknown): ref is Record<string | number | symbol, unknown> => ref === Object(ref) && !isArray(ref);
const isList = <T>(ref: T): ref is Record<string | number | symbol, unknown> & T => ref === Object(ref) && !isArray(ref); // Boolean(ref) && Object.getPrototypeOf(ref) === Object.prototype;
const isFunc = (ref: unknown): ref is typeof Function => typeof ref === "function";
const isInt = (ref: unknown): ref is int => isNumber(ref) && Math.round(ref) === ref;
const isFloat = (ref: unknown): ref is float => isNumber(ref) && /\./.test(`${ref}`);
const isPosInt = (ref: unknown): ref is posInt => isInt(ref) && ref >= 0;
const isIndex = <T>(ref: T): ref is T & Index<ValueOf<T>> => isList(ref) || isArray(ref);
const isIterable = (ref: unknown): ref is Iterable<unknown> => typeof ref === "object" && ref !== null && Symbol.iterator in ref;
const isHTMLCode = (ref: unknown): ref is HTMLCode => typeof ref === "string" && /^<.*>$/u.test(ref);
const isHexColor = (ref: unknown): ref is HEXColor => typeof ref === "string" && /^#(([0-9a-fA-F]{2}){3,4}|[0-9a-fA-F]{3,4})$/.test(ref);
const isRGBColor = (ref: unknown): ref is RGBColor => typeof ref === "string" && /^rgba?\((\d{1,3},\s*){1,2}?\d{1,3},\s*\d{1,3}(\.\d+)?\)$/.test(ref);
const isUndefined = (ref: unknown): ref is undefined => ref === undefined;
const isDefined = (ref: unknown): ref is NonNullable<unknown> | null => !isUndefined(ref);
const isEmpty = (ref: Index<unknown>): boolean => !(() => { for (const i in ref) { return true } return false })();
const hasItems = (ref: Index<unknown>): boolean => !isEmpty(ref);
const isInstance = <T extends new (...args: unknown[]) => unknown>(classRef: T, ref: unknown): ref is InstanceType<T> => ref instanceof classRef;
const isInstanceFunc = <T extends new (...args: ConstructorParameters<T>) => InstanceType<T>>(clazz: T) => (instance: unknown): instance is InstanceType<T> => instance instanceof clazz;
const areEqual = (...refs: unknown[]) => {
	do {
		const ref = refs.pop();
		if (refs.length && !checkEquality(ref, refs[0])) {
			return false;
		}
	} while (refs.length);
	return true;

	function checkEquality(ref1: unknown, ref2: unknown): boolean {
		if (typeof ref1 !== typeof ref2) { return false }
		if ([ref1, ref2].includes(null)) { return ref1 === ref2 }
		switch (typeof ref1) {
			case "object": {
				if (isArray(ref1)) {
					if (!isArray(ref2)) { return false }
					if (ref1.length !== ref2.length) { return false }
					for (let i = 0; i < ref1.length; i++) {
						if (!checkEquality(ref1[i], ref2[i])) { return false }
					}
					return true;
				} else if (isList(ref1)) {
					if (!isList(ref2) || Object.keys(ref1).length !== Object.keys(ref2).length) { return false }
					return checkEquality(Object.keys(ref1), Object.keys(ref2)) && checkEquality(Object.values(ref1), Object.values(ref2));
				}
				try {
					return JSON.stringify(ref1) === JSON.stringify(ref2);
				} catch {
					return false;
				}
			}
			default: {
				return ref1 === ref2;
			}
		}
	}

};
const pFloat = (ref: unknown, sigDigits?: posInt, isStrict = false): number => {
	if (typeof ref === "string") {
		ref = parseFloat(ref);
	}
	if (typeof ref === "number") {
		if (isNaN(ref)) { return isStrict ? NaN : 0 }
		if (isUndefined(sigDigits)) { return ref }
		return Math.round(ref * (10 ** sigDigits)) / (10 ** sigDigits);
	}
	return isStrict ? NaN : 0;
};
const pInt = (ref: unknown, isStrict = false): number => (isNaN(pFloat(ref, 0, isStrict)) ? NaN : Math.round(pFloat(ref, 0, isStrict)));
const radToDeg = (rad: number, isConstrained = true): number => {
	rad = isConstrained ? rad % (2 * Math.PI) : rad;
	rad *= 180 / Math.PI;
	return rad;
};
const degToRad = (deg: number, isConstrained = true): number => {
	deg = isConstrained ? deg % 360 : deg;
	deg *= Math.PI / 180;
	return deg;
};
const getKey = <T>(key: string|number|symbol, obj: Record<string|number|symbol, T>): T|null => {
	if (key in obj) {
		return obj[key];
	}
	return null;
};

const FILTERS = {
	IsInstance: ((classRef: unknown) => ((item: unknown) => typeof classRef === "function" && item instanceof classRef))
};
// #endregion ▄▄▄▄▄ TYPES ▄▄▄▄▄

// #region ████████ STRINGS: String Parsing, Manipulation, Conversion, Regular Expressions ████████
// #region ░░░░░░░[Case Conversion]░░░░ Upper, Lower, Sentence & Title Case ░░░░░░░ ~
const uCase = <T extends unknown>(str: T): Uppercase<string & T> => String(str).toUpperCase() as Uppercase<string & T>;
const lCase = <T extends unknown>(str: T): Lowercase<string & T> => String(str).toLowerCase() as Lowercase<string & T>;
const sCase = <T extends unknown>(str: T): Capitalize<string & T> => {
	let [first, ...rest] = `${str ?? ""}`.split(/\s+/);
	first = testRegExp(first, _capWords) ? first : `${uCase(first.charAt(0))}${lCase(first.slice(1))}`;
	if (hasItems(rest)) {
		rest = rest.map((word) => (testRegExp(word, _capWords) ? word : lCase(word)));
	}
	return [first, ...rest].join(" ").trim() as Capitalize<string & T>;
};
const tCase = <T extends unknown>(str: T): Titlecase<string & T> => String(str).split(/\s/)
	.map((word, i) => (i && testRegExp(word, _noCapWords) ? lCase(word) : sCase(word)))
	.join(" ").trim() as Titlecase<string & T>;
// #endregion ░░░░[Case Conversion]░░░░
// #region ░░░░░░░[RegExp]░░░░ Regular Expressions ░░░░░░░ ~
const testRegExp = (str: unknown, patterns: Array<RegExp | string> = [], flags = "gui", isTestingAll = false) => patterns
	.map((pattern) => (pattern instanceof RegExp
		? pattern
		: new RegExp(`\\b${pattern}\\b`, flags)))[isTestingAll ? "every" : "some"]((pattern) => pattern.test(`${str}`));
const regExtract = (ref: unknown, pattern: string | RegExp, flags?: string) => {
	/* Wrapper around String.match() that removes the need to worry about match()'s different handling of the 'g' flag.
			- IF your pattern contains unescaped parentheses -> Returns Array of all matching groups.
			- OTHERWISE -> Returns string that matches the provided pattern. */
	const splitFlags: string[] = [];
	[...(flags ?? "").replace(/g/g, ""), "u"].forEach((flag) => {
		if (flag && !splitFlags.includes(flag)) {
			splitFlags.push(flag);
		}
	});
	const isGrouping = /[)(]/.test(pattern.toString().replace(/\\\)|\\\(/g, ""));
	if (isGrouping) {
		splitFlags.push("g");
	}
	flags = splitFlags.join("");
	pattern = new RegExp(pattern, flags);
	const matches = `${ref}`.match(pattern) || [];
	return isGrouping ? Array.from(matches) : matches.pop();
};

// #endregion ░░░░[RegExp]░░░░
// #region ░░░░░░░[Formatting]░░░░ Hyphenation, Pluralization, "a"/"an" Fixing ░░░░░░░ ~
// const hyphenate = (str: unknown) => (/^<|\u00AD|\u200B/.test(`${str}`) ? `${str}` : _hyph(`${str}`));
const unhyphenate = (str: unknown) => `${str}`.replace(/\u00AD|\u200B/gu, "");
const parseArticles = (str: unknown) => `${str}`.replace(/\b(a|A)\s([aeiouAEIOU])/gu, "$1n $2");
const pluralize = (singular: string, num: number, plural?: string) => {
	if (pFloat(num) === 1) { return singular }
	return plural ?? `${singular.replace(/y$/, "ie").replace(/s$/, "se")}s`;
};
const oxfordize = (items: Array<number | string>, useOxfordComma = true) => {
	const lastItem = items.pop();
	return [
		items.join(", "),
		useOxfordComma ? "," : "",
		" and ",
		lastItem
	].join("");
};
const ellipsize = (text: unknown, maxLength: number) => (`${text}`.length > maxLength ? `${`${text}`.slice(0, maxLength - 3)}…` : `${text}`);
const pad = (text: unknown, minLength: posInt, delim = " ", decimalPos?: posInt): string => {
	const str = `${text}`;
	if (str.length < minLength) {
		// if (/\./.test(str) && typeof decimalPos === "number") {
		//   ... position decimal
		// } else {
		return `${delim.repeat(minLength - str.length)}${str}`;
	}
	return str;
};
const toKey = (text: string): string => (text ?? "").toLowerCase().replace(/ /g, "-").replace(/default/, "DEFAULT");
// #region ========== Numbers: Formatting Numbers Into Strings =========== ~
const signNum = (num: int, delim = "", zeroSign = "+") => `${pFloat(num) < 0 ? "-" : (pFloat(num) > 0 ? "+" : zeroSign)}${delim}${Math.abs(pFloat(num))}`;
const padNum = (num: number, numDecDigits: int, includePlus = false, decimalPos?: posInt) => {
	const prefix = (includePlus && num >= 0) ? "+" : "";
	const [leftDigits, rightDigits] = `${pFloat(num)}`.split(/\./);
	if (getType(rightDigits) === "int") {
		if (rightDigits.length > numDecDigits) {
			return `${prefix}${pFloat(num, numDecDigits)}`;
		} else if (rightDigits.length < numDecDigits) {
			return `${prefix}${leftDigits}.${rightDigits}${"0".repeat(numDecDigits - rightDigits.length)}`;
		} else {
			return `${prefix}${pFloat(num)}`;
		}
	}
	return `${prefix}${leftDigits}.${"0".repeat(numDecDigits)}`;
};
const stringifyNum = (num: number | string) => {
	// Can take string representations of numbers, either in standard or scientific/engineering notation.
	// Returns a string representation of the number in standard notation.
	if (pFloat(num) === 0) { return "0" }
	const stringyNum = lCase(num).replace(/[^\d.e+-]/g, "");
	const base = regExtract(stringyNum, /^-?[\d.]+/) as string | undefined;
	const exp = pInt(regExtract(stringyNum, /e([+-]?\d+)$/) as string | undefined);
	if (typeof base === "string" && typeof exp === "string") {
		let baseInts = regExtract(base, /^-?(\d+)/),
						baseDecs = regExtract(base, /\.(\d+)/);
		if (isArray(baseInts) && isArray(baseDecs)) {
			baseInts = baseInts.pop()?.replace(/^0+/, "");
			baseDecs = lCase(baseDecs?.pop()).replace(/0+$/, "");
			if (!isUndefined(baseInts) && !isUndefined(baseDecs)) {
				const numFinalInts = Math.max(0, baseInts.length + exp);
				const numFinalDecs = Math.max(0, baseDecs.length - exp);
				const finalInts = [
					baseInts.slice(0, numFinalInts),
					baseDecs.slice(0, Math.max(0, exp))
				].join("") || "0";
				const finalDecs = [
					baseInts.length - numFinalInts > 0
						? baseInts.slice(baseInts.length - numFinalInts - 1)
						: "",
					baseDecs.slice(baseDecs.length - numFinalDecs)
				].join("");
				return [
					stringyNum.charAt(0) === "-" ? "-" : "",
					finalInts,
					"0".repeat(Math.max(0, numFinalInts - finalInts.length)),
					finalDecs.length ? "." : "",
					"0".repeat(Math.max(0, numFinalDecs - finalDecs.length)),
					finalDecs
				].join("");
			}
		}
	}
	return `${num}`;
};
const verbalizeNum = (num: number | string) => {
	// Converts a float with absolute magnitude <= 9.99e303 into words.
	num = stringifyNum(num);
	const getTier = (trioNum: number) => {
		if (trioNum < _numberWords.tiers.length) {
			return _numberWords.tiers[trioNum];
		}
		return [
			_numberWords.bigPrefixes[(trioNum % 10) - 1],
			_numberWords.bigSuffixes[Math.floor(trioNum / 10)]
		].join("");
	};
	const parseThreeDigits = (trio: string) => {
		if (pInt(trio) === 0) { return "" }
		const digits = `${trio}`.split("").map((digit) => pInt(digit)) as number[];
		let result = "";
		if (digits.length === 3) {
			const hundreds = digits.shift();
			if (isUndefined(hundreds)) {
				throw new Error(`[U.verbalizeNum] Undefined digit in trio '${digits.join("")}'.`);
			}
			result += hundreds > 0 ? `${_numberWords.ones[hundreds]} hundred` : "";
			if (hundreds && (digits[0] || digits[1])) {
				result += " and ";
			}
		}
		if (pInt(digits.join("")) <= _numberWords.ones.length) {
			result += _numberWords.ones[pInt(digits.join(""))];
		} else {
			result += `${_numberWords.tens[pInt(digits.shift())]}${pInt(digits[0]) > 0 ? `-${_numberWords.ones[pInt(digits[0])]}` : ""}`;
		}
		return result;
	};
	const numWords = [];
	if (num.charAt(0) === "-") {
		numWords.push("negative");
	}
	const [integers, decimals] = num.replace(/[,|\s|-]/g, "").split(".");
	const intArray = integers.split("").reverse().join("")
		.match(/.{1,3}/g)
		?.map((v) => v.split("").reverse().join("")) ?? [];
	const intStrings = [];
	while (intArray.length) {
		const thisTrio = intArray.pop();
		if (thisTrio) {
			const theseWords = parseThreeDigits(thisTrio);
			if (theseWords) {
				intStrings.push(`${theseWords} ${getTier(intArray.length)}`);
			}
		}
	}
	numWords.push(intStrings.join(", ").trim());
	if (getType(decimals) === "int") {
		if (integers === "0") {
			numWords.push("zero");
		}
		numWords.push("point");
		for (const digit of decimals.split("")) {
			numWords.push(_numberWords.ones[pInt(digit)]);
		}
	}
	return numWords.join(" ");
};
const ordinalizeNum = (num: string | number, isReturningWords = false) => {
	if (isReturningWords) {
		const [numText, suffix]: RegExpMatchArray = lCase(verbalizeNum(num)).match(/.*?[-|\s]?(\w*?)$/) ?? ["", ""];
		return numText.replace(
			new RegExp(`${suffix}$`),
			suffix in _ordinals ? _ordinals[<keyof typeof _ordinals>suffix] : `${suffix}th`
		);
	}
	if (/\.|1[1-3]$/.test(`${num}`)) {
		return `${num}th`;
	}
	return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][
		pInt(`${num}`.charAt(`${num}`.length - 1))
	]
	}`;
};
const romanizeNum = (num: number, isUsingGroupedChars = true) => {
	if (isFloat(num)) { throw new Error(`Error: Can't Romanize Floats (${num})`) }
	if (num >= 400000) { throw new Error(`Error: Can't Romanize >= 400,000 (${num})`) }
	if (num <= 0) { throw new Error(`Error: Can't Romanize <= 0 (${num})`) }
	const romanRef = _romanNumerals[isUsingGroupedChars ? "grouped" : "ungrouped"];
	const romanNum = stringifyNum(num)
		.split("")
		.reverse()
		.map((digit, i) => romanRef[i][pInt(digit)])
		.reverse()
		.join("");
	return isUsingGroupedChars
		? romanNum.replace(/ⅩⅠ/gu, "Ⅺ").replace(/ⅩⅡ/gu, "Ⅻ")
		: romanNum;
};
// #endregion _______ Numbers _______
// #endregion ░░░░[Formatting]░░░░
// #region ░░░░░░░[Content]░░░░ Lorem Ipsum, Random Content Generation, Randum UUID ░░░░░░░ ~
const loremIpsum = (numWords = 200) => {
	const lrWordList = _loremIpsumText.split(/\n?\s+/g);
	const words = [...lrWordList[randNum(0, lrWordList.length - 1)]];
	while (words.length < numWords) {
		words.push(...lrWordList);
	}
	words.length = numWords;
	return `${sCase(words.join(" ")).trim().replace(/[^a-z\s]*$/ui, "")}.`;
};
const randString = (length = 5) => [...new Array(length)].map(() => String.fromCharCode(randInt(...<[number, number]>["a", "z"].map((char) => char.charCodeAt(0))))).join("");
const randWord = (numWords = 1, wordList = _randomWords) => [...Array(numWords)].map(() => randElem([...wordList])).join(" ");
const getUID = (id: string): string => {
	const indexNum = Math.max(0, ...UUIDLOG.filter(([genericID]) => genericID.startsWith(id)).map(([,,num]) => num)) + 1;
	const uuid = indexNum === 1 ? id : `${id}_${indexNum}`;
	UUIDLOG.push([id, uuid, indexNum]);
	eLog.log(`UUIDify(${id}) --> [${uuid}, ${indexNum}]`);
	Object.assign(globalThis, {UUIDLOG});
	return uuid;
};
// #endregion ░░░░[Content]░░░░
// #endregion ▄▄▄▄▄ STRINGS ▄▄▄▄▄

// #region ████████ SEARCHING: Searching Various Data Types w/ Fuzzy Matching ████████ ~
const fuzzyMatch = (val1: unknown, val2: unknown): boolean => {
	const [str1, str2] = [val1, val2].map((val) => lCase(String(val).replace(/[^a-zA-Z0-9\.+-]/g, "").trim()));
	return str1.length > 0 && str1 == str2; // eslint-disable-line eqeqeq
};
const isIn = (needle: unknown, haystack: unknown[] = [], fuzziness = 0) => {
	// Looks for needle in haystack using fuzzy matching, then returns value as it appears in haystack.

	// STEP ONE: POPULATE SEARCH TESTS ACCORDING TO FUZZINESS SETTING
	const SearchTests = [
		(ndl: unknown, item: unknown) => new RegExp(`^${ndl}$`, "gu").test(`${item}`),
		(ndl: unknown, item: unknown) => new RegExp(`^${ndl}$`, "gui").test(`${item}`)
	];
	if (fuzziness >= 1) {
		const fuzzyTests = [
			(ndl: unknown, item: unknown) => new RegExp(`^${ndl}`, "gui").test(`${item}`),
			(ndl: unknown, item: unknown) => new RegExp(`${ndl}$`, "gui").test(`${item}`),
			(ndl: unknown, item: unknown) => new RegExp(`${ndl}`, "gui").test(`${item}`),
			(ndl: unknown, item: unknown) => new RegExp(`${item}`, "gui").test(`${ndl}`)
		];
		SearchTests.push(...fuzzyTests);
		if (fuzziness >= 2) {
			SearchTests.push(...fuzzyTests
				.map((func) => (ndl: unknown, item: unknown) => func(`${ndl}`.replace(/\W/g, ""), `${item}`.replace(/\W/gu, ""))));
			if (fuzziness >= 3) {
				SearchTests.push(() => false); // Have to implement Fuse matching
			}
		}
	}

	// STEP TWO: PARSE NEEDLE & CONSTRUCT SEARCHABLE HAYSTACK.
	const searchNeedle = `${needle}`;
	const searchStack = (() => {
		if (isArray(haystack)) {
			return [...haystack] as unknown[];
		}
		if (isList(haystack)) {
			return Object.keys(haystack) as unknown[];
		}
		try {
			return Array.from(haystack) as unknown[];
		} catch {
			throw new Error(`Haystack type must be [list, array], not ${typeof haystack}: ${JSON.stringify(haystack)}`);
		}
	})();
	if (!isArray(searchStack)) { return false }

	// STEP THREE: SEARCH HAY FOR NEEDLE USING PROGRESSIVELY MORE FUZZY SEARCH TESTS
	let matchIndex = -1;
	while (!isPosInt(matchIndex)) {
		const testFunc = SearchTests.shift();
		if (!testFunc) {
			return false;
		}
		matchIndex = searchStack.findIndex((item) => testFunc(searchNeedle, `${item}`));
	}
	if (isPosInt(matchIndex)) {
		return isList(haystack) ? Object.values(haystack)[matchIndex] : haystack[matchIndex];
	}
	return false;
};
const isInExact = (needle: unknown, haystack: unknown[]) => isIn(needle, haystack, 0);
// #endregion ▄▄▄▄▄ SEARCHING ▄▄▄▄▄

// #region ████████ NUMBERS: Number Casting, Mathematics, Conversion ████████ ~
const randNum = (min: number, max: number, snap = 0): number => gsap.utils.random(min, max, snap);
const randInt = (min: number, max: number) => randNum(min, max, 1);
const coinFlip = () => randNum(0, 1, 1) === 1;
const cycleNum = (num: number, [min = 0, max = Infinity] = []): number => gsap.utils.wrap(min, max, num);
const clampNum = (num: number, [min = 0, max = Infinity] = []): number => gsap.utils.clamp(min, max, num);
const cycleAngle = (angle: number, range: [number, number] = [0, 360]) => cycleNum(angle, range);
const roundNum = (num: number, sigDigits: posInt = 0) => (sigDigits === 0 ? pInt(num) : pFloat(num, sigDigits));
const sum = (...nums: Array<number | number[]/* | Record<key,number > */>) => Object.values(nums.flat()).reduce((num, tot) => tot + num, 0);
const average = (...nums: Array<number | number[]>) => sum(...nums) / nums.flat().length;
// #region ░░░░░░░[Positioning]░░░░ Relationships On 2D Cartesian Plane ░░░░░░░ ~
const getDistance = ({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) => (((x1 - x2) ** 2) + ((y1 - y2) ** 2)) ** 0.5;
const getAngle = (
	{x: x1, y: y1}: Point,
	{x: x2, y: y2}: Point,
	{x: xO, y: yO}: Point = {x: 0, y: 0},
	range: [number, number] = [0, 360]
) => {
	x1 -= xO; y1 -= yO; x2 -= xO; y2 -= yO;
	return cycleAngle(radToDeg(Math.atan2(y2 - y1, x2 - x1)), range);
};
const getAngleDelta = (angleStart: number, angleEnd: number, range: [number, number] = [0, 360]) => cycleAngle(angleEnd - angleStart, range);
// #endregion ░░░░[Positioning]░░░░
// #endregion ▄▄▄▄▄ NUMBERS ▄▄▄▄▄

// #region ████████ ARRAYS: Array Manipulation ████████ ~
const randElem = <Type>(array: Type[]): Type => gsap.utils.random(array);
const randIndex = (array: unknown[]): posInt => randInt(0, array.length - 1);
const makeIntRange = (min: int, max: int) => {
	const intRange: int[] = [];
	for (let i = min; i <= max; i++) {
		intRange.push(i);
	}
	return intRange;
};
const makeCycler = (array: unknown[], index = 0): Generator => {
	// Given an array and a starting index, returns a generator function that can be used
	// to iterate over the array indefinitely, or wrap out-of-bounds index values
	const wrapper = gsap.utils.wrap(array);
	index--;
	return (function* cycler() {
		while (true) {
			index++;
			yield wrapper(index);
		}
	}());
};


function getLast<Type extends any[]>(array: Type): ValueOf<Type> {
	return array.length === 0 ? undefined : array[array.length - 1];
}
// const getLast = <Type>(array: Type[]): typeof array extends [] ? undefined : Type => ;
const unique = <Type>(array: Type[]): Type[] => {
	const returnArray: Type[] = [];
	array.forEach((item) => { if (!returnArray.includes(item)) { returnArray.push(item) } });
	return returnArray;
};
const group = <Type extends Record<string,unknown>>(array: Type[], key: KeyOf<Type>): Record<string & ValueOf<Type>, Type[]> => {
	const returnObj: Partial<Record<string & ValueOf<Type>, Type[]>> = {};
	array.forEach((item) => {
		returnObj[item[key] as string & ValueOf<Type>] ??= [];
		returnObj[item[key] as string & ValueOf<Type>]!.push(item);
	});
	return returnObj as Record<string & ValueOf<Type>, Type[]>;
};
const removeFirst = (array: unknown[], element: unknown) => array.splice(array.findIndex((v) => v === element));
const pullElement = (array: unknown[], checkFunc = (_v: unknown = true, _i = 0, _a: unknown[] = []) => { checkFunc(_v, _i, _a) }) => {
	const index = array.findIndex((v, i, a) => checkFunc(v, i, a));
	return index !== -1 && array.splice(index, 1).pop();
};
const pullIndex = (array: unknown[], index: posInt) => pullElement(array, (v, i) => i === index);
const subGroup = (array: unknown[], groupSize: posInt) => {
	const subArrays = [];
	while (array.length > groupSize) {
		const subArray = [];
		while (subArray.length < groupSize) {
			subArray.push(array.shift());
		}
		subArrays.push(subArray);
	}
	subArrays.push(array);
};
const shuffle = (array: unknown[]) => {
	let currentIndex = array.length, randomIndex;

	// While there remain elements to shuffle.
	while (currentIndex !== 0) {

		// Pick a remaining element.
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex--;

		// And swap it with the current element.
		[array[currentIndex], array[randomIndex]] = [
			array[randomIndex], array[currentIndex]];
	}

	return array;
};
// #endregion ▄▄▄▄▄ ARRAYS ▄▄▄▄▄

// #region ████████ OBJECTS: Manipulation of Simple Key/Val Objects ████████ ~

const checkVal = ({k, v}: { k?: unknown, v?: unknown }, checkTest: checkTest) => {
	if (typeof checkTest === "function") {
		if (isDefined(v)) { return checkTest(v, k) }
		return checkTest(k);
	}
	if (typeof checkTest === "number") {
		checkTest = `${checkTest}`;
	}
	return (new RegExp(checkTest)).test(`${v}`);
};
const remove = (obj: Index<unknown>, checkTest: testFunc<keyFunc | valFunc>) => {
	// Given an array or list and a search function, will remove the first matching element and return it.
	if (isArray(obj)) {
		const index = obj.findIndex((v) => checkVal({v}, checkTest));
		if (index >= 0) {
			let remVal;
			for (let i = 0; i <= obj.length; i++) {
				if (i === index) {
					remVal = obj.shift();
				} else {
					obj.push(obj.shift());
				}
			}
			return remVal;
		}
	} else if (isList(obj)) {
		const [remKey] = Object.entries(obj).find(([k, v]) => checkVal({k, v}, checkTest)) ?? [];
		if (remKey) {
			const remVal = obj[remKey];
			// const {[remKey]: remVal} = obj;
			delete obj[remKey];
			return remVal;
		}
	}
	return false;
};
const replace = (obj: Index<unknown>, checkTest: checkTest, repVal: unknown) => {
	// As remove, except instead replaces the element with the provided value.
	// Returns true/false to indicate whether the replace action succeeded.
	let repKey;
	if (isList(obj)) {
		[repKey] = Object.entries(obj).find((v) => checkVal({v}, checkTest)) || [false];
		if (repKey === false) { return false }
	} else if (isArray(obj)) {
		repKey = obj.findIndex((v) => checkVal({v}, checkTest));
		if (repKey === -1) { return false }
	}
	if (typeof repKey !== "number") {
		repKey = `${repKey}`;
	}
	if (typeof repVal === "function") {
		// @ts-expect-error Hopefully just temporary to get this to compile: Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
		obj[repKey] = repVal(obj[repKey], repKey);
	} else {
		// @ts-expect-error Hopefully just temporary to get this to compile: Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
		obj[repKey] = repVal;
	}
	return true;
};
const objClean = <T>(data: T, remVals: Array<false|null|undefined|""|0|Record<string,never>|never[]> = [undefined,null,"",{},[]]): T | Partial<T> | "KILL" => {
	const remStrings = remVals.map((rVal) => JSON.stringify(rVal));
	if (remStrings.includes(JSON.stringify(data)) || remVals.includes(data as ValueOf<typeof remVals>)) { return "KILL" }
	if (Array.isArray(data)) {
		const newData = data.map((elem) => objClean(elem, remVals))
			.filter((elem) => elem !== "KILL") as T & any[];
		return newData.length ? newData : "KILL";
	}
	if (data && typeof data === "object" && JSON.stringify(data).startsWith("{")) {
		const newData = Object.entries(data)
			.map(([key, val]) => [key, objClean(val, remVals)])
			.filter(([, val]) => val !== "KILL");
		return newData.length ? Object.fromEntries(newData) : "KILL";
	}
	return data;
};


export function toDict<T extends List, K extends string & KeyOf<T>, V extends ValueOf<T>>(items: T[], key: K): V extends key ? Record<V,T> : never {
	const dict = {} as Record<V,T>;
	const mappedItems = items
		.map((data) => {
			let {iData} = data;
			if (!iData) { iData = data }
			return [
				`${(iData.linkName || iData.sourceItem?.name) ? `>${iData.type.charAt(0)}>` : ""}${iData[key]}`,
				iData
			];
		})
		.sort(([a], [b]) => a.localeCompare(b)) as Array<[string, T]>;
	mappedItems.forEach(([newKey, iData]: [string, T]) => {
		if (newKey in dict) {
			newKey = indexString(newKey) as V;
		}
		dict[newKey as KeyOf<typeof dict>] = iData;
	});
	// @ts-expect-error Oh it definitely does.
	return dict;

	function indexString(str: string) {
		if (/_\d+$/.test(str)) {
			const [curIndex, ...subStr] = str.split(/_/).reverse();
			return [
				...subStr.reverse(),
				parseInt(curIndex) + 1
			].join("_");
		}
		return `${str}_1`;
	}
}
// Given an object and a predicate function, returns array of two objects:
//   one with entries that pass, one with entries that fail.
const partition = <Type>(obj: Type[], predicate: testFunc<valFunc> = () => true): [Type[], Type[]] => [
	objFilter(obj, predicate),
	objFilter(obj, (v: unknown, k: string | number | undefined) => !predicate(v, k))
];
function objMap(obj: Index<unknown>, keyFunc: mapFunc<keyFunc> | mapFunc<valFunc> | false, valFunc?: mapFunc<valFunc>): Index<unknown> {
	// An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
	// If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
	if (!valFunc) {
		valFunc = keyFunc as mapFunc<valFunc>;
		keyFunc = false;
	}
	if (!keyFunc) {
		keyFunc = ((k: unknown) => k);
	}
	if (isArray(obj)) { return obj.map(valFunc) }
	return Object.fromEntries(Object.entries(obj).map(([key, val]) => [(<mapFunc<keyFunc>>keyFunc)(key, val), (<mapFunc<valFunc>>valFunc)(val, key)]));
}
const objFindKey = <Type extends Index<unknown>>(obj: Type, keyFunc: testFunc<keyFunc> | testFunc<valFunc> | false, valFunc?: testFunc<valFunc>): KeyOf<Type>|false => {
	// An object-equivalent Array.findIndex() function, which accepts check functions for both keys and/or values.
	// If only one function is provided, it's assumed to be searching via values and will receive (v, k) args.
	if (!valFunc) {
		valFunc = keyFunc as testFunc<valFunc>;
		keyFunc = false;
	}
	if (!keyFunc) {
		keyFunc = <testFunc<keyFunc>>((k: unknown) => k);
	}
	if (isArray(obj)) { return obj.findIndex(valFunc) }
	const kFunc = keyFunc || (() => true);
	const vFunc = valFunc || (() => true);
	const validEntry = Object.entries(obj).find(([k, v]) => kFunc(k, v) && vFunc(v, k));
	if (validEntry) {
		return validEntry[0] as KeyOf<Type>;
	}
	return false;
};
const objFilter = <Type extends Index<unknown>>(obj: Type, keyFunc: testFunc<keyFunc> | testFunc<valFunc> | false, valFunc?: testFunc<valFunc>): Type => {
	// An object-equivalent Array.filter() function, which accepts filter functions for both keys and/or values.
	// If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
	if (!valFunc) {
		valFunc = keyFunc as testFunc<valFunc>;
		keyFunc = false;
	}
	if (!keyFunc) {
		keyFunc = <testFunc<keyFunc>>((k: unknown) => k);
	}
	if (isArray(obj)) { return obj.filter(valFunc) as Type }
	const kFunc = keyFunc || (() => true);
	const vFunc = valFunc || (() => true);
	return Object.fromEntries(Object.entries(obj).filter(([key, val]: [string, unknown]) => kFunc(key, val) && vFunc(val, key))) as Type;
};
const objForEach = (obj: Index<unknown>, func: valFunc): void => {
	// An object-equivalent Array.forEach() function, which accepts one function(val, key) to perform for each member.
	if (isArray(obj)) {
		obj.forEach(func);
	} else {
		Object.entries(obj).forEach(([key, val]) => func(val, key));
	}
};
// Prunes an object of certain values (undefined by default)
const objCompact = <Type extends (Index<unknown>)>(obj: Type, preserve: unknown[] = []): Type => objFilter(obj, (val: unknown) => preserve.includes(`${val}`));
const objClone = <Type>(obj: Type, isStrictlySafe = false): Type => {
	try {
		return JSON.parse(JSON.stringify(obj));
	} catch (err) {
		if (isStrictlySafe) { throw err }
		if (isArray(obj)) { return <Type><unknown>[...obj] }
		if (isList(obj)) { return {...obj} }
	}
	return obj;
};
function objMerge<Tx,Ty>(target: Tx, source: Ty, {isMutatingOk = false, isStrictlySafe = false, isConcatenatingArrays = true} = {}): Tx & Ty {
	/* Returns a deep merge of source into target. Does not mutate target unless isMutatingOk = true. */
	target = isMutatingOk ? target : objClone(target, isStrictlySafe);
	if (source instanceof Application) {
		return source as unknown as Tx & Ty;
	}
	if (isUndefined(target)) {
		return objClone(source) as Tx & Ty;
	}
	if (isUndefined(source)) {
		return target as Tx & Ty;
	}
	if (isIndex(source)) {
		for (const [key, val] of Object.entries(source)) {
			const targetVal = target[key as KeyOf<typeof target>];
			if (isConcatenatingArrays && isArray(target[key as KeyOf<typeof target>]) && isArray(val)) {
				(target[key as KeyOf<typeof target>] as unknown as any[]).push(...val);
			} else if (val !== null && typeof val === "object") {
				if (isUndefined(targetVal) && !(val instanceof Application)) {
					// @ts-expect-error TS doesn't recognize __proto__.
					target[key as KeyOf<typeof target>] = new val.__proto__.constructor();
				}
				target[key as KeyOf<typeof target>] = objMerge(target[key as KeyOf<typeof target>], val, {isMutatingOk: true, isStrictlySafe});
			} else {
				target[key as KeyOf<typeof target>] = val as Tx[KeyOf<Tx>];
			}
		}
	}
	return target as Tx & Ty;
}
const objExpand = <T>(obj: List<T>): List<T> => {
	const expObj = {};
	for (let [key, val] of Object.entries(obj)) {
		if (isList(val)) {
			val = objExpand(val) as T;
		}
		setProperty(expObj, key, val);
	}
	// Iterate through expanded Object, converting object literals to arrays where it makes sense
	function arrayify<X>(obj: Index<X> | X): Index<X> | X {
		if (isList(obj)) {
			if (/^\d+$/.test(Object.keys(obj).join(""))) {
				return Object.values(obj).map(arrayify) as X[];
			}
			return objMap(obj, (v: unknown): unknown => arrayify(v)) as List<X>;
		}
		if (isArray(obj)) {
			return obj.map(arrayify) as X[];
		}
		return obj;
	}

	return arrayify(expObj) as List<T>;
};
const objFlatten = <ST extends unknown>(obj: Index<ST>): Record<string, ST> => {
	const flatObj: Record<string, ST> = {};
	for (const [key, val] of Object.entries(obj)) {
		if ((isArray(val) || isList(val)) && hasItems(val)) {
			for (const [subKey, subVal] of Object.entries(objFlatten(val)) as Array<[string,ST]>) {
				flatObj[`${key}.${subKey}`] = subVal;
			}
		} else {
			flatObj[key] = val;
		}
	}
	return flatObj;
};

function objNullify<T extends List<any>>(obj: T & Record<KeyOf<T>,null>): Record<KeyOf<T>,null>
function objNullify<T extends any[]>(obj: T & null[]): null[]
function objNullify<T>(obj: T): Record<KeyOf<T>,null> | null[] | T {
	if (!isIndex(obj)) { return obj }
	if (Array.isArray(obj)) {
		for (let i = 0; i < obj.length; i++) {
			obj[i] = null as ValueOf<T>;
		}
		return obj as null[];
	}
	const test = obj as Record<KeyOf<T>,null>;
	for (const objKey of Object.keys(obj) as Array<KeyOf<T>>) {
		(<Record<KeyOf<T>,null>>obj)[objKey] = null;
	}
	return obj;
}
// #endregion ▄▄▄▄▄ OBJECTS ▄▄▄▄▄

// #region ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████ ~
const getDynamicFunc = (funcName: string, func: (...args: unknown[]) => unknown, context: object) => {
	if (typeof func === "function") {
		const dFunc = {[funcName](...args: unknown[]) { return func(...args) }}[funcName];
		return context ? dFunc.bind(context) : dFunc;
	}
	return false;
};

const withLog = (fn: (...args: unknown[]) => unknown) => {
	return (...args: unknown[]) => {
		console.log(`calling ${fn.name}`);
		return fn(...args);
	};
};
// #endregion ▄▄▄▄▄ FUNCTIONS ▄▄▄▄▄

// #region ████████ HTML: Parsing HTML Code, Manipulating DOM Objects ████████ ~

// #region ░░░░░░░[GreenSock]░░░░ Wrappers for GreenSock Functions ░░░░░░░ ~
const set = (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => gsap.set(targets, vars);
function get(target: gsap.TweenTarget, property: keyof gsap.CSSProperties & string, unit: string): number;
function get(target: gsap.TweenTarget, property: keyof gsap.CSSProperties & string): string | number;
function get(target: gsap.TweenTarget, property: keyof gsap.CSSProperties & string, unit?: string): string | number {
	if (unit) {
		const propVal = regExtract(gsap.getProperty(target, property, unit), /[\d.]+/);
		if (typeof propVal === "string") {
			return pFloat(propVal);
		}
		throw new Error(`Unable to extract property '${property}' in '${unit}' units from ${target}`);
	}
	return gsap.getProperty(target, property);
}

const getGSAngleDelta = (startAngle: number, endAngle: number) => signNum(roundNum(getAngleDelta(startAngle, endAngle), 2)).replace(/^(.)/, "$1=");
// #endregion ░░░░[GreenSock]░░░░

// #region ░░░░░░░[SVG]░░░░ SVG Generation & Manipulation ░░░░░░░ ~
const getRawCirclePath = (r: number, {x: xO, y: yO}: Point = {x: 0, y: 0}): Array<Array<number | string>> => {
	[r, xO, yO] = [r, xO, yO].map((val) => roundNum(val, 2));
	const [b1, b2] = [0.4475 * r, (1 - 0.4475) * r];
	const [xT, yT] = [xO, yO - r];
	return [[
		...[xT, yT],
		...[b2, 0, r, b1, r, r],
		...[0, b2, -b1, r, -r, r],
		...[-b2, 0, -r, -b1, -r, -r],
		...[0, -b2, b1, -r, r, -r]
	]];
};
const drawCirclePath = (radius: number, origin: Point) => {
	const [[xT, yT, ...segments]] = getRawCirclePath(radius, origin);
	const path: Array<number | string> = [`m ${xT} ${yT}`];
	segments.forEach((coord, i) => {
		if (i % 6 === 0) { path.push("c") }
		path.push(coord);
	});
	path.push("z");
	return path.join(" ");
};
// #endregion ░░░░[SVG]░░░░

// #region ░░░░░░░[Colors]░░░░ Color Manipulation ░░░░░░░ ~
const getColorVals = (red?: string | number | number[], green?: number, blue?: number, alpha?: number): number[] | null => {
	if (isRGBColor(red)) {
		[red, green, blue, alpha] = red
			.replace(/[^\d.,]/g, "")
			.split(/,/)
			.map((color) => (isUndefined(color) ? undefined : parseFloat(color)));
	}
	if (isHexColor(red)) {
		if ([4,5].includes(red.length)) {
			red = red.replace(/([^#])/g, "$1$1");
		}
		[red, green, blue, alpha] = red
			.match(/[^#]{2}/g)
			?.map((val) => parseInt(val, 16)) ?? [];
	}
	if ([red, green, blue].every((color) => /^\d+$/.test(`${color}`))) {
		return [red, green, blue, alpha]
			.filter((color) => /^[\d.]+$/.test(`${color}`)) as number[];
	}
	return null;
};
const getRGBString = (red: string | number, green?: number, blue?: number, alpha?: number): RGBColor | null => {
	if (isRGBColor(red) || isHexColor(red)) {
		[red, green, blue, alpha] = getColorVals(red) ?? [];
	}
	if ([red, green, blue].every((color) => /^[.\d]+$/.test(`${color}`))) {
		let colorString = "rgb";
		const colors = [red, green, blue];
		if (/^[.\d]+$/.test(`${alpha}`)) {
			colors.push(alpha as number >= 1 ? pInt(alpha) : pFloat(alpha, 2));
			colorString += "a";
		}
		return `${colorString}(${colors.join(", ")})`;
	}
	return null;
};
const getHEXString = (red: string | number, green?: number, blue?: number): HEXColor | null => {
	function componentToHex(c: string | number): string {
		const hex = c.toString(16);
		return hex.length === 1 ? "0" + hex : hex;
	}
	if (isHexColor(red)) { return red }
	if (isRGBColor(red)) {
		[red, green, blue] = getColorVals(red) ?? [];
	}
	if (isDefined(red) && isDefined(green) && isDefined(blue) && [red, green, blue].every((color) => /^[.\d]+$/.test(`${color}`))) {
		return "#" + componentToHex(red ?? 0) + componentToHex(green ?? 0) + componentToHex(blue ?? 0);
	}
	return null;
};
const getContrastingColor = (...colorVals: [string] | number[]): RGBColor | null => {
	const [red, green, blue] = getColorVals(...colorVals) ?? [];
	if ([red, green, blue].every(isNumber)) {
		const YIQ = ((red * 299) + (green * 587) + (blue * 114)) / 1000;
		return (YIQ >= 128) ? "rgba(0, 0, 0, 1)" : "rgba(255, 255, 255, 0.8)";
	}
	return null;
};
const getRandomColor = (): RGBColor => getRGBString(gsap.utils.random(0, 255, 1), gsap.utils.random(0, 255, 1), gsap.utils.random(0, 255, 1))!;
// #endregion ░░░░[Colors]░░░░

// #region ░░░░░░░[DOM]░░░░ DOM Manipulation ░░░░░░░ ~
const getSiblings = (elem: Node) => {
	const siblings: HTMLElement[] = [];
	// if no parent, return no sibling
	if (!elem.parentNode) { return siblings }

	Array.from(elem.parentNode.children).forEach((sibling) => {
		if (sibling !== elem) {
			siblings.push(sibling as HTMLElement);
		}
	});

	return siblings;
};
// #endregion ░░░░[DOM]░░░░

const escapeHTML = <T = unknown>(str: T): T => (typeof str === "string"
	? str
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/`|'/g, "&#039;") as T
	: str);

// #endregion ▄▄▄▄▄ HTML ▄▄▄▄▄

// #region ████████ ASYNC: Async Functions, Asynchronous Flow Control ████████ ~
const sleep = (duration: number): Promise<void> => new Promise((resolve) => { setTimeout(resolve, duration >= 100 ? duration : duration * 1000) });
// #endregion ▄▄▄▄▄ ASYNC ▄▄▄▄▄

// #region ████████ FOUNDRY: Requires Configuration of System ID in constants.ts ████████ ~

const isDocID = (docRef: unknown, isUUIDok = true) => {
	return typeof docRef === "string" && (isUUIDok
		? /^(.*\.)?[A-Za-z0-9]{16}$/.test(docRef)
		: /^[A-Za-z0-9]{16}$/.test(docRef));
};

const loc = (locRef: string, formatDict: Record<string,string> = {}) => {
	if (/[a-z]/.test(locRef)) { // reference contains lower-case characters: add system ID namespacing to dot notation
		locRef = locRef.replace(new RegExp(`^(${C.SYSTEM_ID}\.)*`), `${C.SYSTEM_ID}.`);
	}
	if (typeof game.i18n.localize(locRef) === "string") {
		for (const [key, val] of Object.entries(formatDict)) {
			formatDict[key] = loc(val);
		}
		return game.i18n.format(locRef, formatDict) || game.i18n.localize(locRef) || locRef;
	}
	return locRef;
};

const getSetting = (setting: string) => game.settings.get(C.SYSTEM_ID, setting);

function getTemplatePath(subFolder: string, fileName: string): string
function getTemplatePath(subFolder: string, fileName: string[]): string[]
function getTemplatePath(subFolder: string, fileName: string|string[]) {
	if (typeof fileName === "string") {
		return `${C.TEMPLATE_ROOT}/${subFolder}/${fileName.replace(/\..*$/, "")}.hbs`;
	}
	return fileName.map((fName) => getTemplatePath(subFolder, fName));
}

function getItemsOfType(itemType: string, user?: User): SystemDocs.Item[] {
	const items = game.items.filter((item) => fuzzyMatch(item.type, itemType));
	return items;
}

function getActorsOfType(actorType: string, user?: User): SystemDocs.Actor[] {
	const actors = game.actors.filter((actor) => fuzzyMatch(actor.type, actorType));
	// if (user?.permissions)
	return actors;
}

function checkUserPermissions(document: SystemDocs.Sheet, user: User) {
	return true;
}


// #endregion ▄▄▄▄▄ FOUNDRY ▄▄▄▄▄

export default {
	// ████████ GETTERS: Basic Data Lookup & Retrieval ████████
	GMID, getUID,

	// ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████
	isNumber, isSimpleObj, isList, isArray, isFunc, isInt, isFloat, isPosInt, isIterable,
	isHTMLCode, isRGBColor, isHexColor,
	isUndefined, isDefined, isEmpty, hasItems, isInstance,
	areEqual,
	pFloat, pInt, radToDeg, degToRad,
	getKey,

	FILTERS,

	// ████████ REGEXP: Regular Expressions, Replacing, Matching ████████
	testRegExp,
	regExtract,

	// ████████ STRINGS: String Parsing, Manipulation, Conversion ████████
	// ░░░░░░░ Case Conversion ░░░░░░░
	uCase, lCase, sCase, tCase,
	// ░░░░░░░ Formatting ░░░░░░░
	/* hyphenate, */ unhyphenate, pluralize, oxfordize, ellipsize, pad,
	toKey,
	parseArticles,
	signNum, padNum, stringifyNum, verbalizeNum, ordinalizeNum, romanizeNum,
	// ░░░░░░░ Content ░░░░░░░
	loremIpsum, randString, randWord,

	// ████████ SEARCHING: Searching Various Data Types w/ Fuzzy Matching ████████
	fuzzyMatch, isIn, isInExact,

	// ████████ NUMBERS: Number Casting, Mathematics, Conversion ████████
	randNum, randInt,
	coinFlip,
	cycleNum, cycleAngle, roundNum, clampNum,
	sum, average,
	// ░░░░░░░ Positioning ░░░░░░░
	getDistance,
	getAngle, getAngleDelta,

	// ████████ ARRAYS: Array Manipulation ████████
	randElem, randIndex,
	makeIntRange,
	makeCycler,
	unique, group,
	getLast, removeFirst, pullElement, pullIndex,
	subGroup, shuffle,

	// ████████ OBJECTS: Manipulation of Simple Key/Val Objects ████████
	remove, replace, partition,
	objClean, objMap, objFindKey, objFilter, objForEach, objCompact,
	objClone, objMerge, objExpand, objFlatten, objNullify,

	// ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████
	getDynamicFunc, withLog,

	// ████████ HTML: Parsing HTML Code, Manipulating DOM Objects ████████
	// ░░░░░░░ GreenSock ░░░░░░░
	gsap, get, set,	getGSAngleDelta,

	getRawCirclePath, drawCirclePath,

	getColorVals, getRGBString, getHEXString, getContrastingColor, getRandomColor,

	getSiblings,

	escapeHTML,

	// ████████ ASYNC: Async Functions, Asynchronous Flow Control ████████
	sleep,

	// ░░░░░░░ SYSTEM: System-Specific Functions (Requires Configuration of System ID in constants.js) ░░░░░░░
	isDocID, loc, getSetting, getTemplatePath,
	getItemsOfType, getActorsOfType, checkUserPermissions

};
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄