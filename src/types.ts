export interface CropInfo {
  id: string;
  nameEn: string;
  nameKn: string;
  typeEn: string;
  typeKn: string;
  soilEn: string;
  soilKn: string;
  durationEn: string;
  durationKn: string;
  yieldEn: string;
  yieldKn: string;
  descriptionEn: string;
  descriptionKn: string;
  image: string;
}

export interface APMCPrice {
  crop: string;
  market: string;
  min: number;
  max: number;
  ragiAvg: number;
  unit: string;
  change: string;
}

export interface WeatherData {
  city: string;
  temp: number;
  humidity: number;
  condition: string;
  wind: number;
  rainChance: string;
  soilMoisture: string;
  advisory: string;
}

export interface SchemeInfo {
  id: string;
  titleEn: string;
  titleKn: string;
  deptEn: string;
  deptKn: string;
  benefitsEn: string;
  benefitsKn: string;
  eligibilityEn: string;
  eligibilityKn: string;
  link: string;
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export const CROPS_DATA: CropInfo[] = [
  {
    id: "1",
    nameEn: "Ragi (Finger Millet)",
    nameKn: "ರಾಗಿ",
    typeEn: "Millet / Kharif",
    typeKn: "ಕಿರುಧಾನ್ಯ / ಮುಂಗಾರು",
    soilEn: "Red loam, sandy loam, gravelly well-drained soils",
    soilKn: "ಕೆಂಪು ಮಣ್ಣು, ಮರಳು ಮಿಶ್ರಿತ ಕೆಂಪು ಮಣ್ಣು",
    durationEn: "110 - 125 Days",
    durationKn: "110 ರಿಂದ 125 ದಿನಗಳು",
    yieldEn: "15 - 20 Quintals per Acre",
    yieldKn: "ಎಕರೆಗೆ 15 ರಿಂದ 20 ಕ್ವಿಂಟಾಲ್",
    descriptionEn: "Ragi is the staple crop of Southern Karnataka. Highly drought-resistant and rich in calcium and iron.",
    descriptionKn: "ರಾಗಿ ದಕ್ಷಿಣ ಕರ್ನಾಟಕದ ಮುಖ್ಯ ಆಹಾರ ಬೆಳೆಯಾಗಿದೆ. ಇದು ಬರನಿರೋಧಕ ಸಾಮರ್ಥ್ಯ ಹೊಂದಿದ್ದು, ಕ್ಯಾಲ್ಸಿಯಂ ಮತ್ತು ಕಬ್ಬಿಣದಂಶದಿಂದ ಸಮೃದ್ಧವಾಗಿದೆ.",
    image: "https://images.unsplash.com/photo-1622205313162-be1d5712a43f?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "2",
    nameEn: "Paddy (Rice)",
    nameKn: "ಭತ್ತ",
    typeEn: "Cereal / Kharif, Rabi",
    typeKn: "ಧಾನ್ಯ / ಮುಂಗಾರು ಮತ್ತು ಹಿಂಗಾರು",
    soilEn: "Clayey or loamy soils that can retain water",
    soilKn: "ನೀರು ಹಿಡಿದಿಟ್ಟುಕೊಳ್ಳುವ ಜೇಡಿಮಣ್ಣು ಅಥವಾ ಕೆಸರು ಮಣ್ಣು",
    durationEn: "120 - 150 Days",
    durationKn: "120 ರಿಂದ 150 ದಿನಗಳು",
    yieldEn: "22 - 30 Quintals per Acre",
    yieldKn: "ಎಕರೆಗೆ 22 ರಿಂದ 30 ಕ್ವಿಂಟಾಲ್",
    descriptionEn: "Highly cultivated in river basins of Cauvery, Tungabhadra, and coastal districts who have access to canal or high rainfall.",
    descriptionKn: "ಕಾವೇರಿ, ತುಂಗಭದ್ರಾ ನದಿ ಪಾತ್ರಗಳಲ್ಲಿ ಹಾಗೂ ಕರಾವಳಿ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಕಾಲುವೆ ನೀರು ಮತ್ತು ಅಧಿಕ ಮಳೆಯ ಆಶ್ರಯದಲ್ಲಿ ಹೆಚ್ಚಾಗಿ ಬೆಳೆಯಲಾಗುತ್ತದೆ.",
    image: "https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "3",
    nameEn: "Cotton",
    nameKn: "ಹತ್ತಿ",
    typeEn: "Fiber / Cash Crop",
    typeKn: "ನಾರು ಬೆಳೆ / ನಗದು ಬೆಳೆ",
    soilEn: "Deep black clay soil (regur) with good drainage",
    soilKn: "ಕಪ್ಪು ಹತ್ತಿ ಮಣ್ಣು (ರೆಗೂರ್ ಮಣ್ಣು)",
    durationEn: "160 - 180 Days",
    durationKn: "160 ರಿಂದ 180 ದಿನಗಳು",
    yieldEn: "8 - 12 Quintals per Acre",
    yieldKn: "ಎಕರೆಗೆ 8 ರಿಂದ 12 ಕ್ವಿಂಟಾಲ್",
    descriptionEn: "Principal cash crop of Northern Karnataka, including Dharwad, Haveri, Bellary, and Belagavi tracts.",
    descriptionKn: "ಉತ್ತರ ಕರ್ನಾಟಕದ ಧಾರವಾಡ, ಹಾವೇರಿ, ಬಳ್ಳಾರಿ ಮತ್ತು ಬೆಳಗಾವಿ ಜಿಲ್ಲೆಗಳ ಪ್ರಮುಖ ವಾಣಿಜ್ಯ ಹಣದ ಬೆಳೆಯಾಗಿದೆ.",
    image: "https://images.unsplash.com/photo-1594142415174-8dbb8e192ce9?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "4",
    nameEn: "Tur (Pigeon Pea)",
    nameKn: "ತೊಗರಿ ಬೇಳೆ",
    typeEn: "Pulse / Kharif",
    typeKn: "ದ್ವಿದಳ ಧಾನ್ಯ / ಮುಂಗಾರು",
    soilEn: "Sandy loam to clay loam with premium neutral pH",
    soilKn: "ರಮ್ಯ ಮರಳು ಮಿಶ್ರಿತ ಜೇಡಿಮಣ್ಣು, ಮಧ್ಯಮ ಕಪ್ಪು ಮಣ್ಣು",
    durationEn: "140 - 160 Days",
    durationKn: "140 ರಿಂದ 160 ದಿನಗಳು",
    yieldEn: "6 - 9 Quintals per Acre",
    yieldKn: "ಎಕರೆಗೆ 6 ರಿಂದ 9 ಕ್ವಿಂಟಾಲ್",
    descriptionEn: "Kalaburagi (Gulbarga) is known as the 'Tur Bowl of Karnataka' providing fine grades of high-protein pigeon peas.",
    descriptionKn: "ಕಲಬುರಗಿ ಜಿಲ್ಲೆಯನ್ನು ಕರ್ನಾಟಕದ 'ತೊಗರಿ ಕಣಜ' ಎಂದು ಕರೆಯಲಾಗುತ್ತದೆ. ಇದು ಅತ್ಯಧಿಕ ಸಸಾರಜನಕ ಹೊಂದಿರುವ ಬೇಳೆಯಾಗಿದೆ.",
    image: "https://images.unsplash.com/photo-1547058886-ca7ae7f3b392?auto=format&fit=crop&w=600&q=80"
  },
  {
    id: "5",
    nameEn: "Sugarcane",
    nameKn: "ಕಬ್ಬು",
    typeEn: "Perennial Cash Crop",
    typeKn: "ಬಹುವಾರ್ಷಿಕ ವಾಣಿಜ್ಯ ಬೆಳೆ",
    soilEn: "Rich alluvial loams and heavy dark clay",
    soilKn: "ಫಲವತ್ತಾದ ಕಪ್ಪು ಜೇಡಿ ಮತ್ತು ಮರಳು ಮಿಶ್ರಿತ ಗೊಬ್ಬರ ಮಣ್ಣು",
    durationEn: "11 - 12 Months",
    durationKn: "11 ರಿಂದ 12 ತಿಂಗಳುಗಳು",
    yieldEn: "35 - 45 Tons per Acre",
    yieldKn: "ಎಕರೆಗೆ 35 ರಿಂದ 45 ಟನ್",
    descriptionEn: "Extensively grown in Mandya, Belagavi, and Bagalkot with intense sugar-factory clusters.",
    descriptionKn: "ಮಂಡ್ಯ, ಬೆಳಗಾವಿ ಮತ್ತು ಬಾಗಲಕೋಟೆ ಜಿಲ್ಲೆಗಳಲ್ಲಿ ಹೆಚ್ಚಿನ ಸಕ್ಕರೆ ಕಾರ್ಖಾನೆಗಳ ಸಾಂದ್ರತೆಯೊಂದಿಗೆ ವ್ಯಾಪಕವಾಗಿ ಬೆಳೆಯಲಾಗುತ್ತದೆ.",
    image: "https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=600&q=80"
  }
];

export const SCHEMES_DATA: SchemeInfo[] = [
  {
    id: "s1",
    titleEn: "PM-KISAN Samman Nidhi",
    titleKn: "ಪಿಎಂ-ಕಿಸಾನ್ ಸಮ್ಮಾನ್ ನಿಧಿ",
    deptEn: "Central Department of Agriculture",
    deptKn: "ಕೇಂದ್ರ ಕೃಷಿ ಮತ್ತು ರೈತರ ಕಲ್ಯಾಣ ಇಲಾಖೆ",
    benefitsEn: "₹6,000 per year in 3 equal installments of ₹2,000 directly transferred to farmer savings accounts.",
    benefitsKn: "ವರ್ಷಕ್ಕೆ ₹6,000 ಹಣವನ್ನು ₹2,000 ರಂತೆ 3 ಕಂತುಗಳಲ್ಲಿ ನೇರವಾಗಿ ರೈತರ ಬ್ಯಾಂಕ್ ಖಾತೆಗೆ ಜಮೆ ಮಾಡಲಾಗುತ್ತದೆ.",
    eligibilityEn: "All small and marginal landholder farmer families owning cultivable land.",
    eligibilityKn: "ಸ್ವಂತ ಸಾಗುವಳಿ ಭೂಮಿ ಹೊಂದಿರುವ ಎಲ್ಲಾ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ಹಿಡುವಳಿದಾರ ರೈತ ಕುಟುಂಬಗಳು.",
    link: "https://pmkisan.gov.in"
  },
  {
    id: "s2",
    titleEn: "Karnataka Krishi Bhagya",
    titleKn: "ಕೃಷಿ ಭಾಗ್ಯ ಯೋಜನೆ (ಕರ್ನಾಟಕ)",
    deptEn: "Government of Karnataka Agriculture Dept",
    deptKn: "ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ಕೃಷಿ ಇಲಾಖೆ",
    benefitsEn: "Up to 80-90% subsidy for construction of Farm Ponds (Krishi Honda), polythene lining, diesel pumpsets, and micro-irrigation systems.",
    benefitsKn: "ಕೃಷಿ ಹೊಂಡ ನಿರ್ಮಾಣ, ಪಾಲಿಥಿನ್ ಲೈನಿಂಗ್, ಡೀಸೆಲ್ ಪಂಪ್ ಸೆಟ್ ಮತ್ತು ಲಘು ನೀರಾವರಿ ಪದ್ಧತಿಗೆ ಶೇ. 80 ರಿಂದ 90ರ ವರೆಗೆ ಸಹಾಯಧನ.",
    eligibilityEn: "Rainfed farmers in dry districts of Karnataka.",
    eligibilityKn: "ಕರ್ನಾಟಕದ ಒಣ ಬೇಸಾಯ ಹಾಗೂ ಮಳೆಯಾಶ್ರಿತ ಪ್ರದೇಶಗಳ ಎಲ್ಲಾ ರೈತರು.",
    link: "https://kaitatva.karnataka.gov.in"
  },
  {
    id: "s3",
    titleEn: "Krishi Yantra Dhare Scheme",
    titleKn: "ಕೃಷಿ ಯಂತ್ರಧಾರೆ ಯೋಜನೆ",
    deptEn: "Karnataka Agricultural Engineering Wing",
    deptKn: "ಕೃಷಿ ಇಂಜಿನಿಯರಿಂಗ್ ವಿಭಾಗ",
    benefitsEn: "Access to high-tech farm machinery (tractors, tillers, harvesters) on very low hourly rental basis directly operated via local hubs.",
    benefitsKn: "ಅತಿ ಕಡಿಮೆ ಬಾಡಿಗೆ ದರದಲ್ಲಿ ಹೈಟೆಕ್ ಕೃಷಿ ಯಂತ್ರೋಪಕರಣಗಳಾದ ಟ್ರ್ಯಾಕ್ಟರ್, ಹಾರ್ವೆಸ್ಟರ್‌ಗಳನ್ನು ಸ್ಥಳೀಯ ಸೇವಾ ಕೇಂದ್ರಗಳಿಂದ ಪಡೆದುಕೊಳ್ಳಬಹುದು.",
    eligibilityEn: "All registered farmers residing in rural hoblis of Karnataka.",
    eligibilityKn: "ಕರ್ನಾಟಕದ ಗ್ರಾಮಂತರ ಭಾಗದಲ್ಲಿ ಕೃಷಿ ಚಟುವಟಿಕೆ ಹೊಂದಿರುವ ಎಲ್ಲಾ ನೋಂದಾಯಿತ ರೈತರು.",
    link: "https://raitamitra.karnataka.gov.in"
  }
];
