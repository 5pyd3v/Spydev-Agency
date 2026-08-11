import type { CaseStudy } from '@/types/entities';
import { createResourceApi } from './createResourceApi';

export const caseStudiesApi = createResourceApi<CaseStudy>('case-studies');
