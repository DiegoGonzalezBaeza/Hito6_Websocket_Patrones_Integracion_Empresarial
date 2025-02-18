import { Optional } from "sequelize";
import {
  AllowNull,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
  BelongsTo,
} from "sequelize-typescript";

import { User } from "./user.model";
import { Movie } from "./movie.model";

interface ReviewAttributes {
  rid?: string;
  uid: string;
  mid: string;
  rating: number;
  review_text: string;
  created_at: Date;
  updated_at: Date;
}

// Define los campos opcionales para la creación
export interface ReviewCreationAttributes extends Optional<ReviewAttributes, "rid" | "created_at" | "updated_at"> {}

@Table({
  tableName: "reviews",
})
export class Review extends Model<ReviewAttributes, ReviewCreationAttributes> {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare rid: string; // Identificador único de la reseña

  @AllowNull(false)
  @Column({
    type: DataType.INTEGER,
    validate: {
      min: 1,
      max: 5,
    },
  })
  declare rating: number; // Puntuación de la película (1-5)

  @AllowNull(false)
  @Column(DataType.TEXT)
  declare review_text: string; // Comentario de la reseña

  @CreatedAt
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare created_at: Date; // Fecha de creación de la reseña

  @UpdatedAt
  @Default(DataType.NOW)
  @Column(DataType.DATE)
  declare updated_at: Date; // Fecha de actualización de la reseña

  @ForeignKey(() => User)
  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  declare uid: string; // UUID del usuario que realizó la reseña

  @ForeignKey(() => Movie)
  @AllowNull(false)
  @IsUUID(4)
  @Column(DataType.UUID)
  declare mid: string; // UUID del usuario que realizó la reseña

  @BelongsTo(() => User)
  declare user: User; // Relación con User

  @BelongsTo(() => Movie)
  declare movie: Movie; // Relación con Movie
}