import type { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { sendSuccess } from '../utils/ApiResponse.js';
import { getPagination, buildMeta } from '../utils/pagination.js';
import { Lead } from '../models/Lead.js';
import { SiteSettings } from '../models/SiteSettings.js';
import { sendEmail } from '../services/email.service.js';
import { env } from '../config/env.js';

async function notifyNewLead(subject: string, html: string, notifyKey: 'notifyOnContactLead' | 'notifyOnProjectInquiry') {
  const settings = await SiteSettings.findOne({ key: 'main' });
  const shouldNotify = settings?.emailNotifications?.[notifyKey] ?? true;
  const to = env.NOTIFY_EMAIL || settings?.contactEmail;
  if (shouldNotify && to) {
    await sendEmail({ to, subject, html }).catch((err) => console.error('Lead notification email failed:', err));
  }
}

export const submitContactLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.create({ ...req.body, source: 'contact' });

  await notifyNewLead(
    `New contact form submission from ${lead.name}`,
    `<p><strong>${lead.name}</strong> (${lead.email}) sent a message:</p><p>${lead.message}</p>`,
    'notifyOnContactLead'
  );

  sendSuccess(res, { id: lead._id }, "Thanks — we'll be in touch shortly.", 201);
});

export const submitProjectInquiry = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.create({ ...req.body, source: 'start-project' });

  await notifyNewLead(
    `New project inquiry from ${lead.name}`,
    `<p><strong>${lead.name}</strong> (${lead.email}) started a project inquiry:</p><p>${lead.projectDescription}</p>`,
    'notifyOnProjectInquiry'
  );

  sendSuccess(res, { id: lead._id }, "Thanks — we'll be in touch shortly.", 201);
});

export const listLeads = asyncHandler(async (req: Request, res: Response) => {
  const { page, limit, skip } = getPagination(req);
  const search = String(req.query.search ?? '').trim();

  const filter: Record<string, unknown> = {};
  if (search) filter.$text = { $search: search };
  if (req.query.status) filter.status = req.query.status;
  if (req.query.source) filter.source = req.query.source;
  if (req.query.isRead !== undefined) filter.isRead = req.query.isRead === 'true';

  const [items, total, unreadCount] = await Promise.all([
    Lead.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),
    Lead.countDocuments(filter),
    Lead.countDocuments({ isRead: false }),
  ]);

  sendSuccess(res, items, 'Leads fetched', 200, { ...buildMeta(page, limit, total), unreadCount });
});

export const getLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  sendSuccess(res, lead);
});

export const updateLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  Object.assign(lead, req.body);
  await lead.save();
  sendSuccess(res, lead, 'Lead updated successfully');
});

export const addLeadNote = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  lead.notes.push({ text: req.body.text, createdAt: new Date() });
  await lead.save();
  sendSuccess(res, lead, 'Note added');
});

export const deleteLead = asyncHandler(async (req: Request, res: Response) => {
  const lead = await Lead.findById(req.params.id);
  if (!lead) throw ApiError.notFound('Lead not found');
  await lead.deleteOne();
  sendSuccess(res, null, 'Lead deleted successfully');
});
