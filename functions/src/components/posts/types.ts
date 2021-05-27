
export interface Post {
  author: string;
  date: Date;
  description: string;
  imageURL: string;
  title: string;
  uid: string;
  videoURL: string;
}



export type imageAnalysis =
  | "UNKNOWN"
  | "VERY_UNLIKELY"
  | "UNLIKELY"
  | "POSSIBLE"
  | "LIKELY"
  | "VERY_LIKELY"
  | null
  | undefined
  | any