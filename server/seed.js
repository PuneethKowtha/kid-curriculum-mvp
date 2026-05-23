const db = require('./db');

function seed() {
  const existing = db.prepare("SELECT COUNT(*) as count FROM songs WHERE is_prewritten = 1").get();
  if (existing.count > 0) {
    console.log('Pre-written songs already seeded. Skipping.');
    return;
  }

  const insert = db.prepare(`
    INSERT OR IGNORE INTO songs (kid_id, subject, topic, genre, grade, curriculum, template_id, input_values, lyrics, audio_settings, share_id, is_prewritten)
    VALUES (NULL, ?, ?, 'pop', ?, ?, ?, '{}', ?, '{}', ?, 1)
  `);

  const genShareId = () => Math.random().toString(36).substring(2, 10);

  const songs = [];

  // ===== GRADE 1 SONGS =====

  // --- Grade 1: CBSE Math Shapes ---
  songs.push({
    subject: 'math', topic: 'Shapes', grade: 1, curriculum: 'cbse',
    lyrics: `🎵 A circle is round, it rolls on the ground,
No corners at all, no edges to be found!
A square has four sides, every one the same size,
Equal and neat, a wonderful surprise!

🎵 Chorus:
Shapes, shapes, everywhere we go!
Shapes, shapes, helping us to know!
From the sun up in the sky to the books we hold so high,
Shapes are all around my friend, learning them will never end!

🎵 A triangle has three sides, pointy at the top,
Like a pizza slice or a mountain top!
A rectangle has four sides, two are long, two are small,
Like a door or a book upon the wall!

🎵 An oval shape is like an egg, stretched out just a bit,
A diamond shape is like a kite when I go to sit!
A star has five pointy points that shine so bright,
Learning all the shapes feels right!

🎵 Let's find a circle in the room today,
A clock, a coin, a ball at play!
Let's find a square in the things we see,
A window pane or a book for me!`
  });

  // --- Grade 1: ICSE Math Shapes ---
  songs.push({
    subject: 'math', topic: 'Shapes', grade: 1, curriculum: 'icse',
    lyrics: `🎵 A circle has one curved side that goes around and round,
No corners and no edges, the simplest shape around!
A square has four equal sides and four corners too,
Every angle is the same, ninety degrees for you!

🎵 Chorus:
Learning shapes is so much fun,
Under the bright and shining sun!
Sides and corners, count them all,
Shapes are big and shapes are small!

🎵 A triangle has three sides, three corners at the end,
It can be tall or short, a triangle is a friend!
A rectangle has four sides with two that are the same,
Opposite sides are equal, rectangle is the name!

🎵 An oval is like an egg, no corners to be found,
A diamond has four sides all tilted to the ground!
A star has five points shining every night,
A semi-circle looks like a half moon that is bright!

🎵 A hexagon has six sides, count them one by one,
An octagon has eight sides, that is lots of fun!
Let's find the shapes around the room, look left and look right,
Every shape has properties that make it special and bright!`
  });

  // --- Grade 1: SSC Telangana Math Shapes ---
  songs.push({
    subject: 'math', topic: 'Shapes', grade: 1, curriculum: 'ssc-telangana',
    lyrics: `🎵 Vruttham (circle) is round goes rolling on the ground,
No corners anywhere, no edges can be found!
Chaturashram (square) has four sides, each one the same you see,
Equal sides and corners too, learning shapes is free!

🎵 Chorus:
Aakaaramulu, aakaaramulu,
Shapes around us everywhere!
Aakaaramulu, aakaaramulu,
Learning them beyond compare!

🎵 Tribhujam (triangle) has three sides and three corners neat,
Like the slice of pizza that we love to eat!
Ayatachaturashram (rectangle) has two sides long and two sides small,
Like the books upon our desk or a door in the hall!

🎵 A star is called nakshatramu with shining points of light,
An oval is called andajamu shaped like an egg so bright!
A diamond is vajra vajram with four sides all that shine,
Shapes in Telugu and in English, learning them feels fine!

🎵 Let us find vruttham in our class, a clock upon the wall,
Let us find a square in books we read, both big and small!
Aakaaramulu (shapes) everywhere in nature and in school,
Learning every single one is very, very cool!`
  });

  // --- Grade 1: Math Addition ---
  songs.push({
    subject: 'math', topic: 'Addition', grade: 1, curriculum: 'cbse',
    lyrics: `🎵 One plus one equals two, that is so easy to do!
Two plus two equals four, adding more and more!
Three plus three equals six, doing addition tricks!
Adding numbers every day, learning math is here to stay!

🎵 Chorus:
Addition means to put together, like the sun and rainy weather!
Add the numbers, count them all, big and small!
Addition helps us combine, makes our math knowledge shine!

🎵 Let us add a group of three apples on a tree,
Add two more and what we see, five apples now for me!
Four balloons up in the sky, add one more flying by,
Now we have as many as five balloons up high!

🎵 Six little birds sitting on the wire,
Add three more and soon we spy, nine birds in the sky!
Seven stars are shining bright, add two more to the night,
Now we see nine stars of light, twinkling with all their might!

🎵 Eight plus one is nine you know, adding makes our numbers grow!
Ten plus zero equals ten, adding over and over again!
Addition is fun to do when numbers are added by me and you!`
  });

  songs.push({
    subject: 'math', topic: 'Addition', grade: 1, curriculum: 'icse',
    lyrics: `🎵 One and one together make two,
Two and two together make four, that is through!
Three and three together make six,
Learning addition with clever tricks!

🎵 Chorus:
Koodika (addition) is the name in Telugu or add in English true!
Putting groups together now, one plus one makes two!
Addition is the operation that we are learning now,
It always makes the number grow, and that we know somehow!

🎵 Addition is the operation that combines two things,
Like adding flower petals or counting bird wings!
The addends are the numbers we put together today,
And the sum is the total, the answer hooray!

🎵 If you have five red balloons and two blue balloons you got,
The sum is seven balloons in the bunch that you have got!
The plus sign (+) tells us add, the equal sign (=) tells the sum,
Adding numbers is so easy and so fun!

🎵 Let's practice addition with objects that we see,
Two pencils plus two pencils makes four, come count with me!
Five blocks and three more blocks makes eight blocks all in a row,
Addition is the operation that helps our numbers grow!`
  });

  songs.push({
    subject: 'math', topic: 'Addition', grade: 1, curriculum: 'ssc-telangana',
    lyrics: `🎵 Koodika addition is putting numbers all together,
One katti (group) and one more katti makes two alright forever!
Rendu (two) and rendu (two) together make chappu (four) not three,
Adding numbers is so easy come and learn with me!

🎵 Chorus:
Koodika, koodika, add all numbers up!
Koodika, koodika, fill the adding cup!
One plus one is rendu, two plus two is nalugu,
Three plus three is aaru, counting is our value!

🎵 If you have three pencils in your bag at school today,
And you find two more pencils on your desk where you play,
Now you have aidu (five) pencils all lined up in a row,
Adding numbers helps us count and helps our numbers grow!

🎵 Four balloons are flying high up in the blue sky,
Add three more balloons and now there are edu (seven) up high!
Six flowers are blooming in the garden green and bright,
Add two more flowers and now the total is eight in sight!

🎵 Five books upon the shelf and three more books you see,
Ashtu (eight) books in total now for kids like you and me!
Nine stars are twinkling and add one more to the light,
Ten stars shining in the sky make the dark night bright!`
  });

  // --- Grade 1: Science My Body ---
  songs.push({
    subject: 'science', topic: 'My Body', grade: 1, curriculum: 'cbse',
    lyrics: `🎵 I have a head upon my top, on my face a nose that drops,
Two bright eyes to see the sky, two good ears to listen by!
One small mouth to eat and speak, two strong shoulders, arms and cheeks!
My body parts are working well, every single day they tell!

🎵 Chorus:
My body, my body, amazing from head to toe!
My body, my body, it helps me learn and grow!
My body, my body, I take good care of you!
My body, my body, you help in all I do!

🎵 I have ten fingers on my hands, clapping, waving small like bands!
Ten small toes upon my feet, running, jumping down the street!
Two legs strong to walk and run, one big heart beats and is never done!
Two lungs inside my chest that breathe air in, the very best!

🎵 My brain is in my head, it helps me think and read!
My stomach digests my food, breaking it down in a good mood!
My bones give me structure tall, my muscles help me throw a ball!
My skin protects me all around, the largest organ I have found!

🎵 I wash my body every day to keep the germs away!
I brush my teeth morning and night to keep them shining bright!
I eat good food and drink lots of water to stay healthy for my daughter!
Taking care of my body is the best thing I can be!`
  });

  songs.push({
    subject: 'science', topic: 'My Body', grade: 1, curriculum: 'icse',
    lyrics: `🎵 The human body is amazing, let me tell you all about it,
Every part has a special job and we cannot live without it!
The head is at the top of our body looking all around,
The neck connects our head to the rest that we have found!

🎵 Chorus:
Sharira, body, so wonderful and grand,
Made of so many parts working hand in hand!
Sharira, body, from head down to the feet,
Every part of our body works and is so neat!

🎵 Our hands have fingers and each finger has a nail,
Our feet have toes that help us balance on the trail!
The arms are for lifting and for hugging very tight,
The legs are for jumping, running with all our might!

🎵 Our eyes help us to see the colors and the light,
Our ears help us to hear sounds both soft and bright!
Our nose helps us to smell the flowers and the food,
Our tongue helps us to taste delicious or the crude!

🎵 The skin is the largest organ covering us all day,
It protects our inside parts in every single way!
Our skeleton of bones gives our body shape so strong,
Our muscles help us move and dance and sing a happy song!`
  });

  songs.push({
    subject: 'science', topic: 'My Body', grade: 1, curriculum: 'ssc-telangana',
    lyrics: `🎵 Naa shariram (my body) is special, amazing and so grand,
Talaku (head) is at the top with kangallu (eyes) across the land!
There are chevulu (ears) on both sides to hear everyone near,
Mukku (nose) to smell and noru (mouth) to say goodbye and cheer!

🎵 Chorus:
Naa shariram, naa shariram, so wonderful and strong!
Naa shariram, naa shariram, helps me all day long!
Naa shariram, naa shariram, from talaku to paadam (head to feet),
Every single part of me is helpful and is sweet!

🎵 Chetulu (hands) have ten vellulu (fingers) to clap and wave and hold,
Kaallu (legs) have ten kalivellulu (toes) that are precious as gold!
Bhujamulu (arms) to hug my friends and lift things up with grace,
Januvulu (knees) to bend and sit in any given place!

🎵 Kangallu (eyes) help me read and see the colors of the light,
Chevulu (ears) to listen to my teacher's lesson bright!
Mukku (nose) to smell the flowers growing in the park,
Noru (mouth) to eat good food from morning until dark!

🎵 Naaku (tongue) helps me taste sweet things and sour things and salt,
Charmam (skin) covers my shariram and never has a fault!
Ashtulu (bones) give me shape to stand up straight and tall,
Taking care of shariram is the best thing of them all!`
  });

  // -- Grade 1: Science Plants ---
  songs.push({
    subject: 'science', topic: 'Plants', grade: 1, curriculum: 'cbse',
    lyrics: `🎵 A plant has roots that grow below the ground,
They hold the plant and take water all around!
A stem grows up above the soil so tall,
It carries water to the leaves and to them all!

🎵 Chorus:
Plants give us food and the air we breathe so free,
Plants are important for you and for me!
Plants give us fruit, vegetables and wood,
Plants make our planet happy and good!

🎵 Leaves on a plant use sunlight to make food,
The process of photosynthesis is where all good things brewed!
A flower becomes a fruit with seeds inside,
New plants from those seeds will grow with nature as our guide!

🎵 Some plants are big like the tall banyan tree,
Some plants are small like grass that we can see!
Plants need sunlight and water to grow,
And good soil where roots can find a home below!

🎵 We get mangoes from the tree and spinach from the ground,
Every fruit and vegetable through plants is found!
Cotton from plants becomes our clothes to wear,
Trees give us shade and give us clean cool air!`
  });

  songs.push({
    subject: 'science', topic: 'Plants', grade: 1, curriculum: 'icse',
    lyrics: `🎵 Plants are living things that grow from tiny seeds so small,
They need water air and sunlight sunlight standing proud and tall!
A seed has a baby plant inside just waiting to be free,
When we plant it in the soil it soon becomes a tree!

🎵 Chorus:
Plants are living things that grow every single day,
Taking care of plants is great in every single way!
Plants are living things that breathe and eat and grow,
From tiny seeds to giant trees, plants help our planet glow!

🎵 Roots grow downward into the soil searching for the water,
The shoot grows upward to the sky happy as a daughter!
The stem supports the leaves and flowers growing everywhere,
The leaves are the food factory making food from the air!

🎵 Flowers are the colorful parts where seeds are made with care,
Some flowers become fruits that we eat, sweet and fair!
Fruits have seeds inside them that can grow into new trees,
This is called the plant life cycle, the story has no freeze!

🎵 Plants help us in many ways giving food and oxygen too,
They give us wood for furniture, paper and bamboo!
Plants give us medicine when we are feeling ill,
Plants give us shade and cool air on any sunny hill!`
  });

  songs.push({
    subject: 'science', topic: 'Plants', grade: 1, curriculum: 'ssc-telangana',
    lyrics: `🎵 Chettu (plant) has veru (roots) that grow deep in the ground,
Verulu hold the chettu strong and take water all around!
Kanda (stem) grows up above the matti (soil) so green and tall,
It takes water to the aakulu (leaves) and to the branches one and all!

🎵 Chorus:
Mokka (plants), mokka, so important every day!
Mokka give us aahara (food) and need our care in every way!
Mokka, mokka, from a tiny vithanamu (seed) they grow,
Mokka make our planet green with oxygen to show!

🎵 Aakulu (leaves) make food using surya kanti (sunlight) so bright,
The process is called photosynthesis working day and night!
Puvvu (flower) turns into pandu (fruit) with vithanalu (seeds) inside,
New mokka grow from those vithanalu with nature as our guide!

🎵 Some mokka are tall like the maamidi chettu (mango tree) so grand,
Some mokka are small like grass that grows upon the land!
Mokka need neellu (water), veLuturu (air) and matti to grow,
And surya kanti helping their aakulu to glow!

🎵 We get pandlu (fruits) from chettu and kura (vegetables) from below,
Every aahara that we eat through mokka does it flow!
Mokka give us pranavayu (oxygen) to breathe free every day,
Taking care of our mokka is the best in every way!`
  });

  // --- Grade 1: Spelling Sight Words ---
  songs.push({
    subject: 'spelling', topic: 'Sight Words', grade: 1, curriculum: 'cbse',
    lyrics: `🎵 The word "the" we read and write, in every book it comes in sight,
"I" and "you" and "we" and "they", sight words help us every day!
"A" and "an" and "is" and "it", reading them helps us to fit!
Sight words that we know by sight make reading quick and bright!

🎵 Chorus:
Sight words, sight words, read them with a glance!
Sight words, sight words, our reading will advance!
Sight words, sight words, we know them in a flash!
Sight words help our reading become so very fast!

🎵 "And" and "are" and "can" and "do", these words we see in books so new!
"For" and "go" and "has" and "he", these words help you and help me!
"In" and "is" and "it" and "like", these sight words are important in a bike!
"Look" and "my" and "no" and "not", these sight words we have got!

🎵 "On" and "play" and "run" and "see", learning sight words is the key!
"The" and "to" and "up" and "us", sight words are a must!
"We" and "yes" and "you" and "she", sight words set our reading free!
Reading them by sight not sound is the fastest way around!

🎵 Practice sight words every day, in the classroom and at play!
Flash cards help us memorize, sight words make reading wise!
When we know these words by sight, we read stories day and night!
Sight words are the building blocks for reading through the rocks!`
  });

  songs.push({
    subject: 'spelling', topic: 'Sight Words', grade: 1, curriculum: 'icse',
    lyrics: `🎵 Sight words are common words that we see every day,
We read them by looking not by sounding out the way!
"The" and "a" and "and" and "to", we recognize them fast,
"The boy and a girl went to school" is a sentence that will last!

🎵 Chorus:
Sight words, sight words, recognize them fast!
Sight words help our reading, our literacy skills amassed!
Sight words, sight words, we read them in a wink,
Sight words make our reading easier we think!

🎵 "He" and "she" and "it" and "we", "they" and "you" and "me",
These are pronouns that we read with our eyes so free!
"Can" and "will" and "do" and "did" are helping verbs to note,
"Has" and "have" and "had" and "is" we always read and quote!

🎵 "Big" and "small" and "hot" and "cold" are describing words to hold,
"Up" and "down" and "in" and "out" positional words no doubt!
"See" and "look" and "run" and "jump" are action words we plump,
"Eat" and "drink" and "sleep" and "play" are sight words every day!

🎵 Color words like "red" and "blue", "green" and "yellow" too,
"Black" and "white" and "brown" and "purple", sight words help us through!
Number words like "one" and "two", "three" and "four" and "five",
Reading sight words helps our literacy truly thrive!`
  });

  songs.push({
    subject: 'spelling', topic: 'Sight Words', grade: 1, curriculum: 'ssc-telangana',
    lyrics: `🎵 Sight words are padalu (words) we read by choodadam (seeing) not by spelling out,
"The" and "a" and "an" are words we read about!
"I" and "you" and "we" and "they" are pronouns we see every day,
Learning these by choodadam helps us read and play!

🎵 Chorus:
Sight words, sight words, recognize them with your eyes!
Sight words, sight words, reading quickly is the prize!
Sight words, sight words, no need to spell them out,
Sight words help our reading become strong without a doubt!

🎵 "Is" and "am" and "are" and "was" helping verbs that give a pause,
"Have" and "has" and "had" in books, "do" and "does" with knowing looks!
"Can" and "will" and "shall" and "may" in our reading books we lay,
"The cat can run" is a sentence that is fun!

🎵 "Big" and "small" and "tall" and "short" describing words for every sort,
"Hot" and "cold" and "wet" and "dry" describing words beneath the sky!
"In" and "on" and "under" show where things go,
"Up" and "down" and "inside" tell us all we know!

🎵 Numbers like okati (one) and rendu (two) we read them every day,
Colors like erupu (red) and neelam (blue) in reading books we lay!
Practice sight words every day, at school and then at play,
Reading English padalu fast makes our literacy last!`
  });

  // ===== GRADE 3 SONGS =====

  // --- Grade 3: Math Multiplication ---
  songs.push({
    subject: 'math', topic: 'Multiplication', grade: 3, curriculum: 'cbse',
    lyrics: `🎵 Multiplication is repeated addition, let me explain,
Two times four is eight again and again!
When we multiply we are adding groups with speed,
Two plus two plus two plus two is eight indeed!

🎵 Chorus:
Times tables, times tables, learn them all by heart,
Two times two is four, that is very smart!
Times tables, times tables, memorize them right,
Multiplication makes math easy day and night!

🎵 Two times one is two, two times two is four,
Two times three is six and then we learn some more!
Two times four is eight, two times five is ten,
Two times six is twelve, now try it once again!

🎵 Three times one is three, three times two is six,
Three times three is nine, learning multiplication tricks!
Three times four is twelve, three times five is fifteen,
Three times six is eighteen, the neatest thing we have seen!

🎵 Five times one is five, five times two is ten,
Five times three is fifteen, count and try again!
Five times four is twenty, five times five is twenty-five,
Five times six is thirty, multiplication helps us thrive!

🎵 A times table chart helps us see the pattern clear,
Skip counting is another strategy that helps us persevere!
Ten times any number just add a zero at the end,
Multiplication is a useful math skill we can comprehend!`
  });

  songs.push({
    subject: 'math', topic: 'Multiplication', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Multiplication, the operation of scaling numbers tall,
Two groups of three makes six in all!
The product is the answer we get when we multiply,
The multiplier and multiplicand with each other they do tie!

🎵 Chorus:
Gunakaram, gunakaram (multiplication in Telugu),
Grouping numbers is the clue!
Gunakaram, gunakaram,
Faster than addition, true!

🎵 The properties of multiplication help us understand,
Commutative means four times two is same as two times four in land!
Associative means group change does not change the product at all,
Two times three times four is same no matter the call!

🎵 Identity property says multiply by one and the number stays,
One times any number is that number all your days!
Zero property says multiply by zero, answer is always zero,
That is a multiplication fact, every math hero!

🎵 Four times one is four, four times two is eight,
Four times three is twelve, isn't that just great!
Four times four is sixteen, four times five is twenty,
Four times six is twenty-four, learning plenty!

🎵 Six times one is six, six times two is twelve,
Six times three is eighteen, you are doing very well!
Six times four is twenty-four, six times five is thirty,
Six times six is thirty-six, learning not too dirty!`
  });

  songs.push({
    subject: 'math', topic: 'Multiplication', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Gunakaram (multiplication) is a short way to add groups of same size,
Three groups of four is twelve, a wonderful surprise!
Gunyam (product) is the answer when we multiply two,
Gunakam (multiplier) and gunyam (multiplicand) help us see it through!

🎵 Chorus:
Gunakaram pusthakaalu (times tables), learn them all so well,
Okati padhikulu (eleven), pandrendlu (twelve) and other tables we can tell!
Gunakaram, gunakaram, faster than koodika (addition) by far,
Gunakaram helps in math no matter where you are!

🎵 Rendla gunakaram (table of two) step by step,
Two ones are two, two twos are four, all in our mental prep!
Two threes are six, two fours are eight,
Two fives are ten, learning them is great!

🎵 Moodu gunakaram (table of three), let us learn it too,
Three ones are three, three twos are six so true!
Three threes are nine, three fours are twelve,
Three fives are fifteen, learning helps ourselves!

🎵 Aidu gunakaram (table of five) is easy memory to make,
Five ones are five, five twos are ten for goodness sake!
Five threes are fifteen, five fours are twenty,
Five fives are twenty-five, learning in plenty!

🎵 Padhi gunakaram (table of ten) is the simplest of them all,
Ten times any number just add a zero and that's all!
Ten ones are ten, ten twos are twenty,
Gunakaram in math class is learning full of plenty!`
  });

  // --- Grade 3: Math Shapes/Geometry ---
  songs.push({
    subject: 'math', topic: 'Shapes', grade: 3, curriculum: 'cbse',
    lyrics: `🎵 Geometry is the study of shapes in the world around,
Every shape has properties that in math class can be found!
A polygon is a closed shape with straight sides three or more,
Triangle, quadrilateral, pentagon and many more in store!

🎵 Chorus:
Shapes and designs all around we see,
In art and nature and geometry!
Edges and vertices, faces and sides,
Every shape in geometry abides!

🎵 A triangle has three sides, three angles, vertices three,
It can be equilateral with all sides equally!
Isosceles has two sides equal, scalene has all different,
Learning about triangles makes us more intelligent!

🎵 A quadrilateral has four sides, like square and rectangle too,
A square has equal sides, rectangle has opposite sides true!
A rhombus has equal sides but angles are not right,
A parallelogram has opposite sides that are parallel and bright!

🎵 A pentagon has five sides, hexagon has six,
Heptagon has seven, octagon eight, learning full of tricks!
A circle has no sides at all, just one curved line,
The distance from center to edge is the radius we define!

🎵 Perimeter is the total distance around a shape's boundary line,
Add all the sides to find the perimeter and it will be fine!
Area is the space inside a shape that's measured in square units,
Learning geometry gives our mathematical mind a big boost!`
  });

  songs.push({
    subject: 'math', topic: 'Shapes', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Geometry comes from Greek words for earth and measurement,
Measuring the shapes around us is what geometry meant!
A point has no size, a line has no end,
A line segment has two endpoints from which we can depend!

🎵 Chorus:
Geometry of shapes and sizes great,
Measuring angles and sides is our fate!
Geometry from flat to solid shapes too,
Learning geometry helps us see the world brand new!

🎵 An angle is formed where two lines meet or intersect,
A right angle is ninety degrees, the angle we expect!
An acute angle is less than ninety degrees of measure,
An obtuse angle is greater than ninety and is a different treasure!

🎵 Two-dimensional shapes are flat with length and width you see,
Three-dimensional shapes have depth as well, like cubes and spheres they be!
A cube has six square faces all equal in their size,
A cuboid has six rectangular faces, a different shape surprise!

🎵 A sphere is round like a ball with no flat face at all,
A cylinder has two circular faces and a curved side tall!
A cone has one circular base that tapers to a point,
Learning about solid shapes is a feeling out of joint!

🎵 Symmetry is when one half matches the other side,
A line of symmetry cuts a shape where both sides coincide!
A shape can have one line of symmetry or many at all,
Learning geometry helps our logical thinking grow tall!`
  });

  songs.push({
    subject: 'math', topic: 'Shapes', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Geometry is rekha ganitamu (line math in Telugu),
Studying shapes in the world around is what geometry do!
A aakaramu (shape) can be flat like a rekha chitramu (line drawing) on the page,
Or solid like a ghanuni pramaanam (3D shape) on the stage!

🎵 Chorus:
Aakaaramulu, aakaaramulu (shapes, shapes),
Everywhere we see!
Aakaaramulu, aakaaramulu,
In our geometry!

🎵 Tribhujam (triangle) has three bhujamulu (sides) and three konamulu (angles) too,
Square and rectangle are chaturbhujamulu (quadrilaterals) through and through!
A square has all four sides equal and konamulu all right,
A rectangle has opposite equal sides, a different shape in sight!

🎵 Chakram (circle) has a vyasam (diameter) and vyasardham (radius) within,
A circle has no bhujamulu (sides) just one curved line to begin!
Chakram paryantam (circumference) is the distance around the chakram true,
Learning about circles and their parts is a joyous avenue!

🎵 Ghanuni aakaaramulu (solid shapes) have length width height too,
Ghanam (cube) has six chaturasra phalakaalu (square faces) all equal through!
Ghana chaturasram (cuboid) has ayata phalakaalu (rectangular faces) six,
Kunda (sphere) is round like a ball doing tricks!

🎵 Kankam (cylinder) has two vrutta phalakaalu (circular faces) and a vakra phalam (curved face) between,
Shankuvu (cone) has one vruttamu (circular base) at the bottom that can be seen!
Prastaram (symmetry) means aakaram splits into two halves that match the same,
Learning rekha ganitamu is an interesting game!`
  });

  // --- Grade 3: Science Living Things ---
  songs.push({
    subject: 'science', topic: 'Living Things', grade: 3, curriculum: 'cbse',
    lyrics: `🎵 Living things are all around, animals, plants and also me,
They grow and breathe and need food and water to be!
Non-living things do not grow and do not eat or breathe,
A rock or a chair or a pencil cannot increase its size beneath!

🎵 Chorus:
Living things grow and change each day,
Non-living things always stay the same way!
Living things need food and air to live,
Non-living things have nothing they need to give!

🎵 All living things are born, they grow and reproduce,
Plants from seeds and animals from parents, that's the use!
Living things need food for energy to work and play,
Plants make their own food using sunlight every day!

🎵 Animals find food by hunting or by eating plants and grass,
Herbivores eat plants, carnivores eat meat, so fast!
Omnivores eat both plants and meat to stay strong,
Living things are eating food all the whole day long!

🎵 Living things respond to changes in the world,
When they feel too cold they move or when they get too hot unfurled!
They have senses that help them see and hear and feel and smell and taste,
Living things are always adapting, learning, growing in haste!

🎵 All living things found on Earth need water to stay alive,
Without water plants will dry and no life can survive!
Living things need air and shelter from the sun and rain,
Protecting all living things is what we should sustain!`
  });

  songs.push({
    subject: 'science', topic: 'Living Things', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Living things have seven characteristics that define them all,
Movement, respiration, sensitivity, growth, they stand up tall!
Reproduction, excretion, nutrition, these complete the list,
Any thing that does all seven as a living thing exists!

🎵 Chorus:
Living things are full of life and energy so grand,
Managing to survive and thrive in any kind of land!
Living things are special they can change and grow and be,
The seven characteristics help us living things to clearly see!

🎵 Movement means living things can change their body position,
Animals walk swim and fly with natural volition!
Plants move towards sunlight, their shoots grow up so high,
Roots grow downwards into soil, searching, reaching nigh!

🎵 Respiration is the way they get energy from the food,
They breathe in oxygen and release carbon dioxide as is good!
Sensitivity is responding to the changes in the air,
Light, sound, touch and temperature are things that living things care!

🎵 Growth means living things increase in size as time goes by,
A seed becomes a sapling and then a tree up high!
Reproduction means they can make new ones of their kind,
Some from seeds some from eggs, living things are designed!

🎵 Excretion is removing waste materials from inside,
Nutrition is taking food to live, the need that will abide!
These seven characteristics show what being alive means,
Every living thing on Earth from riversides to mountain streams!`
  });

  songs.push({
    subject: 'science', topic: 'Living Things', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Jeevi vastuvulu (living things) have gunamulu (characteristics) seven so true,
Chalana (movement), swasakriya (respiration), that is what they do!
Prathispena (sensitivity), vrudhi (growth), prajanana (reproduction) too,
Visarjana (excretion) and poshana (nutrition) are the other clues!

🎵 Chorus:
Jeevi vastuvulu are alive and can feel,
They need aahara (food) and neellu (water) to stay real!
Jeevi vastuvulu grow and change every day,
Learning about them is the best in every way!

🎵 Chalana (movement) means they can move from place to place,
Januvulu (animals) walk and swim and fly at any pace!
Mokkalu (plants) move their leaves towards surya kanti (sunlight) so bright,
Vrukshamu (tree) roots grow deep in soil searching day and night!

🎵 Swasakriya (respiration) gives them shakti (energy) from the food they take,
They release carbon dioxide and oxygen for the earth's sake!
Prathispena (sensitivity) means they respond to sparsam (touch) and light,
They feel the temperature changing from the day into the night!

🎵 Vrudhi (growth) means they increase in garuvu (size) and get big and tall,
A small vithanamu (seed) becomes a tree growing straight up above all!
Prajanana (reproduction) means jeevi vastuvulu create new ones of their race,
Mokkalu from vithanamu, januvulu from andam (eggs) that they place!

🎵 Visarjana (excretion) is removing waste that body does not need,
Poshana (nutrition) is eating aahara to grow a healthy breed!
These seven gunamulu make a thing truly alive,
Every jeevi vastuvulu from a bee to a beehive!`
  });

  // --- Grade 3: Science Our Body ---
  songs.push({
    subject: 'science', topic: 'Our Body', grade: 3, curriculum: 'cbse',
    lyrics: `🎵 Our body is a wonderful machine with many systems inside,
The skeletal system gives us shape with bones that in us hide!
The skull protects our brain up in our head,
The rib cage guards our heart and lungs in our body spread!

🎵 Chorus:
Our body systems work together as a team,
Helping us to live and move and dream!
The skeletal system gives us shape and frame,
Without our bones we would not be the same!

🎵 The muscular system helps us move our arms and legs and more,
There are over 600 muscles flexing from the floor!
Some muscles we control to move when we want them to,
Some work automatically like the heart beating for you!

🎵 The digestive system turns our food into energy so grand,
Starting with the mouth and teeth, then stomach where food is planned!
The food goes to the small intestine where nutrients are absorbed,
Large intestine removes the waste that from the food is stored!

🎵 The respiratory system lets us breathe the air so free,
We breathe in oxygen through the nose or mouth you see!
The air goes to our lungs inside the rib cage space,
The diaphragm helps them expand and contract at breathing pace!

🎵 The circulatory system has the heart and blood vessels too,
The heart pumps blood through arteries, veins and capillaries through!
Blood carries oxygen and nutrients to every body cell,
And takes away the waste products from where in us they dwell!`
  });

  songs.push({
    subject: 'science', topic: 'Our Body', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Our body has many organ systems coordinating as a whole,
The nervous system is the control center controlling every role!
The brain is the commander inside the protected skull,
The spinal cord sends messages that make our body full!

🎵 Chorus:
Organ systems, organ systems, working all together,
In every kind of place and any kind of weather!
Organ systems, organ systems, ten in number true,
Learning body systems is an exciting avenue!

🎵 The skeletal system has two hundred and six bones at adult size,
Joints are where two bones connect, a movable compromise!
Ligaments connect bone to bone so strong,
Cartilage is the cushion that stops the bones going wrong!

🎵 The muscular system has three kinds, smooth and skeletal and cardiac,
Skeletal muscles are attached to bones by tendons, they work on a track!
Cardiac muscle makes the heart pump day and night,
Smooth muscles line our internal organs and work without our sight!

🎵 The digestive system starts at the mouth with teeth for chewing food,
The oesophagus carries food to stomach where it is brewed!
The liver and pancreas help with digestion too,
The small intestine absorbs nutrients, the large eliminates residue!

🎵 The respiratory system brings oxygen in and carbon dioxide out,
The trachea or windpipe carries air in without a doubt!
The lungs with their alveoli do the gas exchange,
The diaphragm helps us inhale without a range!

🎵 The circulatory system has the heart that pumps blood all around,
The blood carries nutrients and oxygen to where they can be found!
Arteries carry blood away, veins carry blood back,
Capillaries connect them all through the body's endless track!`
  });

  songs.push({
    subject: 'science', topic: 'Our Body', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Mana shariram (our body) has so many vyavasthalu (systems) working every day,
Ashti vyavastha (skeletal system) gives shape to our body in every way!
Kapalam (skull) protects our medha (brain) up in our head so well,
Pattelu (rib cage) guards our gundelu (heart) and uppusiri (lungs) where air can dwell!

🎵 Chorus:
Sharira vyavasthalu, sharira vyavasthalu,
Working all as one!
Sharira vyavasthalu, sharira vyavasthalu,
Helping us have fun!

🎵 Snayu vyavastha (muscular system) helps us kuduguta (move) and throw,
There are many snayuvulu (muscles) that bend our arms and help us grow!
Gunda snayu (cardiac muscle) beats our gunde (heart) without a rest,
We can control some snayuvulu while others work as best!

🎵 Jeerna vyavastha (digestive system) changes our aahara (food) into shakti (energy) right,
Noru (mouth) and palukulu (teeth) start to chew and break the food in sight!
Aahara kosam (oesophagus) takes food to the jalara (stomach) where it churns,
Chinna prani kosam (small intestine) absorbs the nutrients that our body earns!

🎵 Swasa vyavastha (respiratory system) lets us veLuTuru (breathe) the air so fresh,
Mukku (nose) and noru (mouth) take veLuTuru in like a precious mesh!
Uppusiri pothalu (lungs) are where gas exchange takes place,
The veLuTuru goes in and out at a steady pace!

🎵 Rakta pradanana vyavastha (circulatory system) with gunde (heart) beating true,
Raktam (blood) goes through dhamani (arteries) and sira (veins) through and through!
Raktam carries pranavayu (oxygen) to every koshamu (cell) inside,
And carries away waste from where in our body it does hide!`
  });

  // --- Grade 3: Spelling Homophones ---
  songs.push({
    subject: 'spelling', topic: 'Homophones', grade: 3, curriculum: 'cbse',
    lyrics: `🎵 Homophones are words that sound the same but differently spelled,
Their meanings are different as well, something to be held!
"There" tells a place, "their" shows belonging, "they're" means they are,
Three words that sound the same but different from afar!

🎵 Chorus:
Homophones, homophones, same sound different spelling!
Homophones, homophones, the difference we are telling!
Homophones are tricky so we learn each one with care,
Knowing which to use tells others that we really care!

🎵 "To" is for direction, "too" means also or too much,
"Two" is the number two as in one plus one is such!
I went to the store and bought two apples too,
Learning homophones is a good thing for me and you!

🎵 "Here" means this place, "hear" means with my ears,
"I can hear you from here" makes sense through all the years!
"By" means near or the person who made it you see,
"Buy" means to purchase, "bye" means goodbye to be!

🎵 "Sun" is in the sky bright and gives us light,
"Son" is a boy in a family morning noon or night!
"Flour" is what we use for baking bread so nice,
"Flower" is a pretty plant with fragrance like a spice!

🎵 "Sea" is a big body of water, saltwater all around,
"See" is with our eyes the vision that we found!
"Weak" means not strong, "week" is seven days,
"Break" means to separate, "brake" stops the car in many ways!`
  });

  songs.push({
    subject: 'spelling', topic: 'Homophones', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Homophones are words that share the same pronunciation,
But differ in spelling and meaning, a spelling variation!
"There, their, they're" are the classic example we all know,
There is the place, their is possession, they're is they are, watch them go!

🎵 Chorus:
Homophones, homophones, tricky as can be!
Same sound, different meaning for you and me!
Homophones, homophones, learn them one by one,
When you get them right you have the spelling battle won!

🎵 "Your" shows something belongs to you we say,
"You're" is short for you are in every single way!
"Whose" asks who owns it, "who's" is who is or who has,
These are homophone pairs that in writing come to pass!

🎵 "Knight" is a medieval warrior with sword and shield,
"Night" is the dark time when stars in the sky are revealed!
"Write" means to put words on paper with a pen,
"Right" means correct or a direction you say again!

🎵 "Male" is a boy or a man of the species,
"Mail" is letters and packages that come in the pieces!
"Pair" means two things that belong together like a pair of shoes,
"Pear" is a sweet fruit that grows on a tree that we use!

🎵 "Bare" means uncovered or empty not filled,
"Bear" can be an animal or to carry something, learn it drilled!
"Cell" is a small room or the basic unit of life,
"Sell" means to exchange for money, reducing the strife!`
  });

  songs.push({
    subject: 'spelling', topic: 'Homophones', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Homophones are samanamuga palikina padalu (words that sound the same),
But spellinglu veru (different spellings) and veru arthalu (different meanings) they have to name!
"There" means akkada (there) a place, "their" means vaari (their) belonging,
"They're" means vaaru (they are) all three different words worth knowing!

🎵 Chorus:
Homophones, samana padaalu (same-sounding words),
Learn each one, they are treasures to be heard!
Same dhvani (sound) but different spelling and meaning too,
Homophones when learned right make spellers out of you!

🎵 "To" means varaku (towards) a destination we see,
"Too" means kooda (also) or a lot like "chala" so be!
"Two" is the sankhya (number) rendu (two) we can count,
Learn these homophones and they will surely amount!

🎵 "Here" means ikkada (here) where we are standing today,
"Hear" means vinadam (to hear) with our chevulu (ears) hooray!
"By" means daggaraga (near) or the creator you see,
"Buy" means konadam (to purchase) for vela (price) that may be!

🎵 "Sun" is surya (sun) that shines bright in the sky,
"Son" is a putrudu (son) of a family standing nearby!
"Flour" is pindi (flour) for making bread in the kitchen so grand,
"Flower" is puvvu (flower) in the garden or in hand!

🎵 Practiceing homophones in English every day,
Helps us write the right padaalu (words) in the proper way!
Context helps us know which spelling to choose,
Getting homophones correct is good English we use!`
  });

  // --- Grade 3: Spelling Compound Words ---
  songs.push({
    subject: 'spelling', topic: 'Compound Words', grade: 3, curriculum: 'icse',
    lyrics: `🎵 Compound words are made from two smaller words combined,
Like combining sun and flower to make a sunflower kind!
The meaning of the compound word comes from both parts you see,
"Sunflower" is a flower facing the sun so free!

🎵 Chorus:
Compound words, compound words, put two words into one,
Compound words help us create new words it can be done!
Two smaller words combine to make a bigger word so grand,
Learning compound words helps us understand!

🎵 "Rain" plus "bow" equals rainbow across the sky,
"Foot" plus "ball" equals football that we kick very high!
"Bed" plus "room" equals bedroom where we sleep each night,
"Door" plus "bell" equals doorbell that rings with all our might!

🎵 "Butter" plus "fly" equals butterfly that flutters through the air,
"Star" plus "fish" equals starfish in the ocean deep and fair!
"Snow" plus "man" equals snowman built when snow does fall,
"Fire" plus "fly" equals firefly lighting up for all!

🎵 "Class" plus "room" equals classroom where we study every day,
"Play" plus "ground" equals playground where we run and play!
"Book" plus "case" equals bookcase storing books so many,
"Candy" plus "bar" equals candy bar sweet as a penny!

🎵 The first word often tells you the kind or type it will be,
The second word tells you the object or thing that you see!
Some compound words are closed like "sunflower" all together,
Some are open like "ice cream" with a space to weather!`
  });

  songs.push({
    subject: 'spelling', topic: 'Compound Words', grade: 3, curriculum: 'ssc-telangana',
    lyrics: `🎵 Compound words are samaasta padalu (combined words) in English true,
Made from rendu (two) chhina (small) padalu (words) making a word brand new!
First word plus second word give the new compound meaning bright,
Like "sun" and "flower" make "sunflower", a beautiful sight!

🎵 Chorus:
Samaasta padalu, samaasta padalu,
Two words joined as one!
Samaasta padalu, samaasta padalu,
Learning them is fun!

🎵 "Rain" and "bow" make "rainbow" in the sky so bright,
"Foot" and "ball" make "football" that we kick with all our might!
"Bed" and "room" make "bedroom" where we sleep at night,
"Bed" and "room" combine to show a room with beds in sight!

🎵 "Butter" and "fly" make "butterfly" flying all around,
"Tooth" and "brush" make "toothbrush" that keeps our teeth clean and sound!
"Every" and "thing" make "everything" all that we can see,
"Them" and "selves" make "themselves" meaning them personally!

🎵 "Some" and "thing" make "something" an object unknown,
"Any" and "one" make "anyone" a person we are thrown!
"Every" and "one" make "everyone" meaning all of us,
Learning samaasta padalu is a great big plus!

🎵 Focus on the first word, it often tells the kind,
The second tells the object or what you have in mind!
Practice reading compound words in books you read each day,
Samaasta padalu are another tool for English that will stay!`
  });

  let insertMany = db.transaction(songs => {
    for (const s of songs) {
      insert.run(s.subject, s.topic, s.grade, s.curriculum, `${s.subject}-${s.topic.toLowerCase()}`, s.lyrics, genShareId());
    }
  });

  insertMany(songs);
  console.log(`Seeded ${songs.length} pre-written songs.`);
}

seed();