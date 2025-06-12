import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Pregunta } from './pregunta.entity';

@Entity('opciones')
export class Opcion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  texto: string;

  @Column()
  numero: number;

  @ManyToOne(() => Pregunta, (pregunta) => pregunta.opciones)
  @JoinColumn({ name: 'id_pregunta' })
  pregunta: Pregunta;
}
