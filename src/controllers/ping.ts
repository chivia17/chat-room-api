interface PingResponse {
    message: string;
}
  
export default class PingController {
    /**
    * Check healthy of API
    * @returns Promise - Pong message
    */
    public async getMessage(): Promise<PingResponse> {
        return {
            message: "pong",
        };
    }
}
