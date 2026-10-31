import fs from 'fs';
import path from 'path';

const outDir = path.resolve(process.cwd(), 'public', 'uploads', 'products');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

function makeHookahSvg(brand, model, color1, color2, stemColor, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="bgGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2a2010" stop-opacity="0.8"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${stemColor}"/>
      <stop offset="40%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="${stemColor}"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <linearGradient id="glass" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${color1}" stop-opacity="0.9"/>
      <stop offset="50%" stop-color="${color2}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0.95"/>
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="15" stdDeviation="20" flood-color="#000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="800" height="800" fill="#080808"/>
  <circle cx="400" cy="400" r="380" fill="url(#bgGlow)"/>
  <ellipse cx="400" cy="680" rx="220" ry="25" fill="#000" opacity="0.8"/>

  <!-- Brand Watermark Header -->
  <rect x="50" y="40" width="700" height="70" rx="12" fill="#141414" stroke="#D4AF37" stroke-opacity="0.3" stroke-width="1.5"/>
  <text x="400" y="72" font-family="'Cinzel', 'Playfair Display', Georgia, serif" font-size="24" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="4">${brand.toUpperCase()}</text>
  <text x="400" y="96" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="#A89050" text-anchor="middle" letter-spacing="2">${model.toUpperCase()} &bull; GENUINE LUXURY SHISHA</text>

  <!-- Hookah Visual Group -->
  <g filter="url(#shadow)" transform="translate(0, 10)">
    <!-- Charcoal Bowl (Chillum) -->
    <path d="M 370 140 L 430 140 L 418 190 L 382 190 Z" fill="#8C3A1E" stroke="#5A2412" stroke-width="2"/>
    <ellipse cx="400" cy="140" rx="30" ry="8" fill="#5A2412"/>
    <ellipse cx="400" cy="138" rx="26" ry="6" fill="#222"/>
    <!-- Ashtray Plate -->
    <ellipse cx="400" cy="195" rx="90" ry="14" fill="url(#metal)" stroke="#333" stroke-width="1"/>
    <ellipse cx="400" cy="193" rx="80" ry="10" fill="#1a1a1a"/>

    <!-- Stem Column -->
    <rect x="392" y="200" width="16" height="180" fill="url(#metal)"/>
    <!-- Decorative Spheres on Stem -->
    <circle cx="400" cy="240" r="22" fill="url(#metal)"/>
    <circle cx="400" cy="300" r="26" fill="url(#metal)"/>
    <circle cx="400" cy="360" r="20" fill="url(#metal)"/>

    <!-- Purge Valve and Hose Port -->
    <rect x="345" y="380" width="30" height="14" rx="4" fill="url(#metal)"/>
    <rect x="425" y="380" width="30" height="14" rx="4" fill="url(#metal)"/>

    <!-- Base Grommet / Hub -->
    <path d="M 360 375 L 440 375 L 430 405 L 370 405 Z" fill="url(#metal)"/>

    <!-- Crystal Glass Vase -->
    <path d="M 370 405 Q 350 480 320 540 Q 290 600 320 640 Q 360 670 400 670 Q 440 670 480 640 Q 510 600 480 540 Q 450 480 430 405 Z" fill="url(#glass)" stroke="${accent}" stroke-width="2"/>
    
    <!-- Water level line & internal bubbles -->
    <path d="M 330 570 Q 400 580 470 570" stroke="#7ad1d1" stroke-width="3" fill="none" opacity="0.6"/>
    <circle cx="380" cy="600" r="6" fill="#fff" opacity="0.4"/>
    <circle cx="420" cy="620" r="8" fill="#fff" opacity="0.3"/>
    <circle cx="395" cy="635" r="5" fill="#fff" opacity="0.5"/>

    <!-- Silicone Hose Drape -->
    <path d="M 345 387 C 220 440, 240 620, 310 660" fill="none" stroke="#222" stroke-width="12" stroke-linecap="round"/>
    <path d="M 345 387 C 220 440, 240 620, 310 660" fill="none" stroke="${accent}" stroke-width="2" stroke-dasharray="6,4" stroke-linecap="round"/>
    <!-- Hose Handle -->
    <path d="M 310 660 L 270 630" stroke="url(#metal)" stroke-width="14" stroke-linecap="round"/>
  </g>

  <!-- Authentic Badge -->
  <g transform="translate(100, 710)">
    <rect width="600" height="50" rx="8" fill="#121212" stroke="#D4AF37" stroke-width="1"/>
    <text x="300" y="32" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#F3D079" text-anchor="middle" letter-spacing="1.5">✓ 100% ORIGINAL ${brand.toUpperCase()} &bull; HEAVY SMOKE CLOUDS &bull; GERMAN CUT</text>
  </g>
</svg>`;
}

function makeFlavourSvg(brand, name, fruitColor, accentColor, tag) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="boxGlow" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${fruitColor}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="pouchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#2a251b"/>
      <stop offset="50%" stop-color="#14110b"/>
      <stop offset="100%" stop-color="#080705"/>
    </linearGradient>
    <filter id="packShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000" flood-opacity="0.95"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#080808"/>
  <rect width="800" height="800" fill="url(#boxGlow)"/>

  <!-- Pouch / Pack Box Body -->
  <g filter="url(#packShadow)">
    <rect x="200" y="140" width="400" height="520" rx="20" fill="url(#pouchGrad)" stroke="#D4AF37" stroke-width="3"/>
    <rect x="215" y="155" width="370" height="490" rx="14" fill="none" stroke="#D4AF37" stroke-width="1" stroke-dasharray="8,6" opacity="0.6"/>

    <!-- Foil Seal Header -->
    <path d="M 200 190 L 600 190" stroke="#D4AF37" stroke-width="2"/>
    <rect x="200" y="140" width="400" height="50" rx="20" fill="#1f1b13"/>
    <text x="400" y="172" font-family="system-ui, sans-serif" font-size="14" font-weight="900" fill="#2ECC71" text-anchor="middle" letter-spacing="2">0% NICOTINE &bull; 0% TOBACCO &bull; HERBAL</text>

    <!-- Brand Header -->
    <text x="400" y="260" font-family="'Cinzel', Georgia, serif" font-size="38" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="4">${brand.toUpperCase()}</text>
    <text x="400" y="290" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="#A89050" text-anchor="middle" letter-spacing="3">PREMIUM HOOKAH MOLASSES</text>

    <!-- Flavour Emblem / Art Center -->
    <circle cx="400" cy="410" r="95" fill="#111" stroke="${accentColor}" stroke-width="4"/>
    <circle cx="400" cy="410" r="85" fill="${fruitColor}" opacity="0.75"/>
    
    <!-- Smoke swirl aesthetic -->
    <path d="M 350 430 Q 400 360 450 430 Q 400 480 350 430 Z" fill="#fff" opacity="0.25"/>
    <circle cx="400" cy="410" r="30" fill="${accentColor}" opacity="0.9"/>
    
    <!-- Flavor Name -->
    <rect x="230" y="520" width="340" height="55" rx="10" fill="#121212" stroke="#D4AF37" stroke-width="1.5"/>
    <text x="400" y="555" font-family="system-ui, sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${name.toUpperCase()}</text>

    <!-- Weight & Details -->
    <text x="400" y="615" font-family="system-ui, sans-serif" font-size="13" font-weight="700" fill="#D4AF37" text-anchor="middle" letter-spacing="1">NET WEIGHT 50g &bull; ${tag.toUpperCase()}</text>
  </g>
</svg>`;
}

function makePaperSvg(brand, type, bgTone, isBrown, tag) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <linearGradient id="paperBooklet" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${isBrown ? '#8B5A2B' : '#E8E8E8'}"/>
      <stop offset="50%" stop-color="${isBrown ? '#6E451F' : '#D0D0D0'}"/>
      <stop offset="100%" stop-color="${isBrown ? '#4A2E14' : '#B8B8B8'}"/>
    </linearGradient>
    <filter id="bookletShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000" flood-opacity="0.9"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#0A0A0A"/>
  <circle cx="400" cy="400" r="350" fill="${isBrown ? '#402510' : '#222222'}" opacity="0.4"/>

  <!-- Booklet Perspective Pack -->
  <g filter="url(#bookletShadow)" transform="translate(0, 20)">
    <!-- Main Booklet Body (King Size Slim format) -->
    <rect x="150" y="240" width="500" height="280" rx="16" fill="url(#paperBooklet)" stroke="${isBrown ? '#D4AF37' : '#333'}" stroke-width="3"/>
    
    <!-- Top Flap Fold Crease -->
    <line x1="150" y1="330" x2="650" y2="330" stroke="#000" stroke-width="2" opacity="0.4"/>
    
    <!-- Brand Title -->
    <text x="400" y="300" font-family="'Cinzel', Georgia, serif" font-size="34" font-weight="900" fill="${isBrown ? '#F7D070' : '#111111'}" text-anchor="middle" letter-spacing="3">${brand.toUpperCase()}</text>
    
    <!-- Paper Type Spec -->
    <rect x="200" y="360" width="400" height="50" rx="8" fill="#111" stroke="#D4AF37" stroke-width="1.5"/>
    <text x="400" y="392" font-family="system-ui, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">${type.toUpperCase()}</text>
    
    <!-- Roach Tips & Specs -->
    <text x="400" y="445" font-family="system-ui, sans-serif" font-size="14" font-weight="700" fill="${isBrown ? '#FFE4B5' : '#222222'}" text-anchor="middle" letter-spacing="1">32 LEAVES + 32 ROACH TIPS &bull; ULTRA THIN</text>
    <text x="400" y="480" font-family="system-ui, sans-serif" font-size="12" font-weight="600" fill="${isBrown ? '#D4AF37' : '#555555'}" text-anchor="middle" letter-spacing="2">${tag.toUpperCase()} &bull; SLOW BURNING</text>

    <!-- Hologram / Authentic Seal -->
    <circle cx="590" cy="285" r="28" fill="#D4AF37" stroke="#fff" stroke-width="1"/>
    <text x="590" y="290" font-family="system-ui, sans-serif" font-size="8" font-weight="900" fill="#000" text-anchor="middle">ORIGINAL</text>
  </g>

  <!-- Pre-rolled cones illustration below -->
  <g transform="translate(180, 580)">
    <path d="M 50 40 L 400 20 L 400 60 L 50 40 Z" fill="${isBrown ? '#A06D3B' : '#E0E0E0'}" stroke="#333" stroke-width="1"/>
    <ellipse cx="400" cy="40" rx="10" ry="20" fill="${isBrown ? '#704214' : '#CCCCCC'}"/>
    <rect x="50" y="32" width="60" height="16" fill="#D2B48C" stroke="#8B5A2B"/>
    <text x="220" y="45" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#222">PERFECT CONE</text>
  </g>
</svg>`;
}

function makeBongSvg(name, isAcrylic, color1, color2, style) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="bongGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${color1}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="bongBody" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${color1}" stop-opacity="${isAcrylic ? '0.9' : '0.4'}"/>
      <stop offset="50%" stop-color="${color2}" stop-opacity="${isAcrylic ? '0.95' : '0.2'}"/>
      <stop offset="100%" stop-color="${color1}" stop-opacity="${isAcrylic ? '0.85' : '0.5'}"/>
    </linearGradient>
    <filter id="bongShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="20" stdDeviation="25" flood-color="#000" flood-opacity="0.95"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#080808"/>
  <circle cx="400" cy="400" r="360" fill="url(#bongGlow)"/>
  
  <text x="400" y="70" font-family="'Cinzel', Georgia, serif" font-size="24" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="3">${name.toUpperCase()}</text>
  <text x="400" y="95" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#A89050" text-anchor="middle" letter-spacing="2">${isAcrylic ? 'HEAVY ACRYLIC WATER PIPE' : 'BOROSILICATE GLASS PERCOLATOR'}</text>

  <g filter="url(#bongShadow)" transform="translate(0, 20)">
    <!-- Mouthpiece -->
    <ellipse cx="400" cy="140" rx="35" ry="12" fill="${color2}" stroke="#fff" stroke-width="1.5"/>
    <ellipse cx="400" cy="140" rx="22" ry="8" fill="#111"/>

    <!-- Long Neck Tube -->
    <rect x="375" y="145" width="50" height="280" fill="url(#bongBody)" stroke="${color2}" stroke-width="2"/>
    
    <!-- Ice Notches / Perc Chambers -->
    <circle cx="385" cy="280" r="8" fill="#fff" opacity="0.5"/>
    <circle cx="415" cy="280" r="8" fill="#fff" opacity="0.5"/>
    <circle cx="400" cy="340" r="16" fill="${color1}" stroke="#fff" stroke-width="1" opacity="0.7"/>

    <!-- Main Water Beaker / Bubble Chamber -->
    <path d="M 375 425 L 300 620 Q 280 670 330 670 L 470 670 Q 520 670 500 620 L 425 425 Z" fill="url(#bongBody)" stroke="${color2}" stroke-width="3"/>

    <!-- Water Line -->
    <path d="M 320 610 Q 400 625 480 610" stroke="#00ffff" stroke-width="4" fill="none" opacity="0.6"/>

    <!-- Downstem & Slide Bowl -->
    <line x1="450" y1="480" x2="380" y2="630" stroke="#fff" stroke-width="10" stroke-linecap="round" opacity="0.8"/>
    <path d="M 450 480 L 490 440 L 515 455 L 475 495 Z" fill="${color1}" stroke="#fff" stroke-width="2"/>
    <!-- Bowl -->
    <ellipse cx="505" cy="445" rx="18" ry="12" fill="#555" stroke="#fff" stroke-width="1"/>
  </g>
</svg>`;
}

function makeLighterSvg(brand, model, bodyColor, flameType) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="flameGlow" cx="50%" cy="30%" r="40%">
      <stop offset="0%" stop-color="#ff7700" stop-opacity="0.7"/>
      <stop offset="100%" stop-color="#080808" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="metalCasing" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${bodyColor}"/>
      <stop offset="40%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="${bodyColor}"/>
      <stop offset="100%" stop-color="#111111"/>
    </linearGradient>
    <filter id="lighterShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="25" flood-color="#000" flood-opacity="0.95"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#080808"/>
  <circle cx="400" cy="280" r="240" fill="url(#flameGlow)"/>

  <!-- Flame / Plasma Arc -->
  <g transform="translate(0, -30)">
    <!-- Blue Torch Flame / Torch jet -->
    <path d="M 400 180 Q 425 250 405 320 Q 400 325 395 320 Q 375 250 400 180 Z" fill="#00e5ff" opacity="0.9"/>
    <path d="M 400 210 Q 415 260 403 310 Q 400 315 397 310 Q 385 260 400 210 Z" fill="#ffffff" opacity="0.95"/>
  </g>

  <!-- Lighter Body -->
  <g filter="url(#lighterShadow)">
    <!-- Open Lid flipped to the left -->
    <path d="M 280 290 L 330 230 L 360 250 L 330 320 Z" fill="url(#metalCasing)" stroke="#333" stroke-width="2"/>
    
    <!-- Chimney / Burner Core -->
    <rect x="365" y="270" width="70" height="50" rx="4" fill="#333" stroke="#888" stroke-width="1.5"/>
    <circle cx="385" cy="290" r="4" fill="#fff"/>
    <circle cx="415" cy="290" r="4" fill="#fff"/>
    <circle cx="400" cy="305" r="4" fill="#fff"/>

    <!-- Flint Wheel / Trigger -->
    <circle cx="445" cy="290" r="14" fill="#555" stroke="#999" stroke-width="2"/>

    <!-- Main Solid Metal Body -->
    <rect x="330" y="320" width="140" height="280" rx="16" fill="url(#metalCasing)" stroke="#444" stroke-width="2"/>

    <!-- Brand Engraving on Front Face -->
    <rect x="345" y="380" width="110" height="90" rx="8" fill="#151515" stroke="#D4AF37" stroke-width="1"/>
    <text x="400" y="420" font-family="'Cinzel', Georgia, serif" font-size="20" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="2">${brand.toUpperCase()}</text>
    <text x="400" y="445" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#CCCCCC" text-anchor="middle" letter-spacing="1">${model.toUpperCase()}</text>

    <!-- Bottom Stamp -->
    <text x="400" y="560" font-family="system-ui, sans-serif" font-size="10" font-weight="800" fill="#D4AF37" text-anchor="middle" letter-spacing="2">WINDPROOF &bull; REFILLABLE</text>
  </g>
</svg>`;
}

function makeAshtraySvg(name, isGlass, mainColor, accentColor) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="ashtrayGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${mainColor}" stop-opacity="0.3"/>
      <stop offset="100%" stop-color="#0a0a0a" stop-opacity="1"/>
    </radialGradient>
    <filter id="trayShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000" flood-opacity="0.95"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#080808"/>
  <circle cx="400" cy="400" r="360" fill="url(#ashtrayGlow)"/>

  <text x="400" y="90" font-family="'Cinzel', Georgia, serif" font-size="24" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="3">${name.toUpperCase()}</text>
  <text x="400" y="115" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#A89050" text-anchor="middle" letter-spacing="2">${isGlass ? 'HEAVY CUT CRYSTAL GLASS' : 'SOLID METAL PUSH-DOWN SPINNING MECHANISM'}</text>

  <!-- Ashtray Isometric Shape -->
  <g filter="url(#trayShadow)" transform="translate(0, 40)">
    <!-- Outer Rim -->
    <ellipse cx="400" cy="420" rx="260" ry="160" fill="${mainColor}" stroke="${accentColor}" stroke-width="4"/>
    
    <!-- Inner Bowl -->
    <ellipse cx="400" cy="420" rx="190" ry="110" fill="#151515" stroke="${accentColor}" stroke-width="2"/>
    
    ${!isGlass ? `
      <!-- Spinning Metal Plunger & Disc -->
      <circle cx="400" cy="420" r="60" fill="#888" stroke="#fff" stroke-width="2"/>
      <rect x="390" y="270" width="20" height="150" rx="6" fill="#aaa" stroke="#444" stroke-width="2"/>
      <circle cx="400" cy="265" r="22" fill="#D4AF37" stroke="#fff" stroke-width="2"/>
    ` : `
      <!-- Crystal Cut Facet Pattern -->
      <line x1="210" y1="420" x2="350" y2="420" stroke="#fff" stroke-width="3" opacity="0.6"/>
      <line x1="450" y1="420" x2="590" y2="420" stroke="#fff" stroke-width="3" opacity="0.6"/>
      <line x1="400" y1="310" x2="400" y2="380" stroke="#fff" stroke-width="3" opacity="0.6"/>
      <line x1="400" y1="460" x2="400" y2="530" stroke="#fff" stroke-width="3" opacity="0.6"/>
    `}

    <!-- Cigarette / Cigar Rests -->
    <rect x="135" y="412" width="40" height="16" rx="6" fill="#111" stroke="${accentColor}" stroke-width="2"/>
    <rect x="625" y="412" width="40" height="16" rx="6" fill="#111" stroke="${accentColor}" stroke-width="2"/>
    <rect x="392" y="255" width="16" height="40" rx="6" fill="#111" stroke="${accentColor}" stroke-width="2"/>
    <rect x="392" y="545" width="16" height="40" rx="6" fill="#111" stroke="${accentColor}" stroke-width="2"/>
  </g>
</svg>`;
}

function makePerfumeSvg(brand, name, glassColor, capColor, tag) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800" width="100%" height="100%">
  <defs>
    <radialGradient id="perfumeGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${glassColor}" stop-opacity="0.4"/>
      <stop offset="100%" stop-color="#080808" stop-opacity="1"/>
    </radialGradient>
    <linearGradient id="perfumeGlass" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${glassColor}" stop-opacity="0.9"/>
      <stop offset="35%" stop-color="#ffffff" stop-opacity="0.5"/>
      <stop offset="65%" stop-color="${glassColor}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#050505" stop-opacity="0.95"/>
    </linearGradient>
    <linearGradient id="capGold" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stop-color="${capColor}"/>
      <stop offset="45%" stop-color="#ffffff"/>
      <stop offset="70%" stop-color="${capColor}"/>
      <stop offset="100%" stop-color="#4a3b10"/>
    </linearGradient>
    <filter id="bottleShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="25" stdDeviation="30" flood-color="#000" flood-opacity="0.95"/>
    </filter>
  </defs>

  <rect width="800" height="800" fill="#080808"/>
  <circle cx="400" cy="400" r="360" fill="url(#perfumeGlow)"/>

  <g filter="url(#bottleShadow)" transform="translate(0, 15)">
    <!-- Gold / Metallic Heavy Cap -->
    <rect x="340" y="160" width="120" height="90" rx="8" fill="url(#capGold)" stroke="#333" stroke-width="2"/>
    <rect x="360" y="250" width="80" height="20" fill="#222"/>

    <!-- Glass Shoulder -->
    <path d="M 330 270 L 470 270 L 510 320 L 290 320 Z" fill="url(#perfumeGlass)" stroke="#D4AF37" stroke-width="1.5"/>

    <!-- Heavy Solid Crystal Bottle Body -->
    <rect x="290" y="320" width="220" height="320" rx="16" fill="url(#perfumeGlass)" stroke="#D4AF37" stroke-width="2.5"/>

    <!-- Heavy Base Glass Base -->
    <rect x="300" y="600" width="200" height="30" rx="8" fill="#fff" opacity="0.15"/>

    <!-- High-End Luxury Brand Label Plaque -->
    <rect x="315" y="380" width="170" height="160" rx="8" fill="#121212" stroke="#D4AF37" stroke-width="2"/>
    
    <text x="400" y="420" font-family="'Cinzel', Georgia, serif" font-size="18" font-weight="900" fill="#E5C158" text-anchor="middle" letter-spacing="2">${brand.toUpperCase()}</text>
    <line x1="340" y1="432" x2="460" y2="432" stroke="#D4AF37" stroke-width="1"/>
    
    <text x="400" y="465" font-family="system-ui, sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle" letter-spacing="1">${name.toUpperCase()}</text>
    <text x="400" y="495" font-family="system-ui, sans-serif" font-size="10" font-weight="700" fill="#A89050" text-anchor="middle" letter-spacing="2">EAU DE PARFUM</text>
    <text x="400" y="520" font-family="system-ui, sans-serif" font-size="9" font-weight="800" fill="#2ECC71" text-anchor="middle">100ml / 3.4 FL.OZ</text>
  </g>

  <!-- Tagline below -->
  <text x="400" y="730" font-family="system-ui, sans-serif" font-size="12" font-weight="700" fill="#E5C158" text-anchor="middle" letter-spacing="2">✓ ${tag.toUpperCase()} &bull; ALL-DAY PERFORMANCE</text>
</svg>`;
}

// Generate the complete set of exact product images:
const items = [
  // Hookahs (Mya, Cocoyaya, Denver)
  { fn: 'mya_suka.svg', svg: makeHookahSvg('Mya', 'Suka Crystal', '#1a2a40', '#0a1525', '#C0C0C0', '#4A90E2') },
  { fn: 'mya_qt.svg', svg: makeHookahSvg('Mya', 'QT Portable Brass', '#302010', '#181005', '#D4AF37', '#E5C158') },
  { fn: 'mya_bambino.svg', svg: makeHookahSvg('Mya', 'Bambino Heavy Glass', '#201030', '#100518', '#D4AF37', '#9B51E0') },
  { fn: 'mya_astra.svg', svg: makeHookahSvg('Mya', 'Astra Russian Stem', '#102020', '#051010', '#E0E0E0', '#27AE60') },
  { fn: 'cocoyaya_king.svg', svg: makeHookahSvg('Cocoyaya', 'King Series Brass', '#403010', '#201505', '#E5C158', '#F3D079') },
  { fn: 'cocoyaya_prince.svg', svg: makeHookahSvg('Cocoyaya', 'Prince Edition', '#151515', '#080808', '#C59B27', '#E5C158') },
  { fn: 'cocoyaya_niro.svg', svg: makeHookahSvg('Cocoyaya', 'Niro Stainless', '#252525', '#101010', '#EEEEEE', '#00e5ff') },
  { fn: 'cocoyaya_simba.svg', svg: makeHookahSvg('Cocoyaya', 'Simba Russian 2.0', '#301515', '#180808', '#D4AF37', '#FF3B30') },
  { fn: 'denver_russian.svg', svg: makeHookahSvg('Denver', 'Russian Hybrid Pro', '#101525', '#050810', '#D0D0D0', '#5AC8FA') },
  { fn: 'denver_stainless.svg', svg: makeHookahSvg('Denver', 'Stainless Steel Shisha', '#202020', '#0d0d0d', '#E0E0E0', '#F3D079') },
  { fn: 'denver_carbon.svg', svg: makeHookahSvg('Denver', 'Carbon Fiber Stealth', '#111111', '#050505', '#888888', '#FF9500') },
  { fn: 'danbar_russian.svg', svg: makeHookahSvg('Denver', 'Russian Hybrid Pro', '#101525', '#050810', '#D0D0D0', '#5AC8FA') },
  { fn: 'danbar_stainless.svg', svg: makeHookahSvg('Denver', 'Stainless Steel Shisha', '#202020', '#0d0d0d', '#E0E0E0', '#F3D079') },
  { fn: 'danbar_carbon.svg', svg: makeHookahSvg('Denver', 'Carbon Fiber Stealth', '#111111', '#050505', '#888888', '#FF9500') },

  // Flavours (Afzal / Absol, Aladin, Al Fakher)
  { fn: 'afzal_pan_raas.svg', svg: makeFlavourSvg('Afzal (Absol)', 'Pan Raas', '#1e4620', '#2ECC71', 'Original Betel Leaf & Cool Mint') },
  { fn: 'afzal_bombay_pan.svg', svg: makeFlavourSvg('Afzal (Absol)', 'Bombay Pan Masala', '#4a2511', '#D4AF37', 'Sweet Supari & Rose Petals') },
  { fn: 'afzal_brain_freeze.svg', svg: makeFlavourSvg('Afzal (Absol)', 'Brain Freeze', '#0f3854', '#00e5ff', 'Intense Arctic Ice Rush') },
  { fn: 'afzal_chocofusion.svg', svg: makeFlavourSvg('Afzal (Absol)', 'Chocofusion', '#3d2010', '#E5C158', 'Rich Dark Cocoa Cream') },
  { fn: 'aladin_double_apple.svg', svg: makeFlavourSvg('Aladin', 'Double Apple Anise', '#661a1a', '#FF3B30', 'Authentic Red & Green Apple') },
  { fn: 'aladin_blueberry_mint.svg', svg: makeFlavourSvg('Aladin', 'Blueberry Mint Blast', '#1a1f54', '#5856D6', 'Sweet Wild Berries & Crisp Mint') },
  { fn: 'aladin_paan_twist.svg', svg: makeFlavourSvg('Aladin', 'Paan Twist Supreme', '#1a401c', '#34C759', 'Fresh Calcutta Leaf Infusion') },
  { fn: 'al_fakher_two_apples.svg', svg: makeFlavourSvg('Al Fakher', 'Two Apples Classic', '#731414', '#FF2D55', 'World-Renowned Shisha Flavour') },
  { fn: 'al_fakher_mint.svg', svg: makeFlavourSvg('Al Fakher', 'Mint Magic', '#14523d', '#30D158', 'Pure Crisp Spearmint Leaf') },
  { fn: 'al_fakher_grape_mint.svg', svg: makeFlavourSvg('Al Fakher', 'Grape with Mint', '#3f1a52', '#AF52DE', 'Juicy Black Grapes & Chilled Mint') },

  // Bongs & Rolls (Bongchie, Thrice A Day, Perfect Roll, Acrylic Bongs, Glass Percolators)
  { fn: 'bongchie_brown_booklet.svg', svg: makePaperSvg('Bongchie', 'Brown King Size Slim', '#6B4226', true, 'Unbleached Organic Hemp') },
  { fn: 'bongchie_white_booklet.svg', svg: makePaperSvg('Bongchie', 'White Ultra Thin', '#D9D9D9', false, 'Natural Pure Rice Paper') },
  { fn: 'thrice_day_brown.svg', svg: makePaperSvg('Thrice A Day', 'Brown Natural Rolling Paper', '#5C381E', true, 'With Natural Roaches Included') },
  { fn: 'thrice_day_white.svg', svg: makePaperSvg('Thrice A Day', 'White Rice Paper Booklet', '#E2E2E2', false, 'Zero Ash Pure Burn') },
  { fn: 'perfect_roll_brown.svg', svg: makePaperSvg('Perfect Roll', 'Brown Pre-Rolled Cones', '#7A4B24', true, 'Pack of 3 Pre-Rolled Cones') },
  { fn: 'perfect_roll_white.svg', svg: makePaperSvg('Perfect Roll', 'White Pre-Rolled Cones', '#EFEFEF', false, 'Slow-Burning Ultra Fine') },
  { fn: 'acrylic_bong_neon.svg', svg: makeBongSvg('Neon Acrylic Multi-Ring Bong', true, '#00e5ff', '#ff007f', 'acrylic') },
  { fn: 'acrylic_bong_bubble.svg', svg: makeBongSvg('Compact Pistol Bubble Bong', true, '#39ff14', '#ffff00', 'acrylic') },
  { fn: 'glass_percolator_double.svg', svg: makeBongSvg('Double Honeycomb Percolator Bong', false, '#70d6ff', '#ffffff', 'glass') },
  { fn: 'glass_percolator_tree.svg', svg: makeBongSvg('Matrix Showerhead Perc Ice Bong', false, '#99e2b4', '#ffffff', 'glass') },

  // Lighters & Ashtrays (Flux, Stash Pro, Zippo, Glass Ashtray, Metal Ashtray)
  { fn: 'flux_quad_jet.svg', svg: makeLighterSvg('Flux', 'Turbo Quad-Jet Torch', '#1a1a1a', 'torch') },
  { fn: 'flux_plasma_arc.svg', svg: makeLighterSvg('Flux', 'Electric Plasma USB Arc', '#101826', 'plasma') },
  { fn: 'stash_pro_metal.svg', svg: makeLighterSvg('Stash Pro', 'Refillable Metal Jet', '#2e2e2e', 'jet') },
  { fn: 'stash_pro_clipper.svg', svg: makeLighterSvg('Stash Pro', 'Clipper Pro Metal', '#C59B27', 'flame') },
  { fn: 'zippo_matte_black.svg', svg: makeLighterSvg('Zippo', 'Classic Matte Black', '#1c1c1c', 'windproof') },
  { fn: 'zippo_brushed_chrome.svg', svg: makeLighterSvg('Zippo', 'Vintage Brushed Chrome', '#888888', 'windproof') },
  { fn: 'glass_ashtray_crystal.svg', svg: makeAshtraySvg('Faceted Octagonal Glass Ashtray', true, '#253545', '#89CFF0') },
  { fn: 'glass_ashtray_round.svg', svg: makeAshtraySvg('Heavy Cut Crystal Round Ashtray', true, '#333333', '#E0E0E0') },
  { fn: 'metal_ashtray_spinning.svg', svg: makeAshtraySvg('Spinning Smoke-Free Metal Ashtray', false, '#404040', '#D4AF37') },
  { fn: 'metal_ashtray_vintage.svg', svg: makeAshtraySvg('Cast Antique Brass Ashtray', false, '#5C4018', '#F3D079') },

  // Fragrances (Denver, Bella Vita, Park Avenue)
  { fn: 'denver_hamilton_edp.svg', svg: makePerfumeSvg('Denver', 'Hamilton Imperial', '#142033', '#D4AF37', 'All-Day Royal Aroma') },
  { fn: 'denver_sporting_victor.svg', svg: makePerfumeSvg('Denver', 'Sporting Club Victor', '#1a2f1c', '#2ECC71', 'Sport Fresh & Woody') },
  { fn: 'denver_caliber_edp.svg', svg: makePerfumeSvg('Denver', 'Caliber Signature', '#261b14', '#E5C158', 'Intense Amber Spice') },
  { fn: 'bellavita_ceo_man.svg', svg: makePerfumeSvg('Bella Vita', 'CEO MAN Luxury EDP', '#111111', '#D4AF37', 'Commanding Boardroom Aroma') },
  { fn: 'bellavita_white_oud.svg', svg: makePerfumeSvg('Bella Vita', 'White Oud Unisex EDP', '#252015', '#E5C158', 'Pure Amber, Rose & Smokey Oud') },
  { fn: 'bellavita_skai_aquatic.svg', svg: makePerfumeSvg('Bella Vita', 'Skai Aquatic Cologne', '#102a3a', '#00C7BE', 'Breezy Sea Notes & Citrus') },
  { fn: 'park_avenue_euphoria.svg', svg: makePerfumeSvg('Park Avenue', 'Euphoria Intense EDP', '#1a1824', '#D4AF37', 'Feisty Amber & Exotic Wood') },
  { fn: 'park_avenue_voyage.svg', svg: makePerfumeSvg('Park Avenue', 'Voyage Signature EDP', '#14221a', '#30D158', 'Mandarin & Tonka Bean') },
  { fn: 'park_avenue_harmony.svg', svg: makePerfumeSvg('Park Avenue', 'Harmony Luxury Mist', '#201814', '#FF9500', 'Patchouli & Musk Infusion') },
];

const distOutDir = path.resolve(process.cwd(), 'dist', 'uploads', 'products');
if (!fs.existsSync(distOutDir)) {
  try { fs.mkdirSync(distOutDir, { recursive: true }); } catch {}
}

for (const item of items) {
  const filePath = path.join(outDir, item.fn);
  fs.writeFileSync(filePath, item.svg, 'utf8');

  try {
    const distPath = path.join(distOutDir, item.fn);
    fs.writeFileSync(distPath, item.svg, 'utf8');
  } catch {}
}

console.log(`Generated ${items.length} luxury branded product packshots in ${outDir} and ${distOutDir}`);
