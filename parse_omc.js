const fs = require('fs');
let tsx = fs.readFileSync('app/[locale]/capacidades/omcContent.ts', 'utf8');

// The exported string is omcHtml = `<body class=...>...</body>`;
// We just want to remove the <body ...> and </body> tags
tsx = tsx.replace(/<body[^>]*>/i, '');
tsx = tsx.replace(/<\/body>/i, '');

fs.writeFileSync('app/[locale]/capacidades/omcContent.ts', tsx);
console.log("Stripped body tags");
