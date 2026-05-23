const bank = {
  math: {
    'Shapes': [
      { q: 'How many sides does a circle have?', options: ['0', '1', '3'], a: '0' },
      { q: 'How many sides does a square have?', options: ['3', '4', '5'], a: '4' },
      { q: 'A triangle has how many sides?', options: ['2', '3', '4'], a: '3' },
      { q: 'Which shape has four sides with two long and two short?', options: ['Square', 'Rectangle', 'Triangle'], a: 'Rectangle' },
      { q: 'How many points does a star have?', options: ['3', '5', '6'], a: '5' }
    ],
    'Addition': [
      { q: 'What is one plus one?', options: ['1', '2', '3'], a: '2' },
      { q: 'What is two plus two?', options: ['3', '4', '5'], a: '4' },
      { q: 'What is three plus three?', options: ['5', '6', '7'], a: '6' },
      { q: 'What is five plus three?', options: ['7', '8', '9'], a: '8' },
      { q: 'What is ten plus zero?', options: ['0', '10', '11'], a: '10' }
    ],
    'Subtraction': [
      { q: 'What is five minus two?', options: ['2', '3', '4'], a: '3' },
      { q: 'What is ten minus four?', options: ['5', '6', '7'], a: '6' },
      { q: 'What is eight minus three?', options: ['4', '5', '6'], a: '5' },
      { q: 'What is seven minus four?', options: ['2', '3', '4'], a: '3' },
      { q: 'What is twelve minus five?', options: ['5', '7', '9'], a: '7' }
    ],
    'Addition & Subtraction': [
      { q: 'What is 8 plus 9?', options: ['16', '17', '18'], a: '17' },
      { q: 'What is 15 minus 7?', options: ['6', '7', '8'], a: '8' },
      { q: 'What is 12 plus 15?', options: ['25', '27', '30'], a: '27' },
      { q: 'What is 30 minus 12?', options: ['16', '18', '20'], a: '18' },
      { q: 'What is 100 minus 50?', options: ['25', '50', '75'], a: '50' }
    ],
    'Multiplication': [
      { q: 'What is 2 times 2?', options: ['2', '4', '6'], a: '4' },
      { q: 'What is 3 times 4?', options: ['7', '12', '14'], a: '12' },
      { q: 'What is 5 times 5?', options: ['10', '20', '25'], a: '25' },
      { q: 'What does multiplication mean?', options: ['Repeated addition', 'Subtraction', 'Division'], a: 'Repeated addition' },
      { q: 'What is 10 times any number?', options: ['Add a zero', 'Double it', 'Half it'], a: 'Add a zero' }
    ],
    'Division': [
      { q: 'What is ten divided by two?', options: ['3', '5', '7'], a: '5' },
      { q: 'What is twelve divided by three?', options: ['3', '4', '6'], a: '4' },
      { q: 'What is fifteen divided by three?', options: ['3', '5', '7'], a: '5' },
      { q: 'What is twenty divided by four?', options: ['4', '5', '6'], a: '5' },
      { q: 'What does division mean?', options: ['Adding groups', 'Sharing equally', 'Multiplying'], a: 'Sharing equally' }
    ],
    'Fractions': [
      { q: 'What is half of eight?', options: ['2', '4', '6'], a: '4' },
      { q: 'What is a quarter of twenty?', options: ['4', '5', '10'], a: '5' },
      { q: 'What is one third of nine?', options: ['2', '3', '4'], a: '3' },
      { q: 'What do fractions represent?', options: ['Whole numbers', 'Equal parts of a whole', 'Mixed numbers'], a: 'Equal parts of a whole' },
      { q: 'How many halves make a whole?', options: ['2', '3', '4'], a: '2' }
    ],
    'Time': [
      { q: 'How many hours are in a day?', options: ['12', '24', '36'], a: '24' },
      { q: 'How many minutes are in an hour?', options: ['30', '60', '90'], a: '60' },
      { q: 'How many seconds are in a minute?', options: ['30', '60', '90'], a: '60' },
      { q: 'What does the short hand on a clock show?', options: ['Minutes', 'Hours', 'Seconds'], a: 'Hours' },
      { q: 'When the minute hand is at 12, what does it mean?', options: ['Half past', "O'clock", 'Quarter past'], a: "O'clock" }
    ],
    'Money': [
      { q: 'How many pennies make a dollar?', options: ['10', '50', '100'], a: '100' },
      { q: 'How much is a nickel worth?', options: ['1 cent', '5 cents', '10 cents'], a: '5 cents' },
      { q: 'How much is a dime worth?', options: ['5 cents', '10 cents', '25 cents'], a: '10 cents' },
      { q: 'How much is a quarter worth?', options: ['10 cents', '25 cents', '50 cents'], a: '25 cents' },
      { q: 'How many quarters make a dollar?', options: ['2', '3', '4'], a: '4' }
    ],
    'Numbers 1 to 9': [
      { q: 'What comes after 3?', options: ['2', '4', '5'], a: '4' },
      { q: 'What comes before 7?', options: ['5', '6', '8'], a: '6' },
      { q: 'What number is between 4 and 6?', options: ['3', '5', '7'], a: '5' },
      { q: 'What is the largest number from 1 to 9?', options: ['8', '9', '10'], a: '9' },
      { q: 'What is the smallest number?', options: ['0', '1', '2'], a: '1' }
    ],
    'Numbers 1-100': [
      { q: 'What number comes after 99?', options: ['98', '100', '101'], a: '100' },
      { q: 'How many tens are in 50?', options: ['3', '5', '10'], a: '5' },
      { q: 'What is 10 more than 25?', options: ['30', '35', '40'], a: '35' },
      { q: 'What number has 2 tens and 5 ones?', options: ['25', '52', '205'], a: '25' },
      { q: 'What number comes before 100?', options: ['98', '99', '101'], a: '99' }
    ],
    'Large Numbers': [
      { q: 'How many zeros are in one hundred?', options: ['1', '2', '3'], a: '2' },
      { q: 'How many zeros are in one thousand?', options: ['2', '3', '4'], a: '3' },
      { q: 'What is 1000 written in words?', options: ['One hundred', 'One thousand', 'Ten thousand'], a: 'One thousand' },
      { q: 'What is the largest 4-digit number?', options: ['9000', '9999', '10000'], a: '9999' },
      { q: 'How many hundreds are in 5000?', options: ['5', '50', '500'], a: '50' }
    ],
    'Factors & Multiples': [
      { q: 'What are the factors of 12?', options: ['1,2,3,4,6,12', '1,2,3,4,5,12', '2,4,6,8,12'], a: '1,2,3,4,6,12' },
      { q: 'What is a factor?', options: ['A number that divides exactly', 'The answer to multiplication', 'The largest number'], a: 'A number that divides exactly' },
      { q: 'What is a multiple?', options: ['A number you add', 'The product of a number and another', 'A number you subtract'], a: 'The product of a number and another' },
      { q: 'What is the first multiple of 5?', options: ['0', '5', '10'], a: '5' },
      { q: 'What is a prime number?', options: ['Has only 2 factors', 'Has 4 factors', 'Has many factors'], a: 'Has only 2 factors' }
    ],
    'Geometry': [
      { q: 'What is a point?', options: ['An exact location', 'A line', 'A shape'], a: 'An exact location' },
      { q: 'What is a line segment?', options: ['A line that goes on forever', 'A part of a line with two endpoints', 'A curved line'], a: 'A part of a line with two endpoints' },
      { q: 'What is an angle?', options: ['Two lines meeting at a point', 'A curved line', 'A straight line'], a: 'Two lines meeting at a point' },
      { q: 'What is a right angle?', options: ['45 degrees', '90 degrees', '180 degrees'], a: '90 degrees' },
      { q: 'What shape has four right angles and equal sides?', options: ['Rectangle', 'Square', 'Triangle'], a: 'Square' }
    ],
    'Perimeter & Area': [
      { q: 'What is perimeter?', options: ['The distance around a shape', 'The space inside a shape', 'The width of a shape'], a: 'The distance around a shape' },
      { q: 'What is area?', options: ['The distance around', 'The space inside a shape', 'The height of a shape'], a: 'The space inside a shape' },
      { q: 'How do you find the area of a rectangle?', options: ['Length + width', 'Length x width', 'Length / width'], a: 'Length x width' },
      { q: 'What unit is area measured in?', options: ['Units', 'Square units', 'Cube units'], a: 'Square units' },
      { q: 'What is the perimeter of a square with side 5?', options: ['15', '20', '25'], a: '20' }
    ],
    'Decimals': [
      { q: 'What is 0.5 as a fraction?', options: ['1/4', '1/2', '3/4'], a: '1/2' },
      { q: 'What is 0.25 as a fraction?', options: ['1/4', '1/2', '3/4'], a: '1/4' },
      { q: 'What does the first digit after decimal point represent?', options: ['Tenths', 'Hundredths', 'Thousandths'], a: 'Tenths' },
      { q: 'What is 0.75 as a fraction?', options: ['1/4', '1/2', '3/4'], a: '3/4' },
      { q: 'Which is bigger: 0.5 or 0.05?', options: ['0.5', '0.05', 'Same'], a: '0.5' }
    ],
    'Percentage': [
      { q: 'What does percentage mean?', options: ['Out of 10', 'Out of 100', 'Out of 1000'], a: 'Out of 100' },
      { q: 'What is 50% as a fraction?', options: ['1/4', '1/2', '3/4'], a: '1/2' },
      { q: 'What is 25% as a fraction?', options: ['1/4', '1/2', '3/4'], a: '1/4' },
      { q: 'What is 100% of anything?', options: ['Half of it', 'All of it', 'None of it'], a: 'All of it' },
      { q: 'What is 10% of 50?', options: ['5', '10', '15'], a: '5' }
    ],
    'Volume': [
      { q: 'What is volume?', options: ['The space inside a 3D shape', 'The distance around', 'The area of a shape'], a: 'The space inside a 3D shape' },
      { q: 'How is volume measured?', options: ['Square units', 'Cubic units', 'Linear units'], a: 'Cubic units' },
      { q: 'What is the volume of a cube with side 2?', options: ['4', '6', '8'], a: '8' },
      { q: 'What does a liter measure?', options: ['Length', 'Weight', 'Volume'], a: 'Volume' },
      { q: 'How many milliliters in one liter?', options: ['10', '100', '1000'], a: '1000' }
    ],
    'Place Value': [
      { q: 'In the number 345, what digit is in the tens place?', options: ['3', '4', '5'], a: '4' },
      { q: 'What is the value of 7 in 472?', options: ['7', '70', '700'], a: '70' },
      { q: 'In 6205, what digit is in the thousands place?', options: ['6', '2', '0'], a: '6' },
      { q: 'What is expanded form of 356?', options: ['300+50+6', '30+50+6', '300+5+6'], a: '300+50+6' },
      { q: 'How many tens are in the number 280?', options: ['8', '28', '80'], a: '28' }
    ],
    'Roman Numerals': [
      { q: 'What does I stand for in Roman numerals?', options: ['1', '5', '10'], a: '1' },
      { q: 'What does V stand for?', options: ['1', '5', '10'], a: '5' },
      { q: 'What does X stand for?', options: ['5', '10', '50'], a: '10' },
      { q: 'What is VII in numbers?', options: ['5', '7', '12'], a: '7' },
      { q: 'What is IX in numbers?', options: ['9', '11', '19'], a: '9' }
    ],
    'Measurement': [
      { q: 'What tool measures length?', options: ['Clock', 'Ruler', 'Scale'], a: 'Ruler' },
      { q: 'What is the basic unit of length?', options: ['Gram', 'Meter', 'Liter'], a: 'Meter' },
      { q: 'How many centimeters in a meter?', options: ['10', '100', '1000'], a: '100' },
      { q: 'What is the basic unit of weight?', options: ['Gram', 'Meter', 'Liter'], a: 'Gram' },
      { q: 'What does a thermometer measure?', options: ['Length', 'Temperature', 'Weight'], a: 'Temperature' }
    ],
    'Symmetry': [
      { q: 'What is a line of symmetry?', options: ['A line that divides equally', 'A curved line', 'A diagonal line'], a: 'A line that divides equally' },
      { q: 'How many lines of symmetry does a square have?', options: ['2', '4', '6'], a: '4' },
      { q: 'Does a circle have symmetry?', options: ['No', 'Yes, infinite lines', 'Yes, 1 line'], a: 'Yes, infinite lines' },
      { q: 'What is a mirror image?', options: ['A reflection', 'A rotation', 'A translation'], a: 'A reflection' },
      { q: 'Does a triangle have symmetry?', options: ['Always', 'Sometimes', 'Never'], a: 'Sometimes' }
    ],
    'Speed': [
      { q: 'What is speed?', options: ['How far you go in a time', 'How long something is', 'How heavy something is'], a: 'How far you go in a time' },
      { q: 'If you run 10 meters in 5 seconds what is your speed?', options: ['2 m/s', '5 m/s', '10 m/s'], a: '2 m/s' },
      { q: 'What unit is speed often measured in?', options: ['Meters', 'Kilometers per hour', 'Kilograms'], a: 'Kilometers per hour' },
      { q: 'A faster speed means you cover more what?', options: ['Time', 'Distance', 'Weight'], a: 'Distance' },
      { q: 'What is the speed formula?', options: ['Distance / Time', 'Distance x Time', 'Time / Distance'], a: 'Distance / Time' }
    ],
    'Data Handling': [
      { q: 'What is a bar graph used for?', options: ['Comparing data', 'Drawing shapes', 'Measuring length'], a: 'Comparing data' },
      { q: 'What shows the categories in a bar graph?', options: ['The bars', 'The labels on the axis', 'The colors'], a: 'The labels on the axis' },
      { q: 'What is a tally chart?', options: ['Counting using marks', 'A type of graph', 'A measuring tool'], a: 'Counting using marks' },
      { q: 'What does each tally mark represent?', options: ['5', '1', '10'], a: '1' },
      { q: 'What is the mode?', options: ['The most common value', 'The middle value', 'The average'], a: 'The most common value' }
    ],
    'Graphs': [
      { q: 'What type of graph shows parts of a whole?', options: ['Bar graph', 'Pie chart', 'Line graph'], a: 'Pie chart' },
      { q: 'What does a line graph show best?', options: ['Change over time', 'Comparing groups', 'Parts of a whole'], a: 'Change over time' },
      { q: 'What is the x-axis?', options: ['The horizontal line', 'The vertical line', 'The title'], a: 'The horizontal line' },
      { q: 'What is the y-axis?', options: ['The horizontal line', 'The vertical line', 'The title'], a: 'The vertical line' },
      { q: 'What does a pictograph use?', options: ['Pictures', 'Bars', 'Lines'], a: 'Pictures' }
    ],
    'Fun with Numbers': [
      { q: 'What is a number pattern?', options: ['Numbers repeated in order', 'Numbers in a sequence with a rule', 'Random numbers'], a: 'Numbers in a sequence with a rule' },
      { q: 'What comes next: 2, 4, 6, 8, __?', options: ['9', '10', '12'], a: '10' },
      { q: 'What is skip counting?', options: ['Counting by 1', 'Counting by a fixed number', 'Counting backwards'], a: 'Counting by a fixed number' },
      { q: 'What is the missing number: 5, 10, __, 20?', options: ['12', '15', '18'], a: '15' },
      { q: 'What is 100 minus 1?', options: ['98', '99', '101'], a: '99' }
    ],
    'Time & Money': [
      { q: 'How many minutes in half an hour?', options: ['15', '30', '45'], a: '30' },
      { q: 'How many quarters make a dollar?', options: ['2', '3', '4'], a: '4' },
      { q: 'How much is 2 dimes and 1 nickel?', options: ['15 cents', '25 cents', '30 cents'], a: '25 cents' },
      { q: 'What time is half past 3?', options: ['3:00', '3:30', '4:00'], a: '3:30' },
      { q: 'How many hours from 2 PM to 5 PM?', options: ['2', '3', '4'], a: '3' }
    ],
    'Tables 2-5': [
      { q: 'What is 2 x 3?', options: ['4', '5', '6'], a: '6' },
      { q: 'What is 3 x 4?', options: ['10', '12', '14'], a: '12' },
      { q: 'What is 4 x 5?', options: ['16', '20', '25'], a: '20' },
      { q: 'What is 5 x 6?', options: ['25', '30', '35'], a: '30' },
      { q: 'What is 2 x 9?', options: ['16', '18', '20'], a: '18' }
    ]
  },

  science: {
    'My Body': [
      { q: 'What organ pumps blood in our body?', options: ['Brain', 'Heart', 'Lungs'], a: 'Heart' },
      { q: 'What helps us breathe air?', options: ['Lungs', 'Stomach', 'Heart'], a: 'Lungs' },
      { q: 'What is the largest organ of our body?', options: ['Liver', 'Heart', 'Skin'], a: 'Skin' },
      { q: 'How many bones does an adult human have?', options: ['106', '206', '306'], a: '206' },
      { q: 'What does the brain do?', options: ['Pumps blood', 'Helps us think', 'Digests food'], a: 'Helps us think' }
    ],
    'Plants': [
      { q: 'What part of the plant grows underground?', options: ['Stem', 'Leaves', 'Roots'], a: 'Roots' },
      { q: 'What do plants need from the sun?', options: ['Water', 'Sunlight', 'Soil'], a: 'Sunlight' },
      { q: 'What process do plants use to make food?', options: ['Digestion', 'Respiration', 'Photosynthesis'], a: 'Photosynthesis' },
      { q: 'What part of the plant carries water to leaves?', options: ['Roots', 'Stem', 'Flowers'], a: 'Stem' },
      { q: 'What do plants give off that we breathe?', options: ['Carbon dioxide', 'Nitrogen', 'Oxygen'], a: 'Oxygen' }
    ],
    'Plants Around Us': [
      { q: 'What do roots do for a plant?', options: ['Make food', 'Hold the plant and take water', 'Grow flowers'], a: 'Hold the plant and take water' },
      { q: 'What part of a plant grows above the soil?', options: ['Roots', 'Stem', 'Both stem and leaves'], a: 'Stem' },
      { q: 'Which gas do plants use from the air?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], a: 'Carbon dioxide' },
      { q: 'What do flowers become after they bloom?', options: ['Roots', 'Fruits', 'Soil'], a: 'Fruits' },
      { q: 'What do we get from plants besides food?', options: ['Clothes and wood', 'Only food', 'Only oxygen'], a: 'Clothes and wood' }
    ],
    'Animals': [
      { q: 'What do animals need to survive?', options: ['Only food', 'Food water and air', 'Only water'], a: 'Food water and air' },
      { q: 'What do herbivores eat?', options: ['Meat', 'Plants', 'Both'], a: 'Plants' },
      { q: 'What do carnivores eat?', options: ['Meat', 'Plants', 'Both'], a: 'Meat' },
      { q: 'What do omnivores eat?', options: ['Only plants', 'Only meat', 'Both plants and meat'], a: 'Both plants and meat' },
      { q: 'What helps fish breathe in water?', options: ['Lungs', 'Gills', 'Skin'], a: 'Gills' }
    ],
    'Weather': [
      { q: 'What type of cloud brings rain?', options: ['Cirrus', 'Cumulus', 'Stratus'], a: 'Cumulus' },
      { q: 'What makes the wind blow?', options: ['The Earth spinning', 'Moving air', 'The ocean'], a: 'Moving air' },
      { q: 'What happens when water gets very cold?', options: ['It boils', 'It turns to ice', 'It disappears'], a: 'It turns to ice' },
      { q: 'What gives us heat and light during the day?', options: ['The Moon', 'The Sun', 'The stars'], a: 'The Sun' },
      { q: 'What is snow made of?', options: ['Frozen rain', 'Ice crystals', 'Hail'], a: 'Ice crystals' }
    ],
    'Living Things': [
      { q: 'Do non-living things grow?', options: ['Yes', 'No', 'Sometimes'], a: 'No' },
      { q: 'What do living things need to survive?', options: ['Only food', 'Food water and air', 'Only water'], a: 'Food water and air' },
      { q: 'Do living things respond to changes?', options: ['Yes', 'No', 'Only some'], a: 'Yes' },
      { q: 'Do living things need air?', options: ['Yes', 'No', 'Only plants'], a: 'Yes' },
      { q: 'Can a non-living thing grow?', options: ['Yes', 'No', 'Only in water'], a: 'No' }
    ],
    'Living & Non-Living': [
      { q: 'Is a rock a living thing?', options: ['Yes', 'No', 'Sometimes'], a: 'No' },
      { q: 'Do living things respond to changes?', options: ['Yes', 'No', 'Only some'], a: 'Yes' },
      { q: 'Is a toy car a living thing?', options: ['Yes', 'No', 'If it moves'], a: 'No' },
      { q: 'Do living things produce young ones?', options: ['Yes', 'No', 'Only big animals'], a: 'Yes' },
      { q: 'What do living things need that non-living things do not?', options: ['Food and water', 'Shape', 'Color'], a: 'Food and water' }
    ],
    'Our Body': [
      { q: 'How many bones are in the adult human skeleton?', options: ['106', '206', '306'], a: '206' },
      { q: 'What protects our brain?', options: ['Skull', 'Rib cage', 'Spine'], a: 'Skull' },
      { q: 'What is the function of the rib cage?', options: ['Protects heart and lungs', 'Helps us think', 'Digests food'], a: 'Protects heart and lungs' },
      { q: 'What are the muscles that we can control called?', options: ['Cardiac', 'Skeletal', 'Smooth'], a: 'Skeletal' },
      { q: 'What does the heart pump?', options: ['Air', 'Blood', 'Food'], a: 'Blood' }
    ],
    'Food & Health': [
      { q: 'Why do we need food?', options: ['For fun', 'For energy', 'For sleep'], a: 'For energy' },
      { q: 'What food gives us strong bones?', options: ['Fruits', 'Milk and cheese', 'Candy'], a: 'Milk and cheese' },
      { q: 'How much water should we drink daily?', options: ['None', 'Only when thirsty', 'Several glasses'], a: 'Several glasses' },
      { q: 'What food group gives us energy?', options: ['Proteins', 'Grains', 'Vitamins'], a: 'Grains' },
      { q: 'Why are fruits and vegetables important?', options: ['They taste good', 'They give us vitamins', 'They are fun to eat'], a: 'They give us vitamins' }
    ],
    'Air & Water': [
      { q: 'What do we breathe in from the air?', options: ['Carbon dioxide', 'Oxygen', 'Nitrogen'], a: 'Oxygen' },
      { q: 'Where does rain come from?', options: ['The ocean', 'Clouds in the sky', 'The ground'], a: 'Clouds in the sky' },
      { q: 'Why is water important for our body?', options: ['It gives us energy', 'It keeps us hydrated', 'It helps us sleep'], a: 'It keeps us hydrated' },
      { q: 'How can we save water?', options: ['Use more water', 'Turn off taps when not in use', 'Drink less water'], a: 'Turn off taps when not in use' },
      { q: 'What is the water cycle?', options: ['Water going round in circles', 'Water changing forms and moving', 'Water staying still'], a: 'Water changing forms and moving' }
    ],
    'Water': [
      { q: 'What state is water at room temperature?', options: ['Solid', 'Liquid', 'Gas'], a: 'Liquid' },
      { q: 'What happens when water boils?', options: ['It freezes', 'It turns to steam', 'It disappears'], a: 'It turns to steam' },
      { q: 'Where do we find the most water on Earth?', options: ['Rivers', 'Oceans', 'Lakes'], a: 'Oceans' },
      { q: 'How can we save water at home?', options: ['Take longer showers', 'Fix leaking taps', 'Use more water'], a: 'Fix leaking taps' },
      { q: 'What is rainwater harvesting?', options: ['Collecting rain water', 'Boiling rain', 'Measuring rain'], a: 'Collecting rain water' }
    ],
    'Food & Nutrition': [
      { q: 'What are nutrients?', options: ['Substances that help us grow', 'Types of food', 'Only vitamins'], a: 'Substances that help us grow' },
      { q: 'Which nutrient gives us energy?', options: ['Vitamins', 'Carbohydrates', 'Minerals'], a: 'Carbohydrates' },
      { q: 'What nutrient helps build muscles?', options: ['Protein', 'Fat', 'Sugar'], a: 'Protein' },
      { q: 'What is a balanced diet?', options: ['Eating only one food', 'Eating variety of foods in right amounts', 'Eating less food'], a: 'Eating variety of foods in right amounts' },
      { q: 'Which vitamin do we get from the sun?', options: ['Vitamin A', 'Vitamin C', 'Vitamin D'], a: 'Vitamin D' }
    ],
    'Human Senses': [
      { q: 'How many senses do humans have?', options: ['3', '5', '7'], a: '5' },
      { q: 'Which sense does the tongue help with?', options: ['Sight', 'Taste', 'Smell'], a: 'Taste' },
      { q: 'Which sense does the skin help with?', options: ['Touch', 'Taste', 'Hearing'], a: 'Touch' },
      { q: 'Which sense does the nose help with?', options: ['Taste', 'Smell', 'Hearing'], a: 'Smell' },
      { q: 'Which sense do our ears help with?', options: ['Sight', 'Hearing', 'Touch'], a: 'Hearing' }
    ],
    'Simple Machines': [
      { q: 'What is a simple machine?', options: ['A very complex machine', 'A tool that makes work easier', 'An electronic device'], a: 'A tool that makes work easier' },
      { q: 'Which is an example of a lever?', options: ['Scissors', 'Ramp', 'Pulley'], a: 'Scissors' },
      { q: 'What does a pulley help us do?', options: ['Cut objects', 'Lift heavy things', 'Measure weight'], a: 'Lift heavy things' },
      { q: 'What is an inclined plane?', options: ['A flat surface', 'A slanted surface', 'A curved surface'], a: 'A slanted surface' },
      { q: 'Which is a wheel and axle?', options: ['A bicycle wheel', 'A hammer', 'A saw'], a: 'A bicycle wheel' }
    ],
    'Digestion': [
      { q: 'Where does digestion begin?', options: ['Stomach', 'Mouth', 'Intestine'], a: 'Mouth' },
      { q: 'What does the stomach do?', options: ['Absorbs water', 'Breaks down food', 'Pumps blood'], a: 'Breaks down food' },
      { q: 'What helps digest food in the stomach?', options: ['Air', 'Water', 'Digestive juices'], a: 'Digestive juices' },
      { q: 'What is the function of the small intestine?', options: ['Absorbs nutrients', 'Stores food', 'Grinds food'], a: 'Absorbs nutrients' },
      { q: 'How long is the digestive system?', options: ['About 9 meters', 'About 2 meters', 'About 5 meters'], a: 'About 9 meters' }
    ],
    'Adaptations': [
      { q: 'What is an adaptation?', options: ['A change to survive', 'A type of animal', 'A plant part'], a: 'A change to survive' },
      { q: 'Why do polar bears have thick fur?', options: ['To look good', 'To stay warm', 'To swim fast'], a: 'To stay warm' },
      { q: 'Why do cacti have spines?', options: ['To save water', 'To attract animals', 'To grow tall'], a: 'To save water' },
      { q: 'Why do birds have wings?', options: ['To run fast', 'To fly', 'To swim'], a: 'To fly' },
      { q: 'Why do fish have scales?', options: ['To breathe', 'To protect their body', 'To see better'], a: 'To protect their body' }
    ],
    'States of Matter': [
      { q: 'What are the three states of matter?', options: ['Solid liquid gas', 'Hot cold warm', 'Metal wood plastic'], a: 'Solid liquid gas' },
      { q: 'Does a solid have a fixed shape?', options: ['Yes', 'No', 'Sometimes'], a: 'Yes' },
      { q: 'Does a liquid have a fixed shape?', options: ['Yes', 'No', 'It takes the shape of its container'], a: 'It takes the shape of its container' },
      { q: 'What happens when ice melts?', options: ['It turns to gas', 'It turns to water', 'It stays the same'], a: 'It turns to water' },
      { q: 'What happens when water evaporates?', options: ['It turns to ice', 'It turns to water vapor', 'It stays the same'], a: 'It turns to water vapor' }
    ],
    'Force & Work': [
      { q: 'What is a force?', options: ['A push or a pull', 'A type of energy', 'A kind of motion'], a: 'A push or a pull' },
      { q: 'What is gravity?', options: ['The force that pulls things down', 'The force that pushes up', 'The force of wind'], a: 'The force that pulls things down' },
      { q: 'What is friction?', options: ['A force that speeds things up', 'A force that slows things down', 'A force that lifts things'], a: 'A force that slows things down' },
      { q: 'What is work in science?', options: ['Force applied over distance', 'Any activity', 'Thinking'], a: 'Force applied over distance' },
      { q: 'What unit is force measured in?', options: ['Kilograms', 'Newtons', 'Meters'], a: 'Newtons' }
    ],
    'Natural Disasters': [
      { q: 'What is an earthquake?', options: ['The ground shaking', 'A huge wave', 'A strong wind'], a: 'The ground shaking' },
      { q: 'What causes a flood?', options: ['Too much rain', 'Strong winds', 'Cold weather'], a: 'Too much rain' },
      { q: 'What is a volcano?', options: ['A mountain that erupts lava', 'A deep hole', 'A big rock'], a: 'A mountain that erupts lava' },
      { q: 'What is a hurricane?', options: ['A very strong windstorm', 'A snowfall', 'An earthquake'], a: 'A very strong windstorm' },
      { q: 'How can we stay safe during a flood?', options: ['Go to higher ground', 'Stay indoors', 'Go swimming'], a: 'Go to higher ground' }
    ],
    'Our Environment': [
      { q: 'What is environment?', options: ['Everything around us', 'Only the air', 'Only the soil'], a: 'Everything around us' },
      { q: 'Why should we plant trees?', options: ['They give us oxygen', 'They look pretty', 'They make noise'], a: 'They give us oxygen' },
      { q: 'What is pollution?', options: ['Harmful substances in nature', 'Natural clean air', 'Pure water'], a: 'Harmful substances in nature' },
      { q: 'What can we recycle?', options: ['Paper and plastic', 'Only paper', 'Only metal'], a: 'Paper and plastic' },
      { q: 'What is a habitat?', options: ['The natural home of an animal', 'A zoo', 'A cage'], a: 'The natural home of an animal' }
    ],
    'Solar System': [
      { q: 'How many planets are in our solar system?', options: ['7', '8', '9'], a: '8' },
      { q: 'What is the closest planet to the Sun?', options: ['Venus', 'Mercury', 'Earth'], a: 'Mercury' },
      { q: 'Which planet is known as the Red Planet?', options: ['Venus', 'Jupiter', 'Mars'], a: 'Mars' },
      { q: 'What is the largest planet?', options: ['Saturn', 'Jupiter', 'Neptune'], a: 'Jupiter' },
      { q: 'What keeps the planets orbiting the Sun?', options: ['Gravity', 'Magnetism', 'Wind'], a: 'Gravity' }
    ],
    'Plant Life': [
      { q: 'What is the life cycle of a plant?', options: ['Seed to plant to flower to fruit', 'Plant to seed', 'Flower to leaf'], a: 'Seed to plant to flower to fruit' },
      { q: 'What do seeds need to grow?', options: ['Water warmth soil', 'Only water', 'Only sunlight'], a: 'Water warmth soil' },
      { q: 'How do seeds spread?', options: ['By wind water animals', 'Only by wind', 'Only by water'], a: 'By wind water animals' },
      { q: 'What part of the plant makes seeds?', options: ['Leaves', 'Flowers', 'Roots'], a: 'Flowers' },
      { q: 'What is germination?', options: ['When a seed starts to grow', 'When a plant dies', 'When leaves fall'], a: 'When a seed starts to grow' }
    ],
    'Rocks & Minerals': [
      { q: 'What are rocks made of?', options: ['Minerals', 'Plants', 'Water'], a: 'Minerals' },
      { q: 'What type of rock is formed from lava?', options: ['Sedimentary', 'Igneous', 'Metamorphic'], a: 'Igneous' },
      { q: 'What is a fossil?', options: ['Remains of ancient life', 'A type of rock', 'A mineral'], a: 'Remains of ancient life' },
      { q: 'What is the hardest mineral?', options: ['Gold', 'Diamond', 'Quartz'], a: 'Diamond' },
      { q: 'What do we use rocks for?', options: ['Building materials', 'Only decoration', 'Only jewelry'], a: 'Building materials' }
    ],
    'Photosynthesis': [
      { q: 'What does photosynthesis produce?', options: ['Food and oxygen', 'Only food', 'Only oxygen'], a: 'Food and oxygen' },
      { q: 'What is the green pigment in leaves called?', options: ['Chlorophyll', 'Carotene', 'Melanin'], a: 'Chlorophyll' },
      { q: 'What do plants absorb from the soil?', options: ['Carbon dioxide', 'Water and minerals', 'Sunlight'], a: 'Water and minerals' },
      { q: 'What gas do plants take in for photosynthesis?', options: ['Oxygen', 'Carbon dioxide', 'Nitrogen'], a: 'Carbon dioxide' },
      { q: 'Where does photosynthesis mainly occur?', options: ['Roots', 'Stem', 'Leaves'], a: 'Leaves' }
    ],
    'Electricity': [
      { q: 'What is electricity?', options: ['A form of energy', 'A type of water', 'A kind of rock'], a: 'A form of energy' },
      { q: 'What material allows electricity to flow?', options: ['Conductor', 'Insulator', 'Plastic'], a: 'Conductor' },
      { q: 'What does a battery do?', options: ['Stores electricity', 'Creates water', 'Heats air'], a: 'Stores electricity' },
      { q: 'What is a circuit?', options: ['A closed path for electricity', 'A type of wire', 'A switch'], a: 'A closed path for electricity' },
      { q: 'Why should we not touch electrical outlets?', options: ['They are dangerous', 'They are dirty', 'They are hot'], a: 'They are dangerous' }
    ],
    'Natural Resources': [
      { q: 'What is a natural resource?', options: ['Something from nature we use', 'Something made in a factory', 'Only food'], a: 'Something from nature we use' },
      { q: 'Is sunlight a renewable resource?', options: ['Yes', 'No', 'Sometimes'], a: 'Yes' },
      { q: 'Is coal a renewable resource?', options: ['Yes', 'No', 'Maybe'], a: 'No' },
      { q: 'Why should we conserve resources?', options: ['They might run out', 'They are cheap', 'They are everywhere'], a: 'They might run out' },
      { q: 'Which is a non-renewable resource?', options: ['Solar energy', 'Wind energy', 'Petroleum'], a: 'Petroleum' }
    ],
    'Plant Reproduction': [
      { q: 'What part of a plant produces seeds?', options: ['Leaves', 'Flowers', 'Roots'], a: 'Flowers' },
      { q: 'What is pollination?', options: ['Transfer of pollen', 'Watering plants', 'Cutting plants'], a: 'Transfer of pollen' },
      { q: 'What do bees help plants with?', options: ['Pollination', 'Watering', 'Growing'], a: 'Pollination' },
      { q: 'What is inside a seed?', options: ['A baby plant and food', 'Only food', 'Only water'], a: 'A baby plant and food' },
      { q: 'How do some plants reproduce without seeds?', options: ['Through stems or roots', 'They cannot', 'Only through flowers'], a: 'Through stems or roots' }
    ],
    'Animals & Birds': [
      { q: 'What body covering do birds have?', options: ['Fur', 'Feathers', 'Scales'], a: 'Feathers' },
      { q: 'What helps birds fly?', options: ['Wings and hollow bones', 'Only wings', 'Only feathers'], a: 'Wings and hollow bones' },
      { q: 'What do mammals have that other animals do not?', options: ['Fur or hair', 'Feathers', 'Scales'], a: 'Fur or hair' },
      { q: 'What does a bird use its beak for?', options: ['Eating and building nests', 'Only eating', 'Only flying'], a: 'Eating and building nests' },
      { q: 'Which animal lays eggs?', options: ['Dog', 'Bird', 'Cat'], a: 'Bird' }
    ],
    'Human Body': [
      { q: 'What is the largest organ in the human body?', options: ['Liver', 'Skin', 'Brain'], a: 'Skin' },
      { q: 'How many bones does a baby have?', options: ['About 200', 'About 300', 'About 400'], a: 'About 300' },
      { q: 'What system helps us breathe?', options: ['Digestive system', 'Respiratory system', 'Circulatory system'], a: 'Respiratory system' },
      { q: 'What system helps blood move?', options: ['Circulatory system', 'Nervous system', 'Skeletal system'], a: 'Circulatory system' },
      { q: 'What system helps us move?', options: ['Muscular system', 'Digestive system', 'Endocrine system'], a: 'Muscular system' }
    ],
    'Heart': [
      { q: 'How many chambers does the human heart have?', options: ['2', '3', '4'], a: '4' },
      { q: 'What is the main function of the heart?', options: ['Pump blood', 'Digest food', 'Help us breathe'], a: 'Pump blood' },
      { q: 'What are the upper chambers of the heart called?', options: ['Ventricles', 'Atria', 'Valves'], a: 'Atria' },
      { q: 'What are the lower chambers of the heart called?', options: ['Atria', 'Ventricles', 'Aorta'], a: 'Ventricles' },
      { q: 'What blood vessel carries blood away from the heart?', options: ['Artery', 'Vein', 'Capillary'], a: 'Artery' }
    ],
    'Matter': [
      { q: 'What is matter?', options: ['Anything that has mass and volume', 'Only solids', 'Only liquids'], a: 'Anything that has mass and volume' },
      { q: 'How many states of matter are there?', options: ['2', '3', '4'], a: '3' },
      { q: 'Does gas have a fixed shape?', options: ['Yes', 'No', 'Sometimes'], a: 'No' },
      { q: 'What happens when a liquid is heated?', options: ['It expands', 'It contracts', 'It stays the same'], a: 'It expands' },
      { q: 'What is density?', options: ['How much mass in a volume', 'How heavy something is', 'How big something is'], a: 'How much mass in a volume' }
    ]
  },

  spelling: {
    'Sight Words': [
      { q: 'How do we read sight words?', options: ['By sounding out', 'By looking at them', 'By spelling them'], a: 'By looking at them' },
      { q: 'Which word is a sight word?', options: ['Elephant', 'The', 'Refrigerator'], a: 'The' },
      { q: 'Which word is NOT a sight word?', options: ['A', 'Is', 'Giraffe'], a: 'Giraffe' },
      { q: 'What helps us read faster?', options: ['Knowing sight words', 'Reading slowly', 'Counting letters'], a: 'Knowing sight words' },
      { q: 'Is "play" a sight word?', options: ['Yes', 'No', 'Sometimes'], a: 'Yes' }
    ],
    'Phonics': [
      { q: 'What sound does the letter A make in "apple"?', options: ['ay', 'ah', 'a'], a: 'ah' },
      { q: 'What sound does the letter B make?', options: ['buh', 'bee', 'bo'], a: 'buh' },
      { q: 'What is phonics used for?', options: ['Sounding out words', 'Counting letters', 'Writing sentences'], a: 'Sounding out words' },
      { q: 'How many letters are in the alphabet?', options: ['24', '26', '28'], a: '26' },
      { q: 'What sound does the letter S make?', options: ['sh', 'sss', 'suh'], a: 'sss' }
    ],
    'Homophones': [
      { q: 'Which word means a place?', options: ['Their', 'There', "They're"], a: 'There' },
      { q: 'Which word shows belonging?', options: ['Their', 'There', "They're"], a: 'Their' },
      { q: 'Which is the number 2?', options: ['To', 'Too', 'Two'], a: 'Two' },
      { q: 'Which means also?', options: ['To', 'Too', 'Two'], a: 'Too' },
      { q: 'What are words that sound the same but have different meanings?', options: ['Synonyms', 'Antonyms', 'Homophones'], a: 'Homophones' }
    ],
    'Compound Words': [
      { q: 'What is a compound word?', options: ['A word with silent letters', 'Two small words joined as one', 'A very long word'], a: 'Two small words joined as one' },
      { q: 'What is "sun" + "flower"?', options: ['Sunlight', 'Sunflower', 'Flowerpot'], a: 'Sunflower' },
      { q: 'What is "rain" + "bow"?', options: ['Rainbow', 'Raindrop', 'Raincoat'], a: 'Rainbow' },
      { q: 'What is "bed" + "room"?', options: ['Bedroom', 'Bedtime', 'Bedding'], a: 'Bedroom' },
      { q: 'What is "class" + "room"?', options: ['Classmate', 'Classroom', 'Classwork'], a: 'Classroom' }
    ],
    'Spelling Lists': [
      { q: 'How do you spell "school" correctly?', options: ['S-C-H-O-O-L', 'S-C-O-O-L', 'S-C-H-O-L-E'], a: 'S-C-H-O-O-L' },
      { q: 'How do you spell "friend" correctly?', options: ['F-R-E-N-D', 'F-R-I-E-N-D', 'F-R-I-N-D'], a: 'F-R-I-E-N-D' },
      { q: 'What helps us become better spellers?', options: ['Practice', 'Reading less', 'Writing less'], a: 'Practice' },
      { q: 'How do you spell "because" correctly?', options: ['B-E-C-A-U-S-E', 'B-E-C-A-U-S', 'B-I-C-A-U-S-E'], a: 'B-E-C-A-U-S-E' },
      { q: 'What is a dictionary used for?', options: ['To find word meanings and spellings', 'To read stories', 'To draw pictures'], a: 'To find word meanings and spellings' }
    ],
    'Prefixes & Suffixes': [
      { q: 'What is a prefix?', options: ['Letters added at the beginning of a word', 'Letters added at the end', 'The middle of a word'], a: 'Letters added at the beginning of a word' },
      { q: 'What does "un-" mean in "unhappy"?', options: ['Very', 'Not', 'Again'], a: 'Not' },
      { q: 'What is a suffix?', options: ['Letters added at the beginning', 'Letters added at the end of a word', 'A whole word'], a: 'Letters added at the end of a word' },
      { q: 'What does "-ful" mean in "beautiful"?', options: ['Without', 'Full of', 'Not'], a: 'Full of' },
      { q: 'What is the prefix in "rewrite"?', options: ['re', 'write', 'ite'], a: 're' }
    ],
    'Silent Letters': [
      { q: 'Which letter is silent in "knife"?', options: ['k', 'n', 'f'], a: 'k' },
      { q: 'Which letter is silent in "write"?', options: ['w', 'r', 't'], a: 'w' },
      { q: 'What is a silent letter?', options: ['A letter not pronounced', 'A letter pronounced softly', 'A missing letter'], a: 'A letter not pronounced' },
      { q: 'Which word has a silent "b"?', options: ['Bat', 'Comb', 'Boat'], a: 'Comb' },
      { q: 'Which word has a silent "h"?', options: ['Home', 'Hour', 'Hat'], a: 'Hour' }
    ],
    'Greek & Latin Roots': [
      { q: 'What does the root "bio" mean?', options: ['Life', 'Two', 'Book'], a: 'Life' },
      { q: 'What does the root "graph" mean?', options: ['Write', 'Read', 'Draw'], a: 'Write' },
      { q: 'What does the root "aud" mean?', options: ['See', 'Hear', 'Run'], a: 'Hear' },
      { q: 'What does "tele" mean in "telephone"?', options: ['Far', 'Near', 'Loud'], a: 'Far' },
      { q: 'What does the root "struct" mean?', options: ['Build', 'Break', 'Carry'], a: 'Build' }
    ],
    'Alphabet': [
      { q: 'How many letters in the English alphabet?', options: ['24', '26', '28'], a: '26' },
      { q: 'What is the first letter of the alphabet?', options: ['A', 'B', 'C'], a: 'A' },
      { q: 'What is the last letter?', options: ['X', 'Y', 'Z'], a: 'Z' },
      { q: 'How many vowels are in the alphabet?', options: ['5', '6', '7'], a: '5' },
      { q: 'What are the vowels?', options: ['A E I O U', 'A B C D', 'X Y Z'], a: 'A E I O U' }
    ],
    'Short Vowels': [
      { q: 'What is the short A sound in "cat"?', options: ['ay', 'ah', 'a'], a: 'ah' },
      { q: 'What is the short E sound in "bed"?', options: ['ee', 'eh', 'ay'], a: 'eh' },
      { q: 'What is the short I sound in "pig"?', options: ['ee', 'ih', 'eye'], a: 'ih' },
      { q: 'What is the short O sound in "dog"?', options: ['oh', 'ah', 'aw'], a: 'aw' },
      { q: 'What is the short U sound in "cup"?', options: ['yoo', 'uh', 'oo'], a: 'uh' }
    ],
    'Long Vowels': [
      { q: 'What is the long A sound in "cake"?', options: ['ah', 'ay', 'a'], a: 'ay' },
      { q: 'What is the long E sound in "bee"?', options: ['eh', 'ee', 'ye'], a: 'ee' },
      { q: 'What is the long I sound in "kite"?', options: ['ih', 'eye', 'ee'], a: 'eye' },
      { q: 'What is the long O sound in "home"?', options: ['aw', 'oh', 'oo'], a: 'oh' },
      { q: 'What is the long U sound in "cube"?', options: ['uh', 'yoo', 'oo'], a: 'yoo' }
    ],
    'Blends & Digraphs': [
      { q: 'What is a consonant blend?', options: ['Two consonants blended together', 'One consonant sound', 'A vowel sound'], a: 'Two consonants blended together' },
      { q: 'What sound does "sh" make?', options: ['sss', 'shh', 'ch'], a: 'shh' },
      { q: 'What sound does "ch" make?', options: ['shh', 'chh', 'thh'], a: 'chh' },
      { q: 'What sound does "th" make in "think"?', options: ['t', 'th (soft)', 'd'], a: 'th (soft)' },
      { q: 'Which word starts with a blend?', options: ['At', 'Cat', 'Blue'], a: 'Blue' }
    ],
    'Contractions': [
      { q: 'What is "can not" contracted?', options: ['cannot', "can't", 'cant'], a: "can't" },
      { q: 'What is "do not" contracted?', options: ["don't", "doesn't", 'dont'], a: "don't" },
      { q: 'What is "I am" contracted?', options: ['Im', "I'm", 'Iam'], a: "I'm" },
      { q: 'What is "they will" contracted?', options: ['theyll', "they'll", 'thayl'], a: "they'll" },
      { q: 'What does an apostrophe in a contraction show?', options: ['Missing letters', 'Possession', 'Plural'], a: 'Missing letters' }
    ],
    'Word Origins': [
      { q: 'Where does English come from?', options: ['Many languages combined', 'Only Latin', 'Only Greek'], a: 'Many languages combined' },
      { q: 'Which language gave us "pizza"?', options: ['French', 'Italian', 'German'], a: 'Italian' },
      { q: 'Which language gave us "kindergarten"?', options: ['French', 'Italian', 'German'], a: 'German' },
      { q: 'What is a loanword?', options: ['A word taken from another language', 'A borrowed book', 'A type of money'], a: 'A word taken from another language' },
      { q: 'Which language gave us "ballet"?', options: ['French', 'Spanish', 'Chinese'], a: 'French' }
    ],
    'Vocabulary': [
      { q: 'What is a synonym?', options: ['A word with similar meaning', 'A word with opposite meaning', 'A word that sounds the same'], a: 'A word with similar meaning' },
      { q: 'What is an antonym?', options: ['A word with similar meaning', 'A word with opposite meaning', 'A word that sounds the same'], a: 'A word with opposite meaning' },
      { q: 'What is a homonym?', options: ['Words spelled the same with different meanings', 'Words with the same meaning', 'Words with opposite meaning'], a: 'Words spelled the same with different meanings' },
      { q: 'What is a prefix?', options: ['Letters at the start of a word', 'Letters at the end', 'The main part'], a: 'Letters at the start of a word' },
      { q: 'What is a suffix?', options: ['Letters at the start', 'Letters at the end of a word', 'The whole word'], a: 'Letters at the end of a word' }
    ],
    'Dictionary Skills': [
      { q: 'How are words arranged in a dictionary?', options: ['Alphabetical order', 'Random order', 'By length'], a: 'Alphabetical order' },
      { q: 'What are guide words in a dictionary?', options: ['Words at the top of the page', 'The definitions', 'Example sentences'], a: 'Words at the top of the page' },
      { q: 'What does a dictionary entry include?', options: ['Spelling meaning pronunciation', 'Only the spelling', 'Only the meaning'], a: 'Spelling meaning pronunciation' },
      { q: 'What does the pronunciation guide show?', options: ['How to say the word', 'How to spell the word', 'Where the word comes from'], a: 'How to say the word' },
      { q: 'If you look up "apple" which word would come before it?', options: ['Ant', 'Apple', 'Banana'], a: 'Ant' }
    ],
    'Word Building': [
      { q: 'What is a root word?', options: ['The base of a word', 'A type of plant', 'A prefix'], a: 'The base of a word' },
      { q: 'What word can you make with "play" + "ful"?', options: ['Player', 'Playful', 'Playing'], a: 'Playful' },
      { q: 'What does adding "-er" to "teach" make?', options: ['Teacher', 'Teaching', 'Teachable'], a: 'Teacher' },
      { q: 'What does adding "re-" to "do" make?', options: ['Redo', 'Doer', 'Doing'], a: 'Redo' },
      { q: 'What does "un" + "kind" make?', options: ['Unkind', 'Reckind', 'Kindun'], a: 'Unkind' }
    ]
  },

  geography: {
    'Continents': [
      { q: 'How many continents are there?', options: ['5', '7', '9'], a: '7' },
      { q: 'Which is the largest continent?', options: ['Africa', 'Asia', 'Europe'], a: 'Asia' },
      { q: 'Which continent is the coldest?', options: ['Antarctica', 'Europe', 'North America'], a: 'Antarctica' },
      { q: 'Which continent has the Amazon rainforest?', options: ['Asia', 'Africa', 'South America'], a: 'South America' },
      { q: 'On which continent is India located?', options: ['Africa', 'Asia', 'Europe'], a: 'Asia' }
    ],
    'Countries': [
      { q: 'What is the capital of the United States?', options: ['New York', 'Washington D.C.', 'Los Angeles'], a: 'Washington D.C.' },
      { q: 'Which country has the Eiffel Tower?', options: ['Italy', 'France', 'Spain'], a: 'France' },
      { q: 'Which country has the Great Wall?', options: ['Japan', 'China', 'India'], a: 'China' },
      { q: 'Which is the largest country by area?', options: ['Canada', 'China', 'Russia'], a: 'Russia' },
      { q: 'Which country is also a continent?', options: ['India', 'Brazil', 'Australia'], a: 'Australia' }
    ],
    'Landforms': [
      { q: 'What is a mountain?', options: ['Very tall land', 'Flat land', 'Water'], a: 'Very tall land' },
      { q: 'What is a valley?', options: ['High land', 'Low land between mountains', 'Body of water'], a: 'Low land between mountains' },
      { q: 'What is a desert?', options: ['Wet area', 'Dry area with little rain', 'Forest'], a: 'Dry area with little rain' },
      { q: 'What is an island?', options: ['Land surrounded by water', 'A big mountain', 'A river'], a: 'Land surrounded by water' },
      { q: 'What is the largest ocean?', options: ['Atlantic', 'Indian', 'Pacific'], a: 'Pacific' }
    ],
    'Maps': [
      { q: 'What does the letter N stand for on a compass?', options: ['South', 'North', 'East'], a: 'North' },
      { q: 'What direction is opposite of North?', options: ['South', 'East', 'West'], a: 'South' },
      { q: 'What does a compass help us do?', options: ['Find directions', 'Measure distance', 'Tell time'], a: 'Find directions' },
      { q: 'What shows symbols and their meanings on a map?', options: ['Scale', 'Legend', 'Compass'], a: 'Legend' },
      { q: 'What does a globe represent?', options: ['The Earth', 'The Moon', 'The Sun'], a: 'The Earth' }
    ],
    'Climate': [
      { q: 'What is climate?', options: ['Long-term weather patterns', 'Daily weather', 'Temperature only'], a: 'Long-term weather patterns' },
      { q: 'Which climate zone is near the equator?', options: ['Tropical', 'Polar', 'Temperate'], a: 'Tropical' },
      { q: 'Which climate is very cold year-round?', options: ['Tropical', 'Temperate', 'Polar'], a: 'Polar' },
      { q: 'What is a desert climate like?', options: ['Very dry with little rain', 'Very wet', 'Cold and snowy'], a: 'Very dry with little rain' },
      { q: 'What causes seasons on Earth?', options: ['Earth tilted on its axis', 'Distance from Sun', 'The Moon'], a: 'Earth tilted on its axis' }
    ],
    'Natural Resources': [
      { q: 'What is a natural resource?', options: ['Something from nature we use', 'Something made in a factory', 'Only food'], a: 'Something from nature we use' },
      { q: 'Is sunlight a renewable resource?', options: ['Yes', 'No', 'Sometimes'], a: 'Yes' },
      { q: 'Is coal a renewable resource?', options: ['Yes', 'No', 'Maybe'], a: 'No' },
      { q: 'Why should we conserve resources?', options: ['They might run out', 'They are cheap', 'They are everywhere'], a: 'They might run out' },
      { q: 'Which is a non-renewable resource?', options: ['Solar energy', 'Wind energy', 'Petroleum'], a: 'Petroleum' }
    ]
  }
};

const synonymKeys = {
  'Shapes & Patterns': 'math:Shapes',
  'Shapes & Designs': 'math:Geometry',
  'Addition & Subtraction': 'math:Addition & Subtraction',
  'Time & Money': 'math:Time & Money',
  'Multiplication Tables': 'math:Multiplication',
  'Tables 2-5': 'math:Tables 2-5',
  'Fun with Numbers': 'math:Fun with Numbers',
  'Numbers 1 to 100': 'math:Numbers 1-100',
  'Large Numbers': 'math:Large Numbers',
  'Place Value': 'math:Place Value',
  'Roman Numerals': 'math:Roman Numerals',
  'Factors & Multiples': 'math:Factors & Multiples',
  'Factors': 'math:Factors & Multiples',
  'Geometry': 'math:Geometry',
  'Perimeter & Area': 'math:Perimeter & Area',
  'Perimeter': 'math:Perimeter & Area',
  'Area': 'math:Perimeter & Area',
  'Measurement': 'math:Measurement',
  'Symmetry': 'math:Symmetry',
  'Decimals': 'math:Decimals',
  'Percentage': 'math:Percentage',
  'Percentages': 'math:Percentage',
  'Volume': 'math:Volume',
  'Volume & Capacity': 'math:Volume',
  'Speed': 'math:Speed',
  'Data Handling': 'math:Data Handling',
  'Graphs': 'math:Graphs',
  'Living & Non-Living': 'science:Living & Non-Living',
  'Living Things': 'science:Living Things',
  'Plants Around Us': 'science:Plants Around Us',
  'Animals & Birds': 'science:Animals & Birds',
  'Animals': 'science:Animals',
  'Plants & Animals': 'science:Animals',
  'Our Body': 'science:Our Body',
  'My Body': 'science:My Body',
  'Human Body': 'science:Human Body',
  'Human Body Systems': 'science:Human Body',
  'Organ Systems': 'science:Human Body',
  'Human Senses': 'science:Human Senses',
  'Food & Health': 'science:Food & Health',
  'Food & Nutrition': 'science:Food & Nutrition',
  'Food': 'science:Food & Health',
  'Air & Water': 'science:Air & Water',
  'Water': 'science:Water',
  'Weather': 'science:Weather',
  'Plants': 'science:Plants',
  'Plant Life': 'science:Plant Life',
  'Plant World': 'science:Plant Life',
  'Plant Reproduction': 'science:Plant Reproduction',
  'Reproduction in Plants': 'science:Plant Reproduction',
  'Photosynthesis': 'science:Photosynthesis',
  'Living Things': 'science:Living Things',
  'Digestion': 'science:Digestion',
  'Digestive System': 'science:Digestion',
  'Adaptations': 'science:Adaptations',
  'States of Matter': 'science:States of Matter',
  'Matter': 'science:Matter',
  'Matter & Materials': 'science:Matter',
  'Force & Work': 'science:Force & Work',
  'Force & Energy': 'science:Force & Work',
  'Simple Machines': 'science:Simple Machines',
  'Natural Disasters': 'science:Natural Disasters',
  'Our Environment': 'science:Our Environment',
  'Environment': 'science:Our Environment',
  'Solar System': 'science:Solar System',
  'Rocks & Minerals': 'science:Rocks & Minerals',
  'Electricity': 'science:Electricity',
  'Natural Resources': 'science:Natural Resources',
  'Sight Words': 'spelling:Sight Words',
  'Phonics': 'spelling:Phonics',
  'Phonics A-M': 'spelling:Phonics',
  'Phonics N-Z': 'spelling:Phonics',
  'Phonics Blends': 'spelling:Blends & Digraphs',
  'Homophones': 'spelling:Homophones',
  'Advanced Homophones': 'spelling:Homophones',
  'Compound Words': 'spelling:Compound Words',
  'Spelling Lists': 'spelling:Spelling Lists',
  'Spelling Rules': 'spelling:Spelling Lists',
  'Spelling Patterns': 'spelling:Spelling Lists',
  'Spelling Challenges': 'spelling:Spelling Lists',
  'Advanced Spelling': 'spelling:Spelling Lists',
  'Prefixes & Suffixes': 'spelling:Prefixes & Suffixes',
  'Prefixes': 'spelling:Prefixes & Suffixes',
  'Suffixes': 'spelling:Prefixes & Suffixes',
  'Silent Letters': 'spelling:Silent Letters',
  'Greek & Latin Roots': 'spelling:Greek & Latin Roots',
  'Alphabet': 'spelling:Alphabet',
  'Alphabet Sounds': 'spelling:Alphabet',
  'Short Vowels': 'spelling:Short Vowels',
  'Long Vowels': 'spelling:Long Vowels',
  'Blends & Digraphs': 'spelling:Blends & Digraphs',
  'Contractions': 'spelling:Contractions',
  'Word Origins': 'spelling:Word Origins',
  'Advanced Vocabulary': 'spelling:Vocabulary',
  'Vocabulary': 'spelling:Vocabulary',
  'Dictionary Skills': 'spelling:Dictionary Skills',
  'Simple Words': 'spelling:Word Building',
  'Word Building': 'spelling:Word Building',
   'Continents': 'geography:Continents',
   'Countries': 'geography:Countries',
   'Landforms': 'geography:Landforms',
   'Maps': 'geography:Maps',
   'Climate': 'geography:Climate',
   'Natural Resources': 'geography:Natural Resources',
   'Resources': 'geography:Natural Resources',

   'heart': 'science:Heart',
   'human heart': 'science:Heart',
   'heartbeat': 'science:Heart',
   'circulatory': 'science:Heart',
   'blood': 'science:Heart',

   'water cycle': 'science:Water',
   'watercycle': 'science:Water',
   'evaporation': 'science:Water',
   'condensation': 'science:Water',
   'precipitation': 'science:Water',
   'rain cycle': 'science:Water',
   'hydrologic': 'science:Water',

   'solar system': 'science:Solar System',
   'planets': 'science:Solar System',
   'sun': 'science:Solar System',
   'moon': 'science:Solar System',
   'earth': 'science:Solar System',
   'space': 'science:Solar System',
   'orbit': 'science:Solar System',

   'five senses': 'science:Human Senses',
   'senses': 'science:Human Senses',
   'smell': 'science:Human Senses',
   'taste': 'science:Human Senses',
   'touch': 'science:Human Senses',
   'hearing': 'science:Human Senses',
   'sight': 'science:Human Senses',

   'bones': 'science:Human Body',
   'skeleton': 'science:Human Body',
   'muscles': 'science:Human Body',
   'skull': 'science:Human Body',
   'ribs': 'science:Human Body',
   'brain': 'science:Human Body',
   'lungs': 'science:Human Body',
   'stomach': 'science:Digestion',

   'rocks': 'science:Rocks & Minerals',
   'minerals': 'science:Rocks & Minerals',
   'fossils': 'science:Rocks & Minerals',

   'natural disaster': 'science:Natural Disasters',
   'earthquake': 'science:Natural Disasters',
   'volcano': 'science:Natural Disasters',
   'flood': 'science:Natural Disasters',
   'tsunami': 'science:Natural Disasters',
   'hurricane': 'science:Natural Disasters',
   'tornado': 'science:Natural Disasters',

   'environment': 'science:Our Environment',
   'pollution': 'science:Our Environment',
   'ecosystem': 'science:Our Environment',
   'habitat': 'science:Our Environment',

   'solid': 'science:States of Matter',
   'liquid': 'science:States of Matter',
   'gas': 'science:States of Matter',
   'matter': 'science:States of Matter',
   'states of matter': 'science:States of Matter',
   'melt': 'science:States of Matter',
   'freeze': 'science:States of Matter',
   'boil': 'science:States of Matter',

   'machine': 'science:Simple Machines',
   'lever': 'science:Simple Machines',
   'pulley': 'science:Simple Machines',
   'inclined plane': 'science:Simple Machines',
   'wheel': 'science:Simple Machines',
   'wedge': 'science:Simple Machines',
   'screw': 'science:Simple Machines',

   'force': 'science:Force & Work',
   'energy': 'science:Force & Work',
   'push': 'science:Force & Work',
   'pull': 'science:Force & Work',
   'gravity': 'science:Force & Work',
   'friction': 'science:Force & Work',

   'animals': 'science:Animals',
   'mammals': 'science:Animals',
   'reptiles': 'science:Animals',
   'amphibians': 'science:Animals',
   'birds': 'science:Animals & Birds',
   'fish': 'science:Animals',
   'insects': 'science:Animals',
   'herbivores': 'science:Animals',
   'carnivores': 'science:Animals',
   'omnivores': 'science:Animals',

   'food chain': 'science:Food & Health',
   'nutrition': 'science:Food & Nutrition',
   'vitamins': 'science:Food & Health',
   'healthy': 'science:Food & Health',
   'diet': 'science:Food & Health',

   'plants': 'science:Plants',
   'trees': 'science:Plants',
   'flowers': 'science:Plants',
   'seeds': 'science:Plant Reproduction',
   'germination': 'science:Plant Reproduction',
   'pollination': 'science:Plant Reproduction',

   'air': 'science:Air & Water',
   'wind': 'science:Air & Water',
   'oxygen': 'science:Air & Water',
   'carbon dioxide': 'science:Photosynthesis',
   'chlorophyll': 'science:Photosynthesis',
   'sunlight': 'science:Plants',

   'weather': 'science:Weather',
   'rain': 'science:Weather',
   'snow': 'science:Weather',
   'cloud': 'science:Weather',
   'temperature': 'science:Weather',

   'electricity': 'science:Electricity',
   'circuit': 'science:Electricity',
   'battery': 'science:Electricity',
   'current': 'science:Electricity',

   'addition': 'math:Addition',
   'adding': 'math:Addition',
   'plus': 'math:Addition',
   'sum': 'math:Addition',

   'subtraction': 'math:Subtraction',
   'subtract': 'math:Subtraction',
   'minus': 'math:Subtraction',
   'take away': 'math:Subtraction',

   'multiplication': 'math:Multiplication',
   'multiply': 'math:Multiplication',
   'times': 'math:Multiplication',
   'product': 'math:Multiplication',
   'tables': 'math:Multiplication',
   'times table': 'math:Multiplication',

   'division': 'math:Division',
   'divide': 'math:Division',
   'sharing': 'math:Division',

   'fractions': 'math:Fractions',
   'fraction': 'math:Fractions',
   'half': 'math:Fractions',
   'quarter': 'math:Fractions',
   'third': 'math:Fractions',

   'decimals': 'math:Decimals',
   'decimal': 'math:Decimals',
   'decimal point': 'math:Decimals',

   'percentage': 'math:Percentage',
   'percent': 'math:Percentage',

   'shapes': 'math:Shapes',
   'circle': 'math:Shapes',
   'square': 'math:Shapes',
   'triangle': 'math:Shapes',
   'rectangle': 'math:Shapes',

   'geometry': 'math:Geometry',
   'angles': 'math:Geometry',
   'lines': 'math:Geometry',

   'perimeter': 'math:Perimeter & Area',
   'area': 'math:Perimeter & Area',

   'time': 'math:Time',
   'clock': 'math:Time',
   'hour': 'math:Time',
   'minute': 'math:Time',

   'money': 'math:Money',
   'coins': 'math:Money',
   'dollar': 'math:Money',
   'cents': 'math:Money',

   'numbers': 'math:Numbers 1-100',
   'counting': 'math:Numbers 1 to 9',
   'count': 'math:Numbers 1 to 9',
   'place value': 'math:Place Value',
   'large numbers': 'math:Large Numbers',

   'measurement': 'math:Measurement',
   'measure': 'math:Measurement',
   'ruler': 'math:Measurement',
   'length': 'math:Measurement',
   'weight': 'math:Measurement',

   'volume': 'math:Volume',
   'capacity': 'math:Volume',
   'liter': 'math:Volume',
   'speed': 'math:Speed',
   'distance': 'math:Speed',

   'graph': 'math:Graphs',
   'data': 'math:Data Handling',
   'chart': 'math:Graphs',
   'bar graph': 'math:Graphs',

   'symmetry': 'math:Symmetry',
   'roman numerals': 'math:Roman Numerals',
   'roman': 'math:Roman Numerals',

   'sight words': 'spelling:Sight Words',
   'phonics': 'spelling:Phonics',
   'alphabet': 'spelling:Alphabet',
   'letters': 'spelling:Alphabet',
   'vowels': 'spelling:Short Vowels',
   'short vowels': 'spelling:Short Vowels',
   'long vowels': 'spelling:Long Vowels',
   'blends': 'spelling:Blends & Digraphs',
   'digraphs': 'spelling:Blends & Digraphs',
   'contractions': 'spelling:Contractions',
   'compound words': 'spelling:Compound Words',
   'homophones': 'spelling:Homophones',
   'prefix': 'spelling:Prefixes & Suffixes',
   'suffix': 'spelling:Prefixes & Suffixes',
   'silent letters': 'spelling:Silent Letters',
   'spelling': 'spelling:Spelling Lists',
   'dictionary': 'spelling:Dictionary Skills',
   'word building': 'spelling:Word Building',
   'vocabulary': 'spelling:Vocabulary',

   'climate': 'geography:Climate',
   'weather patterns': 'geography:Climate',
   'seasons': 'geography:Climate',
   'rainforest': 'geography:Climate',
   'desert': 'geography:Climate',
   'polar': 'geography:Climate',
   'temperate': 'geography:Climate',

   'map': 'geography:Maps',
   'compass': 'geography:Maps',
   'globe': 'geography:Maps',

   'country': 'geography:Countries',
   'capital': 'geography:Countries',
   'india': 'geography:Countries',
   'china': 'geography:Countries',
   'france': 'geography:Countries',
   'japan': 'geography:Countries',
   'australia': 'geography:Countries',
   'usa': 'geography:Countries',

   'mountain': 'geography:Landforms',
   'river': 'geography:Landforms',
   'ocean': 'geography:Landforms',
   'valley': 'geography:Landforms',
   'desert landform': 'geography:Landforms',
   'island': 'geography:Landforms'
};

const subjectMap = {
  math: 'math',
  science: 'science',
  spelling: 'spelling',
  geography: 'geography'
};

function normalize(str) {
  return str.toLowerCase().replace(/[-–—]/g, ' ').replace(/[&]/g, ' and ').replace(/\s+/g, ' ').trim();
}

function getQuizForTopic(subject, topic) {
  const subj = subjectMap[subject] || 'math';
  const tn = topic.trim();
  const tnLower = tn.toLowerCase();
  const tnNorm = normalize(tn);

  const synonymKey = tnLower + '|' + tnNorm;
  for (const [topicName, mapped] of Object.entries(synonymKeys)) {
    const [mapSubj, mapKey] = mapped.split(':');
    if (mapSubj === subj) {
      const mappedLower = topicName.toLowerCase();
      if (mappedLower === tnLower || normalize(topicName) === tnNorm) {
        const pool = (bank[mapSubj] || {})[mapKey];
        if (pool) return pool.sort(() => Math.random() - 0.5).slice(0, 4);
      }
    }
  }

  const subjBank = bank[subj] || bank.math;
  const exactKey = Object.keys(subjBank).find(k => k.toLowerCase() === tnLower);
  if (exactKey) {
    return subjBank[exactKey].sort(() => Math.random() - 0.5).slice(0, 4);
  }

  const normKey = Object.keys(subjBank).find(k => normalize(k) === tnNorm);
  if (normKey) {
    return subjBank[normKey].sort(() => Math.random() - 0.5).slice(0, 4);
  }

  const tnTokens = tnLower.split(/\s+/).filter(t => t.length > 2);
  let bestMatch = null;
  let bestScore = 0;
  for (const [key, questions] of Object.entries(subjBank)) {
    const keyTokens = key.toLowerCase().split(/\s+/).filter(t => t.length > 2);
    const matches = tnTokens.filter(t => keyTokens.includes(t)).length;
    if (matches > bestScore) {
      bestScore = matches;
      bestMatch = key;
    }
  }
  if (bestMatch && bestScore >= 1) {
    return subjBank[bestMatch].sort(() => Math.random() - 0.5).slice(0, 4);
  }

  const firstKey = Object.keys(subjBank)[0];
  return (subjBank[firstKey] || bank.math.Shapes).sort(() => Math.random() - 0.5).slice(0, 4);
}

export { getQuizForTopic, bank, synonymKeys, normalize };
