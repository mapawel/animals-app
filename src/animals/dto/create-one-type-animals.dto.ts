import { IsNotEmpty, IsString, Length } from 'class-validator';

export class CreateOneTypeAnimalsDTO {
  @IsNotEmpty()
  @IsString()
  @Length(5, 5)
  public readonly insuranceId: string;

  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @IsString()
  @Length(0, 100)
  public readonly description: string;
}
