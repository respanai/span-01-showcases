// Emoji pool + question bank for the Twenty Tool Calls demo.
// Each emoji carries a one-line card: Span-01 decides from evidence in the span,
// so the card is what it reads when answering "Is it round?" etc.

export const EMOJIS = [
  // animals
  ["🐶", "Dog", "A friendly furry pet dog with four legs and a tail that barks."],
  ["🐱", "Cat", "A small furry pet cat with whiskers that meows and purrs."],
  ["🐟", "Fish", "A blue fish with fins and scales that swims in water."],
  ["🐦", "Bird", "A small blue bird with feathers and wings that flies and sings."],
  ["🐍", "Snake", "A long green legless reptile that slithers on the ground."],
  ["🦋", "Butterfly", "A colorful insect with large delicate wings that flies between flowers."],
  ["🐘", "Elephant", "A huge gray wild mammal with a long trunk and big ears."],
  ["🐴", "Horse", "A large brown mammal with four legs and a mane that people ride."],
  ["🐢", "Turtle", "A slow green reptile with a hard shell that swims and walks."],
  ["🐝", "Bee", "A small yellow and black striped insect that flies and makes honey."],
  ["🐙", "Octopus", "A soft sea animal with eight arms that lives in the ocean."],
  ["🦁", "Lion", "A large wild cat mammal with a golden mane that roars."],
  ["🐸", "Frog", "A small green amphibian that jumps and swims in ponds."],
  ["🐧", "Penguin", "A black and white bird that swims in cold water and cannot fly."],
  // food and drink
  ["🍕", "Pizza", "A round flatbread with tomato sauce and melted cheese, served hot in slices."],
  ["🍎", "Apple", "A round red fruit that grows on trees."],
  ["🍌", "Banana", "A long curved yellow fruit you peel."],
  ["☕", "Coffee", "A hot brown drink served in a mug."],
  ["🎂", "Birthday cake", "A sweet cake with frosting and candles for birthday celebrations."],
  ["🍦", "Ice cream", "A cold sweet dessert in a crunchy cone."],
  ["🥕", "Carrot", "A long thin orange vegetable that grows in the ground."],
  ["🍞", "Bread", "A brown loaf of baked bread you slice."],
  ["🍔", "Hamburger", "A hot sandwich with a beef patty in a round bun."],
  ["🍩", "Doughnut", "A round sweet fried pastry with a hole in the middle and pink frosting."],
  ["🍉", "Watermelon", "A big green fruit with sweet red juicy flesh."],
  ["🥚", "Egg", "A white oval egg laid by a chicken, eaten for breakfast."],
  ["🧀", "Cheese", "A yellow wedge of cheese made from milk."],
  ["🍫", "Chocolate bar", "A sweet brown bar of chocolate in a wrapper."],
  // sports and games
  ["⚽", "Soccer ball", "A round black and white ball kicked in soccer."],
  ["🏀", "Basketball", "A round orange ball bounced and thrown through a hoop."],
  ["🏸", "Badminton racket", "A long-handled racket with strings, used to hit a white shuttlecock."],
  ["🎳", "Bowling", "A heavy bowling ball rolled at white pins."],
  ["🏆", "Trophy", "A shiny gold metal cup awarded to winners."],
  ["🥊", "Boxing glove", "A padded red glove worn on the hand for boxing."],
  ["🛹", "Skateboard", "A wooden board with four small wheels you ride and do tricks on."],
  ["🎲", "Dice", "A small white cube with black dots rolled in board games."],
  ["♟️", "Chess pawn", "A small black chess piece moved on a chessboard."],
  ["🎯", "Dartboard", "A round red and white target you throw sharp darts at."],
  ["🏓", "Ping pong paddle", "A round red paddle with a short handle for table tennis."],
  ["🪁", "Kite", "A colorful diamond-shaped kite made of fabric that flies in the wind on a string."],
  // vehicles
  ["🚗", "Car", "A red car with four wheels and an engine that drives on roads."],
  ["🚲", "Bicycle", "A bike with two wheels and pedals that you ride."],
  ["✈️", "Airplane", "A large metal aircraft with wings and jet engines that flies passengers."],
  ["🚀", "Rocket", "A tall metal rocket with engines that launches into space."],
  ["⛵", "Sailboat", "A boat with a white fabric sail that floats on water."],
  ["🚌", "Bus", "A large vehicle with wheels and an engine that carries many passengers."],
  ["🚂", "Train", "A steam locomotive with an engine that runs on rails."],
  ["🚁", "Helicopter", "An aircraft with spinning rotor blades and an engine that flies."],
  ["🛴", "Kick scooter", "A small metal scooter with two wheels and a handlebar you push with your foot."],
  // everyday objects
  ["☎️", "Telephone", "A red desk telephone with a handset that plugs into the wall and rings."],
  ["💻", "Laptop", "A portable computer with a screen and keyboard."],
  ["⌨️", "Keyboard", "A computer keyboard with many keys for typing."],
  ["📷", "Camera", "A black camera with a glass lens for taking photos."],
  ["💡", "Light bulb", "A glass bulb that glows with electric light."],
  ["🔑", "Key", "A small gold metal key that opens locks."],
  ["✂️", "Scissors", "A metal cutting tool with two sharp blades."],
  ["🔨", "Hammer", "A tool with a heavy metal head and wooden handle for hitting nails."],
  ["✏️", "Pencil", "A long thin yellow wooden pencil for writing."],
  ["📖", "Book", "A book with paper pages to read."],
  ["☂️", "Umbrella", "A fabric umbrella that opens to keep rain off."],
  ["⏰", "Alarm clock", "A red metal clock that rings loudly to wake you up."],
  ["🪙", "Coin", "A round, flat metal disc used as money."],
  ["💰", "Money bag", "A cloth sack full of money."],
  ["🎁", "Gift", "A wrapped present box with a ribbon bow for celebrations."],
  ["🕯️", "Candle", "A white wax candle with a small burning flame that gives light."],
  ["📱", "Mobile phone", "A handheld smartphone with a touch screen."],
  ["🧲", "Magnet", "A red horseshoe-shaped metal magnet that attracts iron."],
  ["🔦", "Flashlight", "A handheld electric torch that shines a beam of light."],
  ["🪑", "Chair", "A wooden chair with four legs you sit on at home."],
  ["🛏️", "Bed", "A large bed with a mattress, pillow, and blanket for sleeping at home."],
  ["🧹", "Broom", "A long wooden broom with bristles for sweeping floors."],
  ["🎈", "Balloon", "A red rubber balloon filled with air for parties."],
  ["📺", "Television", "An electronic TV with a screen for watching shows at home."],
  ["🧸", "Teddy bear", "A soft brown stuffed toy bear made of fabric."],
  ["🪥", "Toothbrush", "A long thin plastic brush for cleaning teeth."],
  ["🍴", "Fork and knife", "A metal fork and knife used for eating."],
  // clothing and accessories
  ["👕", "T-shirt", "A blue cotton shirt with short sleeves."],
  ["👟", "Sneaker", "A running shoe worn on the foot."],
  ["🎩", "Top hat", "A tall black hat worn on the head."],
  ["👓", "Glasses", "Eyeglasses with clear glass lenses worn on the face."],
  ["🧤", "Gloves", "A pair of warm green fabric gloves worn on the hands."],
  ["👑", "Crown", "A gold metal crown with jewels worn on the head by a king or queen."],
  ["🧦", "Socks", "A pair of soft fabric socks worn on the feet."],
  ["💍", "Ring", "A small round gold ring with a diamond worn on a finger."],
  // nature and sky
  ["🌳", "Tree", "A tall green tree with a wooden trunk and leaves."],
  ["🌻", "Sunflower", "A tall yellow flower that grows in fields."],
  ["☀️", "Sun", "The bright hot yellow sun in the sky that gives light."],
  ["🌙", "Moon", "The yellow crescent moon in the night sky."],
  ["🌵", "Cactus", "A green spiky desert plant."],
  ["🍄", "Mushroom", "A mushroom with a red cap and white spots that grows in forests."],
  ["🔥", "Fire", "Hot orange flames that give light."],
  ["🌈", "Rainbow", "A colorful arc of light in the sky after rain."],
  ["❄️", "Snowflake", "A small cold white ice crystal that falls from the sky."],
  ["⭐", "Star", "A bright yellow star shining in the night sky."],
  // music
  ["🎸", "Guitar", "A wooden string instrument you strum."],
  ["🥁", "Drum", "A round percussion instrument you hit with sticks."],
  ["🎺", "Trumpet", "A gold brass instrument you blow into."],
  ["🎹", "Piano", "A large instrument with black and white keys."],
  ["🎻", "Violin", "A small wooden string instrument played with a bow."],
  ["🎤", "Microphone", "An electronic microphone you sing or speak into."],
];

export const QUESTIONS = [
  "Is it an animal?", "Is it food or drink?", "Is it a plant?", "Is it a vehicle?",
  "Is it something you wear?", "Is it for sports or games?", "Is it a musical instrument?",
  "Is it electronic?", "Is it money?", "Is it a toy?",
  "Is it round?", "Is it long and thin?", "Is it made of metal?", "Is it made of wood?",
  "Is it made of fabric?", "Is it made of paper?", "Is it made of glass?", "Is it made of plastic?",
  "Is it sweet?", "Is it hot?", "Is it cold?", "Is it alive?", "Can it fly?",
  "Does it live in water?", "Is it in the sky?", "Does it have legs?",
  "Does it have fur?", "Does it have wings?", "Is it sharp?", "Does it have wheels?",
  "Does it have an engine?", "Does it have a screen?", "Does it have strings?",
  "Does it give off light?", "Does it make sound?",
  "Is it used for reading or writing?", "Is it for telling time?",
  "Is it for cleaning?", "Is it worn on the head?", "Is it worn on the feet?", "Is it worn on the hands?",
  "Is it a fruit?", "Is it a vegetable?", "Is it a dessert?", "Is it a drink?", "Is it a ball?",
  "Is it an insect?", "Does it bark?", "Does it have a shell?", "Is it used for eating?",
  "Is it red?", "Is it yellow?", "Is it green?", "Is it brown?", "Is it white?", "Is it black?",
  "Is it orange?", "Is it blue?",
];

export function spanFor([emoji, name, card]) {
  return {
    input: [{ role: "user", content: "Which emoji are you thinking of?" }],
    output: { role: "assistant", content: `The secret emoji is ${emoji} ${name}. ${card}` },
  };
}

export function definitionFor(question) {
  return `The thing the assistant names is an object for which the answer to "${question}" is yes, using common knowledge about that object.`;
}

export function behaviorFor(q) {
  return { id: `q${q}`, definition: definitionFor(QUESTIONS[q]) };
}

// Sonnet 5.5's runs from @edwinarbus's "Twenty tool calls" video (x.com/edwinarbus/status/2104643996123603407).
// Read frame by frame from the video: each call's question/answer, and the card's TIME (s), COST ($), TOKENS
// and emojis-left at the moment that call landed. The clip plays 3× sped up; the demo replays at 1×.
// Row: [fn, question, answer, time, cost, tokens, left]
export const ORIGINAL = {
  model: "Sonnet 5.5",
  source: "@edwinarbus",
  pool: 365,
  runs: {
    "Badminton racket": [
      ["ask", "Is it an animal?", "N", 1.2, 0.012, 4300, 272],
      ["ask", "Is it an everyday object?", "N", 1.9, 0.017, 5200, 177],
      ["ask", "Is it food or drink?", "N", 2.5, 0.020, 5900, 102],
      ["ask", "Is it something you wear?", "N", 3.2, 0.023, 6500, 78],
      ["ask", "Is it for sports or games?", "Y", 3.8, 0.026, 6800, 31],
      ["ask", "Is it round?", "N", 4.5, 0.029, 7100, 20],
      ["ask", "Is it long and thin?", "N", 5.6, 0.033, 7500, 17],
      ["ask", "Does it have wheels?", "N", 6.7, 0.037, 7900, 15],
      ["ask", "Does it fit in your hand?", "N", 7.4, 0.040, 8200, 8],
      ["ask", "Is it made of plastic?", "N", 8.1, 0.043, 8400, 8],
      ["ask", "Can it fly?", "N", 9.0, 0.046, 8700, 6],
      ["ask", "Is it brown?", "N", 10.7, 0.051, 9300, 4],
      ["ask", "Is it white?", "Y", 11.4, 0.054, 9500, 2],
      ["guess", "🎳 Bowling pin?", "N", 12.0, 0.057, 9700, 1],
      ["guess", "🏸 Badminton racket?", "Y", 12.6, 0.060, 9900, 1],
    ],
    Telephone: [
      ["ask", "Is it an animal?", "N", 1.6, 0.012, 4300, 272],
      ["ask", "Is it an everyday object?", "Y", 2.2, 0.016, 4900, 95],
      ["ask", "Does it use electricity?", "Y", 2.9, 0.018, 5100, 17],
      ["ask", "Does it have a screen?", "N", 3.6, 0.020, 5400, 13],
      ["ask", "Is it electronics?", "Y", 4.2, 0.023, 5600, 11],
      ["ask", "Does it have a lens?", "N", 4.9, 0.025, 5800, 9],
      ["ask", "Does it have keys?", "Y", 5.6, 0.028, 6000, 2],
      ["guess", "⌨️ Computer keyboard?", "N", 6.3, 0.030, 6200, 1],
      ["guess", "☎️ Telephone?", "Y", 6.9, 0.033, 6400, 1],
    ],
    Coin: [
      ["ask", "Is it an animal?", "N", 1.2, 0.012, 4300, 272],
      ["ask", "Is it an everyday object?", "Y", 1.9, 0.016, 4900, 95],
      ["ask", "Does it use electricity?", "N", 2.5, 0.019, 5400, 78],
      ["ask", "Is it made of metal?", "Y", 3.2, 0.021, 5700, 33],
      ["ask", "Is it sharp?", "N", 3.8, 0.024, 6000, 24],
      ["ask", "Does it fit in your hand?", "Y", 4.5, 0.027, 6200, 12],
      ["ask", "Is it round?", "Y", 5.1, 0.029, 6400, 4],
      ["ask", "Is it money?", "Y", 5.7, 0.031, 6600, 1],
      ["guess", "🪙 Coin?", "Y", 6.5, 0.034, 6800, 1],
    ],
  },
};
