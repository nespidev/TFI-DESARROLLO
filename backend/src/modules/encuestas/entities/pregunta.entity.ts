import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Encuesta } from './encuesta.entity';
import { Opcion } from './opcion.entity';
import { RespuestaDetalle } from './respuesta-detalle.entity';

@Entity('preguntas')
export class Pregunta {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  numero: number;

  @Column()
  texto: string;

  @Column()
  tipo: string;

  @OneToMany(() => Opcion, (opcion) => opcion.pregunta, {
    cascade: true,
    eager: true,
  })
  opciones: Opcion[];

  @Column({ nullable: true })
  minimo?: number;

  @Column({ nullable: true })
  maximo?: number;

  @ManyToOne(() => Encuesta, (encuesta) => encuesta.preguntas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'id_encuesta' })
  encuesta: Encuesta;

  @OneToMany(() => RespuestaDetalle, (detalle) => detalle.pregunta)
  detalles: RespuestaDetalle[];
}
