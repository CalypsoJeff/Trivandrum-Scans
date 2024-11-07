import mongoose from 'mongoose';

export interface ICart {
    _id: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    services: ICartService[];
  }
  
  interface ICartService {
    serviceId: mongoose.Types.ObjectId;
    personIds?: { _id: mongoose.Types.ObjectId }[];
  }
  