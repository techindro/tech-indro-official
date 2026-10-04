/**
 * Course Image Mapping & Resolver — Tech Indro
 * Ensures 100% of courses have stunning, high-definition thumbnails identical to the website.
 */

export const COURSE_IMAGE_MAP: Record<string, string> = {
  'coding-ai': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
  'sih-hackathon': 'https://h2svision.github.io/publicAssets/SIH_Sr/eventPageNewBannerSIH.png',
  'microsoft-imagine-cup': 'https://imaginestorageprod.blob.core.windows.net/public/images/How_It_Works_Builder_Series_717x365_v2_1.png',
  'amazon-hackon': 'https://d8it4huxumps7.cloudfront.net/uploads/competition-sharable/6644829d87f67_SEO.jpg',
  'tcs-codevita': 'https://codevita.tcsapps.com/assets_public/img/gallery/Season-10-Winner.webp',
  'flipkart-grid': 'https://d8it4huxumps7.cloudfront.net/uploads/images/opportunity/mobile_banner/6687c45cc1232_flipkart-grid-60-software-development-track.png',
  'google-gsoc': 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80',
  'isro-antariksh-hackathon': 'https://res.cloudinary.com/dpfi3rnqf/image/upload/v1781249588/bah_2026_bgbpja.webp',
  'nasa-space-apps': 'https://assets.spaceappschallenge.org/media/original_images/Space_Apps_2026_Logo_OG.jpg',
  'marketing-sales': 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=800&q=80',
  'communication': 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=800&q=80',
  'freelancing': 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'life-skills': 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=800&q=80',
  'research-papers': 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80',
  'advanced-robotics': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
  'agentic-ai': 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80',
};

export const DEFAULT_COURSE_IMAGE = 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=800&q=80';

export function getCourseThumbnail(course?: { id?: string; image?: string; title?: string }): string {
  if (!course) return DEFAULT_COURSE_IMAGE;

  // If already a valid web URL
  if (course.image && (course.image.startsWith('http://') || course.image.startsWith('https://'))) {
    return course.image;
  }

  // Exact ID match
  if (course.id && COURSE_IMAGE_MAP[course.id]) {
    return COURSE_IMAGE_MAP[course.id];
  }

  // Fuzzy match on title or ID keywords
  const key = (course.id || '' + ' ' + (course.title || '')).toLowerCase();
  if (key.includes('robot')) return COURSE_IMAGE_MAP['advanced-robotics'];
  if (key.includes('ai') || key.includes('agent') || key.includes('python')) return COURSE_IMAGE_MAP['coding-ai'];
  if (key.includes('sih')) return COURSE_IMAGE_MAP['sih-hackathon'];
  if (key.includes('imagine')) return COURSE_IMAGE_MAP['microsoft-imagine-cup'];
  if (key.includes('hackon') || key.includes('amazon')) return COURSE_IMAGE_MAP['amazon-hackon'];
  if (key.includes('codevita') || key.includes('tcs')) return COURSE_IMAGE_MAP['tcs-codevita'];
  if (key.includes('grid') || key.includes('flipkart')) return COURSE_IMAGE_MAP['flipkart-grid'];
  if (key.includes('gsoc')) return COURSE_IMAGE_MAP['google-gsoc'];
  if (key.includes('isro')) return COURSE_IMAGE_MAP['isro-antariksh-hackathon'];
  if (key.includes('nasa')) return COURSE_IMAGE_MAP['nasa-space-apps'];
  if (key.includes('market') || key.includes('sales')) return COURSE_IMAGE_MAP['marketing-sales'];
  if (key.includes('communicat') || key.includes('english')) return COURSE_IMAGE_MAP['communication'];
  if (key.includes('freelanc')) return COURSE_IMAGE_MAP['freelancing'];
  if (key.includes('paper') || key.includes('research')) return COURSE_IMAGE_MAP['research-papers'];

  return DEFAULT_COURSE_IMAGE;
}
