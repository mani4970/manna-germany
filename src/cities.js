export const CITIES = [
  {
    id: 'berlin', emoji: '🐻', lat: 52.5200, lng: 13.4050,
    name_de: 'Berlin', name_en: 'Berlin',
    sub_de: 'Hauptstadt · Kultur · Vielfalt',
    sub_en: 'Capital · Culture · Diversity',
    spots: [
      { id: 'mitte', lat: 52.5200, lng: 13.4050, name_de: 'Mitte', name_en: 'Mitte', sub_de: 'Zentrum · Brandenburger Tor · Museen', sub_en: 'City center · Brandenburg Gate · Museums' },
      { id: 'prenzlauer_berg', lat: 52.5382, lng: 13.4187, name_de: 'Prenzlauer Berg', name_en: 'Prenzlauer Berg', sub_de: 'Hipster · Cafés · Kollwitzplatz', sub_en: 'Hipster · Cafés · Kollwitzplatz' },
      { id: 'kreuzberg', lat: 52.4988, lng: 13.4028, name_de: 'Kreuzberg', name_en: 'Kreuzberg', sub_de: 'Street Art · Bars · Vielfalt', sub_en: 'Street Art · Bars · Diversity' },
      { id: 'friedrichshain', lat: 52.5163, lng: 13.4540, name_de: 'Friedrichshain', name_en: 'Friedrichshain', sub_de: 'Clubs · East Side Gallery', sub_en: 'Clubs · East Side Gallery' },
      { id: 'charlottenburg', lat: 52.5167, lng: 13.3044, name_de: 'Charlottenburg', name_en: 'Charlottenburg', sub_de: 'Luxus · Shopping · Schloss', sub_en: 'Luxury · Shopping · Palace' },
      { id: 'schoeneberg', lat: 52.4882, lng: 13.3552, name_de: 'Schöneberg', name_en: 'Schöneberg', sub_de: 'Lebhaft · Winterfeldtplatz', sub_en: 'Vibrant · Winterfeldtplatz' },
      { id: 'neukoelln', lat: 52.4811, lng: 13.4354, name_de: 'Neukölln', name_en: 'Neukölln', sub_de: 'Trendy · Restaurants · Vielfalt', sub_en: 'Trendy · Restaurants · Diverse' },
      { id: 'hackescher_markt', lat: 52.5248, lng: 13.4022, name_de: 'Hackescher Markt', name_en: 'Hackescher Markt', sub_de: 'Galerien · Cafés · Nachtleben', sub_en: 'Galleries · Cafés · Nightlife' },
    ]
  },
  {
    id: 'munich', emoji: '🍺', lat: 48.1351, lng: 11.5820,
    name_de: 'München', name_en: 'Munich',
    sub_de: 'Bier · Kunst · Alpen',
    sub_en: 'Beer · Art · Alps',
    spots: [
      { id: 'marienplatz', lat: 48.1374, lng: 11.5755, name_de: 'Marienplatz', name_en: 'Marienplatz', sub_de: 'Zentrum · Rathaus · Einkaufen', sub_en: 'City center · Town Hall · Shopping' },
      { id: 'schwabing', lat: 48.1600, lng: 11.5833, name_de: 'Schwabing', name_en: 'Schwabing', sub_de: 'Studenten · Cafés · Englischer Garten', sub_en: 'Students · Cafés · English Garden' },
      { id: 'maxvorstadt', lat: 48.1503, lng: 11.5700, name_de: 'Maxvorstadt', name_en: 'Maxvorstadt', sub_de: 'Museen · Kunst · Pinakothek', sub_en: 'Museums · Art · Pinakothek' },
      { id: 'glockenbachviertel', lat: 48.1289, lng: 11.5703, name_de: 'Glockenbachviertel', name_en: 'Glockenbach', sub_de: 'Hip · Bars · Vielfalt', sub_en: 'Hip · Bars · Diverse' },
      { id: 'haidhausen', lat: 48.1306, lng: 11.6013, name_de: 'Haidhausen', name_en: 'Haidhausen', sub_de: 'Gemütlich · Restaurants · Ostbahnhof', sub_en: 'Cozy · Restaurants · Eastside' },
    ]
  },
  {
    id: 'hamburg', emoji: '⚓', lat: 53.5511, lng: 9.9937,
    name_de: 'Hamburg', name_en: 'Hamburg',
    sub_de: 'Hafen · Fischmarkt · Elbphilharmonie',
    sub_en: 'Harbor · Fish Market · Elbphilharmonie',
    spots: [
      { id: 'hafencity', lat: 53.5414, lng: 9.9994, name_de: 'HafenCity', name_en: 'HafenCity', sub_de: 'Modern · Elbphilharmonie · Hafen', sub_en: 'Modern · Elbphilharmonie · Harbor' },
      { id: 'altona', lat: 53.5497, lng: 9.9350, name_de: 'Altona', name_en: 'Altona', sub_de: 'Lebhaft · Fischmarkt · Elbe', sub_en: 'Vibrant · Fish Market · Elbe' },
      { id: 'schanzenviertel', lat: 53.5633, lng: 9.9636, name_de: 'Schanzenviertel', name_en: 'Schanzenviertel', sub_de: 'Hip · Bars · Street Art', sub_en: 'Hip · Bars · Street Art' },
      { id: 'eppendorf', lat: 53.5881, lng: 9.9814, name_de: 'Eppendorf', name_en: 'Eppendorf', sub_de: 'Vornehm · Cafés · Isebek', sub_en: 'Upscale · Cafés · Isebek' },
      { id: 'reeperbahn', lat: 53.5495, lng: 9.9620, name_de: 'Reeperbahn', name_en: 'Reeperbahn', sub_de: 'Nachtleben · Clubs · St. Pauli', sub_en: 'Nightlife · Clubs · St. Pauli' },
    ]
  },
  {
    id: 'cologne', emoji: '⛪', lat: 50.9333, lng: 6.9500,
    name_de: 'Köln', name_en: 'Cologne',
    sub_de: 'Dom · Kölsch · Rhein',
    sub_en: 'Cathedral · Kölsch · Rhine',
    spots: [
      { id: 'altstadt', lat: 50.9381, lng: 6.9590, name_de: 'Altstadt', name_en: 'Old Town', sub_de: 'Dom · Rhein · Geschichte', sub_en: 'Cathedral · Rhine · History' },
      { id: 'belgisches_viertel', lat: 50.9397, lng: 6.9321, name_de: 'Belgisches Viertel', name_en: 'Belgian Quarter', sub_de: 'Trendy · Boutiquen · Cafés', sub_en: 'Trendy · Boutiques · Cafés' },
      { id: 'ehrenfeld', lat: 50.9517, lng: 6.9000, name_de: 'Ehrenfeld', name_en: 'Ehrenfeld', sub_de: 'Kreativ · Street Art · Bars', sub_en: 'Creative · Street Art · Bars' },
      { id: 'nippes', lat: 50.9636, lng: 6.9547, name_de: 'Nippes', name_en: 'Nippes', sub_de: 'Lokal · Restaurants · Markt', sub_en: 'Local · Restaurants · Market' },
    ]
  },
  {
    id: 'frankfurt', emoji: '🏙️', lat: 50.1109, lng: 8.6821,
    name_de: 'Frankfurt', name_en: 'Frankfurt',
    sub_de: 'Skyline · Apfelwein · Römer',
    sub_en: 'Skyline · Apple Wine · Römer',
    spots: [
      { id: 'sachsenhausen', lat: 50.1009, lng: 8.6868, name_de: 'Sachsenhausen', name_en: 'Sachsenhausen', sub_de: 'Apfelwein · Museen · Altstadt', sub_en: 'Apple Wine · Museums · Old Town' },
      { id: 'bornheim', lat: 50.1214, lng: 8.7086, name_de: 'Bornheim', name_en: 'Bornheim', sub_de: 'Lebendig · Cafés · Berger Straße', sub_en: 'Lively · Cafés · Berger Straße' },
      { id: 'nordend', lat: 50.1278, lng: 8.6889, name_de: 'Nordend', name_en: 'Nordend', sub_de: 'Schick · Restaurants · Ruhig', sub_en: 'Chic · Restaurants · Quiet' },
      { id: 'innenstadt', lat: 50.1109, lng: 8.6821, name_de: 'Innenstadt', name_en: 'City Center', sub_de: 'Shopping · Römer · Skyline', sub_en: 'Shopping · Römer · Skyline' },
    ]
  },
]
