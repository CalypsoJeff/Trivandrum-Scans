import { Types } from 'mongoose';
import { ICategory } from "../../../domain/entities/types/categoryType";

export interface IServiceRequest {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId | ICategory;
  preTestPreparations: string[];
  expectedResultDuration: string;
  serviceImage: Express.Multer.File;
}
export interface IServiceUpdate {
  serviceId: Types.ObjectId;
  personIds: Types.ObjectId[];
}


export interface IServiceResponse {
  name: string;
  description?: string;
  price: number;
  category: Types.ObjectId | ICategory;
  preTestPreparations: string[];
  expectedResultDuration: string;
  serviceImageUrl?: string;
}