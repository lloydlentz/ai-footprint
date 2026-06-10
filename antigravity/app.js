// Environmental Footprint Calculator - Logic & Interactions

// DOM Elements - Inputs
const liveHouse = document.getElementById('live-house');
const liveApartment = document.getElementById('live-apartment');
const heatingFuel = document.getElementById('heating-fuel');
const electricBill = document.getElementById('electric-bill');
const isEv = document.getElementById('is-ev');
const carMiles = document.getElementById('car-miles');
const carMpg = document.getElementById('car-mpg');
const flightMiles = document.getElementById('flight-miles');
const aiPrompts = document.getElementById('ai-prompts');
const aiImages = document.getElementById('ai-images');
const dietType = document.getElementById('diet-type');
const mitRecycle = document.getElementById('mit-recycle');
const mitCompost = document.getElementById('mit-compost');
const mitEnergy = document.getElementById('mit-energy');
const mitDry = document.getElementById('mit-dry');
const mitTemp = document.getElementById('mit-temp');

// DOM Elements - Value badges
const electricBillVal = document.getElementById('electric-bill-val');
const carMilesVal = document.getElementById('car-miles-val');
const carMpgVal = document.getElementById('car-mpg-val');
const flightMilesVal = document.getElementById('flight-miles-val');
const aiPromptsVal = document.getElementById('ai-prompts-val');
const aiImagesVal = document.getElementById('ai-images-val');

// DOM Elements - Outputs
const footprintTotal = document.getElementById('footprint-total');
const comparisonVerdict = document.getElementById('comparison-verdict');
const mpgGroup = document.getElementById('mpg-group');

// DOM Elements - Charts & Visuals
const dialActiveFill = document.getElementById('dial-active-fill');
const dialNeedleGroup = document.getElementById('dial-needle-group');

const breakdownHousingVal = document.getElementById('breakdown-housing-val');
const breakdownDrivingVal = document.getElementById('breakdown-driving-val');
const breakdownFlyingVal = document.getElementById('breakdown-flying-val');
const breakdownLifestyleVal = document.getElementById('breakdown-lifestyle-val');
const breakdownAiVal = document.getElementById('breakdown-ai-val');

const breakdownHousingBar = document.getElementById('breakdown-housing-bar');
const breakdownDrivingBar = document.getElementById('breakdown-driving-bar');
const breakdownFlyingBar = document.getElementById('breakdown-flying-bar');
const breakdownLifestyleBar = document.getElementById('breakdown-lifestyle-bar');
const breakdownAiBar = document.getElementById('breakdown-ai-bar');

// DOM Elements - Screen Reader Tables
const tableHousingVal = document.getElementById('table-housing-val');
const tableDrivingVal = document.getElementById('table-driving-val');
const tableFlyingVal = document.getElementById('table-flying-val');
const tableLifestyleVal = document.getElementById('table-lifestyle-val');
const tableAiVal = document.getElementById('table-ai-val');

// DOM Elements - AI Deep Dive
const aiKwhVal = document.getElementById('ai-kwh-val');
const aiWaterVal = document.getElementById('ai-water-val');
const eqPhones = document.getElementById('eq-phones');
const eqBulbs = document.getElementById('eq-bulbs');
const eqCarMiles = document.getElementById('eq-car-miles');
const eqWaterGlasses = document.getElementById('eq-water-glasses');

// DOM Elements - Theme Toggle
const themeToggle = document.getElementById('theme-toggle');

// Constant Factors (Metric conversions to US standard - lbs CO2e/year)
const FACTORS = {
  // Heating base values (lbs CO2/year) for average single family home
  heating: {
    'natural-gas': 6400,
    'electricity': 8000,
    'fuel-oil': 10000,
    'propane': 7500,
    'none': 0
  },
  // Scale factor for apartments/dorms (shared heating/smaller space)
  apartmentHeatingScale: 0.3,
  
  // Electricity: ($bill / price_per_kwh) * months * grid_carbon_intensity
  electricityPricePerKwh: 0.16, // US average is ~$0.16/kWh
  gridCarbonIntensity: 0.85,    // US average lbs CO2/kWh
  
  // Driving
  gasolineCo2PerGallon: 19.6,   // Direct emissions in lbs CO2/gallon
  evMilesPerKwh: 3.0,          // Average EV efficiency
  
  // Flying: lbs CO2 per passenger mile
  flyingCo2PerMile: 0.5,
  
  // AI computing
  aiTextWh: 2.9,               // Average LLM text query (2.9 Watt-hours)
  aiImageWh: 25.0,             // Average image generation query (25.0 Watt-hours)
  
  // AI Water cooling: ml per query
  aiTextWaterMl: 10,
  aiImageWaterMl: 50,
  mlPerGallon: 3785.41,
  
  // Diet profiles (lbs CO2/year)
  diet: {
    'meat-heavy': 6000,
    'average': 4500,
    'vegetarian': 3300,
    'vegan': 2400
  },
  
  // Mitigation reductions (lbs CO2/year saved)
  mitigations: {
    recycle: 600,
    compost: 300,
    energy: 500,
    dry: 200,
    temp: 500
  },
  
  // Base waste footprint (lbs CO2/year)
  baseWaste: 1500,
  
  // National Average for comparison
  usAverageFootprint: 35000,
  maxDialValue: 75000
};

// Application State
let state = {
  livingSituation: 'house',
  heatingFuel: 'natural-gas',
  electricBill: 120,
  isEv: false,
  carMiles: 12000,
  carMpg: 25,
  flightMiles: 5000,
  aiPrompts: 15,
  aiImages: 2,
  dietType: 'average',
  recycle: true,
  compost: false,
  energy: true,
  dry: false,
  temp: false
};

// Counter Animation Helper
let currentFootprintValue = 0;
let counterAnimationId = null;

function animateNumber(targetValue) {
  if (counterAnimationId) {
    cancelAnimationFrame(counterAnimationId);
  }
  
  const duration = 800; // ms
  const startTime = performance.now();
  const startValue = currentFootprintValue;
  
  function update(now) {
    const elapsed = now - startTime;
    const progress = Math.min(elapsed / duration, 1);
    
    // Ease out cubic
    const easeProgress = 1 - Math.pow(1 - progress, 3);
    
    currentFootprintValue = Math.round(startValue + (targetValue - startValue) * easeProgress);
    footprintTotal.textContent = currentFootprintValue.toLocaleString();
    
    if (progress < 1) {
      counterAnimationId = requestAnimationFrame(update);
    } else {
      currentFootprintValue = targetValue;
      footprintTotal.textContent = targetValue.toLocaleString();
    }
  }
  
  counterAnimationId = requestAnimationFrame(update);
}

// Core Calculator Function
function updateCalculations() {
  // 1. Read Inputs to sync state
  state.livingSituation = document.querySelector('input[name="living-situation"]:checked').value;
  state.heatingFuel = heatingFuel.value;
  state.electricBill = parseFloat(electricBill.value);
  state.isEv = isEv.checked;
  state.carMiles = parseFloat(carMiles.value);
  state.carMpg = parseFloat(carMpg.value);
  state.flightMiles = parseFloat(flightMiles.value);
  state.aiPrompts = parseFloat(aiPrompts.value);
  state.aiImages = parseFloat(aiImages.value);
  state.dietType = dietType.value;
  state.recycle = mitRecycle.checked;
  state.compost = mitCompost.checked;
  state.energy = mitEnergy.checked;
  state.dry = mitDry.checked;
  state.temp = mitTemp.checked;

  // 2. Adjust visibility of MPG slider
  if (state.isEv) {
    mpgGroup.style.opacity = '0.4';
    mpgGroup.style.pointerEvents = 'none';
    carMpg.disabled = true;
  } else {
    mpgGroup.style.opacity = '1';
    mpgGroup.style.pointerEvents = 'auto';
    carMpg.disabled = false;
  }

  // 3. Category Math
  // --- Housing & Utilities ---
  let heatingCO2 = FACTORS.heating[state.heatingFuel];
  if (state.livingSituation === 'apartment') {
    heatingCO2 *= FACTORS.apartmentHeatingScale;
  }
  const electricKwhAnnual = (state.electricBill / FACTORS.electricityPricePerKwh) * 12;
  const electricityCO2 = electricKwhAnnual * FACTORS.gridCarbonIntensity;
  const totalHousing = Math.round(heatingCO2 + electricityCO2);

  // --- Driving ---
  let totalDriving = 0;
  if (state.isEv) {
    const evKwh = state.carMiles / FACTORS.evMilesPerKwh;
    totalDriving = evKwh * FACTORS.gridCarbonIntensity;
  } else {
    totalDriving = (state.carMiles / state.carMpg) * FACTORS.gasolineCo2PerGallon;
  }
  totalDriving = Math.round(totalDriving);

  // --- Flying ---
  const totalFlying = Math.round(state.flightMiles * FACTORS.flyingCo2PerMile);

  // --- AI & Digital Usage ---
  // Text: prompts * days * Wh / 1000 * carbon_intensity
  const aiTextKwh = (state.aiPrompts * 365 * FACTORS.aiTextWh) / 1000;
  const aiTextCO2 = aiTextKwh * FACTORS.gridCarbonIntensity;
  
  // Images: images * days * Wh / 1000 * carbon_intensity
  const aiImageKwh = (state.aiImages * 365 * FACTORS.aiImageWh) / 1000;
  const aiImageCO2 = aiImageKwh * FACTORS.gridCarbonIntensity;
  
  const totalAi = Math.round(aiTextCO2 + aiImageCO2);

  // --- Food & Lifestyle ---
  const dietCO2 = FACTORS.diet[state.dietType];
  let mitigationsSaved = 0;
  if (state.recycle) mitigationsSaved += FACTORS.mitigations.recycle;
  if (state.compost) mitigationsSaved += FACTORS.mitigations.compost;
  if (state.energy) mitigationsSaved += FACTORS.mitigations.energy;
  if (state.dry) mitigationsSaved += FACTORS.mitigations.dry;
  if (state.temp) mitigationsSaved += FACTORS.mitigations.temp;
  
  const totalLifestyle = Math.max(0, Math.round(FACTORS.baseWaste + dietCO2 - mitigationsSaved));

  // --- Total Carbon ---
  const grandTotal = Math.max(0, totalHousing + totalDriving + totalFlying + totalAi + totalLifestyle);

  // 4. Update Badge Text values on the sliders
  electricBillVal.textContent = `$${state.electricBill}`;
  carMilesVal.textContent = `${state.carMiles.toLocaleString()} miles`;
  carMpgVal.textContent = `${state.carMpg} MPG`;
  flightMilesVal.textContent = `${state.flightMiles.toLocaleString()} miles`;
  aiPromptsVal.textContent = `${state.aiPrompts} / day`;
  aiImagesVal.textContent = `${state.aiImages} / day`;

  // 5. Update Digital emissions display with animation
  animateNumber(grandTotal);

  // 6. Update SVG Dial Gauge
  // Dash offset ranges from 251.3 (empty) to 0 (full)
  // needle rotation ranges from -90deg (empty) to 90deg (full)
  const percentOfMax = Math.min(grandTotal / FACTORS.maxDialValue, 1);
  const fillOffset = 251.3 - (percentOfMax * 251.3);
  const needleRotation = -90 + (percentOfMax * 180);

  dialActiveFill.style.strokeDashoffset = fillOffset;
  dialNeedleGroup.style.transform = `rotate(${needleRotation}deg)`;

  // 7. Update Breakdown Bars
  // Scale relatively. Let's make 20,000 lbs the maximum for a 100% wide bar
  const barMaxScale = 20000;
  const housePct = Math.min((totalHousing / barMaxScale) * 100, 100);
  const drivePct = Math.min((totalDriving / barMaxScale) * 100, 100);
  const flyPct = Math.min((totalFlying / barMaxScale) * 100, 100);
  const lifestylePct = Math.min((totalLifestyle / barMaxScale) * 100, 100);
  const aiPct = Math.min((totalAi / barMaxScale) * 100, 100);

  breakdownHousingBar.style.width = `${housePct}%`;
  breakdownDrivingBar.style.width = `${drivePct}%`;
  breakdownFlyingBar.style.width = `${flyPct}%`;
  breakdownLifestyleBar.style.width = `${lifestylePct}%`;
  breakdownAiBar.style.width = `${aiPct}%`;

  breakdownHousingVal.textContent = `${totalHousing.toLocaleString()} lbs`;
  breakdownDrivingVal.textContent = `${totalDriving.toLocaleString()} lbs`;
  breakdownFlyingVal.textContent = `${totalFlying.toLocaleString()} lbs`;
  breakdownLifestyleVal.textContent = `${totalLifestyle.toLocaleString()} lbs`;
  breakdownAiVal.textContent = `${totalAi.toLocaleString()} lbs`;

  // Sync screen reader tables
  tableHousingVal.textContent = totalHousing;
  tableDrivingVal.textContent = totalDriving;
  tableFlyingVal.textContent = totalFlying;
  tableLifestyleVal.textContent = totalLifestyle;
  tableAiVal.textContent = totalAi;

  // 8. Dynamic Comparison verdict
  const diffFromAvg = Math.abs(Math.round(((FACTORS.usAverageFootprint - grandTotal) / FACTORS.usAverageFootprint) * 100));
  if (grandTotal < 12000) {
    comparisonVerdict.innerHTML = `🌍 <strong>Eco-Hero:</strong> Your carbon footprint is <strong>${diffFromAvg}% below</strong> the U.S. average, hitting global sustainability goals!`;
    comparisonVerdict.className = "comparison-banner border-green";
  } else if (grandTotal < FACTORS.usAverageFootprint) {
    comparisonVerdict.innerHTML = `✅ <strong>Moderate Footprint:</strong> Your footprint is <strong>${diffFromAvg}% below</strong> the national average. Excellent!`;
    comparisonVerdict.className = "comparison-banner border-orange";
  } else {
    const aboveAvg = Math.round(((grandTotal - FACTORS.usAverageFootprint) / FACTORS.usAverageFootprint) * 100);
    comparisonVerdict.innerHTML = `⚠️ <strong>Above Average:</strong> Your carbon footprint is <strong>${aboveAvg}% higher</strong> than the U.S. national average.`;
    comparisonVerdict.className = "comparison-banner border-red";
  }

  // 9. Update AI Spotlight Deep Dive Metrics
  const totalAiKwh = Math.round(aiTextKwh + aiImageKwh);
  // Water in gallons: ML / 3785.41
  const annualWaterMl = (state.aiPrompts * FACTORS.aiTextWaterMl + state.aiImages * FACTORS.aiImageWaterMl) * 365;
  const totalAiWaterGallons = Math.round(annualWaterMl / FACTORS.mlPerGallon);

  aiKwhVal.textContent = totalAiKwh.toLocaleString();
  aiWaterVal.textContent = totalAiWaterGallons.toLocaleString();

  // Equivalences
  // 1 phone charge = 12 Wh (0.012 kWh)
  const phoneCharges = Math.round((totalAiKwh / 0.012));
  // 10W LED bulb for 1 hour = 0.01 kWh
  const ledHours = Math.round((totalAiKwh / 0.01));
  // 1 mile in average gas car = 0.77 lbs CO2
  const equivalentGasMiles = Math.round((totalAi / 0.77));
  // 8oz glass of water = 236.588 ml (0.0625 gallons)
  const waterGlasses = Math.round((totalAiWaterGallons / 0.0625));

  eqPhones.textContent = phoneCharges.toLocaleString();
  eqBulbs.textContent = ledHours.toLocaleString();
  eqCarMiles.textContent = equivalentGasMiles.toLocaleString();
  eqWaterGlasses.textContent = waterGlasses.toLocaleString();

  // Save state
  localStorage.setItem('ecoFootprintState', JSON.stringify(state));
}

// Preset Handlers
function setupFlightPresets() {
  document.querySelectorAll('.preset-btn[data-miles]').forEach(button => {
    button.addEventListener('click', (e) => {
      const milesToAdd = parseInt(e.target.getAttribute('data-miles'));
      let currentVal = parseInt(flightMiles.value);
      let newVal = Math.min(currentVal + milesToAdd, 50000);
      flightMiles.value = newVal;
      updateCalculations();
    });
  });

  document.getElementById('clear-flights').addEventListener('click', () => {
    flightMiles.value = 0;
    updateCalculations();
  });
}

// Living Default Sync
// Help user with realistic utilities bills when changing living situations
function setupLivingDefaults() {
  document.querySelectorAll('input[name="living-situation"]').forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'apartment') {
        if (electricBill.value == 120) {
          electricBill.value = 50;
        }
      } else {
        if (electricBill.value == 50) {
          electricBill.value = 120;
        }
      }
      updateCalculations();
    });
  });
}

// Theme Toggle Sync
function setupThemeToggle() {
  // Initial check
  const savedTheme = localStorage.getItem('ecoTheme');
  if (savedTheme === 'light' || (!savedTheme && window.matchMedia('(prefers-color-scheme: light)').matches)) {
    document.body.classList.add('light-theme');
  }

  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('ecoTheme', isLight ? 'light' : 'dark');
  });
}

// Load Saved State
function loadSavedState() {
  const saved = localStorage.getItem('ecoFootprintState');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Sync state and DOM elements
      state = { ...state, ...parsed };
      
      // Update DOM
      if (state.livingSituation === 'apartment') {
        document.getElementById('live-apartment').checked = true;
      } else {
        document.getElementById('live-house').checked = true;
      }
      heatingFuel.value = state.heatingFuel;
      electricBill.value = state.electricBill;
      isEv.checked = state.isEv;
      carMiles.value = state.carMiles;
      carMpg.value = state.carMpg;
      flightMiles.value = state.flightMiles;
      aiPrompts.value = state.aiPrompts;
      aiImages.value = state.aiImages;
      dietType.value = state.dietType;
      
      mitRecycle.checked = state.recycle;
      mitCompost.checked = state.compost;
      mitEnergy.checked = state.energy;
      mitDry.checked = state.dry;
      mitTemp.checked = state.temp;
    } catch (e) {
      console.error("Error loading saved state", e);
    }
  }
}

// Event Listeners Registration
function registerEventListeners() {
  const inputs = [
    heatingFuel, electricBill, isEv, carMiles, carMpg,
    flightMiles, aiPrompts, aiImages, dietType,
    mitRecycle, mitCompost, mitEnergy, mitDry, mitTemp
  ];
  
  inputs.forEach(input => {
    input.addEventListener('input', updateCalculations);
    input.addEventListener('change', updateCalculations);
  });
}

// App Initialization
document.addEventListener('DOMContentLoaded', () => {
  loadSavedState();
  setupThemeToggle();
  setupFlightPresets();
  setupLivingDefaults();
  registerEventListeners();
  updateCalculations();
});
