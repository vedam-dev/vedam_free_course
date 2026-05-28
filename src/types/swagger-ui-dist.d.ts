declare module 'swagger-ui-dist' {
  export interface SwaggerUISpec {
    openapi: string;
    info: Record<string, unknown>;
    paths: Record<string, unknown>;
    components?: Record<string, unknown>;
    [key: string]: unknown;
  }

  export interface SwaggerUIPreset {
    components?: Record<string, unknown>;
    fn?: Record<string, unknown>;
    statePlugins?: Record<string, unknown>;
  }

  export interface SwaggerUIPlugin {
    components?: Record<string, unknown>;
    fn?: Record<string, unknown>;
    statePlugins?: Record<string, unknown>;
  }

  export interface SwaggerUIOptions {
    url?: string;
    spec?: SwaggerUISpec;
    dom_id?: string;
    domNode?: Element | null;
    deepLinking?: boolean;
    presets?: SwaggerUIPreset[];
    plugins?: SwaggerUIPlugin[];
    layout?: string;
    persistAuthorization?: boolean;
    displayOperationId?: boolean;
    displayRequestDuration?: boolean;
    filter?: boolean | string;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    tryItOutEnabled?: boolean;
    requestInterceptor?: (req: Request) => Request | Promise<Request>;
    responseInterceptor?: (res: Response) => Response | Promise<Response>;
    [key: string]: unknown;
  }

  export interface SwaggerUIInstance {
    specActions: {
      updateSpec: (spec: string) => void;
      updateJsonSpec: (spec: SwaggerUISpec) => void;
    };
    specSelectors: {
      specJson: () => SwaggerUISpec;
    };
  }

  export interface SwaggerUIBundleConstructor {
    (options: SwaggerUIOptions): SwaggerUIInstance;
    presets: {
      apis: SwaggerUIPreset;
    };
    plugins: {
      DownloadUrl: SwaggerUIPlugin;
    };
    SwaggerUIStandalonePreset: SwaggerUIPreset;
  }

  export const SwaggerUIBundle: SwaggerUIBundleConstructor;
  export const SwaggerUIStandalonePreset: SwaggerUIPreset;
}

declare module 'swagger-ui-dist/swagger-ui-es-bundle.js' {
  import { SwaggerUIBundleConstructor } from 'swagger-ui-dist';
  const SwaggerUI: SwaggerUIBundleConstructor;
  export default SwaggerUI;
}

declare module 'swagger-ui-dist/swagger-ui-standalone-preset.js' {
  import { SwaggerUIStandalonePreset } from 'swagger-ui-dist';
  export default SwaggerUIStandalonePreset;
}