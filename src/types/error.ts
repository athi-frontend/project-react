export interface ErrorWithDigest extends Error {
  digest?: string;
}

export interface ErrorInfo {
  isNetworkError: boolean;
  message: string;
}