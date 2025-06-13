export type CreateFileVersionProps = {
  checksum: string;
  name: string;
  result: any;
  description: string;
};

export interface ICreateFileVersionRepository {
  create(props: CreateFileVersionProps): Promise<void>;
}
