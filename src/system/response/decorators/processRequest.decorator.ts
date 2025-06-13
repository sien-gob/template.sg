import { ApiResponse } from '../api.response';

export function ProcessRequest<T = any>() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const process = async (): Promise<T> => {
        return await originalMethod.apply(this, args);
      };

      return await ApiResponse.processRequest<T>(process);
    };

    return descriptor;
  };
}