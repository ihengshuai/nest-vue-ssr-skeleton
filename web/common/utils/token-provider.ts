import { CancelTokenSource } from "axios";

interface ITokenProcess {
  [propName: string]: CancelTokenSource;
}

interface ITokenProtectProcess {
  [propName: string]: boolean | CancelTokenSource;
}

class TokenProvider {
  private static _instance: TokenProvider;

  public process: Map<Function, ITokenProcess> = new Map();

  public protectProcess: Map<Function, ITokenProtectProcess> = new Map();

  public static get instance(): TokenProvider {
    if (!this._instance) {
      this._instance = new TokenProvider();
    }
    return this._instance;
  }

  public protect(schema: Function, key: string): void {
    let tokenProcess = this.protectProcess.get(schema);
    !tokenProcess && this.protectProcess.set(schema, tokenProcess = {});
    tokenProcess[key] = true;
  }

  public register(schema: Function, key: string, token: CancelTokenSource): CancelTokenSource {
    const protectProcess = this.protectProcess.get(schema);
    if (protectProcess?.[key]) {
      typeof protectProcess[key] !== "boolean" && (protectProcess[key] as CancelTokenSource)?.cancel();
      protectProcess[key] = token;
    } else {
      let tokenProcess = this.process.get(schema);
      !tokenProcess && this.process.set(schema, tokenProcess = {});
      tokenProcess[key]?.cancel();
      tokenProcess[key] = token;
    }
    return token;
  }

  public resolve(schema: Function, key: string): CancelTokenSource {
    const tokenProcess = this.process.get(schema);
    return tokenProcess?.[key];
  }

  public cancel(schema: Function, key?: string): void {
    const tokenProcess = this.process.get(schema);
    const protectProcess = this.protectProcess.get(schema);

    [tokenProcess, protectProcess].forEach((process, index) => {
      if (process) {
        if (key) {
          this.cancelToken(process, key);
        } else {
          Object.keys(process).forEach(_key => this.cancelToken(process, _key));
          (index ? this.protectProcess : this.process).delete(schema);
        }
      }
    });
  }

  public clear(): void {
    for (const [schema, tokenProcess] of this.process.entries()) {
      Object.entries(tokenProcess).forEach(([key, token]) => {
        token?.cancel();
        tokenProcess[key] = null;
      });
      this.process.delete(schema);
    }
    this.process.clear();
  }

  private cancelToken(process: ITokenProcess | ITokenProtectProcess, key: string): void {
    if (process[key]) {
      typeof process[key] !== "boolean" && (process[key] as CancelTokenSource).cancel();
      process[key] = null;
    }
  }
}

export default TokenProvider;
