import {Entity,PrimaryGeneratedColumn,Column,OneToMany,} from 'typeorm';
import { Pregunta } from './pregunta.entity';
import { Respuesta } from './respuesta.entity';

@Entity('encuestas')
export class Encuesta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'fecha_creacion', type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  fechaCreacion: Date;

  @Column({ name: 'es_publica', type: 'boolean', default: false })
  esPublica: boolean;

  @Column({ name: 'fecha_vencimiento', type: 'timestamp', nullable: true })
  fechaVencimiento?: Date;

  @Column({ name: 'activa', type: 'boolean', default: true })
  activa: boolean;

  @Column({ name: 'correo_creador', type: 'varchar', length: 255 })
  correoCreador: string;

  @Column({ name: 'codigo_privado', type: 'varchar', length: 255, nullable: true })
  codigoPrivado?: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  categoria?: string;

  @Column({ type: 'varchar', length: 255 })
  nombre: string;

  @Column({ type: 'text', nullable: true })
  descripcion?: string;

  @Column({ name: 'codigo_respuesta' })
  codigoRespuesta: string;
  

  @Column({ name: 'codigo_resultados' })
  codigoResultados: string;


  @Column({ name: 'enlace_visualizacion', type: 'varchar', length: 255, nullable: true })
  enlaceVisualizacion?: string;

  @Column({ name: 'enlace_participacion', type: 'varchar', length: 255, nullable: true })
  enlaceParticipacion?: string;

  @OneToMany(() => Pregunta, (pregunta) => pregunta.encuesta, { cascade: true })
  preguntas: Pregunta[];

  @OneToMany(() => Respuesta, (respuesta) => respuesta.encuesta, { cascade: true })
  respuestas: Respuesta[];
}
