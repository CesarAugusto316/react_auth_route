import type { Token, UserPayload, UserProfile } from '../interfaces';
import { RestAPI } from './RestAPI.class';


/**
 *
 * @description Singleton
 */
export class AuthService extends RestAPI {
  private static instance: AuthService;

  private constructor() {
    super();
  }

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
      console.log('Hi I am a new AuthService');
    }
    return AuthService.instance;
  }

  /**
   *
   * @description EveryTime we bring a newToken we store it
   * localStorage.
   */
  fetchToken(userPayload: UserPayload): Promise<Token> {
    return new Promise((resolve, reject) => {
      this.post('/auth/login', userPayload, false)
        .then(({ data }) => {
          this.setLocalToken(data.token);
          resolve(data);
        })
        .catch((error) => {
          this.deleteLocalToken();
          reject(error);
        });
    });
  }

  /**
   *
   * @description If a valid token is stored in localStorage we dont need
   * to call fetchToken, so we can access navigate to our protected routes.
   */
  fetchUserProfile(): Promise<UserProfile> {
    return new Promise((resolve, reject) => {
      this.get('/auth/check')
        .then(({ data }) => {
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}
