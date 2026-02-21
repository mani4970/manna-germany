export const CITIES = [
  {
    id: 'berlin', emoji: '🐻', lat: 52.5200, lng: 13.4050,
    name_de: 'Berlin', name_en: 'Berlin',
    sub_de: 'Hauptstadt · Kultur · Vielfalt',
    sub_en: 'Capital · Culture · Diversity',
    landmarks: [
      { id: 'brandenburger_tor', lat: 52.5163, lng: 13.3777, name_de: 'Brandenburger Tor', name_en: 'Brandenburg Gate', sub_de: 'Wahrzeichen · Mitte', sub_en: 'Landmark · Mitte' },
      { id: 'alexanderplatz', lat: 52.5219, lng: 13.4132, name_de: 'Alexanderplatz', name_en: 'Alexanderplatz', sub_de: 'Zentrum · Shopping · Fernsehturm', sub_en: 'Center · Shopping · TV Tower' },
      { id: 'hackescher_markt', lat: 52.5248, lng: 13.4022, name_de: 'Hackescher Markt', name_en: 'Hackescher Markt', sub_de: 'Galerien · Cafés · Nachtleben', sub_en: 'Galleries · Cafés · Nightlife' },
      { id: 'potsdamer_platz', lat: 52.5096, lng: 13.3761, name_de: 'Potsdamer Platz', name_en: 'Potsdamer Platz', sub_de: 'Modern · Kino · Shopping', sub_en: 'Modern · Cinema · Shopping' },
      { id: 'kurfuerstendamm', lat: 52.5027, lng: 13.3323, name_de: 'Kurfürstendamm', name_en: 'Kurfürstendamm', sub_de: 'Luxus · Shopping · KaDeWe', sub_en: 'Luxury · Shopping · KaDeWe' },
    ],
    stadtteile: [
      { id: 'mitte', lat: 52.5200, lng: 13.4050, name_de: 'Mitte', name_en: 'Mitte', sub_de: 'Lebendig · Restaurants · Bars', sub_en: 'Vibrant · Restaurants · Bars' },
      { id: 'prenzlauer_berg', lat: 52.5382, lng: 13.4187, name_de: 'Prenzlauer Berg', name_en: 'Prenzlauer Berg', sub_de: 'Hipster · Cafés · Kollwitzplatz', sub_en: 'Hipster · Cafés · Kollwitzplatz' },
      { id: 'kreuzberg', lat: 52.4988, lng: 13.4028, name_de: 'Kreuzberg', name_en: 'Kreuzberg', sub_de: 'Street Art · Bars · Vielfalt', sub_en: 'Street Art · Bars · Diversity' },
      { id: 'friedrichshain', lat: 52.5163, lng: 13.4540, name_de: 'Friedrichshain', name_en: 'Friedrichshain', sub_de: 'Clubs · East Side Gallery', sub_en: 'Clubs · East Side Gallery' },
      { id: 'neukoelln', lat: 52.4811, lng: 13.4354, name_de: 'Neukölln', name_en: 'Neukölln', sub_de: 'Trendy · Restaurants · Vielfalt', sub_en: 'Trendy · Restaurants · Diverse' },
      { id: 'schoeneberg', lat: 52.4882, lng: 13.3552, name_de: 'Schöneberg', name_en: 'Schöneberg', sub_de: 'Lebhaft · Winterfeldtplatz', sub_en: 'Vibrant · Winterfeldtplatz' },
      { id: 'charlottenburg', lat: 52.5167, lng: 13.3044, name_de: 'Charlottenburg', name_en: 'Charlottenburg', sub_de: 'Schick · Restaurants · Schloss', sub_en: 'Chic · Restaurants · Palace' },
      { id: 'pberg_kastanienallee', lat: 52.5350, lng: 13.4100, name_de: 'Kastanienallee', name_en: 'Kastanienallee', sub_de: 'Cafés · Bars · Szene', sub_en: 'Cafés · Bars · Scene' },
    ]
  },
  {
    id: 'munich', emoji: '🍺', lat: 48.1351, lng: 11.5820,
    name_de: 'München', name_en: 'Munich',
    sub_de: 'Bier · Kunst · Alpen',
    sub_en: 'Beer · Art · Alps',
    landmarks: [
      { id: 'marienplatz', lat: 48.1374, lng: 11.5755, name_de: 'Marienplatz', name_en: 'Marienplatz', sub_de: 'Zentrum · Rathaus · Glockenspiel', sub_en: 'Center · Town Hall · Glockenspiel' },
      { id: 'viktualienmarkt', lat: 48.1351, lng: 11.5765, name_de: 'Viktualienmarkt', name_en: 'Viktualienmarkt', sub_de: 'Markt · Essen · Tradition', sub_en: 'Market · Food · Tradition' },
      { id: 'englischer_garten', lat: 48.1642, lng: 11.6050, name_de: 'Englischer Garten', name_en: 'English Garden', sub_de: 'Park · Biergarten · Natur', sub_en: 'Park · Beer Garden · Nature' },
      { id: 'olympiapark', lat: 48.1731, lng: 11.5508, name_de: 'Olympiapark', name_en: 'Olympiapark', sub_de: 'Sport · Events · Aussicht', sub_en: 'Sports · Events · Views' },
    ],
    stadtteile: [
      { id: 'schwabing', lat: 48.1600, lng: 11.5833, name_de: 'Schwabing', name_en: 'Schwabing', sub_de: 'Studenten · Cafés · Leopoldsstr.', sub_en: 'Students · Cafés · Leopoldstr.' },
      { id: 'maxvorstadt', lat: 48.1503, lng: 11.5700, name_de: 'Maxvorstadt', name_en: 'Maxvorstadt', sub_de: 'Museen · Bars · Studenten', sub_en: 'Museums · Bars · Students' },
      { id: 'glockenbachviertel', lat: 48.1289, lng: 11.5703, name_de: 'Glockenbachviertel', name_en: 'Glockenbach', sub_de: 'Hip · Bars · Restaurants', sub_en: 'Hip · Bars · Restaurants' },
      { id: 'haidhausen', lat: 48.1306, lng: 11.6013, name_de: 'Haidhausen', name_en: 'Haidhausen', sub_de: 'Gemütlich · Lokale · Paulaner', sub_en: 'Cozy · Locals · Paulaner' },
      { id: 'neuhausen', lat: 48.1525, lng: 11.5297, name_de: 'Neuhausen', name_en: 'Neuhausen', sub_de: 'Entspannt · Cafés · Rotkreuzplatz', sub_en: 'Relaxed · Cafés · Rotkreuzplatz' },
    ]
  },
  {
    id: 'hamburg', emoji: '⚓', lat: 53.5511, lng: 9.9937,
    name_de: 'Hamburg', name_en: 'Hamburg',
    sub_de: 'Hafen · Fischmarkt · Elbphilharmonie',
    sub_en: 'Harbor · Fish Market · Elbphilharmonie',
    landmarks: [
      { id: 'elbphilharmonie', lat: 53.5413, lng: 9.9841, name_de: 'Elbphilharmonie', name_en: 'Elbphilharmonie', sub_de: 'Konzerthaus · HafenCity', sub_en: 'Concert Hall · HafenCity' },
      { id: 'speicherstadt', lat: 53.5438, lng: 9.9932, name_de: 'Speicherstadt', name_en: 'Speicherstadt', sub_de: 'UNESCO · Kanäle · Museen', sub_en: 'UNESCO · Canals · Museums' },
      { id: 'landungsbruecken', lat: 53.5447, lng: 9.9669, name_de: 'Landungsbrücken', name_en: 'Landungsbrücken', sub_de: 'Hafen · Elbe · Fähre', sub_en: 'Harbor · Elbe · Ferry' },
      { id: 'fischmarkt', lat: 53.5479, lng: 9.9367, name_de: 'Fischmarkt', name_en: 'Fish Market', sub_de: 'Sonntags · Altona · Kult', sub_en: 'Sundays · Altona · Iconic' },
    ],
    stadtteile: [
      { id: 'altona', lat: 53.5497, lng: 9.9350, name_de: 'Altona', name_en: 'Altona', sub_de: 'Lebendig · Restaurants · Elbe', sub_en: 'Vibrant · Restaurants · Elbe' },
      { id: 'schanzenviertel', lat: 53.5633, lng: 9.9636, name_de: 'Schanzenviertel', name_en: 'Schanzenviertel', sub_de: 'Hip · Bars · Street Art', sub_en: 'Hip · Bars · Street Art' },
      { id: 'eppendorf', lat: 53.5881, lng: 9.9814, name_de: 'Eppendorf', name_en: 'Eppendorf', sub_de: 'Schick · Cafés · Isebek', sub_en: 'Upscale · Cafés · Isebek' },
      { id: 'winterhude', lat: 53.5953, lng: 10.0081, name_de: 'Winterhude', name_en: 'Winterhude', sub_de: 'Entspannt · Restaurants · Stadtpark', sub_en: 'Relaxed · Restaurants · Stadtpark' },
      { id: 'eimsbüttel', lat: 53.5711, lng: 9.9531, name_de: 'Eimsbüttel', name_en: 'Eimsbüttel', sub_de: 'Gemütlich · Cafés · Grindel', sub_en: 'Cozy · Cafés · Grindel' },
    ]
  },
  {
    id: 'cologne', emoji: '⛪', lat: 50.9333, lng: 6.9500,
    name_de: 'Köln', name_en: 'Cologne',
    sub_de: 'Dom · Kölsch · Rhein',
    sub_en: 'Cathedral · Kölsch · Rhine',
    landmarks: [
      { id: 'koelner_dom', lat: 50.9413, lng: 6.9583, name_de: 'Kölner Dom', name_en: 'Cologne Cathedral', sub_de: 'UNESCO · Wahrzeichen · Innenstadt', sub_en: 'UNESCO · Landmark · City Center' },
      { id: 'hohenzollernbruecke', lat: 50.9402, lng: 6.9627, name_de: 'Hohenzollernbrücke', name_en: 'Hohenzollern Bridge', sub_de: 'Liebesschlösser · Rhein · Aussicht', sub_en: 'Love Locks · Rhine · Views' },
      { id: 'rheinufer', lat: 50.9381, lng: 6.9590, name_de: 'Rheinufer Altstadt', name_en: 'Rhine Waterfront', sub_de: 'Spazieren · Bars · Altstadt', sub_en: 'Walk · Bars · Old Town' },
    ],
    stadtteile: [
      { id: 'belgisches_viertel', lat: 50.9397, lng: 6.9321, name_de: 'Belgisches Viertel', name_en: 'Belgian Quarter', sub_de: 'Trendy · Boutiquen · Cafés', sub_en: 'Trendy · Boutiques · Cafés' },
      { id: 'ehrenfeld', lat: 50.9517, lng: 6.9000, name_de: 'Ehrenfeld', name_en: 'Ehrenfeld', sub_de: 'Kreativ · Street Art · Bars', sub_en: 'Creative · Street Art · Bars' },
      { id: 'nippes', lat: 50.9636, lng: 6.9547, name_de: 'Nippes', name_en: 'Nippes', sub_de: 'Lokal · Restaurants · Markt', sub_en: 'Local · Restaurants · Market' },
      { id: 'suedstadt', lat: 50.9211, lng: 6.9611, name_de: 'Südstadt', name_en: 'Südstadt', sub_de: 'Schick · Cafés · Chlodwigplatz', sub_en: 'Chic · Cafés · Chlodwigplatz' },
    ]
  },
  {
    id: 'frankfurt', emoji: '🏙️', lat: 50.1109, lng: 8.6821,
    name_de: 'Frankfurt', name_en: 'Frankfurt',
    sub_de: 'Skyline · Apfelwein · Römer',
    sub_en: 'Skyline · Apple Wine · Römer',
    landmarks: [
      { id: 'roemer', lat: 50.1109, lng: 8.6821, name_de: 'Römer & Altstadt', name_en: 'Römer & Old Town', sub_de: 'Wahrzeichen · Geschichte · Zentrum', sub_en: 'Landmark · History · Center' },
      { id: 'main_ufer', lat: 50.1056, lng: 8.6874, name_de: 'Mainufer & Museumsufer', name_en: 'Main Riverbank', sub_de: 'Promenade · Museen · Aussicht', sub_en: 'Promenade · Museums · Views' },
      { id: 'zeil', lat: 50.1140, lng: 8.6882, name_de: 'Zeil', name_en: 'Zeil', sub_de: 'Shopping · Zentrum · Belebt', sub_en: 'Shopping · Center · Lively' },
    ],
    stadtteile: [
      { id: 'sachsenhausen', lat: 50.1009, lng: 8.6868, name_de: 'Sachsenhausen', name_en: 'Sachsenhausen', sub_de: 'Apfelwein · Bars · Altstadt', sub_en: 'Apple Wine · Bars · Old Town' },
      { id: 'bornheim', lat: 50.1214, lng: 8.7086, name_de: 'Bornheim', name_en: 'Bornheim', sub_de: 'Lebendig · Cafés · Berger Str.', sub_en: 'Lively · Cafés · Berger Str.' },
      { id: 'nordend', lat: 50.1278, lng: 8.6889, name_de: 'Nordend', name_en: 'Nordend', sub_de: 'Schick · Restaurants · Ruhig', sub_en: 'Chic · Restaurants · Quiet' },
      { id: 'westend', lat: 50.1183, lng: 8.6661, name_de: 'Westend', name_en: 'Westend', sub_de: 'Gehoben · Restaurants · Grüneburgpark', sub_en: 'Upscale · Restaurants · Grüneburgpark' },
    ]
  },
  ,
  {
    id: 'dusseldorf', emoji: '🎨', lat: 51.2217, lng: 6.7762,
    name_de: 'Düsseldorf', name_en: 'Düsseldorf',
    sub_de: 'Mode · Kunst · Rhein',
    sub_en: 'Fashion · Art · Rhine',
    landmarks: [
      { id: 'koenigsallee', lat: 51.2204, lng: 6.7791, name_de: 'Königsallee', name_en: 'Königsallee', sub_de: 'Luxus · Shopping · Kö', sub_en: 'Luxury · Shopping · Kö' },
      { id: 'rheinuferpromenade', lat: 51.2254, lng: 6.7731, name_de: 'Rheinuferpromenade', name_en: 'Rhine Promenade', sub_de: 'Spazieren · Aussicht · Altstadt', sub_en: 'Walk · Views · Old Town' },
      { id: 'medienhafen', lat: 51.2130, lng: 6.7651, name_de: 'Medienhafen', name_en: 'Media Harbor', sub_de: 'Architektur · Restaurants · Bars', sub_en: 'Architecture · Restaurants · Bars' },
      { id: 'altstadt', lat: 51.2254, lng: 6.7726, name_de: 'Altstadt', name_en: 'Old Town', sub_de: 'Längste Theke · Bars · Belebte Gassen', sub_en: 'Longest Bar · Pubs · Lively Lanes' },
    ],
    stadtteile: [
      { id: 'pempelfort', lat: 51.2333, lng: 6.7833, name_de: 'Pempelfort', name_en: 'Pempelfort', sub_de: 'Schick · Cafés · Nordstraße', sub_en: 'Chic · Cafés · Nordstraße' },
      { id: 'flingern', lat: 51.2256, lng: 6.8078, name_de: 'Flingern', name_en: 'Flingern', sub_de: 'Hip · Bars · Ackerstraße', sub_en: 'Hip · Bars · Ackerstraße' },
      { id: 'bilk', lat: 51.2069, lng: 6.7742, name_de: 'Bilk', name_en: 'Bilk', sub_de: 'Studenten · Cafés · Lokal', sub_en: 'Students · Cafés · Local' },
      { id: 'unterbilk', lat: 51.2097, lng: 6.7678, name_de: 'Unterbilk', name_en: 'Unterbilk', sub_de: 'Lebendig · Restaurants · Kiefernstraße', sub_en: 'Vibrant · Restaurants · Kiefernstraße' },
    ]
  },
]