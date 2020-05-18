export const constants = {
  containers: ['Plates', 'Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],

  containersByMaterial: {
    Tissue: ['Blocks/Slides/Tubes'],
    Cells: ['Plates', 'Blocks/Slides/Tubes'],
    'Blocks/Slides': ['Blocks/Slides/Tubes'],
    Blood: ['Blocks/Slides/Tubes'],
    'Buffy Coat': ['Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
    RNA: ['Plates'],
    DNA: ['Plates', 'Micronic Barcoded Tubes'],
    cfDNA: ['Plates', 'Micronic Barcoded Tubes'],
    'DNA Library': ['Plates', 'Micronic Barcoded Tubes'],
    'Pooled Library': ['Micronic Barcoded Tubes'],
    cDNA: ['Plates'],
    'cDNA Library': ['Plates'],
    other: ['Plates', 'Micronic Barcoded Tubes', 'Blocks/Slides/Tubes'],
  },

  humanApplications: [
    'expanded_genomics ',
    'msk-access',
    'hemepact',
    'archer',
    'impact4',
    'humanwholegenome',
  ],

  mouseApplications: ['mousewholegenome ', 'm-impact_v1'],

  humanOrMouseApplications: ['wholeexomesequencing'],

  logger: 'sample-sub',

  cmoPmEmailApplications: [
    'HemePACT_v4',
    'HumanWholeGenome',
    'IMPACT410',
    'IMPACT468',
    'MSK-ACCESS_v1',
    'WholeExomeSequencing',
  ],
};
