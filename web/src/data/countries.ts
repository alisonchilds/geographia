import type { CountryContent } from '../types';
import { commons } from '../lib/images';

// Curated, hand-written architecture histories for flagship countries.
// Keys MUST match the `properties.name` field in public/countries-110m.json so
// the map can look them up directly. Any country not present here falls back to
// live Wikipedia content (see lib/wikipedia.ts).
export const CURATED: Record<string, CountryContent> = {
  Italy: {
    name: 'Italy',
    wikipediaTitle: 'Architecture_of_Italy',
    flagEmoji: '\u{1F1EE}\u{1F1F9}',
    tagline: 'From Etruscan tombs to vertical forests',
    heroImage: commons('Colosseo 2020.jpg', 1400),
    heroCredit: 'Colosseum, Rome \u2014 Wikimedia Commons',
    intro:
      'Italian architecture spans nearly three millennia, from Greek colonial temples and Etruscan tombs through the engineering of ancient Rome, the rebirth of classical ideals in the Renaissance, and the theatrical exuberance of the Baroque, to bold Rationalist and contemporary statements. Italy effectively wrote the grammar of Western building, and its monuments remain a living reference library for architects worldwide.',
    eras: [
      {
        id: 'magna-graecia',
        period: 'c. 800 \u2013 100 BCE',
        title: 'Magna Graecia & the Etruscans',
        text: 'Before Rome, Greek settlers raised Doric temples across southern Italy and Sicily, while the Etruscans of the centre built podium temples and elaborate rock-cut tombs. Paestum preserves three of the best Greek temples anywhere, and the painted tombs of Cerveteri reveal how the Etruscans imagined the house of the dead.',
        media: [
          { kind: 'image', src: commons('Paestum BW 2013-05-17 13-58-28.jpg', 1200), caption: 'Greek temples at Paestum (Magna Graecia)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Tomba dei Rilievi (Banditaccia).jpg', 1000), caption: 'Etruscan Tomb of the Reliefs, Cerveteri', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'roman',
        period: 'c. 509 BCE \u2013 476 CE',
        title: 'Ancient Rome',
        text: 'Rome industrialised construction. The invention of opus caementicium (Roman concrete) and the systematic use of the arch, vault, and dome let builders enclose vast public spaces. The Colosseum stacked the Greek orders across an 80-arch facade, while the Pantheon\u2019s unreinforced concrete dome \u2014 still the largest of its kind \u2014 crowned a perfect interior sphere lit by a single oculus.',
        media: [
          { kind: 'image', src: commons('Colosseo 2020.jpg', 1200), caption: 'The Colosseum (72\u201380 CE), Rome', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Pantheon front.jpg', 1200), caption: 'The Pantheon (c. 126 CE), Rome', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'early-christian',
        period: 'c. 313 \u2013 600',
        title: 'Early Christian',
        text: 'As Christianity became legal, worship adopted the Roman basilica: a long, colonnaded hall leading to an apse. Plain brick exteriors gave way to luminous interiors of marble columns and gilded mosaic. Santa Sabina in Rome is among the purest survivors of this restrained, soaring type.',
        media: [
          { kind: 'image', src: commons('Santa Sabina (Rome) - Interior.jpg', 1200), caption: 'Basilica of Santa Sabina, Rome (422\u2013432)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'byzantine',
        period: 'c. 500 \u2013 800',
        title: 'Byzantine',
        text: 'In Ravenna, capital of the late empire, Byzantine builders sheathed centrally planned churches in shimmering mosaic. San Vitale\u2019s octagonal interior and the star-spangled vault of the Mausoleum of Galla Placidia turn architecture into a vision of heaven rendered in glass and gold.',
        media: [
          { kind: 'image', src: commons('Basilica of San Vitale.jpg', 1200), caption: 'Basilica of San Vitale, Ravenna (consecrated 547)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Mausoleum of Galla Placidia in Ravenna.JPG', 1000), caption: 'Mausoleum of Galla Placidia, Ravenna', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'romanesque',
        period: 'c. 1000 \u2013 1200',
        title: 'Romanesque',
        text: 'Round arches, thick walls, and rhythmic arcaded galleries defined the Romanesque. The cathedral complex at Pisa wraps the type in striped marble \u2014 and its freestanding bell tower famously began to lean before it was even finished.',
        media: [
          { kind: 'image', src: commons('Leaning Tower of Pisa.jpg', 1000), caption: 'The Leaning Tower of Pisa (begun 1173)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'gothic',
        period: 'c. 1200 \u2013 1400',
        title: 'Italian Gothic',
        text: 'Italy adapted northern Gothic to its own taste, favouring broad wall surfaces, polychrome marble, and restrained verticality over soaring skeletal stone. Milan Cathedral is the great exception \u2014 a forest of pinnacles and flying buttresses that took nearly six centuries to complete.',
        media: [
          { kind: 'image', src: commons('Milan Cathedral from Piazza del Duomo.jpg', 1200), caption: 'Milan Cathedral, begun 1386', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'renaissance',
        period: 'c. 1400 \u2013 1520',
        title: 'Renaissance',
        text: 'In Florence, Brunelleschi revived classical proportion and solved the problem of roofing the cathedral crossing with a double-shell dome raised without centring \u2014 a feat of mathematics and masonry that announced a new age. Architects such as Alberti, Bramante, and Palladio codified harmony, symmetry, and the orders into a discipline studied for centuries.',
        media: [
          { kind: 'image', src: commons('Florence Duomo from Michelangelo hill.jpg', 1200), caption: 'Florence Cathedral dome by Brunelleschi (1420\u201336)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Cattedrale di Santa Maria del Fiore \u2013 Il Duomo di Firenze.jpg', 1200), caption: 'Santa Maria del Fiore, Florence', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'mannerism',
        period: 'c. 1520 \u2013 1600',
        title: 'Mannerism',
        text: 'Mannerist architects bent the rules they had just learned, introducing deliberate tension, surprise, and theatrical distortion. Giulio Romano\u2019s Palazzo Te in Mantua plays games with the classical vocabulary \u2014 slipping triglyphs and rusticated grottoes that wink at the educated eye.',
        media: [
          { kind: 'image', src: commons('Mantova 104.jpg', 1200), caption: 'Palazzo Te, Mantua (1525\u201335)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'baroque',
        period: 'c. 1600 \u2013 1750',
        title: 'Baroque & Rococo',
        text: 'Rome became a stage. Bernini and Borromini bent walls into dynamic curves, fused architecture with sculpture and water, and choreographed light to move the faithful. The Trevi Fountain pours this theatrical spirit into the city, while the cascading Spanish Steps stage urban space as pure drama.',
        media: [
          { kind: 'image', src: commons('Trevi Fountain, Rome, Italy 2 - May 2007.jpg', 1200), caption: 'Trevi Fountain, completed 1762', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Piazza di Spagna (Rome) 0004.jpg', 1200), caption: 'The Spanish Steps, Rome (1723\u201325)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'neoclassical',
        period: 'c. 1750 \u2013 1900',
        title: 'Neoclassical & 19th century',
        text: 'A renewed appetite for antique purity produced palaces of monumental clarity such as the colossal Royal Palace of Caserta. In the industrial nineteenth century, iron and glass enabled new public types \u2014 most spectacularly the soaring cruciform arcade of Milan\u2019s Galleria Vittorio Emanuele II.',
        media: [
          { kind: 'image', src: commons('Campania Caserta2 tango7174.jpg', 1200), caption: 'Royal Palace of Caserta (begun 1752)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Galleria Milano (179532365).jpeg', 1200), caption: 'Galleria Vittorio Emanuele II, Milan (1865\u201377)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'rationalism',
        period: 'c. 1920 \u2013 1943',
        title: 'Rationalism & the Fascist era',
        text: 'Between the wars, Italian Rationalists married modern abstraction to monumental order. Terragni\u2019s crisp Casa del Fascio in Como is a manifesto of clarity, while the EUR district\u2019s \u201cSquare Colosseum\u201d translated Roman arches into stark, repetitive modernity.',
        media: [
          { kind: 'image', src: commons('Palazzo della civilt\u00e0 del lavoro (EUR, Rome) (5904657870).jpg', 1200), caption: 'Palazzo della Civilt\u00e0 Italiana, EUR, Rome (1938\u201343)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Como - Casa del Fascio - 27-09-2017.jpg', 1000), caption: 'Casa del Fascio, Como (Terragni, 1932\u201336)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'contemporary',
        period: '1950 \u2013 present',
        title: 'Modern & Contemporary',
        text: 'Postwar Italy produced elegant towers like Gio Ponti\u2019s Pirelli skyscraper and, more recently, world landmarks of sustainable and sculptural design \u2014 from Zaha Hadid\u2019s flowing MAXXI museum to Stefano Boeri\u2019s plant-covered Bosco Verticale towers.',
        media: [
          { kind: 'image', src: commons('MAXXI (27483747665).jpg', 1200), caption: 'MAXXI museum, Rome (Zaha Hadid, 2010)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Bosco Verticale Milano.jpg', 1000), caption: 'Bosco Verticale, Milan (2014)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons("Looking up at Torre Pirelli from Piazza Duca d'Aosta, Milan.jpg", 1000), caption: 'Pirelli Tower, Milan (Gio Ponti, 1958)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },

  Japan: {
    name: 'Japan',
    wikipediaTitle: 'Japanese_architecture',
    flagEmoji: '\u{1F1EF}\u{1F1F5}',
    tagline: 'Timber craft, sacred geometry, and the art of impermanence',
    heroImage: commons('Himeji Castle The Keep Towers.jpg', 1400),
    heroCredit: 'Himeji Castle \u2014 Wikimedia Commons',
    intro:
      'Japanese architecture is defined by sophisticated timber joinery, a deep dialogue between building and landscape, and an aesthetic that embraces impermanence. Indigenous Shinto traditions met continental Buddhist models in the 6th century, and over a millennium they were transformed into something distinctly Japanese: modular, light, and exquisitely detailed.',
    eras: [
      {
        id: 'shinto',
        period: 'Ancient \u2013 present',
        title: 'Shinto Shrines',
        text: 'Japan\u2019s native architecture is the Shinto shrine: unpainted cypress, thatched roofs, and a profound respect for natural materials. The inner shrines of Ise are ritually rebuilt every twenty years, keeping an ancient form perpetually new, while the great torii of Itsukushima appears to float on the sea.',
        media: [
          { kind: 'image', src: commons('Naiku 04.jpg', 1200), caption: 'Naik\u016b, Ise Grand Shrine', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Itsukushima Shrine Torii Gate (13890465459).jpg', 1200), caption: 'The floating torii of Itsukushima', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'nara',
        period: '710 \u2013 794',
        title: 'Nara / Buddhist Temples',
        text: 'Buddhism brought monumental timber halls, bracket-arm roof systems, and axial temple plans from China and Korea. T\u014Ddai-ji\u2019s Great Buddha Hall remains one of the largest wooden buildings on earth, sheltering a colossal bronze Buddha.',
        media: [
          { kind: 'image', src: commons('Todaiji Daibutsuden.jpg', 1200), caption: 'T\u014Ddai-ji Great Buddha Hall, Nara', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Sensoji 2012.JPG', 1000), caption: 'Sens\u014D-ji, Tokyo', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'muromachi',
        period: '1336 \u2013 1573',
        title: 'Muromachi / Zen Aesthetics',
        text: 'Zen Buddhism shaped a culture of refined simplicity, dry rock gardens, and tea-house intimacy. The Golden Pavilion (Kinkaku-ji) sets a gilded reliquary against a reflecting pond, uniting three architectural styles in one serene composition.',
        media: [
          { kind: 'image', src: commons('Kinkakuji 2.jpg', 1200), caption: 'Kinkaku-ji (Golden Pavilion), Kyoto', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'sukiya',
        period: '1600 \u2013 1868',
        title: 'Sukiya & the Tea Aesthetic',
        text: 'The understated sukiya style grew out of the tea ceremony, prizing rustic materials, asymmetry, and a seamless flow between interior and garden. The Katsura Imperial Villa is its masterpiece \u2014 so admired by modernists that Bruno Taut and Walter Gropius called it timelessly modern.',
        media: [
          { kind: 'image', src: commons('Katsura Rikyu (3264799678).jpg', 1200), caption: 'Katsura Imperial Villa, Kyoto (17th c.)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'castle',
        period: '1576 \u2013 1639',
        title: 'Castle Architecture',
        text: 'During the era of warring states, lords raised towering hilltop castles on cyclopean stone bases topped with multi-storey timber keeps. Himeji \u2014 the \u201cWhite Heron\u201d \u2014 is the finest survivor, its brilliant plaster walls concealing a maze of defensive ingenuity.',
        media: [
          { kind: 'image', src: commons('Himeji Castle The Keep Towers.jpg', 1200), caption: 'Himeji Castle, completed 1609', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'modern-jp',
        period: '1945 \u2013 present',
        title: 'Modern & Metabolism',
        text: 'Postwar Japan became a laboratory for world architecture. Kenz\u014D Tange\u2019s sweeping Yoyogi National Gymnasium fused traditional sensibility with daring suspension engineering for the 1964 Olympics, launching the influential Metabolist movement.',
        media: [
          { kind: 'image', src: commons('Kokuritsu Yoyogi Ky\u014Dgij\u014D 1.jpg', 1200), caption: 'Yoyogi National Gymnasium (Kenz\u014D Tange, 1964)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },

  Egypt: {
    name: 'Egypt',
    wikipediaTitle: 'Ancient_Egyptian_architecture',
    flagEmoji: '\u{1F1EA}\u{1F1EC}',
    tagline: 'From pyramids of eternity to Islamic Cairo',
    heroImage: commons('Pyramids of the Giza Necropolis.jpg', 1400),
    heroCredit: 'Giza Necropolis \u2014 Wikimedia Commons',
    intro:
      'Egypt\u2019s architecture pursued permanence above all. Built in stone for the gods and the dead while the living dwelt in mud-brick, its pyramids, temples, and rock-cut tombs encode a civilisation\u2019s cosmology in monumental geometry. Millennia later, Islamic Cairo layered minarets and domes into one of the great medieval cities, and modern Egypt added landmarks of its own.',
    eras: [
      {
        id: 'oldkingdom',
        period: 'c. 2686 \u2013 2181 BCE',
        title: 'Old Kingdom \u2013 The Pyramids',
        text: 'The age of pyramid building perfected the art of cutting, hauling, and laying millions of limestone blocks. The Great Pyramid of Giza, aligned with astonishing accuracy to the cardinal points, was the tallest structure on earth for nearly four millennia.',
        media: [
          { kind: 'image', src: commons('Pyramids of the Giza Necropolis.jpg', 1200), caption: 'The pyramids of Giza, c. 2580\u20132510 BCE', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Egypt.Giza.Sphinx.01.jpg', 1000), caption: 'The Great Sphinx of Giza', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'newkingdom',
        period: 'c. 1550 \u2013 1069 BCE',
        title: 'New Kingdom \u2013 Temple Complexes',
        text: 'Worship moved into vast temple precincts of pylons, courtyards, and hypostyle halls. At Karnak, a forest of 134 colossal columns supported a roof of stone, while Hatshepsut\u2019s terraced mortuary temple at Deir el-Bahari steps dramatically into its cliff backdrop.',
        media: [
          { kind: 'image', src: commons('Karnak Tempel 06.jpg', 1200), caption: 'Great Hypostyle Hall, Karnak', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Templo funerario de Hatshepsut, Luxor, Egipto, 2022-04-03, DD 13.jpg', 1200), caption: 'Mortuary Temple of Hatshepsut, Deir el-Bahari', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'islamic-cairo',
        period: 'c. 640 \u2013 1500',
        title: 'Islamic Cairo',
        text: 'Medieval Cairo became one of the richest stages for Islamic architecture. The vast Mosque of Ibn Tulun, built around an open court with a spiral minaret, and the soaring stone iwans of the Sultan Hasan complex show centuries of refinement in brick, stone, and geometric ornament.',
        media: [
          { kind: 'image', src: commons('Kairo Ibn Tulun Moschee BW 4.jpg', 1200), caption: 'Mosque of Ibn Tulun, Cairo (879)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Flickr - archer10 (Dennis) - Egypt-13A-061 (cropped).jpg', 1000), caption: 'Mosque-Madrasa of Sultan Hasan, Cairo (1356\u201363)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'modern-eg',
        period: '20th century \u2013 present',
        title: 'Modern',
        text: 'Modern Egypt has sought monumental forms for a new era. The Bibliotheca Alexandrina, a vast tilted disc inscribed with the scripts of the world, reimagines the legendary ancient library as a beacon of contemporary learning.',
        media: [
          { kind: 'image', src: commons("Alexandria's Bibliotheca.jpg", 1200), caption: 'Bibliotheca Alexandrina (2002)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },

  India: {
    name: 'India',
    wikipediaTitle: 'Architecture_of_India',
    flagEmoji: '\u{1F1EE}\u{1F1F3}',
    tagline: 'Stupas, temples, tombs, and a fusion of worlds',
    heroImage: commons('Taj Mahal (Edited).jpeg', 1400),
    heroCredit: 'Taj Mahal \u2014 Wikimedia Commons',
    intro:
      'Indian architecture weaves together Buddhist stupas, towering Hindu temples, Indo-Islamic forms introduced by the Delhi Sultanate and Mughals, colonial hybrids, and modern landmarks. The result is one of the world\u2019s richest built heritages, layered across more than two thousand years.',
    eras: [
      {
        id: 'buddhist',
        period: 'c. 300 BCE \u2013 200 CE',
        title: 'Buddhist',
        text: 'India\u2019s earliest surviving monuments are Buddhist: hemispherical stupas enshrining relics, ringed by railings and crowned with sculpted gateways. The Great Stupa at Sanchi, with its richly carved toranas, is the supreme example.',
        media: [
          { kind: 'image', src: commons('East Gateway - Stupa 1 - Sanchi Hill 2013-02-21 4398.JPG', 1200), caption: 'Great Stupa, Sanchi (3rd c. BCE onward)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'temple',
        period: 'c. 700 \u2013 1250',
        title: 'Hindu Temple Architecture',
        text: 'The medieval temple reached a sculptural climax in two great traditions: the northern Nagara style of Khajuraho, with its clustered shikhara towers, and the southern Dravidian style, whose Brihadisvara Temple at Thanjavur raises a single granite tower over sixty metres high.',
        media: [
          { kind: 'image', src: commons('Kandariya Mahadeva Temple 03.jpg', 1200), caption: 'Kandariya Mahadeva Temple, Khajuraho', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Brihadisvara Temple during Maha Shivaratri-WUS03611 (edit).jpg', 1000), caption: 'Brihadisvara Temple, Thanjavur (1010)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'indo-islamic',
        period: '1200 \u2013 1500',
        title: 'Indo-Islamic / Sultanate',
        text: 'The Delhi Sultanate introduced arches, domes, and minarets, fused with local stone craft. The towering Qutb Minar, a fluted victory tower of red sandstone and marble, marks the arrival of this new architectural language.',
        media: [
          { kind: 'image', src: commons('Qutb Minar 2022.jpg', 1000), caption: 'Qutb Minar, Delhi (begun c. 1199)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'mughal',
        period: '1526 \u2013 1764',
        title: 'Mughal',
        text: 'The Mughals fused Persian, Timurid, and Indian ideas into a refined imperial style of domes, iwans, charbagh gardens, and inlaid marble. It culminated in the Taj Mahal, a perfectly symmetrical mausoleum of white marble that seems to dissolve into light.',
        media: [
          { kind: 'image', src: commons("Humayun's Tomb, Delhi.jpg", 1200), caption: "Humayun's Tomb, Delhi (1572)", credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Taj Mahal (Edited).jpeg', 1200), caption: 'The Taj Mahal, Agra (1632\u201353)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'colonial-in',
        period: '1858 \u2013 1947',
        title: 'Colonial',
        text: 'British rule produced a hybrid Indo-Saracenic architecture, grafting Mughal domes and chhatris onto European classical plans. The white-marble Victoria Memorial in Kolkata is its grandest monument.',
        media: [
          { kind: 'image', src: commons('Victoria Memorial situated in Kolkata.jpg', 1200), caption: 'Victoria Memorial, Kolkata (1906\u201321)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'modern-in',
        period: '1947 \u2013 present',
        title: 'Modern & Contemporary',
        text: 'After independence, India embraced bold modernism \u2014 from Le Corbusier\u2019s Chandigarh to expressive sculptural landmarks. The Lotus Temple abstracts a blooming flower into 27 free-standing marble petals.',
        media: [
          { kind: 'image', src: commons('Lotus Temple in New Delhi 03-2016.jpg', 1200), caption: 'Lotus Temple, New Delhi (1986)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },

  Greece: {
    name: 'Greece',
    wikipediaTitle: 'Ancient_Greek_architecture',
    flagEmoji: '\u{1F1EC}\u{1F1F7}',
    tagline: 'The birthplace of the classical orders',
    heroImage: commons('Parthenon from west.jpg', 1400),
    heroCredit: 'The Parthenon \u2014 Wikimedia Commons',
    intro:
      'Greek architecture gave the West its enduring vocabulary of columns and proportion. Working chiefly in marble and limestone, Greek builders refined the temple into a study of harmony and the three orders \u2014 Doric, Ionic, and Corinthian. Byzantine churches and a 19th-century Neoclassical revival added further chapters to a remarkably continuous tradition.',
    eras: [
      {
        id: 'classical',
        period: 'c. 600 \u2013 323 BCE',
        title: 'Archaic & Classical',
        text: 'On the Athenian Acropolis, the Parthenon embodied the Doric ideal: subtle curvature in its columns and platform corrects the eye\u2019s distortions, making rigid stone appear alive. The nearby Temple of Hephaestus survives almost intact, showing the type in pristine form.',
        media: [
          { kind: 'image', src: commons('Parthenon from west.jpg', 1200), caption: 'The Parthenon, Athens (447\u2013432 BCE)', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Temple of Hephaestus viewed from the Stoa of Attalos in Athens, Greece.jpg', 1000), caption: 'Temple of Hephaestus, Athens', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'hellenistic',
        period: 'c. 323 \u2013 31 BCE',
        title: 'Hellenistic',
        text: 'Hellenistic architects worked at civic scale, lining agoras with long colonnaded stoas and perfecting the open-air theatre. The reconstructed Stoa of Attalos and the acoustically flawless theatre of Epidaurus show architecture organising public life.',
        media: [
          { kind: 'image', src: commons('Attica 06-13 Athens 22 View from Acropolis Hill - Museum of Ancient Agora.jpg', 1200), caption: 'Stoa of Attalos, Athens', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('The great theater of Epidaurus, designed by Polykleitos the Younger in the 4th century BC, Sanctuary of Asklepeios at Epidaurus, Greece (14015010416).jpg', 1000), caption: 'Theatre of Epidaurus (4th c. BCE)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'byzantine-gr',
        period: 'c. 600 \u2013 1450',
        title: 'Byzantine',
        text: 'Greek Byzantine churches perfected the cross-in-square plan crowned by a central dome, their interiors glowing with gold-ground mosaic. The monastery of Hosios Loukas is among the finest surviving ensembles.',
        media: [
          { kind: 'image', src: commons('Μονή Οσίου Λουκά 1290.jpg', 1200), caption: 'Monastery of Hosios Loukas (10th\u201311th c.)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'neoclassical-gr',
        period: '1830 \u2013 1900',
        title: 'Neoclassical Revival',
        text: 'After independence, the new Greek state looked back to its classical roots, and Athens filled with marble Neoclassical institutions. The Academy of Athens, designed by Theophil Hansen, is a luminous re-creation of ancient form.',
        media: [
          { kind: 'image', src: commons('Akademie von Athen.jpg', 1200), caption: 'Academy of Athens (1859\u20131885)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },

  Mexico: {
    name: 'Mexico',
    wikipediaTitle: 'Architecture_of_Mexico',
    flagEmoji: '\u{1F1F2}\u{1F1FD}',
    tagline: 'Pyramids of the gods to colonial cathedrals',
    heroImage: commons('Chichen Itza 3.jpg', 1400),
    heroCredit: 'Chichen Itza \u2014 Wikimedia Commons',
    intro:
      'Mexican architecture layers great traditions: the monumental stone cities of Mesoamerica \u2014 Teotihuacan, the Zapotecs, the Maya, the Aztecs \u2014 and the Spanish colonial baroque that rose, often literally, atop them. The dialogue between indigenous and European form continues to define the country\u2019s built identity into the modern age.',
    eras: [
      {
        id: 'teotihuacan',
        period: 'c. 100 BCE \u2013 550 CE',
        title: 'Mesoamerican \u2013 Teotihuacan',
        text: 'Teotihuacan was one of the largest cities of the ancient world, laid out on a vast ceremonial axis. Its Pyramid of the Sun rises in stepped talud-tablero terraces, a form echoed across Mesoamerican civilisations for centuries.',
        media: [
          { kind: 'image', src: commons('Teotihuacan Pyramid of the Sun.jpg', 1200), caption: 'Pyramid of the Sun, Teotihuacan', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'monte-alban',
        period: 'c. 500 BCE \u2013 800 CE',
        title: 'Zapotec \u2013 Monte Alb\u00e1n',
        text: 'The Zapotecs levelled a mountaintop to build Monte Alb\u00e1n, arranging plazas, platforms, and ball courts around a vast artificial esplanade with commanding views over the Oaxaca valleys.',
        media: [
          { kind: 'image', src: commons('Monte Alban West Side Platform.jpg', 1200), caption: 'Monte Alb\u00e1n, Oaxaca', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'maya',
        period: 'c. 250 \u2013 1200 CE',
        title: 'Maya',
        text: 'The Maya raised corbel-vaulted temples and astronomical structures of remarkable precision. At Chichen Itza, the pyramid of El Castillo functions as a giant calendar in stone, while Palenque\u2019s palace and tower display the delicacy of Classic Maya design.',
        media: [
          { kind: 'image', src: commons('Chichen Itza 3.jpg', 1200), caption: 'El Castillo, Chichen Itza', credit: 'Wikimedia Commons' },
          { kind: 'image', src: commons('Palenque Collage.jpg', 1000), caption: 'Palenque, Chiapas', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'aztec',
        period: 'c. 1325 \u2013 1521',
        title: 'Aztec',
        text: 'At the heart of their island capital Tenochtitlan, the Aztecs raised the twin-shrined Templo Mayor. Its excavated foundations now sit beside the cathedral that the Spanish built from its stones.',
        media: [
          { kind: 'image', src: commons('Templo Mayor 50.jpg', 1200), caption: 'Templo Mayor, Mexico City', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'colonial-mx',
        period: '1521 \u2013 1821',
        title: 'Spanish Colonial',
        text: 'Spanish friars and architects covered New Spain with churches, convents, and cathedrals in a richly ornamented baroque \u2014 frequently built from the stones of demolished pre-Hispanic temples. Mexico City\u2019s Metropolitan Cathedral, the largest in the Americas, took nearly 250 years to complete.',
        media: [
          { kind: 'image', src: commons('Mexico City Metropolitan Cathedral.jpg', 1200), caption: 'Mexico City Metropolitan Cathedral (1573\u20131813)', credit: 'Wikimedia Commons' },
        ],
      },
      {
        id: 'modern-mx',
        period: '1900 \u2013 present',
        title: 'Modern',
        text: 'Porfirian Mexico crowned its capital with the marble-and-glass Palacio de Bellas Artes, blending Art Nouveau and Art Deco \u2014 a prelude to the bold modernism of Barrag\u00e1n, O\u2019Gorman, and the muralled campus of UNAM.',
        media: [
          { kind: 'image', src: commons('Bellas Artes 01.jpg', 1200), caption: 'Palacio de Bellas Artes, Mexico City (1904\u201334)', credit: 'Wikimedia Commons' },
        ],
      },
    ],
  },
};

// Country name -> Wikipedia "Architecture of X" title for live fallback when a
// country isn't curated. Covers the rest of the world generically.
export function fallbackWikiTitle(countryName: string): string {
  return `Architecture_of_${countryName.replace(/ /g, '_')}`;
}
