import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Encuesta } from './encuesta.entity';
import { RespuestaDetalle } from './respuesta-detalle.entity';

@Entity('respuestas')
export class Respuesta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.respuestas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuesta;

  @Column()
  fechaCreacion: Date;

  @OneToMany(() => RespuestaDetalle, (detalle) => detalle.respuesta, {
    cascade: true,
  })
  detalles: RespuestaDetalle[];
}
