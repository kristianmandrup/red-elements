export interface ITextFormat {
  getBounds(segment, src)
  handleSubcontents(segments, args, subs, origContent, locale)
  handleBounds(segments, args, aBounds, origContent, locale)
  handleCases(segments, args, cases, origContent, locale)
  handlePoints(segments, args, points, origContent, locale)
}
