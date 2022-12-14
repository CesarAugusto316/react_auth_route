import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';


/**
 *
 * @description {SingleTon} Since we could have many classes that inherit from
 * RestAPI, we will be reading many times from localStorage the same value.
 * So we have only one instance that holds that value which is a synchronous
 * operation.
 */
class LocalToken {
  private static instance: LocalToken;
  private value: string|null = localStorage.getItem('react-auth-token');

  private constructor() {}

  public static getInstance(): LocalToken {
    if (!LocalToken.instance) {
      console.log('I am a singleton Token from localStorage');
      LocalToken.instance = new LocalToken();
    }
    return LocalToken.instance;
  }

  setValue(newToken: string): void {
    this.value = newToken;
    localStorage.setItem('react-auth-token', newToken);
  }

  deleteValue(): void {
    this.value = null;
    localStorage.removeItem('react-auth-token');
  }

  getValue(): string|null {
    return this.value;
  }
}

/**
 *
 * @description BaseClass for services that communicates with API endpoints.
 */
export class RestAPI {
  private baseUrl = import.meta.env.VITE_TODOS_API_URL;

  public setLocalToken(newToken: string) {
    LocalToken.getInstance().setValue(newToken);
  }

  public deleteLocalToken() {
    LocalToken.getInstance().deleteValue();
  }

  public getLocalToken() {
    return LocalToken.getInstance().getValue();
  }

  private configHeaders(auth = true): AxiosRequestConfig {
    if (auth) {
      return {
        headers: {
          Authorization: `Bearer ${this.getLocalToken()}`,
        },
      };
    }
    return {};
  }

  protected get(url: string, auth = true): Promise<AxiosResponse> {
    return axios
      .get(this.baseUrl + url, this.configHeaders(auth));
  }

  protected post(url: string, data: object, auth = true): Promise<AxiosResponse> {
    return axios
      .post(this.baseUrl + url, data, this.configHeaders(auth));
  }

  protected put(url: string, auth = true): Promise<AxiosResponse> {
    return axios
      .put(this.baseUrl + url, this.configHeaders(auth));
  }

  protected delete(url: string, auth = true): Promise<AxiosResponse> {
    return axios
      .delete(this.baseUrl + url, this.configHeaders(auth));
  }
}
