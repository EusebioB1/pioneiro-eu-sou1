
import React from 'react';
import { PioneerType } from './types';

export const DEFAULT_PROFILE = {
  name: '',
  type: PioneerType.REGULAR,
  goals: {
    annual: 600,
    monthly: 50,
    weekly: 12
  },
  onboarded: false,
  reminderTime: '19:00',
  remindersEnabled: true
};

export const WEEK_DAYS = [
  'Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'
];

export const INITIAL_WEEKLY_PLANS = [
  { day: 1, active: false, minutes: 0 },
  { day: 2, active: false, minutes: 0 },
  { day: 3, active: false, minutes: 0 },
  { day: 4, active: false, minutes: 0 },
  { day: 5, active: false, minutes: 0 },
  { day: 6, active: false, minutes: 0 },
  { day: 0, active: false, minutes: 0 }
];

export const MOTIVATIONAL_MESSAGES = [
  "“Pois Deus não é injusto para se esquecer da vossa obra e do amor que mostrastes ao seu nome.” — Hebreus 6:10",
  "“Ide, portanto, e fazei discípulos de pessoas de todas as nações.” — Mateus 28:19",
  "“E estas boas novas do Reino serão pregadas em toda a terra habitada.” — Mateus 24:14",
  "“Então ouvi a voz de Jeová dizer: ‘Quem enviarei...?’. Eu disse: ‘Aqui estou! Envia-me!’” — Isaías 6:8",
  "“Torna-te exemplo para os fiéis no falar, na conduta, no amor, na fé, na castidade.” — 1 Timóteo 4:12",
  "“A alegria de Jeová é a vossa fortaleza.” — Neemias 8:10",
  "“Portanto, meus amados irmãos, sede constantes, inabaláveis, tendo sempre bastante para fazer na obra do Senhor.” — 1 Cor. 15:58"
];
