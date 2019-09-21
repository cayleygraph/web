export type Query = {
  id: number;
  text: string;
  result: { result: any } | { error: object } | null;
  time: Date;
};
