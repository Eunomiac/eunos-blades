// /// <reference types="gsap" />

// #region ▮▮▮▮▮▮▮ IMPORTS ▮▮▮▮▮▮▮ ~
import C, {SVGDATA, HbsSvgData} from "./constants";
// eslint-disable-next-line import/no-unresolved
import {gsap, TextPlugin, Flip, MotionPathPlugin} from "gsap/all";
gsap.registerPlugin(MotionPathPlugin);
// #endregion ▮▮▮▮ IMPORTS ▮▮▮▮

// #region ▮▮▮▮▮▮▮ [HELPERS] Internal Functions, Data & References Used by Utility Functions ▮▮▮▮▮▮▮ ~

// _noCapWords -- Patterns matching words that should NOT be capitalized when converting to TITLE case.
const _noCapWords = "a|above|after|an|and|at|below|but|by|down|for|for|from|in|nor|of|off|on|onto|or|out|so|the|to|under|up|with|yet"
  .split("|")
  .map((word) => new RegExp(`\\b${word}\\b`, "gui"));

// _capWords -- Patterns matching words that should ALWAYS be capitalized when converting to SENTENCE case.
const _capWords = [
  "I", /[^a-z]{3,}|[.0-9]/gu
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

// #endregion ▮▮▮▮[HELPERS]▮▮▮▮

// #region ████████ GETTERS: Basic Data Lookup & Retrieval ████████ ~
// @ts-expect-error Leauge of foundry developers is wrong about user not being on game.
const GMID = (): string | false => game?.user?.find((user) => user.isGM)?.id ?? false;
// #endregion ▄▄▄▄▄ GETTERS ▄▄▄▄▄

// #region ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████ ~

const isNumber = (ref: unknown): ref is number => typeof ref === "number" && !isNaN(ref);
const isNumString = (ref: unknown): ref is string => typeof ref === "string"
  && !isNaN(parseFloat(ref))
  && isFinite(parseFloat(ref));
const isBooleanString = (ref: unknown): ref is "true"|"false" => typeof ref === "string"
  && (ref === "true" || ref === "false");
const isArray = (ref: unknown): ref is unknown[] => Array.isArray(ref);
const isSimpleObj = (ref: unknown): ref is Record<key, unknown> => ref === Object(ref) && !isArray(ref);
const isList = <T>(ref: T): ref is Record<key, unknown> & T => ref === Object(ref) && !isArray(ref);
const isFunc = (ref: unknown): ref is typeof Function => typeof ref === "function";
const isInt = (ref: unknown): ref is int => isNumber(ref) && Math.round(ref) === ref;
const isFloat = (ref: unknown): ref is float => isNumber(ref) && /\./.test(`${ref}`);
const isPosInt = (ref: unknown): ref is posInt => isInt(ref) && ref >= 0;
const isIndex = <T>(ref: T): ref is T & Index<ValOf<T>> => isList(ref) || isArray(ref);
const isIterable = (ref: unknown): ref is Iterable<unknown> => typeof ref === "object" && ref !== null && Symbol.iterator in ref;
const isHTMLCode = (ref: unknown): ref is HTMLCode => typeof ref === "string" && /^<.*>$/u.test(ref);
const isHexColor = (ref: unknown): ref is HEXColor => typeof ref === "string" && /^#(([0-9a-fA-F]{2}){3,4}|[0-9a-fA-F]{3,4})$/.test(ref);
const isRGBColor = (ref: unknown): ref is RGBColor => typeof ref === "string" && /^rgba?\((\d{1,3},\s*){1,2}?\d{1,3},\s*\d{1,3}(\.\d+)?\)$/.test(ref);
const isUndefined = (ref: unknown): ref is undefined => ref === undefined;
const isDefined = (ref: unknown): ref is NonNullable<unknown> | null => !isUndefined(ref);
const isEmpty = (ref: Record<key, unknown> | unknown[]): boolean => Object.keys(ref).length === 0;
const hasItems = (ref: Index<unknown>): boolean => !isEmpty(ref);
const isInstance = <T extends new (...args: unknown[]) => unknown>(
  classRef: T,
  ref: unknown
): ref is InstanceType<T> => ref instanceof classRef;
const isNullish = (ref: unknown): ref is null|undefined => isUndefined(ref) || ref === null;
/**
 * Asserts that a given value is of a specified type.
 * Throws an error if the value is not of the expected type.
 *
 * @template T The expected type of the value.
 * @param {unknown} val The value to check.
 * @param {(new(...args: unknown[]) => T) | string} type The expected type of the value.
 * @throws {Error} If the value is not of the expected type.
 */
function assertNonNullType<T>(
  val: unknown,
  type: (new(...args: unknown[]) => T) | string
): asserts val is NonNullable<T> {
  let valStr: string;
  // Attempt to convert the value to a string for error messaging.
  try {
    valStr = JSON.stringify(val);
  } catch{
    valStr = String(val);
  }

  // Check if the value is undefined
  if (val === undefined) {
    throw new Error(`Value ${valStr} is undefined!`);
  }

  // If the type is a string, compare the typeof the value to the type string.
  if (typeof type === "string") {
    // eslint-disable-next-line valid-typeof
    if (typeof val !== type) {
      throw new Error(`Value ${valStr} is not a ${type}!`);
    }
  } else if (!(val instanceof type)) {
    // If the type is a function (constructor), check if the value is an instance of the type.
    throw new Error(`Value ${valStr} is not a ${type.name}!`);
  }
}
/**
 * Checks if two values are "fuzzy" equal, simulating the behavior of the "==" operator.
 * This function does not use the "==" operator directly to comply with linting rules.
 *
 * @param {unknown} val1 The first value to compare.
 * @param {unknown} val2 The second value to compare.
 * @returns {boolean} True if the values are "fuzzy" equal, false otherwise.
 */
const areFuzzyEqual = (val1: unknown, val2: unknown): boolean => {
  // If both values are null or undefined, they are considered equal
  if (
    ([null, undefined] as unknown[]).includes(val1)
    && ([null, undefined] as unknown[]).includes(val2)
  ) { return true; }

  // If only one of the values is null or undefined, they are not equal
  if (
    ([null, undefined] as unknown[]).includes(val1)
    || ([null, undefined] as unknown[]).includes(val2)
  ) { return false; }

  // If both values are numbers, they are considered equal if they are numerically equal
  if (typeof val1 === "number" && typeof val2 === "number") { return val1 === val2; }

  // If both values are booleans, they are considered equal if they are both true or both false
  if (typeof val1 === "boolean" && typeof val2 === "boolean") { return val1 === val2; }

  // If both values are strings, they are considered equal if they are identical
  if (typeof val1 === "string" && typeof val2 === "string") { return val1 === val2; }

  // If one value is a number and the other is a string, they are considered
  //                         equal if the string can be converted to the number
  if (typeof val1 === "number" && typeof val2 === "string") { return val1 === Number(val2); }
  if (typeof val1 === "string" && typeof val2 === "number") { return Number(val1) === val2; }

  // If one value is a boolean and the other is a non-null object, they are not equal
  if (typeof val1 === "boolean" && typeof val2 === "object") { return false; }
  if (typeof val1 === "object" && typeof val2 === "boolean") { return false; }

  // If one value is a boolean and the other is a string, they are considered equal ID:
  //      ... the boolean is true and the string is not empty, or
  //      ... the boolean is false and the string is empty
  if (
    typeof val1 === "boolean"
    && typeof val2 === "string"
  ) { return (val1 && val2 !== "") || (!val1 && val2 === ""); }
  if (
    typeof val1 === "string"
    && typeof val2 === "boolean"
  ) { return (val2 && val1 !== "") || (!val2 && val1 === ""); }

  // If one value is a number or a string and the other is an object, they are not equal
  if ((typeof val1 === "number" || typeof val1 === "string") && typeof val2 === "object") { return false; }
  if (typeof val1 === "object" && (typeof val2 === "number" || typeof val2 === "string")) { return false; }

  // If both values are objects, they are considered equal if they are identical
  if (typeof val1 === "object" && typeof val2 === "object") { return val1 === val2; }

  // If none of the above conditions are met, the values are not equal
  return false;
};

const areEqual = (...refs: unknown[]) => {
  do {
    const ref = refs.pop();
    if (refs.length && !areFuzzyEqual(ref, refs[0])) {
      return false;
    }
  } while (refs.length);
  return true;
};
const pFloat = (ref: unknown, sigDigits?: posInt, isStrict = false): number => {
  if (typeof ref === "string") {
    ref = parseFloat(ref);
  }
  if (typeof ref === "number") {
    if (isNaN(ref)) {return isStrict ? NaN : 0;}
    if (isUndefined(sigDigits)) {return ref;}
    return Math.round(ref * (10 ** sigDigits)) / (10 ** sigDigits);
  }
  return isStrict ? NaN : 0;
};
const pInt = (
  ref: unknown,
  isStrict = false
): number => (isNaN(pFloat(ref, 0, isStrict)) ? NaN : Math.round(pFloat(ref, 0, isStrict)));
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
const getKey = <T>(key: string | number | symbol, obj: Record<string | number | symbol, T>): T | null => {
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
const uCase = <T>(str: T): Uppercase<string & T> => String(str).toUpperCase() as Uppercase<string & T>;
const lCase = <T>(str: T): Lowercase<string & T> => String(str).toLowerCase() as Lowercase<string & T>;
const sCase = <T>(str: T): Capitalize<string & T> => {
  let [first, ...rest] = `${str ?? ""}`.split(/\s+/);
  first = testRegExp(first, _capWords) ? first : `${uCase(first.charAt(0))}${lCase(first.slice(1))}`;
  if (hasItems(rest)) {
    rest = rest.map((word) => (testRegExp(word, _capWords) ? word : lCase(word)));
  }
  return [first, ...rest].join(" ").trim() as Capitalize<string & T>;
};
const tCase = <T>(str: T): tCase<string & T> => String(str).split(/\s/)
  .map((word, i) => (i && testRegExp(word, _noCapWords) ? lCase(word) : sCase(word)))
  .join(" ").trim() as tCase<string & T>;
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
const unhyphenate = (str: StringLike) => `${str}`.replace(/[\u00AD\u200B]/gu, "");
const parseArticles = (str: StringLike) => `${str}`.replace(/\b([aA])\s([aeiouAEIOU])/gu, "$1n $2");
const pluralize = (singular: string, num = 2, plural?: string) => {
  if (pFloat(num) === 1) {return singular;}
  return plural ?? `${singular.replace(/y$/, "ie").replace(/s$/, "se")}s`;
};
const oxfordize = (items: Array<number | string>, useOxfordComma = true, andString = "and") => {
  if (items.length === 0) {return "";}
  if (items.length === 1) {return `${items[0]}`;}
  const lastItem = items.pop();
  return [
    items.join(", "),
    useOxfordComma ? "," : "",
    ` ${andString} `,
    lastItem
  ].join("");
};
const ellipsize = (text: unknown, maxLength: number): string => {
  const str = String(text);
  return str.length > maxLength ? `${str.slice(0, maxLength - 3)}…` : str;
};
const pad = (text: unknown, minLength: posInt, delim = " "): string => {
  const str = `${text}`;
  if (str.length < minLength) {
    return `${delim.repeat(minLength - str.length)}${str}`;
  }
  return str;
};
const toKey = (text: string): string => (text ?? "").toLowerCase().replace(/ /g, "-").replace(/default/, "DEFAULT");
// #region ========== Numbers: Formatting Numbers Into Strings =========== ~
const signNum = (num: int, delim = "", zeroSign = "+") => {
  let sign;
  const parsedNum = pFloat(num);
  if (parsedNum < 0) {
    sign = "-";
  } else if (parsedNum === 0) {
    sign = zeroSign;
  } else {
    sign = "+";
  }
  return `${sign}${delim}${Math.abs(parsedNum)}`;
};
const padNum = (num: number, numDecDigits: int, includePlus = false) => {
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
  if (pFloat(num) === 0) {return "0";}
  const stringyNum = lCase(num).replace(/[^\d.e+-]/g, "");
  const base = regExtract(stringyNum, /^-?[\d.]+/) as string | undefined;
  const exp = pInt(regExtract(stringyNum, /e([+-]?\d+)$/) as string | undefined);
  if (typeof base === "string" && typeof exp === "string") {
    let baseInts = regExtract(base, /^-?(\d+)/);
    let baseDecs = regExtract(base, /\.(\d+)/);
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
    if (pInt(trio) === 0) {return "";}
    const digits = `${trio}`.split("").map((digit) => pInt(digit));
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
      const tens = _numberWords.tens[pInt(digits.shift())];
      const ones = pInt(digits[0]) > 0 ? `-${_numberWords.ones[pInt(digits[0])]}` : "";
      result += `${tens}${ones}`;
    }
    return result;
  };
  const numWords = [];
  if (num.charAt(0) === "-") {
    numWords.push("negative");
  }
  const [integers, decimals] = num.replace(/[,\s-]/g, "").split(".");
  const intArray = [...integers.split("")].reverse().join("")
    .match(/.{1,3}/g)
    ?.map((v) => [...v.split("")].reverse().join("")) ?? [];
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
    const [numText, suffix]: RegExpMatchArray = lCase(verbalizeNum(num)).match(/.*?[-\s]?(\w*)$/i) ?? ["", ""];
    return numText.replace(
      new RegExp(`${suffix}$`),
      suffix in _ordinals ? _ordinals[suffix as KeyOf<typeof _ordinals>] : `${suffix}th`
    );
  }
  if (/(\.)|(1[1-3]$)/.test(`${num}`)) {
    return `${num}th`;
  }
  return `${num}${["th", "st", "nd", "rd", "th", "th", "th", "th", "th", "th"][
    pInt(`${num}`.charAt(`${num}`.length - 1))
  ]
  }`;
};
const romanizeNum = (num: number, isUsingGroupedChars = true) => {
  if (isFloat(num)) {throw new Error(`Error: Can't Romanize Floats (${num})`);}
  if (num >= 400000) {throw new Error(`Error: Can't Romanize >= 400,000 (${num})`);}
  if (num < 0) {throw new Error(`Error: Can't Romanize Negative Numbers (${num})`);}
  if (num === 0) {return "0";}
  const romanRef = _romanNumerals[isUsingGroupedChars ? "grouped" : "ungrouped"];
  const romanNum = [...stringifyNum(num).split("")]
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
const randString = (length = 5) => Array.from({length})
  .map(() => String.fromCharCode(randInt(...["a", "z"].map((char) => char.charCodeAt(0)) as [number, number])))
  .join("");
const randWord = (numWords = 1, wordList = _randomWords) => Array.from({length: numWords}).map(() => randElem([...wordList])).join(" ");
const getUID = (id: string): string => {
  const indexNum = Math.max(
    0,
    ...UUIDLOG.filter(([genericID]) => genericID.startsWith(id)).map(([, , num]) => num)
  ) + 1;
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
  const [str1, str2] = [val1, val2].map((val) => lCase(String(val).replace(/[^a-zA-Z0-9.+-]/g, "").trim()));
  return str1.length > 0 && str1 === str2;
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
      return Array.from(haystack);
    } catch{
      throw new Error(`Haystack type must be [list, array], not ${typeof haystack}: ${JSON.stringify(haystack)}`);
    }
  })();
  if (!isArray(searchStack)) {return false;}

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
const sum = (...nums: Array<number | number[]>) => Object.values(nums.flat()).reduce((num, tot) => tot + num, 0);
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
const getAngleDelta = (
  angleStart: number,
  angleEnd: number,
  range: [number, number] = [0, 360]
) => cycleAngle(angleEnd - angleStart, range);
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
  return (function*() {
    while (true) {
      index++;
      yield wrapper(index);
    }
  })();
};

/**
 * Returns the last element of an array, or the last value of an object literal.
 *
 * @param {Index<Type>} array An array or object literal
 * @returns {Type|undefined} The last element, or undefined if empty.
 */
function getLast<Type>(array: Index<Type>): Type | undefined {
  array = Object.values(array);
  return array.length === 0 ? undefined : array[array.length - 1];
}
// Const getLast = <Type>(array: Type[]): typeof array extends [] ? undefined : Type => ;
const unique = <Type>(array: Type[]): Type[] => {
  const returnArray: Type[] = [];
  array.forEach((item) => {if (!returnArray.includes(item)) {returnArray.push(item);} });
  return returnArray;
};
const group = <Type extends Record<string, unknown>>(
  array: Type[],
  key: KeyOf<Type>
): Partial<Record<string & ValOf<Type>, Type[]>> => {
  const returnObj: Partial<Record<string & ValOf<Type>, Type[]>> = {};
  array.forEach((item) => {
    const returnKey = item[key] as string & ValOf<Type>;
    let returnVal = returnObj[returnKey];
    if (!returnVal) {
      returnVal = [];
      returnObj[returnKey] = returnVal;
    }
    returnVal.push(item);
  });
  return returnObj;
};
const sample = <Type>(
  array: Type[],
  numElems = 1,
  isUniqueOnly = true,
  uniqueTestFunc: (e: Type, a: Type[]) => boolean = (e, a) => !a.includes(e)
): Type[] => {
  const elems: Type[] = [];
  let overloadCounter = 0;
  while (elems.length < numElems && overloadCounter < 1_000_000) {
    const randomElem = randElem(array);
    if (isUniqueOnly && uniqueTestFunc(randomElem, elems)) {
      elems.push(randomElem);
    }
    overloadCounter++;
  }
  return elems;
};
const removeFirst = (array: unknown[], element: unknown) => array.splice(array.findIndex((v) => v === element));


/**
 * This function removes and returns the first element in an array that equals the provided value
 *   or satisfies the provided testing function.
 * If no elements satisfy the testing function, the function will return undefined.
 *
 * @param {T[]} array The array to be searched.
 * @param {(T|((_v: T, _i?: number, _a?: T[]) => boolean))} checkFunc The testing function or value to be searched for.
 * @returns {T | undefined} The first element in the array that passes the test.
 *                          If no elements pass the test, return undefined.
 */
function pullElement<T>(array: T[], checkFunc: T|((_v: T, _i?: number, _a?: T[]) => boolean)): T | undefined {
  // Define the test function
  let testFunction: (_v: T, _i?: number, _a?: T[]) => boolean;

  // If checkFunc is not a function, create a function that checks for equality with checkFunc
  if (typeof checkFunc !== "function") {
    testFunction = (_v: T) => _v === checkFunc;
  } else {
    testFunction = checkFunc as ((_v: T, _i?: number, _a?: T[]) => boolean);
  }

  // Find the index of the first element that passes the test
  const index = array.findIndex((v, i, a) => testFunction(v, i, a));

  // If no element passes the test, return undefined
  if (index === -1) {return undefined;}

  // Remove the element from the array and return it
  return array.splice(index, 1).pop();
}

const pullIndex = (array: unknown[], index: posInt) => pullElement(array, (_: unknown, i: number) => i === index);
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
  return subArrays;
};
const shuffle = (array: unknown[]) => {
  let currentIndex = array.length; let randomIndex;

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

const checkVal = ({k, v}: {k?: unknown, v?: unknown}, checkTest: checkTest) => {
  if (typeof checkTest === "function") {
    if (isDefined(v)) {return checkTest(v, k);}
    return checkTest(k);
  }
  if (typeof checkTest === "number") {
    checkTest = `${checkTest}`;
  }
  return (new RegExp(checkTest)).test(`${v}`);
};
/**
 * Given an array or list and a search function, will remove the first matching element and return it.
 * @param {Index<unknown>} obj The array or list to be searched.
 * @param {testFunc<keyFunc | valFunc> | number | string} checkTest The search function.
 * @returns {unknown | false} - The removed element or false if no element was found.
 */
const remove = (obj: Index<unknown>, checkTest: testFunc<keyFunc | valFunc> | number | string) => {
  if (isArray(obj)) {
    const index = obj.findIndex((v) => checkVal({v}, checkTest));
    if (index >= 0) {
      return removeElementFromArray(obj, index);
    }
  } else if (isList(obj)) {
    const [remKey] = Object.entries(obj).find(([k, v]) => checkVal({k, v}, checkTest)) ?? [];
    if (remKey) {
      return removeElementFromList(obj, remKey);
    }
  }
  return false;
};

/**
 * Removes an element from an array at a given index and returns it.
 * @param {unknown[]} array The array to remove the element from.
 * @param {number} index The index of the element to remove.
 * @returns {unknown} - The removed element.
 */
const removeElementFromArray = (array: unknown[], index: number) => {
  let remVal;
  for (let i = 0; i <= array.length; i++) {
    if (i === index) {
      remVal = array.shift();
    } else {
      array.push(array.shift());
    }
  }
  return remVal;
};

/**
 * Removes an element from a list at a given key and returns it.
 * @param {List<unknown>} list The list to remove the element from.
 * @param {string} key The key of the element to remove.
 * @returns {unknown} - The removed element.
 */
const removeElementFromList = (list: List<unknown>, key: string) => {
  const remVal = list[key];
  delete list[key];
  return remVal;
};
const replace = (obj: Index<unknown>, checkTest: checkTest, repVal: unknown) => {
  // As remove, except instead replaces the element with the provided value.
  // Returns true/false to indicate whether the replace action succeeded.
  let repKey;
  if (isList(obj)) {
    [repKey] = Object.entries(obj).find((v) => checkVal({v}, checkTest)) || [false];
    if (repKey === false) {return false;}
  } else if (isArray(obj)) {
    repKey = obj.findIndex((v) => checkVal({v}, checkTest));
    if (repKey === -1) {return false;}
  }
  if (typeof repKey !== "number") {
    repKey = `${repKey}`;
  }
  if (typeof repVal === "function") {
    // @ts-expect-error Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
    obj[repKey] = repVal(obj[repKey], repKey);
  } else {
    // @ts-expect-error Need to figure out how to properly define testFunc<keyFunc | valFunc> (keyFunc/valFunc types?)
    obj[repKey] = repVal;
  }
  return true;
};
/**
 * Cleans an object or value by removing specified values recursively.
 *
 * @template T - The type of the input object or value.
 * @param {T} data The object or value to be cleaned.
 * @param {Array<any>} [remVals] An array of values to be removed during the cleaning process.
 * @returns {T | Partial<T> | "KILL"} - The cleaned version of the input object or value.
 *                                      If marked for removal, returns "KILL".
 */
const objClean = <T>(data: T, remVals: UncleanValues[] = [undefined, null, "", {}, []]): T | Partial<T> | "KILL" => {
  const remStrings = remVals.map((rVal) => JSON.stringify(rVal));
  if (remStrings.includes(JSON.stringify(data)) || remVals.includes(data as ValOf<typeof remVals>)) {return "KILL";}
  if (Array.isArray(data)) {
    const newData = data.map((elem) => objClean(elem, remVals))
      .filter((elem) => elem !== "KILL") as T;
    return Array.isArray(newData) && newData.length ? newData : "KILL";
  }
  if (data && typeof data === "object" && JSON.stringify(data).startsWith("{")) {
    const newData = Object.entries(data)
      .map(([key, val]) => [key, objClean(val, remVals)])
      .filter(([, val]) => val !== "KILL");
    return newData.length ? Object.fromEntries(newData) : "KILL";
  }
  return data;
};

// Given an object and a predicate function, returns array of two objects:
//   one with entries that pass, one with entries that fail.
const partition = <Type>(obj: Type[], predicate: testFunc<valFunc> = () => true): [Type[], Type[]] => [
  objFilter(obj, predicate),
  objFilter(obj, (v: unknown, k: string | number | undefined) => !predicate(v, k))
];

/**
 * Zips two arrays into an object.
 *
 * @template T - The type of the keys.
 * @template U - The type of the values.
 * @param {T[]} keys - The array of keys.
 * @param {U[]} values - The array of values.
 * @returns {Record<T, U>} - The resulting object.
 * @throws {Error} - Throws an error if the arrays are not of equal length, if the keys are not unique, or if the keys are not of a type that can be used as object keys.
 */
const zip = <T extends string | number | symbol, U>(keys: T[], values: U[]): Record<T, U> => {
  // Check that the arrays are of equal length
  if (keys.length !== values.length) {
    throw new Error("The arrays must be of equal length.");
  }

  // Check that the keys are unique
  if (new Set(keys).size !== keys.length) {
    throw new Error("The keys must be unique.");
  }

  // Zip the arrays into an object
  const result = {} as Record<T, U>;
  keys.forEach((key, i) => {
    result[key] = values[i];
  });

  return result;
};

/**
 *  An object-equivalent Array.map() function, which accepts mapping functions to transform both keys and values.
 *  If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
 * @param {Index<unknown>} obj
 * @param {mapFunc<keyFunc|valFunc>|false} keyFunc
 * @param {mapFunc<valFunc>} [valFunc]
 */
function objMap<T extends Record<PropertyKey, unknown>|unknown[]>(
  obj: Index<unknown>,
  keyFunc: mapFunc<keyFunc> | mapFunc<valFunc> | false,
  valFunc?: mapFunc<valFunc>
): T {
  //
  let valFuncTyped: mapFunc<valFunc> | undefined = valFunc;
  let keyFuncTyped: mapFunc<keyFunc> | false = keyFunc;

  if (!valFuncTyped) {
    valFuncTyped = keyFunc as mapFunc<valFunc>;
    keyFuncTyped = false;
  }
  if (!keyFuncTyped) {
    keyFuncTyped = ((k: unknown) => k) as mapFunc<keyFunc>;
  }

  if (isArray(obj)) {return obj.map(valFuncTyped) as T;}

  return Object.fromEntries(Object.entries(obj).map(([key, val]) => {
    assertNonNullType(valFuncTyped, "function");
    return [(keyFuncTyped as mapFunc<keyFunc>)(key, val), valFuncTyped(val, key)];
  }));
}
const objSize = (obj: Index<unknown>) => Object.values(obj).filter((val) => val !== undefined && val !== null).length;


/**
 * This function is an object-equivalent of Array.findIndex() function.
 * It accepts check functions for both keys and/or values.
 * If only one function is provided, it's assumed to be searching via values and will receive (v, k) args.
 *
 * @param {Type} obj The object to be searched.
 * @param {testFunc<keyFunc> | testFunc<valFunc> | false} keyFunc The testing function for keys.
 * @param {testFunc<valFunc>} valFunc The testing function for values.
 * @returns {KeyOf<Type> | false} The key of the first entry that passes the test.
 *                                If no entries pass the test, return false.
 */
function objFindKey<Type extends Index<unknown>>(
  obj: Type,
  keyFunc: testFunc<keyFunc> | testFunc<valFunc> | false,
  valFunc?: testFunc<valFunc>
): KeyOf<Type> | false {
  // If valFunc is not provided, assume keyFunc is meant to be valFunc
  if (!valFunc) {
    valFunc = keyFunc as testFunc<valFunc>;
    keyFunc = false;
  }
  // If keyFunc is not provided, create a function that returns the key
  if (!keyFunc) {
    keyFunc = ((k: unknown) => k) as testFunc<keyFunc>;
  }
  // If obj is an array, find the index of the first element that passes the test
  if (isArray(obj)) {return obj.findIndex(valFunc);}
  // Define the testing functions for keys and values
  const kFunc = keyFunc || (() => true);
  const vFunc = valFunc || (() => true);
  // Find the first entry that passes the test
  const validEntry = Object.entries(obj).find(([k, v]) => kFunc(k, v) && vFunc(v, k));
  // If an entry passes the test, return its key
  if (validEntry) {
    return validEntry[0] as KeyOf<Type>;
  }
  // If no entries pass the test, return false
  return false;
}

/**
 * An object-equivalent Array.filter() function, which accepts filter functions for both keys and/or values.
 * If only one function is provided, it's assumed to be mapping the values and will receive (v, k) args.
 *
 * @param {Type} obj The object to be searched.
 * @param {testFunc<keyFunc> | testFunc<valFunc> | false} keyFunc The testing function for keys.
 * @param {testFunc<valFunc>} [valFunc] The testing function for values.
 * @returns {Type} The filtered object.
 */
const objFilter = <Type extends Index<unknown>>(
  obj: Type,
  keyFunc: testFunc<keyFunc> | testFunc<valFunc> | false,
  valFunc?: testFunc<valFunc>,
  isMutating = false
): Type => {
  //
  if (!valFunc) {
    valFunc = keyFunc as testFunc<valFunc>;
    keyFunc = false;
  }
  if (!keyFunc) {
    keyFunc = ((k: unknown) => k) as testFunc<keyFunc>;
  }
  if (isArray(obj)) {
    const keptValues = obj.filter(valFunc);
    if (isMutating) {
      obj.splice(0, obj.length, ...keptValues);
      return obj;
    }
    return keptValues as Type;
  }

  const kFunc = keyFunc || (() => true);
  const vFunc = valFunc || (() => true);
  if (isMutating) {
    const entriesToRemove = Object.entries(obj)
      .filter(([key, val]: [string, unknown]) => !(kFunc(key, val) && vFunc(val, key)));
    for (const [key] of entriesToRemove) {
      delete obj[key];
    }
    return obj;
  }
  return Object.fromEntries(
    Object.entries(obj)
      .filter(([key, val]: [string, unknown]) => kFunc(key, val) && vFunc(val, key))
  ) as Type;
};
const objForEach = (obj: Index<unknown>, func: valFunc): void => {
  // An object-equivalent Array.forEach() function, which accepts one function(val, key) to perform for each member.
  if (isArray(obj)) {
    obj.forEach(func);
  } else {
    Object.entries(obj).forEach(([key, val]) => func(val, key));
  }
};
// Prunes an object of given set of values, [undefined, null] default
const objCompact = <Type extends (Index<unknown>)>(
  obj: Type,
  removeWhiteList: unknown[] = [undefined, null],
  isMutating = false
): Type => objFilter(obj, (val: unknown) => !removeWhiteList.includes(val), undefined, isMutating);

const objClone = <T>(obj: T, isStrictlySafe = false): T => {
  const cloneArray = <aT extends unknown[]>(arr: aT): aT => [...arr] as aT;
  const cloneObject = <oT>(o: oT): oT => ({...o});
  try {
    return JSON.parse(JSON.stringify(obj));
  } catch(err) {
    if (isStrictlySafe) {throw err;}
    if (Array.isArray(obj)) {return cloneArray(obj as T extends unknown[] ? T : never);}
    if (typeof obj === "object") {return cloneObject(obj);}
  }
  return obj;
};
/**
 * Returns a deep merge of source into target. Does not mutate target unless isMutatingOk = true.
 * @param {Tx} target The target object to be merged.
 * @param {Ty} source The source object to be merged.
 * @param {object} options An object containing various options for the merge operation.
 * @param {boolean} options.isMutatingOk
 * @param {boolean} options.isStrictlySafe
 * @param {boolean} options.isConcatenatingArrays
 * @param {boolean} options.isReplacingArrays
 * @returns {Tx & Ty} - The merged object.
 */
function objMerge<Tx, Ty>(
  target: Tx,
  source: Ty,
  {
    isMutatingOk = false,
    isStrictlySafe = false,
    isConcatenatingArrays = true,
    isReplacingArrays = false
  } = {}
): Tx & Ty {
  // Clone the target if mutation is not allowed
  target = isMutatingOk ? target : objClone(target, isStrictlySafe);

  // If source is an instance of  or target is undefined, return source
  if ((source && typeof source === "object" && "id" in source && isDocID(source.id)) || isUndefined(target)) {
    return source as unknown as Tx & Ty;
  }

  // If source is undefined, return target
  if (isUndefined(source)) {
    return target as Tx & Ty;
  }

  // If source is not an index, return target
  if (!isIndex(source)) {
    return target as Tx & Ty;
  }

  // Iterate over each entry in the source object
  for (const [key, val] of Object.entries(source)) {
    const targetVal = target[key as KeyOf<typeof target>];

    // If replacing arrays is enabled and both target and source values are
    // arrays, replace target value with source value
    if (isReplacingArrays && isArray(targetVal) && isArray(val)) {
      target[key as KeyOf<typeof target>] = val as Tx[KeyOf<Tx>];
    } else if (isConcatenatingArrays && isArray(targetVal) && isArray(val)) {

      // If concatenating arrays is enabled and both target and source values
      // are arrays, concatenate source value to target value
      (target[key as KeyOf<typeof target>] as unknown[]).push(...val);
    } else if (val !== null && typeof val === "object") {
    // If source value is an object and not null, merge it into target value
      if (isUndefined(targetVal) && !(val instanceof Application)) {
        target[key as KeyOf<typeof target>] = new (Object.getPrototypeOf(val).constructor)();
      }
      target[key as KeyOf<typeof target>] = objMerge(
        target[key as KeyOf<typeof target>],
        val,
        {isMutatingOk: true, isStrictlySafe}
      );
    } else {
    // For all other cases, assign source value to target
      target[key as KeyOf<typeof target>] = val as Tx[KeyOf<Tx>];
    }
  }

  // Return the merged target
  return target as Tx & Ty;
}
/**
 * Deep-compares two objects and returns an object containing only the keys and values
 * in the second object that differ from the first.
 * If the second object is missing a key or value contained in the first, it sets the
 * value in the returned object to null, and prefixes the key with "-=".
 * @param {Tx} obj1 The first object to be compared.
 * @param {Ty} obj2 The second object to be compared.
 * @returns {Record<string, unknown>} - An object containing the differences between the two input objects.
 */
function objDiff<
  Tx extends Record<string, unknown>,
  Ty extends Record<string, unknown>
>(obj1: Tx, obj2: Ty): Record<string, unknown> {
  const diff: Record<string, unknown> = {};
  const bothObj1AndObj2Keys = Object.keys(obj2).filter((key) => Object.hasOwn(obj2, key) && Object.hasOwn(obj1, key));
  const onlyObj2Keys = Object.keys(obj2).filter((key) => Object.hasOwn(obj2, key) && !Object.hasOwn(obj1, key));

  for (const key of bothObj1AndObj2Keys) {
    // If both values are non-array objects, recursively compare them
    if (typeof obj1[key] === "object" && typeof obj2[key] === "object" && !Array.isArray(obj1[key]) && !Array.isArray(obj2[key])) {
      const nestedDiff = objDiff(obj1[key] as Record<string, unknown>, obj2[key] as Record<string, unknown>);
      if (Object.keys(nestedDiff).length > 0) {
        diff[key] = nestedDiff;
      }
    } else if (Array.isArray(obj1[key]) && Array.isArray(obj2[key])) {
      const array1 = obj1[key] as unknown[];
      const array2 = obj2[key] as unknown[];
      if (array1.toString() !== array2.toString()) {
        // If both values are arrays and they are not equal, add the second array to the diff
        diff[key] = obj2[key];
      }
    } else if (obj1[key] !== obj2[key]) {
      // If the values are not equal, add the second value to the diff
      diff[key] = obj2[key];
    }
  }

  for (const key of onlyObj2Keys) {
    // If the second object has a key that the first does not, add it to the diff with a "-=" prefix
    diff[`-=${key}`] = obj2[key];
  }
  return diff;
}

const objExpand = <T>(obj: List<T>): List<T> => {
  const expObj = {};
  for (const [key, val] of Object.entries(obj)) {
    if (isList(val)) {
      const expandedVal = objExpand(val) as T;
      setProperty(expObj, key, expandedVal);
    } else {
      setProperty(expObj, key, val);
    }
  }
  // Iterate through expanded Object, converting object literals to arrays where it makes sense
  /**
   *
   * @param o
   */
  function arrayify<X>(o: Index<X> | X): Index<X> | X {
    if (isList(o)) {
      if (/^\d+$/.test(Object.keys(o).join(""))) {
        return Object.values(o).map(arrayify) as X[];
      }
      return objMap(o, (v: unknown): unknown => arrayify(v)) as List<X>;
    }
    if (isArray(o)) {
      return o.map(arrayify) as X[];
    }
    return o;
  }

  return arrayify(expObj) as List<T>;
};
const objFlatten = <ST>(obj: Index<ST>): Record<string, ST> => {
  const flatObj: Record<string, ST> = {};
  for (const [key, val] of Object.entries(obj)) {
    if ((isArray(val) || isList(val)) && hasItems(val)) {
      for (const [subKey, subVal] of Object.entries(objFlatten(val)) as Array<[string, ST]>) {
        flatObj[`${key}.${subKey}`] = subVal;
      }
    } else {
      flatObj[key] = val;
    }
  }
  return flatObj;
};

/**
 * This function nullifies all properties of an object or elements of an array.
 * If the input is not an object or an array, it returns the input as is.
 * @param {T} obj The object or array to be nullified.
 * @returns {Record<KeyOf<T>, null> | null[] | T} - The nullified object or array, or the input as is.
 */
function objNullify<T extends List<unknown>>(obj: T & Record<KeyOf<T>, null>): Record<KeyOf<T>, null>
function objNullify<T extends unknown[]>(obj: T & null[]): null[]
/**
 *
 * @param obj
 */
function objNullify<T>(obj: T): Record<KeyOf<T>, null> | null[] | T {
  // Check if the input is an object or an array
  if (!isIndex(obj)) {return obj;}

  // If the input is an array, nullify all its elements
  if (Array.isArray(obj)) {
    obj.forEach((_, i) => {
      obj[i] = null as ValOf<T>;
    });
    return obj as null[];
  }

  // If the input is an object, nullify all its properties
  Object.keys(obj).forEach((objKey) => {
    (obj as Record<KeyOf<T>, null>)[objKey as KeyOf<T>] = null;
  });

  return obj;
}

/**
 * This function freezes the properties of an object based on a provided schema or keys.
 * If a property is missing, it throws an error.
 * @param {Partial<T>} data The object whose properties are to be frozen.
 * @param {...Array<keyof T> | [T]} keysOrSchema The keys or schema to freeze the properties.
 * @returns {T} - The object with frozen properties.
 * @throws {Error} - Throws an error if a property is missing.
 */
function objFreezeProps<T>(data: Partial<T>, ...keysOrSchema: Array<keyof T> | [T]): T {
  const firstArg = keysOrSchema[0];

  // If the first argument is an object and not an array, treat it as a schema
  if (firstArg instanceof Object && !Array.isArray(firstArg)) {
    const schema = firstArg as T;
    for (const key in schema) {
      if (data[key as keyof T] === undefined) {
        throw new Error(`Missing value for ${key}`);
      }
    }
  } else {
    // If the first argument is not an object or is an array, treat it as an array of keys
    for (const key of keysOrSchema as Array<keyof T>) {
      if (data[key] === undefined) {
        throw new Error(`Missing value for ${String(key)}`);
      }
    }
  }

  // Return the data as type T
  return data as T;
}
// #endregion ▄▄▄▄▄ OBJECTS ▄▄▄▄▄

// #region ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████ ~
const getDynamicFunc = (funcName: string, func: (...args: unknown[]) => unknown, context: object) => {
  if (typeof func === "function") {
    const dFunc = {[funcName](...args: unknown[]) {return func(...args);}}[funcName];
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

const changeContainer = (elem: HTMLElement, container: HTMLElement) => {
  // Get the element's current container, which defines its current coordinate space.
  const curContainer = $(elem).parent()[0];
  // Get the element's current position in its current coordinate space.
  const curPosition: gsap.Point2D = {
    x: gsap.getProperty(elem, "x") as number,
    y: gsap.getProperty(elem, "y") as number
  };
  // Convert the element's position in its current space, to the equivalent position in the target space.
  const relPos = MotionPathPlugin.convertCoordinates(
    curContainer,
    container,
    curPosition
  );
  eLog.checkLog3("changeContainer", "Target Element", {elem, container, curContainer, curPosition, relPos});
  // Append the element to the new container, and set its new position
  $(elem).appendTo($(container));
  gsap.set(elem, relPos);
};


const getSvgCode = (svgDotKey: string, svgPathKeys?: string|string[]) => {
  const svgData = getProperty(SVGDATA, svgDotKey) as HbsSvgData|undefined;
  // eLog.checkLog3("compileSvg", {svgDotKey, svgPaths, svgData});
  if (!svgData) { return ""; }
  const {viewBox, paths, classes} = svgData;
  svgPathKeys ??= Object.keys(paths).join("|");
  if (typeof svgPathKeys === "string") {
    svgPathKeys = svgPathKeys.split("|");
  }
  return [
    `<svg viewBox="${viewBox}">`,
    ...svgPathKeys
      .map((path) => `<path class="${path} ${classes?.[path] ?? ""}" d="${paths[path] ?? ""}" />`),
    "</svg>"
  ].join("\n");
};

const getSvgPaths = (svgDotKey: string, svgPathKeys?: string|string[]): Record<string, {class: string, d: string}> => {
  const svgData = getProperty(SVGDATA, svgDotKey) as HbsSvgData|undefined;
  if (!svgData) { return {}; }
  const {paths, classes} = svgData;
  svgPathKeys ??= Object.keys(paths);
  if (typeof svgPathKeys === "string") {
    svgPathKeys = svgPathKeys.split("|");
  }

  const returnData: Record<string, {class: string, d: string}> = {};

  for (const pathKey of svgPathKeys) {
    returnData[pathKey] = {
      class: classes?.[pathKey] ?? "",
      d: paths[pathKey] ?? ""
    };
  }

  return returnData;
};

// #region ░░░░░░░[GreenSock]░░░░ Wrappers for GreenSock Functions ░░░░░░░ ~
const set = (targets: gsap.TweenTarget, vars: gsap.TweenVars): gsap.core.Tween => gsap.set(targets, vars);
function get(target: gsap.TweenTarget, property: keyof gsap.CSSProperties & string, unit: string): number;
function get(target: gsap.TweenTarget, property: keyof gsap.CSSProperties & string): string | number;
/**
 *
 * @param target
 * @param property
 * @param unit
 */
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

// const Animate = {
//   Timeline: {
//     to: (tl: gsap.core.Timeline, targets: gsap.TweenTarget[], vars: gsap.TweenVars, position: any) => {
//       if (targets.length === 0) {

//       }
//     }
//   } (tl: gsap.core.Timeline, )
// }

// const to = (targets: gsap.TweenTarget[], vars: gsap.TweenVars): gsap.core.Tween => {
//   gsap.
// }
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
    if (i % 6 === 0) {path.push("c");}
    path.push(coord);
  });
  path.push("z");
  return path.join(" ");
};
// #endregion ░░░░[SVG]░░░░

// #region ░░░░░░░[Colors]░░░░ Color Manipulation ░░░░░░░ ~
const getColorVals = (
  red?: string | number | number[],
  green?: number,
  blue?: number,
  alpha?: number
): number[] | null => {
  if (isRGBColor(red)) {
    [red, green, blue, alpha] = red
      .replace(/[^\d.,]/g, "")
      .split(/,/)
      .map((color) => (isUndefined(color) ? undefined : parseFloat(color)));
  }
  if (isHexColor(red)) {
    if ([4, 5].includes(red.length)) {
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
    return hex.length === 1 ? `0${hex}` : hex;
  }
  if (isHexColor(red)) {return red;}
  if (isRGBColor(red)) {
    [red, green, blue] = getColorVals(red) ?? [];
  }
  if (isDefined(red) && isDefined(green) && isDefined(blue) && [red, green, blue].every((color) => /^[.\d]+$/.test(`${color}`))) {
    return `#${componentToHex(red ?? 0)}${componentToHex(green ?? 0)}${componentToHex(blue ?? 0)}`;
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
const getRandomColor = () => getRGBString(
  gsap.utils.random(0, 255, 1),
  gsap.utils.random(0, 255, 1),
  gsap.utils.random(0, 255, 1)
) as RGBColor;
// #endregion ░░░░[Colors]░░░░

// #region ░░░░░░░[DOM]░░░░ DOM Manipulation ░░░░░░░ ~
const getSiblings = (elem: Node) => {
  const siblings: HTMLElement[] = [];
  // If no parent, return no sibling
  if (!elem.parentNode) {return siblings;}

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
    .replace(/[`']/g, "&#039;") as T
  : str);

// #endregion ▄▄▄▄▄ HTML ▄▄▄▄▄

// #region ████████ ASYNC: Async Functions, Asynchronous Flow Control ████████ ~
const sleep = (duration: number): Promise<void> => new Promise(
  (resolve) => {
    setTimeout(resolve, duration >= 100 ? duration : duration * 1000);
  }
);
// #endregion ▄▄▄▄▄ ASYNC ▄▄▄▄▄

const EventHandlers = {
  onTextInputBlur: async (inst: BladesSheet, event: InputChangeEvent) => {
    const elem = event.target;
    const {action, target, flagTarget} = elem.dataset;
    if (!action) {
      throw new Error("Input text elements require a data-action attribute.");
    }
    if (!target && !flagTarget) {
      throw new Error("Input text elements require a 'data-target' or 'data-flag-target' attribute.");
    }
    if (target) {
      await inst.document.update({[target]: elem.value});
    } else if (flagTarget) {
      if (elem.value === "") {
        await inst.document.unsetFlag(C.SYSTEM_ID, flagTarget);
      } else {
        await inst.document.setFlag(C.SYSTEM_ID, flagTarget, elem.value);
      }
    }
  },
  onSelectChange: async (inst: BladesSheet, event: SelectChangeEvent) => {
    const elem = event.currentTarget;
    const {action, dtype, target, flagTarget} = elem.dataset;

    if (!action) {
      throw new Error("Select elements require a data-action attribute.");
    }
    if (!target && !flagTarget) {
      throw new Error("Select elements require a 'data-target' or 'data-flag-target' attribute.");
    }
    const dataType = lCase(dtype);
    let value;
    switch (dataType) {
      case "number": value = pFloat(elem.value); break;
      case "boolean": value = lCase(`${elem.value}`) === "true"; break;
      case "string": value = `${elem.value}`; break;
      default: {
        if (isNumString(value)) {
          throw new Error("You must set 'data-dtype=\"Number\"' for <select> elements with number values.");
        }
        if (isBooleanString(value)) {
          throw new Error("You must set 'data-dtype=\"Boolean\"' for <select> elements with boolean values.");
        }
        value = `${elem.value}`;
        break;
      }
    }
    if (target) {
      await inst.document.update({[target]: value});
    } else if (flagTarget) {
      if (elem.value === "") {
        await inst.document.unsetFlag(C.SYSTEM_ID, flagTarget);
      } else {
        await inst.document.setFlag(C.SYSTEM_ID, flagTarget, value);
      }
    }
  }
};

// #region ████████ FOUNDRY: Requires Configuration of System ID in constants.ts ████████ ~

const isDocID = (docRef: unknown, isUUIDok = true): docRef is IDString => {
  return typeof docRef === "string" && (isUUIDok
    ? /^(.*\.)?[A-Za-z0-9]{16}$/.test(docRef)
    : /^[A-Za-z0-9]{16}$/.test(docRef));
};

const loc = (locRef: string, formatDict: Record<string, string> = {}) => {
  if (/[a-z]/.test(locRef)) { // Reference contains lower-case characters: add system ID namespacing to dot notation
    locRef = locRef.replace(new RegExp(`^(${C.SYSTEM_ID}.)*`), `${C.SYSTEM_ID}.`);
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
/**
 *
 * @param subFolder
 * @param fileName
 */
function getTemplatePath(subFolder: string, fileName: string | string[]) {
  if (typeof fileName === "string") {
    return `${C.TEMPLATE_ROOT}/${subFolder}/${fileName.replace(/\..*$/, "")}.hbs`;
  }
  return fileName.map((fName) => getTemplatePath(subFolder, fName));
}

// DisplayImageSelector: Displays a file selector in tiles mode at the indicated path root.
/**
 *
 * @param callback
 * @param pathRoot
 * @param position
 * @param position.top
 * @param position.left
 */
function displayImageSelector(
  callback: (path: string) => Promise<unknown>,
  pathRoot = `systems/${C.SYSTEM_ID}/assets`,
  position: {top: number | null, left: number | null} = {top: 200, left: 200}
) {
  const fp = new FilePicker({
    type: "image",
    activeSource: "public",
    displayMode: "tiles",
    callback,
    top: position.top ?? 200 + 40,
    left: position.left ?? 200 + 10
  });
  return fp.browse(pathRoot);
}

// #endregion ▄▄▄▄▄ FOUNDRY ▄▄▄▄▄

export default {
  // ████████ GETTERS: Basic Data Lookup & Retrieval ████████
  GMID, getUID,

  // ████████ TYPES: Type Checking, Validation, Conversion, Casting ████████
  isNumber, isNumString, isBooleanString, isSimpleObj, isList, isArray, isFunc, isInt, isFloat, isPosInt, isIterable,
  isHTMLCode, isRGBColor, isHexColor,
  isUndefined, isDefined, isEmpty, hasItems, isInstance, isNullish,
  areEqual, areFuzzyEqual,
  pFloat, pInt, radToDeg, degToRad,
  getKey,
  assertNonNullType,

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
  unique, group, sample,
  getLast, removeFirst, pullElement, pullIndex,
  subGroup, shuffle,

  // ████████ OBJECTS: Manipulation of Simple Key/Val Objects ████████
  remove, replace, partition, zip,
  objClean, objSize, objMap, objFindKey, objFilter, objForEach, objCompact,
  objClone, objMerge, objDiff, objExpand, objFlatten, objNullify,
  objFreezeProps,

  // ████████ FUNCTIONS: Function Wrapping, Queuing, Manipulation ████████
  getDynamicFunc, withLog,

  // ████████ HTML: Parsing HTML Code, Manipulating DOM Objects ████████
  getSvgCode, getSvgPaths,
  changeContainer,

  // ░░░░░░░ GreenSock ░░░░░░░
  gsap, get, set, getGSAngleDelta, /* to, from, fromTo, */

  TextPlugin, Flip, MotionPathPlugin,

  getRawCirclePath, drawCirclePath,

  getColorVals, getRGBString, getHEXString, getContrastingColor, getRandomColor,

  getSiblings,

  escapeHTML,

  // ████████ ASYNC: Async Functions, Asynchronous Flow Control ████████
  sleep,

  // EVENT HANDLERS
  EventHandlers,

  // ░░░░░░░ SYSTEM: System-Specific Functions (Requires Configuration of System ID in constants.js) ░░░░░░░
  isDocID, loc, getSetting, getTemplatePath, displayImageSelector


};
// #endregion ▄▄▄▄▄ EXPORTS ▄▄▄▄▄
