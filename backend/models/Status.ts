export interface Status {
  success: boolean;
  broken: boolean;
  reasons: string[];
  error?: string;
}
