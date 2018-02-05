export interface IValidators {

  /**
   * Return validation function to test if value is a number via javascript isNaN function
   * @param blankAllowed { boolean } if blanks are allowed
   * @returns { function } validation function
   */
  number(blankAllowed)

  /**
   * return validation function to test if value is matches given Regular Expression
   * @param re { RegExp } regular expression to use in validation function
   * @returns { function } validation function
   */
  regex(re: RegExp): Function

  /**
   *
   * @param ptypeName { string }
   * @param isConfig { boolean }
   */
  typedInput(ptypeName: string, isConfig: boolean)

  /**
   * Try to parse value as JSON - valid if parse without error
   * @param value { string } value to parse as JSON
   * @returns { boolean } whether value is valid JSON
   */
  validateJson(value: string): boolean

  /**
   * Validate if value is a number via RegExp
   * @param value { string } value to validate
   */
  validateNumber(value: string)

  /**
   * Validate if value is a property
   * @param value { string } value to validate
   */
  validateProp(value: string)
}
