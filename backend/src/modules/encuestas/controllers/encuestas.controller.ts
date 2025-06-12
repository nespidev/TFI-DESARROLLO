import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Res,
  NotFoundException,
} from '@nestjs/common';
import { Response } from 'express';
import { EncuestasService } from '../services/encuestas.service';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { CreateRespuestaDTO } from '../dtos/create-respuesta.dto';
import { Encuesta } from '../entities/encuesta.entity';
import { ObtenerEncuestaDto } from '../dtos/obtener-encuesta.dto';
import { generarCSV } from '../../../utils/csv.util';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';

@Controller('encuestas')
export class EncuestasController {
  constructor(private readonly encuestasService: EncuestasService) {}

  @Get()
  async listarTodas(): Promise<Encuesta[]> {
    return this.encuestasService.listarTodasEncuestas();
  }

  @Post()
  async crearEncuesta(@Body() dto: CreateEncuestaDTO) {
    return this.encuestasService.crearEncuesta(dto);
  }

  @Get('publicas/listar')
  async listarPublicas(): Promise<Encuesta[]> {
    return this.encuestasService.listarEncuestasPublicas();
  }

  @Get('estadisticas-globales')
  async obtenerEstadisticasGlobales() {
    try {
      return await this.encuestasService.obtenerEstadisticasGenerales();
    } catch (error) {
      console.error('Error al obtener estadísticas globales:', error);
      throw error;
    }
  }

  @Get('exportar-global')
  async exportarRespuestasCSVGlobal(@Res() res: Response) {
    const datos = await this.encuestasService.obtenerRespuestasPlanasGlobales();

    if (!datos || datos.length === 0) {
      return res.status(404).json({ mensaje: 'No hay respuestas globales.' });
    }

    const csv = generarCSV(datos);

    res.header('Content-Type', 'text/csv; charset=utf-8');
    res.header(
      'Content-Disposition',
      `attachment; filename="respuestas_globales.csv"`,
    );
    res.send(csv);
  }

  @Get('participar/:codigo')
  async participar(@Param('codigo') codigo: string) {
    return this.encuestasService.obtenerEncuestaPorCodigo(
      codigo,
      CodigoTipoEnum.RESPUESTA,
    );
  }

  @Get('codigo/:codigo')
  async obtenerPorCodigo(
    @Param('codigo') codigo: string,
    @Query('tipo') tipo: CodigoTipoEnum,
  ): Promise<Encuesta> {
    const encuesta = await this.encuestasService.obtenerEncuestaPorCodigo(
      codigo,
      tipo,
    );
    if (!encuesta) throw new NotFoundException('Encuesta no encontrada');
    return encuesta;
  }

  @Get('id/:id')
  async obtenerEncuesta(
    @Param('id') id: string,
    @Query() dto: ObtenerEncuestaDto,
  ): Promise<Encuesta> {
    const encuesta = await this.encuestasService.obtenerEncuesta(
      id,
      dto.codigo,
      dto.tipo,
    );
    if (!encuesta) throw new NotFoundException('Encuesta no encontrada');
    return encuesta;
  }

  @Post(':codigoRespuesta/respuestas')
  async enviarRespuestas(
    @Param('codigoRespuesta') codigoRespuesta: string,
    @Body() dto: CreateRespuestaDTO,
  ) {
    const respuestasFormateadas = dto.respuestas.map((r) => ({
      idPregunta: r.preguntaId,
      valor: r.valor,
    }));
    return this.encuestasService.guardarRespuestas(
      codigoRespuesta,
      respuestasFormateadas,
    );
  }
}
