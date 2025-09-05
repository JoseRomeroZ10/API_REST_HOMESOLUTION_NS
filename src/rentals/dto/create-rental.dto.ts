import { IsEnum, IsNumber, IsString } from "class-validator";
import { TypeRentals } from "../../common/enums/type-rental.enum";

export class CreateRentalDto {

        
        @IsString()
        title: string;
    
        @IsString()
        description: string;
    
        @IsNumber()
        price: number;
    
        @IsString()
        location: string;

        @IsString()
        photo: string;
   
        @IsEnum(TypeRentals)
        TypeRental: TypeRentals;

}
