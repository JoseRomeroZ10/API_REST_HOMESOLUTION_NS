
import { IsInt, IsOptional, IsString } from "class-validator";

export class CreateCommentDto {

    @IsString()
    @IsOptional()
    comment?:string;
}
