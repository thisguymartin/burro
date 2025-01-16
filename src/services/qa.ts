import { ClosedQA } from "autoevals";


export class CloseCaseQA {
    
  private async evaluateItems(items: EvalItem[]): Promise<EvalResult[]> {
    const results: EvalResult[] = [];

    for await (const item of items) {
      const result = await ClosedQA({
        input: item.input,
        criteria: item.criteria,
      });

      console.log(result);

    //   results.push({
    //     ...item,
    //     score: result.score as number,
    //     metadata: result || {},
    //   });
    }

    return results;
  }


}