function buildLines(words: string[]): string[][] {
  const lines: string[][] = [];
  let line: string[] = [];
  let length = 0;

  for (const word of words) {
    if (length + word.length + line.length <= 80) {
      line.push(word);
      length += word.length;
    } else {
      lines.push(line);
      line = [word];
      length = word.length;
    }
  }

  if (line.length) lines.push(line);
  return lines;
}

function justifyLine(words: string[], last: boolean): string {
  if (words.length === 1 || last) return words.join(" ");

  const wordsLength = words.reduce((s, w) => s + w.length, 0);
  const spaces = 80 - wordsLength;
  const gaps = words.length - 1;

  const base = Math.floor(spaces / gaps);
  let extra = spaces % gaps;

  let line = "";
  for (let i = 0; i < gaps; i++) {
    line += words[i];
    line += " ".repeat(base + (extra-- > 0 ? 1 : 0));
  }
  return line + words[words.length - 1];
}

export function justifyText(text: string): string {
  const words = text.split(/\s+/);
  const lines = buildLines(words);

  return lines
    .map((l, i) => justifyLine(l, i === lines.length - 1))
    .join("\n");
}
