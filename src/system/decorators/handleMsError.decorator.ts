import { Exception } from "../exceptions";

export function HandleMsError() {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      try {
        return await originalMethod.apply(this, args);
      } catch (error) {
        if (error.type === 'microservice') {
          throw new Exception({ code: "MICROSERVICES", path: "", message: error.message });
        }
        throw error;
      }
    };

    return descriptor;
  };
}
