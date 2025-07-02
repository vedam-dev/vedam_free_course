import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
  extends: [], // remove '@commitlint/config-conventional'
  parserPreset: {
    parserOpts: {
      headerPattern: /^([A-Z]+-\d+)\s?(.+)$/,
      headerCorrespondence: ['scope', 'subject']
    }
  },
  rules: {
    'type-empty': [0], // disable this rule
    'scope-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    // add any other rules you want
  },
  ignores: [message => message.includes('[jenkins-commit]')]
};

export default config;
