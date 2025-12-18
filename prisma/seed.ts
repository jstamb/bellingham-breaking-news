import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create API key for n8n
  const apiKey = crypto.randomBytes(32).toString('hex');
  await prisma.apiKey.upsert({
    where: { key: apiKey },
    update: {},
    create: {
      key: apiKey,
      name: 'n8n Automation',
      isActive: true,
    },
  });
  console.log(`\n========================================`);
  console.log(`API Key created: ${apiKey}`);
  console.log(`Save this key for your n8n webhook configuration!`);
  console.log(`========================================\n`);

  // Create sample posts for all categories
  const posts = [
    // Local
    {
      slug: 'bellingham-downtown-renovation-project',
      title: 'Downtown Bellingham Renovation Project Enters Final Phase',
      excerpt: 'The multi-year downtown improvement initiative reaches its final stretch with new pedestrian areas and streetscape enhancements.',
      content: `<p>After three years of planning and construction, the Downtown Bellingham Renovation Project is entering its final phase, bringing new pedestrian plazas, improved lighting, and enhanced streetscapes to the heart of the city.</p>
<p>The project, funded through a combination of city bonds and state grants, has transformed several blocks of Commercial Street and Railroad Avenue.</p>
<p>"We're excited to see this vision finally coming together," said Mayor Kim Lund. "Downtown Bellingham is becoming a more vibrant, walkable destination for residents and visitors alike."</p>`,
      category: 'Local',
      tags: ['downtown', 'renovation', 'city projects', 'infrastructure'],
      isBreaking: true,
      featuredImage: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop',
      imageAlt: 'Downtown street renovation',
    },
    // Politics
    {
      slug: 'whatcom-county-council-budget-vote',
      title: 'County Council Approves $280M Budget with Focus on Public Safety',
      excerpt: 'Whatcom County Council passes annual budget with increased funding for sheriff department and emergency services.',
      content: `<p>The Whatcom County Council voted 5-2 Tuesday to approve a $280 million budget for the upcoming fiscal year, with significant increases allocated to public safety and emergency response services.</p>
<p>The budget includes $15 million for new sheriff department hires and equipment, $8 million for fire district support, and $5 million for mental health crisis intervention programs.</p>
<p>"This budget reflects our community's priorities," said Council Chair David Chen. "Public safety remains our top concern while we balance investments in social services."</p>`,
      category: 'Politics',
      tags: ['county council', 'budget', 'public safety', 'government'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1555848962-6e79363ec58f?w=1200&h=800&fit=crop',
      imageAlt: 'Government meeting chamber',
    },
    // Police & Fire
    {
      slug: 'bellingham-fire-department-new-station',
      title: 'Fire Department Breaks Ground on New Eastside Station',
      excerpt: 'New fire station will reduce emergency response times for growing eastern neighborhoods by up to 40%.',
      content: `<p>Bellingham Fire Department officially broke ground on a new fire station on the city's east side Thursday, marking a major milestone in improving emergency response coverage.</p>
<p>Station 7, located on Sunset Drive, will house an engine company and medic unit, serving the rapidly growing neighborhoods of Alabama Hill, Sehome, and Happy Valley.</p>
<p>"This station will dramatically improve our response times to the eastern part of the city," said Fire Chief Maria Santos. "In emergencies, every second counts."</p>
<p>The $12 million project is expected to be completed by late 2026.</p>`,
      category: 'Police & Fire',
      tags: ['fire department', 'emergency services', 'public safety', 'construction'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?w=1200&h=800&fit=crop',
      imageAlt: 'Fire station groundbreaking ceremony',
    },
    // Business
    {
      slug: 'tech-startup-opens-bellingham-headquarters',
      title: 'Seattle Tech Startup Chooses Bellingham for New Regional HQ',
      excerpt: 'Cloud software company plans to create 150 jobs over three years at new downtown office.',
      content: `<p>CloudSync Technologies, a Seattle-based cloud software company, announced Wednesday it will open a regional headquarters in downtown Bellingham, creating up to 150 new jobs over the next three years.</p>
<p>The company has signed a lease for 25,000 square feet of office space in the Cornwall Building, with plans to begin operations in Q2 2026.</p>
<p>"Bellingham offers an incredible quality of life that helps us attract top talent," said CEO Jennifer Park. "The proximity to Seattle and Vancouver, combined with the thriving local tech community, made this an easy decision."</p>`,
      category: 'Business',
      tags: ['tech', 'jobs', 'economic development', 'startup'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=800&fit=crop',
      imageAlt: 'Modern office space',
    },
    // WWU
    {
      slug: 'wwu-enrollment-record-high',
      title: 'Western Washington University Reports Record Fall Enrollment',
      excerpt: 'WWU welcomes largest freshman class in university history amid campus expansion projects.',
      content: `<p>Western Washington University has announced record enrollment for the fall quarter, with 17,200 students enrolled across all programs—the highest in the university's history.</p>
<p>The incoming freshman class of 3,400 students is the largest ever, with notable increases in STEM and environmental science programs.</p>
<p>"This growth reflects the outstanding reputation of our academic programs and the appeal of Bellingham as a college town," said WWU President Sabah Randhawa.</p>
<p>The university is responding to growth with new housing construction and academic building renovations.</p>`,
      category: 'WWU',
      tags: ['WWU', 'enrollment', 'education', 'university'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=800&fit=crop',
      imageAlt: 'University campus students',
    },
    // Sports
    {
      slug: 'bellingham-bay-marathon-registration',
      title: 'Bellingham Bay Marathon Opens Registration for 2026 Race',
      excerpt: 'Annual marathon returns with new waterfront route and expanded half-marathon division.',
      content: `<p>Registration opened Monday for the 2026 Bellingham Bay Marathon, with organizers unveiling a redesigned course that showcases more of the city's stunning waterfront.</p>
<p>The new route will take runners along Boulevard Park, through downtown, and around Lake Padden before finishing at Waypoint Park.</p>
<p>Event director Tom Richards expects 8,000 participants across the full marathon, half-marathon, and 10K events.</p>
<p>"The new course offers incredible views of the bay and mountains," Richards said. "It's going to be a memorable experience for runners."</p>`,
      category: 'Sports',
      tags: ['marathon', 'running', 'events', 'athletics'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=1200&h=800&fit=crop',
      imageAlt: 'Marathon runners on scenic route',
    },
    // Restaurants
    {
      slug: 'new-farm-to-table-restaurant-fairhaven',
      title: 'Award-Winning Chef Opens Farm-to-Table Restaurant in Fairhaven',
      excerpt: 'James Beard semifinalist brings sustainable dining concept to historic Fairhaven building.',
      content: `<p>James Beard Award semifinalist Chef Michael Torres will open his highly anticipated farm-to-table restaurant, Harvest & Hearth, in Fairhaven next month.</p>
<p>Located in the historic Murphy Building on Harris Avenue, the 60-seat restaurant will feature a menu sourced exclusively from Whatcom County farms and Puget Sound fisheries.</p>
<p>"Bellingham has incredible local producers," Torres said. "I want to create a dining experience that celebrates what makes this region so special."</p>
<p>Reservations open January 15 for the February 1 opening.</p>`,
      category: 'Restaurants',
      tags: ['restaurants', 'farm to table', 'fairhaven', 'dining'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=800&fit=crop',
      imageAlt: 'Upscale restaurant interior',
    },
    // Waterfront
    {
      slug: 'bellingham-waterfront-park-expansion',
      title: 'Waterfront Park Expansion Adds New Trails and Kayak Launch',
      excerpt: 'Port of Bellingham completes major expansion of public waterfront access with new amenities.',
      content: `<p>The Port of Bellingham has completed a $4.5 million expansion of the waterfront park system, adding two miles of new trails, a public kayak launch, and improved picnic facilities.</p>
<p>The expansion connects Boulevard Park to the downtown waterfront via a continuous shoreline trail, with interpretive signs highlighting the area's industrial heritage and marine ecology.</p>
<p>"This project fulfills our commitment to making the waterfront accessible to everyone," said Port Commissioner Lisa Anderson. "It's a tremendous asset for our community."</p>`,
      category: 'Waterfront',
      tags: ['waterfront', 'parks', 'recreation', 'port'],
      isBreaking: false,
      featuredImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200&h=800&fit=crop',
      imageAlt: 'Waterfront park with walking trails',
    },
    // Weather
    {
      slug: 'atmospheric-river-weekend-forecast',
      title: 'Atmospheric River to Bring Heavy Rain and Mountain Snow This Weekend',
      excerpt: 'National Weather Service issues flood watch as significant precipitation expected through Sunday.',
      content: `<p>The National Weather Service has issued a flood watch for Whatcom County as a powerful atmospheric river is forecast to bring 3-5 inches of rain to the lowlands and up to 3 feet of snow to Mount Baker through Sunday.</p>
<p>The heaviest rain is expected Friday night through Saturday morning, with potential for localized flooding in low-lying areas and small streams.</p>
<p>Residents in flood-prone areas are advised to monitor conditions and have emergency supplies ready.</p>
<p>The Nooksack River is expected to rise significantly but remain below flood stage.</p>`,
      category: 'Weather',
      tags: ['weather', 'atmospheric river', 'flood watch', 'forecast'],
      isBreaking: true,
      featuredImage: 'https://images.unsplash.com/photo-1534274988757-a28bf1a57c17?w=1200&h=800&fit=crop',
      imageAlt: 'Storm clouds over mountains',
    },
  ];

  for (const post of posts) {
    await prisma.post.upsert({
      where: { slug: post.slug },
      update: post,
      create: post,
    });
    console.log(`Created post: ${post.title}`);
  }

  console.log('\nSeeding complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
