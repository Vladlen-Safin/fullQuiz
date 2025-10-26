interface IWindowWithEnv {
  env: IEnv | undefined;
}

interface IEnv {
  [key: string]: unknown;
}

export class WindowEnvHelper {
  public static getValue<TValue>(key: string): TValue {
    const env: IEnv = (window as unknown as IWindowWithEnv).env || {};
    return env[key] as TValue;
  }
}
