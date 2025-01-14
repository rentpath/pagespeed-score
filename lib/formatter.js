const {keys, entries} = Object;

const precision = (digits) => (n) => n.toFixed(digits);

const skip = ['type'];

const formats = {
  name: s => s.padEnd(6),
  score: precision(0),
  score_stddev: precision(1),
  FCP: precision(1),
  FMP: precision(1),
  SI: precision(1),
  FCI: precision(1),
  TTI: precision(1),
  TTFB: precision(2),
  benchmark: precision(0),
  default: precision(2),
};

function tableHeading(result) {
  return keys(result)
    .filter(k => !skip.includes(k))
    .map((k, index) => index === 0 ? k.padEnd(6) : k)
    .join('\t');
}

function tsvFormatEntry(result) {
  return entries(result)
    .filter(([k]) => !skip.includes(k))
    .map(
      ([k, v]) => (
        formats[`${k}_${result.name}`] || 
        formats[k] || 
        formats.default
      )(v)
    )
    .join('\t');
}

function result(entries, {first}) {
  return [
    ...(first ? [tableHeading(entries[0])] : []),
    ...entries.map(tsvFormatEntry),
  ];
}

function statistic(entries) {
  return ['', ...entries.map(tsvFormatEntry)];
}

function tsvFormat(entries, run) {
  // same type of entries only in a single call!
  const type = entries[0].type; 
  return type === 'result' ? 
    result(entries, run) : 
    statistic(entries);
}

function jsonlFormat(entries) {
  return entries.map(JSON.stringify);
}

class Formatter {
  constructor(jsonl) {
    this.format = jsonl ?  jsonlFormat : tsvFormat;
  }
}

module.exports = {Formatter, tsvFormat, jsonlFormat};
