import { ClassTypeResolver } from "./types";
import { ClassType } from "../interfaces";
export declare function Resolver(): ClassDecorator;
export declare function Resolver(typeFunc: ClassTypeResolver): ClassDecorator;
export declare function Resolver(objectType: ClassType): ClassDecorator;
