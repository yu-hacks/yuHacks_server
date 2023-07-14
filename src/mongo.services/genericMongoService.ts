import { FilterQuery, Model, ObjectId, ProjectionType, QueryOptions, UpdateQuery } from 'mongoose';

export default class GenericMongoService<T> {
    model: Model<T>;
    constructor(model: Model<T>){
        this.model = model;
    }

     async findOne(filter?: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T> {
        try{
            return this.model.findOne(filter, projection, options).lean() as T
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }

    async findById(id: string, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T> {
        try{
            return this.model.findById(id, projection,options).lean() as T
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }

    async find(filter: FilterQuery<T>, projection?: ProjectionType<T>, options?: QueryOptions<T>): Promise<T[]> {
        try{
            return this.model.find(filter, projection, options).lean() as T as Array<T>
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }

    async deleteOne(id: string, options?: QueryOptions<T>): Promise<boolean> {
        try{
            return this.model.deleteOne({_id: id}, options).lean()
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }

    async updateOne(id: String | ObjectId, obj: UpdateQuery<T>, options?: QueryOptions<T>): Promise<boolean> {
        try{
            if(id instanceof String){
                return this.model.updateOne({_id: id},obj, options).lean()
            }
            return this.model.updateOne(id,obj, options).lean()
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }

    async create(obj: T, options?: QueryOptions<T>): Promise<T> {
        try{
            return this.model.create(obj, options) as T
        }catch(err){
            console.log(err)
            return Promise.reject(`Something went wrong... \n${err}`) 
        }
    }
}