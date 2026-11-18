export type GrammarCheck = { q: string; options: string[]; answer: number }

export type Lesson = {
  id: string
  title: string
  intro: string
  table?: { head: string[]; rows: string[][] }
  examples: [string, string][]
  checks: GrammarCheck[]
}

export const lessons: Lesson[] = [
  {
    id: 'gender',
    title: 'Noun gender & articles',
    intro:
      'Norwegian nouns have three genders: masculine (en), feminine (ei) and neuter (et). Feminine nouns may also use "en" in Bokmål. The definite form ("the …") is a suffix added to the end of the noun.',
    table: {
      head: ['Gender', 'Indefinite', 'Definite'],
      rows: [
        ['Masculine', 'en bil', 'bilen'],
        ['Feminine', 'ei bok', 'boka / boken'],
        ['Neuter', 'et hus', 'huset'],
      ],
    },
    examples: [
      ['Jeg har en bil.', 'I have a car.'],
      ['Bilen er rød.', 'The car is red.'],
      ['Huset er stort.', 'The house is big.'],
    ],
    checks: [
      { q: 'Definite form of "et eple"?', options: ['eplen', 'eplet', 'eplea'], answer: 1 },
      { q: 'Definite form of "en venn"?', options: ['vennen', 'vennet', 'venna'], answer: 0 },
    ],
  },
  {
    id: 'present',
    title: 'Present tense',
    intro:
      'Good news: Norwegian verbs do not change by person. To form the present tense, most verbs add -r to the infinitive (without "å").',
    table: {
      head: ['Infinitive', 'Present', 'Meaning'],
      rows: [
        ['å snakke', 'snakker', 'speak(s)'],
        ['å spise', 'spiser', 'eat(s)'],
        ['å bo', 'bor', 'live(s)'],
        ['å være', 'er', 'am / is / are'],
        ['å ha', 'har', 'have / has'],
      ],
    },
    examples: [
      ['Jeg snakker norsk.', 'I speak Norwegian.'],
      ['Hun bor i Oslo.', 'She lives in Oslo.'],
      ['Vi er glade.', 'We are happy.'],
    ],
    checks: [
      { q: 'Han ___ kaffe. (å drikke)', options: ['drikke', 'drikker', 'drikkes'], answer: 1 },
      { q: 'De ___ i Bergen. (å være)', options: ['er', 'være', 'erer'], answer: 0 },
    ],
  },
  {
    id: 'v2',
    title: 'Word order (V2 rule)',
    intro:
      'In main clauses the verb is always the second element. If you start the sentence with something other than the subject (time, place…), the subject moves after the verb.',
    examples: [
      ['Jeg spiser frokost nå.', 'I am eating breakfast now.'],
      ['Nå spiser jeg frokost.', 'Now I am eating breakfast.'],
      ['I dag går vi på kino.', 'Today we are going to the cinema.'],
    ],
    checks: [
      {
        q: 'Choose the correct sentence:',
        options: ['I morgen jeg jobber.', 'I morgen jobber jeg.', 'Jobber i morgen jeg.'],
        answer: 1,
      },
    ],
  },
  {
    id: 'negation',
    title: 'Negation with "ikke"',
    intro:
      'To make a sentence negative, use "ikke". In a simple main clause it goes right after the verb.',
    examples: [
      ['Jeg snakker ikke tysk.', "I don't speak German."],
      ['Hun er ikke hjemme.', "She isn't home."],
      ['Vi liker ikke fisk.', "We don't like fish."],
    ],
    checks: [
      {
        q: '"I don\'t understand" is:',
        options: ['Jeg ikke forstår.', 'Ikke jeg forstår.', 'Jeg forstår ikke.'],
        answer: 2,
      },
    ],
  },
  {
    id: 'pronouns',
    title: 'Personal pronouns',
    intro: 'Subject and object pronouns in Norwegian.',
    table: {
      head: ['Subject', 'Object', 'English'],
      rows: [
        ['jeg', 'meg', 'I / me'],
        ['du', 'deg', 'you'],
        ['han', 'ham / han', 'he / him'],
        ['hun', 'henne', 'she / her'],
        ['vi', 'oss', 'we / us'],
        ['dere', 'dere', 'you (pl.)'],
        ['de', 'dem', 'they / them'],
      ],
    },
    examples: [
      ['Jeg elsker deg.', 'I love you.'],
      ['Ser du henne?', 'Do you see her?'],
    ],
    checks: [
      { q: 'Kan du hjelpe ___? (me)', options: ['jeg', 'meg', 'min'], answer: 1 },
      { q: '___ bor i Tromsø. (they)', options: ['Dem', 'De', 'Dere'], answer: 1 },
    ],
  },
]
