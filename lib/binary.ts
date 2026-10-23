/** "Hi" -> "01001000 01101001" (8 bits per character). */
export function toBinary(text: string) {
  return Array.from(text)
    .map((c) => c.charCodeAt(0).toString(2).padStart(8, "0"))
    .join(" ");
}

/** 5 -> "101" */
export function bin(n: number) {
  return n.toString(2);
}

/**
 * A stand-in for text before it "decodes": every character becomes 0 or 1
 * (spaces stay spaces). Deterministic, so server and browser render the same.
 */
export function bitMask(text: string) {
  return Array.from(text)
    .map((c) => (c === " " ? " " : String(c.charCodeAt(0) % 2)))
    .join("");
}
