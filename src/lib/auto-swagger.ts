import { existsSync, readdirSync, readFileSync, statSync } from 'fs';
import { join } from 'path';

interface ApiRoute {
  path: string;
  methods: string[];
  file: string;
}

interface PathParameter {
  name: string;
  in: string;
  required: boolean;
  schema: { type: string };
  description: string;
}

interface SchemaProperty {
  type: string;
  format?: string;
  example?: string | number | boolean;
  enum?: string[];
  items?: SchemaProperty;
  description?: string;
  minimum?: number;
  maximum?: number;
}

interface ResponseSchema {
  type: string;
  properties?: Record<string, SchemaProperty>;
  items?: SchemaProperty;
  enum?: string[];
  format?: string;
  example?: string | number | boolean;
  minimum?: number;
  maximum?: number;
}

interface RequestBody {
  required: boolean;
  content: {
    'application/json': {
      schema: ResponseSchema & { required?: string[] };
    };
  };
}

interface PathOperation {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  security: Array<{ bearerAuth: [] }>;
  parameters: PathParameter[];
  requestBody?: RequestBody;
  responses: {
    200: {
      description: string;
      content: {
        'application/json': {
          schema: ResponseSchema;
        };
      };
    };
    400: { description: string };
    401: { description: string };
    404: { description: string };
    500: { description: string };
  };
}

function findApiRoutes(dir: string, baseRoute = ''): ApiRoute[] {
  const routes: ApiRoute[] = [];

  if(!existsSync(dir)) {
    console.error(`Directory does not exist: ${dir}`);
    return routes;
  }

  try {
    const entries = readdirSync(dir);

    for(const entry of entries) {
      const fullPath = join(dir, entry);
      const stat = statSync(fullPath);

      if(stat.isDirectory()) {
        if(['api-docs', 'swagger', 'test-swagger'].includes(entry)) {
          continue;
        }

        const routeName = entry.startsWith('[') && entry.endsWith(']')
          ? `{${entry.slice(1, -1)}}`
          : entry;

        const subRoutes = findApiRoutes(
          fullPath,
          `${baseRoute}/${routeName}`
        );
        routes.push(...subRoutes);
      } else if(entry === 'route.ts' || entry === 'route.js') {
        const routePath = baseRoute;

        const fileContent = readFileSync(fullPath, 'utf8');
        const methods: string[] = [];

        if(/export\s+(async\s+)?function\s+GET/.test(fileContent)) {
          methods.push('GET');
        }
        if(/export\s+(async\s+)?function\s+POST/.test(fileContent)) {
          methods.push('POST');
        }
        if(/export\s+(async\s+)?function\s+PUT/.test(fileContent)) {
          methods.push('PUT');
        }
        if(/export\s+(async\s+)?function\s+DELETE/.test(fileContent)) {
          methods.push('DELETE');
        }
        if(/export\s+(async\s+)?function\s+PATCH/.test(fileContent)) {
          methods.push('PATCH');
        }

        if(methods.length > 0) {
          routes.push({
            path: `/api${routePath}`,
            methods,
            file: fullPath,
          });
        }
      }
    }
  } catch(error) {
    console.error('Error reading directory:', error);
  }

  return routes;
}

function getTagFromPath(path: string): string {
  const parts = path.split('/').filter(Boolean);
  if(parts.length > 1) {
    const tag = parts[1];
    return tag
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  return 'Default';
}

function getResourceName(path: string): string {
  const segments = path.split('/').filter(Boolean);
  const lastSegment = segments[segments.length - 1];

  if(lastSegment.startsWith('{') && lastSegment.endsWith('}')) {
    const resource = segments[segments.length - 2] || 'resource';
    return resource
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  return lastSegment
    .replace(/[-_]/g, ' ')
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function generatePathOperation(route: ApiRoute, method: string): PathOperation {
  const lowerMethod = method.toLowerCase();
  const tag = getTagFromPath(route.path);
  const resourceName = getResourceName(route.path);

  const pathParams = route.path.match(/\{([^}]+)\}/g);
  const parameters: PathParameter[] = pathParams
    ? pathParams.map((param) => {
      const paramName = param.replace(/[{}]/g, '');
      return {
        name: paramName,
        in: 'path',
        required: true,
        schema: { type: 'string' },
        description: `The ${paramName.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} identifier`,
      };
    })
    : [];

  const summary = generateSummary(route.path, method, resourceName);
  const description = generateDescription(route.path, method, resourceName);

  const operation: PathOperation = {
    tags: [tag],
    summary,
    description,
    operationId: `${lowerMethod}${route.path.replace(/[^a-zA-Z0-9]/g, '')}`,
    security: [{ bearerAuth: [] }],
    parameters: parameters,
    responses: {
      200: {
        description: 'Successful response',
        content: {
          'application/json': {
            schema: getResponseSchema(route.path, method),
          },
        },
      },
      400: { description: 'Bad request - Invalid input parameters' },
      401: { description: 'Unauthorized - Authentication required' },
      404: { description: 'Resource not found' },
      500: { description: 'Internal server error' },
    },
  };

  if(['post', 'put', 'patch'].includes(lowerMethod)) {
    operation.requestBody = {
      required: true,
      content: {
        'application/json': {
          schema: getRequestSchema(route.path, method),
        },
      },
    };
  }

  return operation;
}

function generateSummary(path: string, method: string, resourceName: string): string {
  const hasIdParam = path.includes('{id}') || path.match(/\{[^}]+\}/);

  const summaries: Record<string, string> = {
    GET: hasIdParam ? `Get ${resourceName} by ID` : `List all ${resourceName}`,
    POST: `Create new ${resourceName}`,
    PUT: `Update ${resourceName}`,
    DELETE: `Delete ${resourceName}`,
    PATCH: `Update ${resourceName} partially`,
  };

  return summaries[method] || `${method} ${resourceName}`;
}

function generateDescription(path: string, method: string, resourceName: string): string {
  const hasIdParam = path.includes('{id}') || path.match(/\{[^}]+\}/);

  const descriptions: Record<string, string> = {
    GET: hasIdParam
      ? `Retrieve detailed information about a specific ${resourceName.toLowerCase()} using its unique identifier.`
      : `Retrieve a list of all ${resourceName.toLowerCase()}. Supports pagination and filtering.`,
    POST: `Create a new ${resourceName.toLowerCase()} with the provided information in the request body.`,
    PUT: `Update an existing ${resourceName.toLowerCase()} by replacing all of its data with the provided information.`,
    DELETE: `Permanently delete a ${resourceName.toLowerCase()} from the system.`,
    PATCH: `Partially update a ${resourceName.toLowerCase()} by modifying only the specified fields.`,
  };

  return descriptions[method] || `Perform ${method} operation on ${resourceName.toLowerCase()}`;
}

function getResponseSchema(path: string, method: string): ResponseSchema {
  const isListEndpoint = method === 'GET' && !path.match(/\{[^}]+\}$/);

  if(path.includes('/users')) {
    const userSchema = {
      type: 'object' as const,
      properties: {
        id: { type: 'string', example: '123' },
        email: { type: 'string', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', enum: ['student', 'mentor', 'admin'] },
        createdAt: { type: 'string', format: 'date-time' },
      },
    };

    return isListEndpoint ? {
      type: 'array',
      items: userSchema,
    } : userSchema;
  }

  if(path.includes('/mentors')) {
    const mentorSchema = {
      type: 'object' as const,
      properties: {
        id: { type: 'string', example: 'mentor_123' },
        name: { type: 'string', example: 'Jane Smith' },
        email: { type: 'string', example: 'jane@example.com' },
        expertise: { type: 'array', items: { type: 'string' } },
        bio: { type: 'string', example: 'Experienced software engineer with 10+ years' },
        verified: { type: 'boolean', example: true },
        rating: { type: 'number', minimum: 0, maximum: 5, example: 4.8 },
      },
    };

    return isListEndpoint ? {
      type: 'array',
      items: mentorSchema,
    } : mentorSchema;
  }

  if(path.includes('/bookings')) {
    const bookingSchema = {
      type: 'object' as const,
      properties: {
        id: { type: 'string', example: 'booking_123' },
        studentId: { type: 'string', example: 'student_456' },
        mentorId: { type: 'string', example: 'mentor_789' },
        date: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00Z' },
        status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'], example: 'confirmed' },
        notes: { type: 'string', example: 'Looking forward to discussing React best practices' },
      },
    };

    return isListEndpoint ? {
      type: 'array',
      items: bookingSchema,
    } : bookingSchema;
  }

  if(path.includes('/sessions')) {
    const sessionSchema = {
      type: 'object' as const,
      properties: {
        id: { type: 'string', example: 'session_123' },
        title: { type: 'string', example: 'React Fundamentals' },
        startTime: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00Z' },
        endTime: { type: 'string', format: 'date-time', example: '2024-03-20T15:00:00Z' },
        status: { type: 'string', enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], example: 'completed' },
        rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
      },
    };

    return isListEndpoint ? {
      type: 'array',
      items: sessionSchema,
    } : sessionSchema;
  }

  if(path.includes('/tokens')) {
    return {
      type: 'object',
      properties: {
        userId: { type: 'string', example: 'user_123' },
        balance: { type: 'number', example: 10 },
        used: { type: 'number', example: 5 },
        refunded: { type: 'number', example: 2 },
        total: { type: 'number', example: 15 },
      },
    };
  }

  const defaultSchema = {
    type: 'object' as const,
    properties: {
      success: { type: 'boolean', example: true },
      data: { type: 'object' },
      message: { type: 'string', example: 'Operation completed successfully' },
    },
  };

  return isListEndpoint ? {
    type: 'array',
    items: { type: 'object' },
  } : defaultSchema;
}

function getRequestSchema(path: string, method: string): ResponseSchema & { required?: string[] } {
  if(path.includes('/users') && method === 'POST') {
    return {
      type: 'object',
      required: ['email', 'name', 'role'],
      properties: {
        email: { type: 'string', format: 'email', example: 'user@example.com' },
        name: { type: 'string', example: 'John Doe' },
        role: { type: 'string', enum: ['student', 'mentor', 'admin'], example: 'student' },
        password: { type: 'string', format: 'password', example: 'SecurePass123!' },
      },
    };
  }

  if(path.includes('/bookings') && method === 'POST') {
    return {
      type: 'object',
      required: ['mentorId', 'date', 'timeSlot'],
      properties: {
        mentorId: { type: 'string', example: 'mentor_789' },
        date: { type: 'string', format: 'date', example: '2024-03-20' },
        timeSlot: { type: 'string', example: '14:00-15:00' },
        notes: { type: 'string', example: 'I want to learn about React hooks' },
      },
    };
  }

  if(path.includes('/calendar/book')) {
    return {
      type: 'object',
      required: ['mentorId', 'startTime', 'endTime'],
      properties: {
        mentorId: { type: 'string', example: 'mentor_789' },
        startTime: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00Z' },
        endTime: { type: 'string', format: 'date-time', example: '2024-03-20T15:00:00Z' },
        title: { type: 'string', example: 'React Mentoring Session' },
        notes: { type: 'string', example: 'Focus on component lifecycle' },
      },
    };
  }

  return {
    type: 'object',
    properties: {
      data: {
        type: 'object',
        description: 'Request payload containing the data for this operation',
      },
    },
  };
}

function collectUniqueTags(routes: ApiRoute[]): Set<string> {
  const tags = new Set<string>();
  routes.forEach(route => {
    const tag = getTagFromPath(route.path);
    tags.add(tag);
  });
  return tags;
}

function generateTagDescriptions(tags: Set<string>) {
  const tagDescriptions: Record<string, string> = {
    'Auth': 'Authentication and authorization endpoints',
    'Users': 'User management and profile endpoints',
    'Mentors': 'Mentor profile and management endpoints',
    'Bookings': 'Booking management and scheduling endpoints',
    'Sessions': 'Session management and history endpoints',
    'Calendar': 'Calendar and availability management endpoints',
    'Tokens': 'Token management for bookings and credits',
    'Ratings': 'Rating and feedback endpoints',
    'Cancellations': 'Cancellation management endpoints',
    'Admin': 'Administrative endpoints (admin access only)',
    'Debug': 'Debug and development endpoints',
    'Analytics': 'Analytics and reporting endpoints',
    'Notifications': 'Notification management endpoints',
    'Payments': 'Payment processing and transaction endpoints',
  };

  return Array.from(tags).map(tag => ({
    name: tag,
    description: tagDescriptions[tag] || `${tag} related endpoints`,
  }));
}

export function generateAutoSwagger() {
  const apiDir = join(process.cwd(), 'src', 'app', 'api');

  console.log('🔍 Scanning API directory:', apiDir);

  if(!existsSync(apiDir)) {
    console.error('❌ API directory not found:', apiDir);
    return getEmptySpec();
  }

  const routes = findApiRoutes(apiDir);

  console.log(`✅ Found ${routes.length} API routes:`);
  routes.forEach(route => {
    console.log(`   📍 ${route.path} [${route.methods.join(', ')}]`);
  });

  if(routes.length === 0) {
    console.warn('⚠️  No API routes found. Make sure you have route.ts files in your api directory.');
    return getEmptySpec();
  }

  const paths: Record<string, Record<string, PathOperation>> = {};

  routes.forEach((route) => {
    if(!paths[route.path]) {
      paths[route.path] = {};
    }

    route.methods.forEach((method) => {
      const lowerMethod = method.toLowerCase();
      paths[route.path][lowerMethod] = generatePathOperation(route, method);
    });
  });

  const uniqueTags = collectUniqueTags(routes);
  const tags = generateTagDescriptions(uniqueTags);

  return {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'Complete API documentation with all available endpoints, request/response schemas, and authentication requirements.',
      contact: {
        name: 'API Support',
        email: 'support@example.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development Server',
      },
      {
        url: 'https://api.production.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter your JWT token obtained from the authentication endpoint',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Error message describing what went wrong' },
            code: { type: 'string', example: 'ERROR_CODE' },
            details: { type: 'object', description: 'Additional error details' },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'user_123' },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            name: { type: 'string', example: 'John Doe' },
            role: { type: 'string', enum: ['student', 'mentor', 'admin'], example: 'student' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', format: 'date-time', example: '2024-03-20T14:45:00Z' },
          },
        },
        Mentor: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'mentor_123' },
            name: { type: 'string', example: 'Jane Smith' },
            email: { type: 'string', example: 'jane@example.com' },
            expertise: { type: 'array', items: { type: 'string' }, example: ['JavaScript', 'React', 'Node.js'] },
            bio: { type: 'string', example: 'Experienced software engineer with 10+ years in web development' },
            verified: { type: 'boolean', example: true },
            rating: { type: 'number', minimum: 0, maximum: 5, example: 4.8 },
            totalSessions: { type: 'number', example: 150 },
          },
        },
        Booking: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'booking_123' },
            studentId: { type: 'string', example: 'student_456' },
            mentorId: { type: 'string', example: 'mentor_789' },
            date: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00Z' },
            status: { type: 'string', enum: ['pending', 'confirmed', 'completed', 'cancelled'], example: 'confirmed' },
            notes: { type: 'string', example: 'Looking forward to discussing React best practices' },
            createdAt: { type: 'string', format: 'date-time', example: '2024-03-15T10:00:00Z' },
          },
        },
        Session: {
          type: 'object',
          properties: {
            id: { type: 'string', example: 'session_123' },
            bookingId: { type: 'string', example: 'booking_123' },
            title: { type: 'string', example: 'React Fundamentals' },
            startTime: { type: 'string', format: 'date-time', example: '2024-03-20T14:00:00Z' },
            endTime: { type: 'string', format: 'date-time', example: '2024-03-20T15:00:00Z' },
            status: { type: 'string', enum: ['scheduled', 'in-progress', 'completed', 'cancelled'], example: 'completed' },
            rating: { type: 'number', minimum: 1, maximum: 5, example: 5 },
            feedback: { type: 'string', example: 'Great session! Very helpful and knowledgeable.' },
          },
        },
      },
    },
    tags,
    paths,
  };
}

function getEmptySpec() {
  return {
    openapi: '3.0.0',
    info: {
      title: 'API Documentation',
      version: '1.0.0',
      description: 'API documentation - No routes found. Please ensure your API routes are properly structured.',
    },
    servers: [
      {
        url: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
        description: 'Development Server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
      },
    },
    tags: [],
    paths: {},
  };
}