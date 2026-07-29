// Country -> sales rep routing, transcribed from the Leverate WhatsApp Bot
// Knowledge Base (Section 10, "Sales Rep Routing Logic"). Phase 1 stand-in:
// this only matches a country name mentioned in the message and returns the
// assigned rep + meeting link — no HubSpot writes, no multi-turn state.

const REPS = {
  jonathan: {
    name: "Jonathan Zwebner",
    languages: "English",
    market: "Global, English-speaking",
    meetingUrl: "https://meetings-eu1.hubspot.com/meetings/jonathan-zwebner",
  },
  yonglong: {
    name: "Yonglong Wu",
    languages: "English, Mandarin Chinese",
    market: "Asia, China",
    meetingUrl: "https://meetings-eu1.hubspot.com/yonglong",
  },
  marcelo: {
    name: "Marcelo Podgaetz",
    languages: "English, Spanish, Portuguese",
    market: "LATAM, Brazil",
    meetingUrl: "https://meetings-eu1.hubspot.com/marcelo-podgaetz",
  },
  jayasri: {
    name: "Jayasri Govindaraj",
    languages: "English",
    market: "South Asia, Southeast Asia",
    meetingUrl: "https://meetings-eu1.hubspot.com/jayasri-govindaraj",
  },
  yossi: {
    name: "Yossi Tamir",
    languages: "English, Hebrew",
    market: "Partners, senior/strategic",
    meetingUrl: "https://meetings-eu1.hubspot.com/meetings/yossi-tamir",
  },
  maria: {
    name: "Maria Chamorro",
    languages: "English, Spanish",
    market: "LATAM",
    meetingUrl: "https://meetings-eu1.hubspot.com/mchamorro",
  },
};

// null = no rep assigned (sanctioned jurisdiction, per Section 14 — do not proceed)
// "rotation" = rotates between the three LATAM/EMEA/APAC leads for UAE
const COUNTRY_TO_REP = {
  brazil: "marcelo", cyprus: "marcelo", india: "jayasri", us: "marcelo",
  uk: "jonathan", pakistan: "jayasri", nigeria: "marcelo", malaysia: "yonglong",
  israel: "jonathan", "south africa": "jonathan", kenya: "jonathan", poland: "jonathan",
  australia: "jonathan", singapore: "yonglong", colombia: "maria", mexico: "marcelo",
  germany: "jonathan", belgium: "jonathan", france: "jonathan", italy: "jonathan",
  "dominican republic": "marcelo", malta: "jonathan", tanzania: "jonathan", morocco: "marcelo",
  spain: "marcelo", canada: "marcelo", china: "yonglong", iraq: "marcelo",
  "hong kong": "yonglong", bulgaria: "jonathan", uzbekistan: "jonathan", egypt: "marcelo",
  thailand: "yonglong", ghana: "jonathan", lithuania: "jonathan", switzerland: "jonathan",
  latvia: "jonathan", senegal: "jonathan", lebanon: "marcelo", portugal: "marcelo",
  japan: "yonglong", georgia: "jonathan", hungary: "jonathan", mauritius: "jonathan",
  mozambique: "jonathan", norway: "jonathan", romania: "jonathan", somalia: "jonathan",
  togo: "jonathan", zambia: "jonathan", bermuda: "marcelo", haiti: "marcelo",
  jamaica: "marcelo", jordan: "marcelo", "saudi arabia": "marcelo", indonesia: "yonglong",
  "sri lanka": "jayasri", albania: "jonathan", ukraine: "jonathan", algeria: "marcelo",
  netherlands: "marcelo", cambodia: "yonglong", armenia: "jonathan", azerbaijan: "jonathan",
  botswana: "jonathan", "burkina faso": "jonathan", "czech republic": "jonathan",
  kazakhstan: "jonathan", montenegro: "jonathan", sweden: "jonathan", uganda: "jonathan",
  argentina: "marcelo", tunisia: "marcelo", uruguay: "marcelo", philippines: "yonglong",
  iran: null, palestine: null,
  "aland islands": "jonathan", andorra: "jonathan", angola: "jonathan", anguilla: "jonathan",
  antartica: "jonathan", austria: "jonathan", belarus: "jonathan", benin: "jonathan",
  bhutan: "jonathan", "bosnia and herzegovina": "jonathan", "bouvet island": "jonathan",
  "british indian ocean territory": "jonathan", "british virgin islands": "jonathan",
  burundi: "jonathan", cameroon: "jonathan", "cape verde": "jonathan",
  "central african republic": "jonathan", chad: "jonathan", "christmas island": "jonathan",
  "cocos (keeling) island": "jonathan", comoros: "jonathan", congo: "jonathan",
  "cook islands": "jonathan", "cote d'ivoire": "jonathan", croatia: "jonathan",
  "democratic republic of congo": "jonathan", denmark: "jonathan", djibouti: "jonathan",
  "equatorial guinea": "jonathan", eritrea: "jonathan", estonia: "jonathan",
  ethiopia: "jonathan", "faroe islands": "jonathan", fiji: "jonathan", finland: "jonathan",
  "french guiana": "jonathan", "french polynesia": "jonathan",
  "french southern and antartic lands": "jonathan", gabon: "jonathan", gambia: "jonathan",
  gibraltar: "jonathan", greece: "jonathan", greenland: "jonathan", guadeloupe: "jonathan",
  guernsey: "jonathan", guinea: "jonathan", "guinea-bissau": "jonathan",
  "heard island and mcdonald islands": "jonathan", iceland: "jonathan", ireland: "jonathan",
  "isle of man": "jonathan", jersey: "jonathan", kiribati: "jonathan", kyrgystan: "jonathan",
  lesotho: "jonathan", liberia: "jonathan", lichtenstein: "jonathan", luxembourg: "jonathan",
  madagascar: "jonathan", malawi: "jonathan", maldives: "jonathan", mali: "jonathan",
  "marshall islands": "jonathan", martinique: "jonathan", mayotte: "jonathan",
  micronesia: "jonathan", moldova: "jonathan", monaco: "jonathan", mongolia: "jonathan",
  montserrat: "jonathan", namibia: "jonathan", nauru: "jonathan", "new zealand": "jonathan",
  niger: "jonathan", niue: "jonathan", "norfolk island": "jonathan",
  "north macedonia": "jonathan", "northern mariana islands": "jonathan",
  "papua new guinea": "jonathan", "pitcairn islands": "jonathan", reunion: "jonathan",
  russia: "jonathan", rwanda: "jonathan", "saint helena": "jonathan",
  "saint kitts and nevis": "jonathan", "saint lucia": "jonathan", "saint martin": "jonathan",
  "saint pierre and miquelon": "jonathan", "saint vincent and the grenadines": "jonathan",
  samoa: "jonathan", "san marino": "jonathan", "sao tome and principe": "jonathan",
  serbia: "jonathan", seychelles: "jonathan", "sierra leone": "jonathan",
  "sint marteen": "jonathan", slovakia: "jonathan", slovenia: "jonathan",
  "solomon islands": "jonathan", "south georgia and the south sandwich islands": "jonathan",
  "svalbard and jan mayen": "jonathan", swaziland: "jonathan", tokelau: "jonathan",
  tonga: "jonathan", tuvalu: "jonathan", "us virgin islands": "jonathan",
  vanuatu: "jonathan", "vatican city": "jonathan", "wallis and futuna": "jonathan",
  "western sahara": "jonathan", zimbabwe: "jonathan",
  afghanistan: "marcelo", "american samoa": "marcelo", "antigua & barbuda": "marcelo",
  aruba: "marcelo", bahamas: "marcelo", bahrain: "marcelo", barbados: "marcelo",
  belize: "marcelo", bolivia: "marcelo", "caribbean netherlands": "marcelo",
  "cayman islands": "marcelo", chile: "marcelo", "costa rica": "marcelo", cuba: "marcelo",
  curacao: "marcelo", ecuador: "marcelo", "el salvador": "marcelo",
  "falkland islands": "marcelo", grenada: "marcelo", guatemala: "marcelo",
  guyana: "marcelo", honduras: "marcelo", kuwait: "marcelo", laos: "marcelo",
  libya: "marcelo", "new caledonia": "marcelo", nicaragua: "marcelo", oman: "marcelo",
  panama: "marcelo", paraguay: "marcelo", "puerto rico": "marcelo", qatar: "marcelo",
  "saint barthelemy": "marcelo", "south sudan": "marcelo", sudan: "marcelo",
  suriname: "marcelo", syria: "marcelo", "trinidad and tobago": "marcelo",
  turkiye: "marcelo", "turks & caicos islands": "marcelo",
  "us minor outlying islands": "marcelo", venezuela: "marcelo", yemen: "marcelo",
  brunei: "jayasri", "east timor": "jayasri", guam: "jayasri",
  "myanmar (burma)": "jayasri", nepal: "jayasri", palau: "jayasri",
  macao: "yonglong", "north korea": "yonglong", "south korea": "yonglong",
  taiwan: "yonglong", tajkistan: "yonglong", turkmenistan: "yonglong", vietnam: "yonglong",
  uae: "rotation",
};

function findCountryMention(message) {
  const lower = message.toLowerCase();
  // Longer names first so "south africa" matches before a bare "africa" would (it never appears alone, but keeps intent clear).
  const countries = Object.keys(COUNTRY_TO_REP).sort((a, b) => b.length - a.length);
  return countries.find((country) => lower.includes(country)) || null;
}

/**
 * If the message names a country from the routing table, return the reply
 * text assigning (or declining) a sales rep. Otherwise return null so the
 * caller can fall back to normal FAQ matching.
 */
function getRoutingReply(userMessage) {
  const country = findCountryMention(userMessage);
  if (!country) return null;

  const assignment = COUNTRY_TO_REP[country];

  if (assignment === null) {
    return "Unfortunately we can't proceed with leads from this jurisdiction at this time. Thank you for your interest.";
  }

  if (assignment === "rotation") {
    const options = [REPS.marcelo, REPS.jonathan, REPS.jayasri]
      .map((rep) => rep.name)
      .join(", ");
    return `For the UAE, we rotate leads between ${options} — whoever's next will reach out to book a 30-minute call.`;
  }

  const rep = REPS[assignment];
  return `Thanks — for that region, the right person to speak with is ${rep.name} (${rep.languages}). You can book a 30-minute call directly here: ${rep.meetingUrl}`;
}

module.exports = { getRoutingReply };
