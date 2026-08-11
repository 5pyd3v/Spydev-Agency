import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { SiteSettings } from '../models/SiteSettings.js';

async function getOrCreateSettings() {
  let settings = await SiteSettings.findOne({ key: 'main' });
  if (!settings) settings = await SiteSettings.create({ key: 'main' });
  return settings;
}

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  sendSuccess(res, settings);
});

const NESTED_KEYS = ['appearance', 'announcement', 'seoDefaults', 'emailNotifications'] as const;

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const settings = await getOrCreateSettings();
  const body = req.body as Record<string, unknown>;

  for (const key of NESTED_KEYS) {
    if (body[key] && typeof body[key] === 'object') {
      Object.assign((settings as any)[key], body[key]);
      delete body[key];
    }
  }
  Object.assign(settings, body);

  await settings.save();
  sendSuccess(res, settings, 'Settings updated successfully');
});
