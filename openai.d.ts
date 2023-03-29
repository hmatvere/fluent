declare module "openai" {
    interface OpenAI {
      Image: {
        new (options: { apiKey: string }): { generate: (params: any) => any };
      };
    }
  
    const openai: OpenAI;
  
    export default openai;
  }
  