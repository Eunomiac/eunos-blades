// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SocketFunction = (...params: any[]) => void;

interface Socket {

  register(funcName: string, func: SocketFunction): void;

  /**
   * Chooses One Connected GM Client (at random, if multiple).
   * Executes 'handler' on that Client, passing it 'parameters'.
   * Can 'await' return value of passed handler function.
   */
  executeAsGM<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<ReturnType<S>>

  /**
    * Chooses Specified User Client, if Connected.
    * Executes 'handler' on that Client, passing it 'parameters'.
  * Can 'await' return value of passed handler function.
    */
  executeAsUser<S extends SocketFunction>(handler: S, userId: string, ...parameters: Parameters<S>): Promise<ReturnType<S>>

  /**
   * Chooses GM Clients.
   * Executes 'handler' on ALL, passing it 'parameters'.
   * CANNOT 'await' return value.
   */
  executeForAllGMs<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>

  /**
    * Chooses GM Clients EXCEPT Caller.
    * Executes 'handler' on ALL, passing it 'parameters'.
    * CANNOT 'await' return value.
    */
  executeForOtherGMs<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>

  /**
 * Chooses ALL Clients.
 * Executes 'handler' on ALL, passing it 'parameters'.
   * CANNOT 'await' return value.
 */
  executeForEveryone<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>
  /**
    * Chooses ALL Clients EXCEPT Caller.
    * Executes 'handler' on ALL, passing it 'parameters'.
    * CANNOT 'await' return value.
    */
  executeForOthers<S extends SocketFunction>(handler: string | S, ...parameters: Parameters<S>): Promise<void>
  /**
    * Chooses ALL Specified User Clients, if Connected.
    * Executes 'handler' on ALL, passing it 'parameters'.
    * CANNOT 'await' return value.
    */
  executeForUsers<S extends SocketFunction>(handler: string | S, userIDs: string[], ...parameters: Parameters<S>): Promise<void>


}
interface SocketLib {
  registerModule(modName: string): Socket;
  registerSystem(sysName: string): Socket;

  system: Socket;
}

declare const socketlib: SocketLib;
