// /* eslint-disable keyword-spacing */
// /* eslint-disable quotes */
// import fs from "fs";

// import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";

// interface StreamableOptions {
//   file?: File | Blob | fs.ReadStream; // Support both browser and Node.js
//   auth?: {
//     username: string;
//     password: string;
//   };
//   params?: string[];
//   timeout?: number;
// }

// interface StreamableResponse {
//   shortcode?: string;
//   status?: number;
//   message?: string;
//   title?: string;
//   thumbnail_url?: string;
//   files?: {
//     mobile?: { url: string };
//     mp4?: { url: string };
//   };
//   [key: string]: any;
// }

// export class ToStreamable {
//   private readonly opts: StreamableOptions;
//   public shortcode: string | null; // Make public so it can be accessed
//   private readonly defaultTimeout = 30000;

//   constructor(opts: StreamableOptions = {}) {
//     this.opts = opts;
//     this.shortcode = null;
//   }

//   // Updated upload method that works with callback pattern
//   upload(
//     callback?: (error: Error | null, response?: StreamableResponse) => void
//   ): Promise<StreamableResponse> {
//     const uploadPromise = this.performUpload();

//     if (callback) {
//       uploadPromise
//         .then((response) => callback(null, response))
//         .catch((error) => callback(error));
//       return uploadPromise;
//     }

//     return uploadPromise;
//   }

//   private async performUpload(): Promise<StreamableResponse> {
//     const {
//       file,
//       auth,
//       params = [],
//       timeout = this.defaultTimeout,
//     } = this.opts;

//     if (!file) throw new Error("No file specified");
//     if (!auth) throw new Error("No auth specified");

//     const paramString = params.length > 0 ? `?${params.join("&")}` : "";

//     try {
//       const formData = new FormData();

//       // Handle different file types
//       if (file instanceof fs.ReadStream) {
//         // For Node.js ReadStream, we need to convert to Buffer
//         const chunks: Buffer[] = [];
//         for await (const chunk of file) {
//           chunks.push(chunk);
//         }
//         const buffer = Buffer.concat(chunks);
//         const blob = new Blob([buffer]);
//         formData.append("file", blob);
//       } else {
//         formData.append("file", file);
//       }

//       const config: AxiosRequestConfig = {
//         method: "POST",
//         url: `https://api.streamable.com/upload${paramString}`,
//         data: formData,
//         auth,
//         timeout,
//         headers: this.getFormDataHeaders(formData),
//         maxContentLength: Infinity,
//         maxBodyLength: Infinity,
//       };

//       const response: AxiosResponse<StreamableResponse> = await axios(config);

//       if (!response?.data?.shortcode) {
//         throw new Error("Invalid response from Streamable");
//       }

//       this.shortcode = response.data.shortcode;
//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       if (axiosError.code === "ECONNRESET") {
//         throw new Error(
//           "Connection was reset by the server. This may be due to a large file size or server timeout."
//         );
//       }
//       if (axiosError.response) {
//         throw new Error(
//           `Streamable API error: ${
//             axiosError.response.status
//           } - ${JSON.stringify(axiosError.response.data)}`
//         );
//       }
//       if (axiosError.code === "ETIMEDOUT") {
//         throw new Error(`Request timed out after ${timeout}ms`);
//       }
//       throw new Error(`Request failed: ${axiosError.message}`);
//     }
//   }

//   // Updated status method that works with callback pattern
//   status(
//     callback?: (error: Error | null, response?: StreamableResponse) => void
//   ): Promise<StreamableResponse> {
//     const statusPromise = this.performStatus();

//     if (callback) {
//       statusPromise
//         .then((response) => callback(null, response))
//         .catch((error) => callback(error));
//       return statusPromise;
//     }

//     return statusPromise;
//   }

//   private async performStatus(): Promise<StreamableResponse> {
//     const { auth, timeout = this.defaultTimeout } = this.opts;
//     const shortcode = this.shortcode;

//     if (!shortcode) throw new Error("No shortcode, upload file first");

//     try {
//       const config: AxiosRequestConfig = {
//         method: "GET",
//         url: `https://api.streamable.com/videos/${shortcode}`,
//         auth,
//         timeout,
//       };

//       const response: AxiosResponse<StreamableResponse> = await axios(config);
//       return response.data;
//     } catch (error) {
//       const axiosError = error as AxiosError;
//       if (axiosError.code === "ECONNRESET") {
//         throw new Error("Connection was reset by the server");
//       }
//       if (axiosError.response) {
//         throw new Error(
//           `Streamable API error: ${
//             axiosError.response.status
//           } - ${JSON.stringify(axiosError.response.data)}`
//         );
//       }
//       if (axiosError.code === "ETIMEDOUT") {
//         throw new Error(`Request timed out after ${timeout}ms`);
//       }
//       throw new Error(`Request failed: ${axiosError.message}`);
//     }
//   }

//   private getFormDataHeaders(
//     formData: FormData
//   ): Record<string, string> | undefined {
//     // Handle both browser and Node.js environments
//     if (typeof window !== "undefined") {
//       return undefined; // Browser will set headers automatically
//     }
//     // For Node.js
//     if (typeof (formData as any).getHeaders === "function") {
//       return (formData as any).getHeaders();
//     }
//     return { "Content-Type": "multipart/form-data" };
//   }
// }
