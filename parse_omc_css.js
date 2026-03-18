const fs = require('fs');
const htmlPath = '/home/iarg/Documentos/SourcesOmc.com/Home - Omnicom.html';
const html = fs.readFileSync(htmlPath, 'utf8');

const headStart = html.indexOf('<head>');
const headEnd = html.indexOf('</head>');
const headStr = html.substring(headStart, headEnd);

let stylesHtml = "";
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/g;
let match;
while ((match = styleRegex.exec(headStr)) !== null) {
    if(!match[1].includes("Dashicons") && !match[1].includes("admin-bar")) {
        stylesHtml += match[1] + "\n";
    }
}

fs.writeFileSync('app/[locale]/capacidades/omc.css', stylesHtml);
console.log("Written to app/[locale]/capacidades/omc.css");
