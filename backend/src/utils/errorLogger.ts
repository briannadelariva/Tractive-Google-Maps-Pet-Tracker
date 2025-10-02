import { AxiosError } from 'axios';

/**
 * Extract relevant information from an error for clean logging
 */
export function formatErrorForLogging(error: unknown, context?: string): string {
  const prefix = context ? `[${context}] ` : '';
  
  // Handle Axios errors specially to extract useful info
  if (error && typeof error === 'object' && 'isAxiosError' in error) {
    const axiosError = error as AxiosError;
    const parts: string[] = [];
    
    // Add error code if available
    if (axiosError.code) {
      parts.push(axiosError.code);
    }
    
    // Add response status if available
    if (axiosError.response) {
      parts.push(`HTTP ${axiosError.response.status}`);
      
      // Add response error message if available
      if (axiosError.response.data && typeof axiosError.response.data === 'object') {
        const data = axiosError.response.data as any;
        if (data.message) {
          parts.push(data.message);
        } else if (data.error) {
          parts.push(data.error);
        }
      }
    }
    
    // Add base error message
    if (axiosError.message) {
      parts.push(axiosError.message);
    }
    
    // Add URL context
    if (axiosError.config?.baseURL && axiosError.config?.url) {
      parts.push(`at ${axiosError.config.baseURL}${axiosError.config.url}`);
    }
    
    return prefix + parts.join(' - ');
  }
  
  // Handle standard Error objects
  if (error instanceof Error) {
    return prefix + error.message;
  }
  
  // Handle string errors
  if (typeof error === 'string') {
    return prefix + error;
  }
  
  // Handle unknown error types
  return prefix + 'Unknown error: ' + String(error);
}

/**
 * Log an error with clean formatting
 */
export function logError(error: unknown, context?: string, includeStack = false): void {
  const formattedError = formatErrorForLogging(error, context);
  console.error(formattedError);
  
  // Only show stack trace if explicitly requested or if it's not an Axios error
  if (includeStack && error instanceof Error && !('isAxiosError' in error)) {
    console.error('Stack trace:', error.stack);
  }
}

/**
 * Log a warning message
 */
export function logWarning(message: string, context?: string): void {
  const prefix = context ? `[${context}] ` : '';
  console.warn(prefix + message);
}

/**
 * Log an informational message
 */
export function logInfo(message: string, context?: string): void {
  const prefix = context ? `[${context}] ` : '';
  console.log(prefix + message);
}
