export interface IMapper<I, O> {
  mapping(input: I): Promise<O>;
}
