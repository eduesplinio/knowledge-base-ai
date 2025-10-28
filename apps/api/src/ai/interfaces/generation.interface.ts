export interface GenerationRequest {
  prompt: string;
  maxTokens?: number;
  temperature?: number;
}

export interface GenerationResponse {
  content: string;
  tokensUsed?: number;
}
