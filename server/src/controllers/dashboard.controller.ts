import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { Service } from '../models/Service.js';
import { User } from '../models/User.js';
import { Media } from '../models/Media.js';
import { HomepageSection } from '../models/HomepageSection.js';

export const getDashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [totalServices, activeServices, totalUsers, totalMedia, enabledSections, totalSections] = await Promise.all([
    Service.countDocuments(),
    Service.countDocuments({ status: 'active' }),
    User.countDocuments(),
    Media.countDocuments(),
    HomepageSection.countDocuments({ enabled: true }),
    HomepageSection.countDocuments(),
  ]);

  const recentServices = await Service.find().sort({ createdAt: -1 }).limit(5).select('title slug status createdAt');

  sendSuccess(res, {
    services: { total: totalServices, active: activeServices },
    users: { total: totalUsers },
    media: { total: totalMedia },
    homepageSections: { enabled: enabledSections, total: totalSections },
    recentServices,
  });
});
