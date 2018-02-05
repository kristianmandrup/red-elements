export interface IBidi {
  isRTLValue(stringValue: string)
  isBidiChar(c: number)
  isLatinChar(c: number)
  /**
   * Determines the text direction of a given string.
   * @param value - the string
   */
  resolveBaseTextDir(value: string)
  onInputChange()

  /**
   * Adds event listeners to the Input to ensure its text-direction attribute
   * is properly set based on its content.
   * @param input - the input field
   */
  prepareInput(input)

  /**
   * Enforces the text direction of a given string by adding
   * UCC (Unicode Control Characters)
   * @param value - the string
   */
  enforceTextDirectionWithUCC(value)

  /**
   * Enforces the text direction for all the spans with style bidiAware under
   * workspace or sidebar div
   */
  enforceTextDirectionOnPage()

  /**
   * Sets the text direction preference
   * @param dir - the text direction preference
   */
  setTextDirection(dir)
}
