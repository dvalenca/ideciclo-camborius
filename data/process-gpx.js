// Script para processar arquivos GPX e extrair waypoints com anotações
const fs = require('fs');
const path = require('path');

// Função para extrair waypoints de um arquivo GPX
function extractWaypointsFromGPX(gpxContent, filename) {
  const waypoints = [];
  
  // Regex para encontrar waypoints
  const waypointRegex = /<wpt[^>]*lat="([^"]*)"[^>]*lon="([^"]*)"[^>]*>(.*?)<\/wpt>/gs;
  
  let match;
  while ((match = waypointRegex.exec(gpxContent)) !== null) {
    const lat = parseFloat(match[1]);
    const lon = parseFloat(match[2]);
    const content = match[3];
    
    // Extrair nome e descrição
    const nameMatch = content.match(/<name>(.*?)<\/name>/s);
    const descMatch = content.match(/<desc>(.*?)<\/desc>/s);
    const cmtMatch = content.match(/<cmt>(.*?)<\/cmt>/s);
    
    const waypoint = {
      lat: lat,
      lon: lon,
      name: nameMatch ? nameMatch[1].trim() : '',
      description: descMatch ? descMatch[1].trim() : '',
      comment: cmtMatch ? cmtMatch[1].trim() : '',
      gpx_file: filename
    };
    
    // Só adicionar se tiver coordenadas válidas
    if (!isNaN(lat) && !isNaN(lon)) {
      waypoints.push(waypoint);
    }
  }
  
  return waypoints;
}

// Processar todos os arquivos GPX
function processAllGPXFiles() {
  const gpxDir = '../../src/gpx-files';
  const allWaypoints = [];
  
  try {
    const files = fs.readdirSync(gpxDir);
    const gpxFiles = files.filter(file => file.toLowerCase().endsWith('.gpx'));
    
    console.log(`📁 Encontrados ${gpxFiles.length} arquivos GPX`);
    
    gpxFiles.forEach(filename => {
      try {
        const filePath = path.join(gpxDir, filename);
        const gpxContent = fs.readFileSync(filePath, 'utf8');
        const waypoints = extractWaypointsFromGPX(gpxContent, filename);
        
        if (waypoints.length > 0) {
          console.log(`📍 ${filename}: ${waypoints.length} waypoints`);
          allWaypoints.push(...waypoints);
        }
      } catch (error) {
        console.error(`❌ Erro ao processar ${filename}:`, error.message);
      }
    });
    
    // Agrupar waypoints por arquivo GPX
    const waypointsByFile = {};
    allWaypoints.forEach(wp => {
      if (!waypointsByFile[wp.gpx_file]) {
        waypointsByFile[wp.gpx_file] = [];
      }
      waypointsByFile[wp.gpx_file].push(wp);
    });
    
    // Salvar dados processados
    fs.writeFileSync('./waypoints-data.json', JSON.stringify(allWaypoints, null, 2));
    fs.writeFileSync('./waypoints-by-file.json', JSON.stringify(waypointsByFile, null, 2));
    
    console.log(`✅ Processamento concluído!`);
    console.log(`📊 Total de waypoints: ${allWaypoints.length}`);
    console.log(`📁 Arquivos com waypoints: ${Object.keys(waypointsByFile).length}`);
    
    return { allWaypoints, waypointsByFile };
    
  } catch (error) {
    console.error('❌ Erro ao acessar diretório GPX:', error.message);
    return { allWaypoints: [], waypointsByFile: {} };
  }
}

// Executar processamento
if (require.main === module) {
  processAllGPXFiles();
}

module.exports = { processAllGPXFiles, extractWaypointsFromGPX };