import { Parser } from 'json2csv';

interface Datos {
  [key: string]: any;
}

export function generarCSV(datos: Datos[], campos?: string[]): string {
  try {
    if (!datos || datos.length === 0) {
      throw new Error('No hay datos para exportar');
    }
 
    const options = campos ? { fields: campos } : { fields: Object.keys(datos[0]) };
    
    const parser = new Parser(options);
    return parser.parse(datos);
  } catch (error) {
    console.error('Error generando CSV:', error.message);
    return '';
  }
}
