import { z } from 'zod';

function getArgentinaToday() {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Argentina/Buenos_Aires',
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  }).formatToParts(new Date());
  const value = (type: string) => Number(parts.find((part) => part.type === type)?.value);
  return { year: value('year'), month: value('month'), day: value('day') };
}

function isValidBirthDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;
  const [, yearText, monthText, dayText] = match;
  const date = new Date(Date.UTC(Number(yearText), Number(monthText) - 1, Number(dayText)));
  return date.getUTCFullYear() === Number(yearText)
    && date.getUTCMonth() === Number(monthText) - 1
    && date.getUTCDate() === Number(dayText);
}

function isAdult(value: string) {
  if (!isValidBirthDate(value)) return false;
  const [yearText, monthText, dayText] = value.split('-');
  const year = Number(yearText);
  const month = Number(monthText);
  const day = Number(dayText);
  const today = getArgentinaToday();
  const age = today.year - year - (
    today.month < month || (today.month === month && today.day < day) ? 1 : 0
  );
  return age >= 18;
}

export const registerSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  lastName: z.string().min(2, 'El apellido debe tener al menos 2 caracteres'),
  email: z.string().email('Ingresá un correo electrónico válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
  description: z.string().max(1000, 'La descripción no puede superar los 1000 caracteres').optional(),
  position: z.string().min(1, 'Elegí una posición'),
  secondaryPosition: z.string().nullable().optional(),
  localityId: z.string().min(1, 'Elegí una localidad'),
  birthDate: z.string().superRefine((value, context) => {
    if (!isValidBirthDate(value)) {
      context.addIssue({ code: 'custom', message: 'Ingresá una fecha de nacimiento válida' });
    } else if (!isAdult(value)) {
      context.addIssue({ code: 'custom', message: 'Tenés que ser mayor de 18 años para registrarte' });
    }
  }).transform((value) => new Date(`${value}T00:00:00.000Z`)),
}).superRefine((data, context) => {
  if (data.secondaryPosition && data.secondaryPosition === data.position) {
    context.addIssue({
      code: 'custom',
      path: ['secondaryPosition'],
      message: 'La posición secundaria debe ser distinta a la principal',
    });
  }
});

export const loginSchema = z.object({
  email: z.string().email('Ingresá un email válido'),
  password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});
