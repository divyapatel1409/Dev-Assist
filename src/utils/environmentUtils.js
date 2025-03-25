/**
 * Replace environment variables in a string
 * @param {string} str - The string containing environment variables
 * @param {Array} variables - Array of { key, value } pairs representing environment variables
 * @returns {string} - The string with environment variables replaced
 */
export const replaceEnvVariables = (str, variables) => {
    if (!str || !variables || !Array.isArray(variables)) return str;
    
    let result = str;
    variables.forEach(variable => {
      // Replace {{variableName}} with its value
      const pattern = new RegExp(`{{${variable.key}}}`, 'g');
      result = result.replace(pattern, variable.value);
    });
    
    return result;
  };
  
  /**
   * Process an object and replace all environment variables in its string values
   * @param {Object} obj - The object to process
   * @param {Array} variables - Array of { key, value } pairs representing environment variables
   * @returns {Object} - A new object with environment variables replaced
   */
  export const processObjectWithEnvVars = (obj, variables) => {
    if (!obj || typeof obj !== 'object' || !variables) return obj;
    
    const result = { ...obj };
    
    Object.keys(result).forEach(key => {
      if (typeof result[key] === 'string') {
        result[key] = replaceEnvVariables(result[key], variables);
      } else if (typeof result[key] === 'object' && result[key] !== null) {
        result[key] = processObjectWithEnvVars(result[key], variables);
      }
    });
    
    return result;
  };