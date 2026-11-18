export type Word = {
  id: string
  no: string
  en: string
  category: string
}

const raw: Record<string, [string, string][]> = {
  Basics: [
    ['hei', 'hi'],
    ['ha det', 'goodbye'],
    ['takk', 'thank you'],
    ['ja', 'yes'],
    ['nei', 'no'],
    ['unnskyld', 'excuse me / sorry'],
    ['vær så snill', 'please'],
    ['god morgen', 'good morning'],
    ['god natt', 'good night'],
    ['velkommen', 'welcome'],
  ],
  Numbers: [
    ['en', 'one'],
    ['to', 'two'],
    ['tre', 'three'],
    ['fire', 'four'],
    ['fem', 'five'],
    ['seks', 'six'],
    ['sju', 'seven'],
    ['åtte', 'eight'],
    ['ni', 'nine'],
    ['ti', 'ten'],
  ],
  Food: [
    ['et brød', 'a bread'],
    ['en ost', 'a cheese'],
    ['et eple', 'an apple'],
    ['en fisk', 'a fish'],
    ['et vann', 'a water'],
    ['en kaffe', 'a coffee'],
    ['ei/en melk', 'a milk'],
    ['et egg', 'an egg'],
    ['en kake', 'a cake'],
    ['et smør', 'a butter'],
  ],
  Family: [
    ['ei/en mor', 'a mother'],
    ['en far', 'a father'],
    ['en bror', 'a brother'],
    ['ei/en søster', 'a sister'],
    ['et barn', 'a child'],
    ['en sønn', 'a son'],
    ['ei/en datter', 'a daughter'],
    ['en venn', 'a friend'],
  ],
  Verbs: [
    ['å være', 'to be'],
    ['å ha', 'to have'],
    ['å gå', 'to walk / go'],
    ['å spise', 'to eat'],
    ['å drikke', 'to drink'],
    ['å snakke', 'to speak'],
    ['å lese', 'to read'],
    ['å skrive', 'to write'],
    ['å forstå', 'to understand'],
    ['å like', 'to like'],
  ],
  'Everyday': [
    ['et hus', 'a house'],
    ['en bil', 'a car'],
    ['en by', 'a city / town'],
    ['ei/en bok', 'a book'],
    ['en dag', 'a day'],
    ['et år', 'a year'],
    ['en jobb', 'a job'],
    ['en butikk', 'a shop'],
    ['stor', 'big'],
    ['liten', 'small'],
  ],
}

export const words: Word[] = Object.entries(raw).flatMap(([category, list]) =>
  list.map(([no, en]) => ({ id: `${category}:${no}`, no, en, category })),
)

export const categories = Object.keys(raw)
