const fs = require('fs');
const file = 'public/02-Home-top-section.json';
let data = fs.readFileSync(file, 'utf8');

// El color naranja original en escala 0-1 (RGB): [1, 0.4039, 0.1804]
// Lo cambiaremos a un morado brillante, ej: Tailwind purple-600 (#9333EA) -> [0.5765, 0.2, 0.9176]
const oldColor = '[1,0.4039,0.1804]';
const newColor = '[0.5765,0.2,0.9176]';

// Hacer el reemplazo global en todo el JSON
const newData = data.split(oldColor).join(newColor);

fs.writeFileSync(file, newData);
console.log(`Reemplazos realizados. Se detectaron ${data.split(oldColor).length - 1} instancias del color original.`);
