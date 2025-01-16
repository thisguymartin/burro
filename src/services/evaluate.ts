export class Evaluate {
  async parseFile<T>(jsonPath: string): Promise<T> {
    try {
      const jsonContent = await Deno.readTextFile(jsonPath);
      const evalItems = JSON.parse(jsonContent);
      return evalItems as T;
    } catch (error) {
      console.error(`Failed to evaluate from JSON: ${error}`);
      throw new Error(`Failed to evaluate from JSON`);
    }
  }
}
