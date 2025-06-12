import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Encuesta } from '../entities/encuesta.entity';
import { Respuesta } from '../entities/respuesta.entity';
import { RespuestaDetalle } from '../entities/respuesta-detalle.entity';
import { Pregunta } from '../entities/pregunta.entity';
import { CreateEncuestaDTO } from '../dtos/create-encuesta.dto';
import { CodigoTipoEnum } from '../enums/codigo-tipo.enum';
import { enviarCorreoCreacion } from '../../../utils/correo.util';

@Injectable()
export class EncuestasService {
  constructor(
    @InjectRepository(Encuesta)
    private readonly encuestasRepository: Repository<Encuesta>,

    @InjectRepository(Pregunta)
    private readonly preguntaRepository: Repository<Pregunta>,

    @InjectRepository(Respuesta)
    private readonly respuestaRepository: Repository<Respuesta>,

    @InjectRepository(RespuestaDetalle)
    private readonly respuestaDetalleRepository: Repository<RespuestaDetalle>,

    private readonly configService: ConfigService,
  ) {}

  async crearEncuesta(dto: CreateEncuestaDTO): Promise<{
    codigoVisualizacion: string;
    id: string;
    codigoRespuesta: string;
    codigoResultados: string;
  }> {
    const frontendUrl = this.configService.get<string>('frontendUrl');
    if (!frontendUrl) {
      throw new BadRequestException('FRONTEND_URL no está configurado');
    }

    const encuesta = this.encuestasRepository.create({
      ...dto,
      codigoRespuesta: uuidv4(),
      codigoResultados: uuidv4(),
      enlaceVisualizacion: uuidv4(),
      enlaceParticipacion: uuidv4(),
    });

    const encuestaGuardada = await this.encuestasRepository.save(encuesta);

    const enlaceParticipacion = `${frontendUrl}/participar/${encuestaGuardada.codigoRespuesta}`;
    await enviarCorreoCreacion(dto.correoCreador, enlaceParticipacion);

    return {
      codigoVisualizacion: encuestaGuardada.enlaceVisualizacion ?? '',
      id: encuestaGuardada.id,
      codigoRespuesta: encuestaGuardada.codigoRespuesta,
      codigoResultados: encuestaGuardada.codigoResultados,
    };
  }
  async listarTodasEncuestas(): Promise<Encuesta[]> {
    return this.encuestasRepository.find({
      relations: ['preguntas', 'preguntas.opciones'],
    });
  }

  async obtenerTodas(): Promise<Encuesta[]> {
    return this.encuestasRepository.find({
      relations: ['preguntas', 'preguntas.opciones'],
    });
  }

  async listarEncuestasPublicas(): Promise<Encuesta[]> {
    return this.encuestasRepository.find({
      where: { esPublica: true, activa: true },
      relations: ['preguntas', 'preguntas.opciones'],
    });
  }

  async obtenerEncuesta(
    id: string,
    codigo: string,
    tipo: CodigoTipoEnum.RESPUESTA | CodigoTipoEnum.RESULTADOS,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion')
      .where('encuesta.id = :id', { id });

    if (tipo === CodigoTipoEnum.RESPUESTA) {
      query.andWhere('encuesta.codigo_respuesta = :codigo', { codigo });
    } else {
      query.andWhere('encuesta.codigo_resultados = :codigo', { codigo });
    }

    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      throw new NotFoundException('Datos de encuesta no válidos');
    }

    return encuesta;
  }

  async obtenerEncuestaPorCodigo(
    codigo: string,
    tipo: CodigoTipoEnum,
  ): Promise<Encuesta> {
    const query = this.encuestasRepository
      .createQueryBuilder('encuesta')
      .leftJoinAndSelect('encuesta.preguntas', 'pregunta')
      .leftJoinAndSelect('pregunta.opciones', 'preguntaOpcion');

    if (tipo === CodigoTipoEnum.RESPUESTA) {
      query.where('encuesta.codigoRespuesta = :codigo', { codigo });
    } else {
      query.where('encuesta.codigoResultados = :codigo', { codigo });
    }

    query.orderBy('pregunta.numero', 'ASC');
    query.addOrderBy('preguntaOpcion.numero', 'ASC');

    const encuesta = await query.getOne();

    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada con ese código');
    }

    return encuesta;
  }

  async obtenerRespuestasPlanasGlobales() {
    try {
      const respuestas = await this.respuestaRepository.find({
        relations: ['detalles', 'detalles.pregunta', 'encuesta'],
      });

      if (!respuestas || respuestas.length === 0) {
        console.log('No se encontraron respuestas globales');
        return [];
      }

      const datos = respuestas.flatMap((respuesta) =>
        respuesta.detalles.map((detalle) => ({
          idRespuesta: respuesta.id,
          fecha: respuesta.fechaCreacion,
          encuestaId: respuesta.encuesta.id,
          encuestaNombre: respuesta.encuesta.nombre,
          pregunta: detalle.pregunta.texto,
          valor: detalle.texto_respuesta,
        })),
      );

      return datos;
    } catch (error) {
      console.error('Error en obtenerRespuestasPlanasGlobales:', error);
      throw error;
    }
  }

  async guardarRespuestas(
    codigoRespuesta: string,
    respuestasDto: { idPregunta: string; valor: string }[],
  ) {
    const encuesta = await this.encuestasRepository.findOneBy({
      codigoRespuesta,
    });
    if (!encuesta) {
      throw new NotFoundException('Encuesta no encontrada');
    }
    const respuesta = new Respuesta();
    respuesta.encuesta = encuesta;
    await this.respuestaRepository.save(respuesta);
    for (const respDto of respuestasDto) {
      const pregunta = await this.preguntaRepository.findOneBy({
        id: respDto.idPregunta,
      });
      if (!pregunta) {
        throw new NotFoundException(
          `Pregunta con id ${respDto.idPregunta} no encontrada`,
        );
      }

      const detalle = new RespuestaDetalle();
      detalle.respuesta = respuesta;
      detalle.pregunta = pregunta;
      detalle.texto_respuesta = respDto.valor;
      await this.respuestaDetalleRepository.save(detalle);
    }

    return { mensaje: 'Respuestas guardadas correctamente' };
  }

  async obtenerEstadisticasGenerales() {
    // Total respuestas en toda la base de datos
    const totalRespuestas = await this.respuestaRepository.count();

    // Total respuestas por pregunta
    const respuestasPorPregunta = await this.respuestaDetalleRepository
      .createQueryBuilder('rd')
      .select('p.id', 'preguntaId')
      .addSelect('p.texto', 'textoPregunta')
      .addSelect('COUNT(rd.id)', 'totalRespuestas')
      .innerJoin('rd.pregunta', 'p')
      .groupBy('p.id')
      .addGroupBy('p.texto')
      .orderBy('p.numero')
      .getRawMany();

    // Porcentaje por opción
    const totalRespuestasDetalle =
      await this.respuestaDetalleRepository.count();
    const porcentajePorOpcion = await this.respuestaDetalleRepository
      .createQueryBuilder('rd')
      .select('o.id', 'opcionId')
      .addSelect('o.texto', 'textoOpcion')
      .addSelect('COUNT(rd.id)', 'selecciones')
      .addSelect(`(COUNT(rd.id) * 100.0 / :total)`, 'porcentaje')
      .innerJoin('rd.opcion', 'o')
      .setParameter('total', totalRespuestasDetalle)
      .groupBy('o.id')
      .orderBy('o.id')
      .getRawMany();

    // Respuestas por minuto
    const respuestasPorMinuto = await this.respuestaRepository
      .createQueryBuilder('r')
      .select("DATE_TRUNC('minute', r.fechaCreacion)", 'minuto')
      .addSelect('COUNT(r.id)', 'total')
      .groupBy('minuto')
      .orderBy('minuto')
      .getRawMany();

    return {
      totalRespuestas,
      respuestasPorPregunta,
      porcentajePorOpcion,
      respuestasPorMinuto,
    };
  }
}
