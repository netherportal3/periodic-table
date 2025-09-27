const src = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/refs/heads/master/PeriodicTableJSON.json';
let elementsData = []; 

function fmtMass(val) { // formatting atomic mass numbers (to 3 decimals)
  const n = typeof val === 'number' ? val : parseFloat(String(val));
  if (!isFinite(n)) return '';
  return n.toFixed(3).replace(/\.?0+$/, '');
}

function formatValue(value) { // formatting the values of the popup
  if (value === null || value === undefined) return 'N/A';
  if (typeof value === 'number') {
    if (value > 1000) return value.toExponential(2);
    return value.toFixed(3).replace(/\.?0+$/, '');
  }
  if (Array.isArray(value)) {
    return value.join(', ');
  }
  return String(value);
}

function showElementPopup(el) { // shows the popup with element data
  const popup = document.getElementById('elementPopup');
  const content = document.getElementById('popupContent');
  
  content.innerHTML = `
    <h2>${el.name} (${el.symbol}) - Atomic Number: ${el.number}</h2>
    
    <div class="element-visual">
      ${el.image && el.image.url ? `
        <div class="element-image">
          <img src="${el.image.url}" alt="${el.name}" title="${el.image.title || el.name}">
        </div>
      ` : ''}
      ${el.bohr_model_3d ? `
        <div class="element-model">
          <model-viewer 
            src="${el.bohr_model_3d}" 
            alt="${el.name} 3D Bohr Model"
            auto-rotate
            camera-controls
            loading="eager">
          </model-viewer>
        </div>
      ` : ''}
    </div>
    
    <ul>
      <li>Atomic Mass: ${formatValue(el.atomic_mass)} u</li>
      <li>Period: ${formatValue(el.period)}</li>
      <li>Group: ${formatValue(el.group)}</li>
      <li>Block: ${formatValue(el.block)}</li>
      <li>Phase: ${formatValue(el.phase)}</li>
      <li>Category: ${formatValue(el.category)}</li>
      <li>Appearance: ${formatValue(el.appearance)}</li>
      <li>Density: ${formatValue(el.density)} g/cm³</li>
      <li>Melting Point: ${formatValue(el.melt)} K</li>
      <li>Boiling Point: ${formatValue(el.boil)} K</li>
      <li>Molar Heat: ${formatValue(el.molar_heat)} J/(mol·K)</li>
      <li>Electron Configuration: ${formatValue(el.electron_configuration)}</li>
      <li>Electronegativity: ${formatValue(el.electronegativity_pauling)}</li>
      <li>Electron Affinity: ${formatValue(el.electron_affinity)} kJ/mol</li>
      <li>Ionization Energies: ${formatValue(el.ionization_energies)} kJ/mol</li>
      <li>Shells: ${formatValue(el.shells)}</li>
      <li>Discovered by: ${formatValue(el.discovered_by)}</li>
      <li>Named by: ${formatValue(el.named_by)}</li>
      <li>Source: <a href="${el.source}" target="_blank">Wikipedia</a></li>
      ${el.summary ? `<li>Summary: ${el.summary}</li>` : ''}
    </ul>
  `;
  
  popup.style.display = 'block';
}

function closeElementPopup() {
  const popup = document.getElementById('elementPopup');
  popup.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
  const parent = document.querySelector('.parent');
  
  // creating all the divs for the grid
  for (let i = 1; i <= 118; i++) {
    const div = document.createElement('div');
    div.className = `div${i}`;
    parent.appendChild(div);
  }
  
  // popup close stuff
  const closeBtn = document.querySelector('.close');
  const popup = document.getElementById('elementPopup');
  
  closeBtn.addEventListener('click', closeElementPopup);
  popup.addEventListener('click', function(e) {
    if (e.target === popup) {
      closeElementPopup();
    }
  });
  
  // esc key to close
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      closeElementPopup();
    }
  });
});

fetch(src)
  .then(r => r.json())
  .then(data => {
    elementsData = data.elements; 
    
    data.elements.forEach(el => {
      const box = document.querySelector('.div' + el.number);
      if (!box) return;
      
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.style.backgroundColor = '#' + el['cpk-hex']; // using the colors from the json file.
      tile.innerHTML =
        '<div class="num">' + el.number + '</div>' +
        '<div class="sym">' + el.symbol + '</div>' +
        '<div class="name">' + el.name + '</div>' +
        '<div class="mass">' + fmtMass(el.atomic_mass) + '</div>';
      
      tile.addEventListener('click', function() {
        showElementPopup(el);
      });
      
      box.appendChild(tile);
    });
  });
