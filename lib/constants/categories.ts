export interface Category {
  id: number
  name: string
  order: number
  is_active: boolean
  children: Category[]
  slug?: string // Generated slug
}

// Helper to generate category slug from name
export function generateCategorySlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-soundboard'
}

// Static categories list - fetched from API and hardcoded to save API calls
// Categories won't be added in the future, so this is a one-time setup
export const CATEGORIES: Category[] = [
  { id: 909, name: "Anime", order: 0, is_active: true, children: [], slug: generateCategorySlug("Anime") },
  { id: 912, name: "Creativity", order: 0, is_active: true, children: [], slug: generateCategorySlug("Creativity") },
  { id: 916, name: "Discord", order: 0, is_active: true, children: [], slug: generateCategorySlug("Discord") },
  { id: 908, name: "Fart", order: 0, is_active: true, children: [], slug: generateCategorySlug("Fart") },
  { id: 913, name: "Games", order: 0, is_active: true, children: [], slug: generateCategorySlug("Games") },
  { id: 914, name: "Memes", order: 0, is_active: true, children: [], slug: generateCategorySlug("Memes") },
  { id: 915, name: "Movies", order: 0, is_active: true, children: [], slug: generateCategorySlug("Movies") },
  { id: 918, name: "Politics", order: 0, is_active: true, children: [], slug: generateCategorySlug("Politics") },
  { id: 919, name: "Pranks", order: 0, is_active: true, children: [], slug: generateCategorySlug("Pranks") },
  { id: 910, name: "Reactions", order: 0, is_active: true, children: [], slug: generateCategorySlug("Reactions") },
  { id: 911, name: "Sound Effects", order: 0, is_active: true, children: [], slug: generateCategorySlug("Sound Effects") },
  { id: 917, name: "WhatsApp Audios", order: 0, is_active: true, children: [], slug: generateCategorySlug("WhatsApp Audios") },
]

// Helper function to get all categories (flattened, including children)
export function getAllCategories(): Category[] {
  const allCategories: Category[] = []
  
  function flatten(categories: Category[]) {
    categories.forEach(category => {
      if (category.is_active) {
        allCategories.push(category)
        if (category.children && category.children.length > 0) {
          flatten(category.children)
        }
      }
    })
  }
  
  flatten(CATEGORIES)
  return allCategories
}

// Get active categories only (top level)
export function getActiveCategories(): Category[] {
  return CATEGORIES.filter(cat => cat.is_active)
}

// Get category by slug
export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find(cat => cat.slug === slug && cat.is_active)
}

// Get category by ID
export function getCategoryById(id: number): Category | undefined {
  return CATEGORIES.find(cat => cat.id === id && cat.is_active)
}
