import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Respuesta } from './respuesta.entity';
import { Pregunta } from './pregunta.entity';
import { Opcion } from './opcion.entity';

@Entity('respuestas_detalle')
export class RespuestaDetalle {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Respuesta, (respuesta) => respuesta.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_respuesta' })
  respuesta: Respuesta;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.detalles, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;

  @ManyToOne(() => Opcion, { eager: false, nullable: true })
  @JoinColumn({ name: 'id_opcion' })
  opcion: Opcion;

  @Column({ name: 'texto_respuesta', type: 'text', nullable: true })
  texto_respuesta?: string;
}
