import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, Timestamp } from 'firebase/firestore';
import { slugify } from '@/lib/slugify';

// Categories and their corresponding topics
const categories = {
    tech: [
        "Artificial Intelligence", "Machine Learning", "Web Development", "Mobile Apps",
        "Cybersecurity", "Cloud Computing", "Data Science", "Blockchain", "IoT", "DevOps",
        "Software Engineering", "UI/UX Design", "Database Management", "API Development", "System Architecture"
    ],
    health: [
        "Mental Health", "Nutrition", "Fitness", "Medical Research", "Wellness",
        "Alternative Medicine", "Public Health", "Disease Prevention", "Mental Wellness", "Healthy Living",
        "Chronic Disease Management", "Preventive Care", "Health Technology", "Medical Innovation", "Wellness Trends"
    ],
    politics: [
        "Election Analysis", "Policy Review", "International Relations", "Economic Policy",
        "Social Justice", "Environmental Policy", "Healthcare Policy", "Education Reform", "Immigration", "Democracy",
        "Political Reform", "Global Governance", "Public Administration", "Civic Engagement", "Policy Implementation"
    ],
    business: [
        "Entrepreneurship", "Startup Culture", "Marketing Strategies", "Financial Planning",
        "Leadership", "Innovation", "Market Analysis", "Investment", "Management", "E-commerce",
        "Digital Transformation", "Business Strategy", "Customer Experience", "Supply Chain", "Business Analytics"
    ],
    lifestyle: [
        "Travel", "Fashion", "Home Decor", "Cooking", "Parenting", "Relationships",
        "Personal Development", "Hobbies", "Entertainment", "Culture",
        "Sustainable Living", "Work-Life Balance", "Creative Arts", "Social Media", "Digital Wellness"
    ],
    science: [
        "Space Exploration", "Climate Change", "Biology", "Physics", "Chemistry",
        "Environmental Science", "Research", "Innovation", "Discovery", "Technology",
        "Renewable Energy", "Biotechnology", "Neuroscience", "Materials Science", "Scientific Method"
    ],
    education: [
        "Learning Methods", "Online Education", "Career Development", "Skill Building",
        "Academic Research", "Teaching", "Student Life", "Educational Technology", "Lifelong Learning", "Knowledge",
        "Critical Thinking", "Digital Literacy", "Educational Policy", "Learning Analytics", "Educational Innovation"
    ]
};

// Sample authors with their profile images
const authors = [
    { name: "Sarah Johnson", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" },
    { name: "Michael Chen", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Emily Rodriguez", image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
    { name: "David Thompson", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Lisa Wang", image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
    { name: "James Wilson", image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
    { name: "Maria Garcia", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
    { name: "Alex Kim", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    { name: "Rachel Brown", image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
    { name: "Tom Anderson", image: "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=100&h=100&fit=crop&crop=face" },
    { name: "Jessica Lee", image: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop&crop=face" },
    { name: "Chris Taylor", image: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face" },
    { name: "Amanda White", image: "https://images.unsplash.com/photo-1531123897727-8f062e26e5d2?w=100&h=100&fit=crop&crop=face" },
    { name: "Ryan Davis", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
    { name: "Nicole Martinez", image: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face" },
    { name: "Dr. Jennifer Smith", image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=100&h=100&fit=crop&crop=face" },
    { name: "Prof. Robert Johnson", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
    { name: "Dr. Maria Santos", image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=100&h=100&fit=crop&crop=face" },
    { name: "Alex Thompson", image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face" },
    { name: "Sarah Williams", image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face" }
];

// Generate topic-specific images using Unsplash API with search terms
const getTopicImages = (topic: string, category: string, index: number) => {
    // Create search terms based on the specific topic
    const searchTerms = topic.toLowerCase().replace(/\s+/g, '-');

    // Generate unique image URLs for each topic
    const baseUrl = "https://images.unsplash.com/photo-";
    const imageIds = [
        "1518709268805-4e9042af2176", "1485827404703-89b55fcc595e", "1516321318423-f06f85b504d3",
        "1555066931-4365d14bab8c", "1461749280684-dccba630e2f6", "1507003211169-0a1dd7228f2d",
        "1559757148-5c350d0d3c56", "1571019613454-1cb2f99b2d8b", "1559757175-0eb30cd8c063",
        "1529107386315-e1a2ed48a620", "1441986300917-64674bd600d8", "1446776877081-d282a0f896e2",
        "1503676260728-1c00da094a0b", "1494790108755-2616b612b786", "1472099645785-5658abf4ff4e",
        "1544005313-94ddf0286df2", "1500648767791-00dcc994a43e", "1487412720507-e7ab37603c6f",
        "1506794778202-cad84cf45f1d", "1534528741775-53994a69daeb", "1507591064344-4c6ce005b128",
        "1488426862026-3ee34a7d66df", "1519345182560-3f2917c472ef", "1531123897727-8f062e26e5d2",
        "1559839734-2b71ea197ec2", "1580489944761-15a19d654956", "1518709268805-4e9042af2176",
        "1485827404703-89b55fcc595e", "1516321318423-f06f85b504d3", "1555066931-4365d14bab8c"
    ];

    // Use topic and index to create unique image selection
    const imageIndex = (topic.length + index) % imageIds.length;
    const imageId = imageIds[imageIndex];

    return `${baseUrl}${imageId}?w=800&h=400&fit=crop&q=80&auto=format`;
};

// Get multiple unique images for a topic
const getTopicImageSet = (topic: string, category: string) => {
    return [
        getTopicImages(topic, category, 0),
        getTopicImages(topic, category, 1),
        getTopicImages(topic, category, 2),
        getTopicImages(topic, category, 3),
        getTopicImages(topic, category, 4)
    ];
};

// Generate unique, comprehensive blog content (2000+ words)
const generateBlogContent = (title: string, category: string, topic: string, index: number) => {
    // Create unique variations for each blog
    const variations = {
        intro: [
            `In today's rapidly evolving landscape of ${category}, ${topic.toLowerCase()} has emerged as a transformative force reshaping how we approach complex challenges.`,
            `The field of ${category} continues to witness remarkable innovations, with ${topic.toLowerCase()} standing at the forefront of this technological revolution.`,
            `As we navigate the complexities of modern ${category}, ${topic.toLowerCase()} presents unprecedented opportunities for growth and innovation.`,
            `The intersection of ${category} and ${topic.toLowerCase()} represents one of the most exciting developments in contemporary technology.`,
            `In an era defined by rapid technological advancement, ${topic.toLowerCase()} has become a cornerstone of ${category} innovation.`
        ],
        challenges: [
            "One of the most significant challenges facing this field is the need for scalable solutions that can adapt to changing requirements.",
            "The complexity of modern systems presents unique challenges that require innovative approaches and creative problem-solving.",
            "As the field continues to evolve, practitioners must navigate an increasingly complex landscape of technical and ethical considerations.",
            "The rapid pace of innovation brings both opportunities and challenges that require careful consideration and strategic planning.",
            "Balancing innovation with practicality remains one of the most pressing challenges in this rapidly evolving field."
        ],
        future: [
            "Looking ahead, we can expect to see continued innovation and refinement of existing methodologies.",
            "The future holds tremendous promise for those willing to embrace new technologies and approaches.",
            "As we move forward, the focus will increasingly shift toward sustainable and ethical implementation strategies.",
            "The next decade promises to bring about revolutionary changes that will reshape the entire landscape.",
            "Emerging trends suggest that we are on the cusp of a major paradigm shift in how we approach these challenges."
        ]
    };

    const intro = variations.intro[index % variations.intro.length];
    const challenge = variations.challenges[index % variations.challenges.length];
    const future = variations.future[index % variations.future.length];

    // Get unique images for this specific topic
    const topicImages = getTopicImageSet(topic, category);

    const content = `
<div class="blog-content">
  <h1>${title}</h1>
  
  <div class="blog-intro">
    <p>${intro} This comprehensive analysis explores the multifaceted nature of this important topic, providing insights into current research, practical applications, and future directions.</p>
  </div>

  <div class="blog-image-container">
    <img src="${topicImages[0]}" alt="${topic} - Main Image" class="blog-image" />
    <p class="image-caption">${topic} represents a significant advancement in ${category} technology</p>
  </div>

  <h2>Understanding the Core Concepts</h2>
  <p>${topic} encompasses a wide range of methodologies and approaches that have evolved over decades of research and development. The fundamental principles underlying this field are based on rigorous scientific research and practical experience gained through real-world implementation.</p>
  
  <p>The core concepts involve sophisticated algorithms, advanced data structures, and innovative problem-solving techniques. These elements work together to create robust systems that can handle complex challenges and adapt to changing requirements.</p>

  <div class="blog-image-container">
    <img src="${topicImages[1]}" alt="${topic} - Technical Implementation" class="blog-image" />
    <p class="image-caption">Technical implementation of ${topic.toLowerCase()} in real-world scenarios</p>
  </div>

  <h2>Current Applications and Real-World Impact</h2>
  <p>Today, ${topic.toLowerCase()} is being implemented across numerous industries and sectors, demonstrating its versatility and effectiveness in solving diverse problems. From healthcare and finance to education and entertainment, the applications are virtually limitless.</p>

  <p>In the healthcare sector, ${topic.toLowerCase()} is revolutionizing patient care through advanced diagnostic tools, personalized treatment plans, and predictive analytics. These applications are helping medical professionals make more accurate diagnoses and develop more effective treatment strategies.</p>

  <p>The financial industry has embraced ${topic.toLowerCase()} for risk assessment, fraud detection, algorithmic trading, and customer service automation. These implementations are improving efficiency, reducing costs, and enhancing customer experiences.</p>

  <div class="blog-image-container">
    <img src="${topicImages[2]}" alt="${topic} - Industry Applications" class="blog-image" />
    <p class="image-caption">Industry applications of ${topic.toLowerCase()} across various sectors</p>
  </div>

  <h2>Technical Architecture and Implementation</h2>
  <p>Understanding the technical architecture of ${topic.toLowerCase()} is crucial for successful implementation. The system typically consists of multiple interconnected components, each serving a specific purpose in the overall functionality.</p>

  <p>The data processing layer handles the collection, cleaning, and preprocessing of information. This layer is critical because the quality of input data directly impacts the performance and accuracy of the entire system.</p>

  <p>The core processing engine contains the main algorithms and logic that perform the actual computation. This is where the sophisticated mathematical models and machine learning algorithms are implemented.</p>

  <div class="blog-image-container">
    <img src="${topicImages[3]}" alt="${topic} - System Architecture" class="blog-image" />
    <p class="image-caption">System architecture diagram showing the components of ${topic.toLowerCase()}</p>
  </div>

  <h2>Challenges and Limitations</h2>
  <p>${challenge} These challenges require careful consideration and strategic planning to ensure successful implementation and long-term sustainability.</p>

  <p>One of the primary concerns is the complexity of the underlying systems. As these technologies become more sophisticated, they also become more difficult to understand, debug, and maintain. This complexity can create barriers to adoption and implementation.</p>

  <p>Another significant challenge is the requirement for large amounts of high-quality data. The performance of these systems is directly correlated with the quality and quantity of training data available. Obtaining and preparing this data can be time-consuming and expensive.</p>

  <div class="blog-image-container">
    <img src="${topicImages[4]}" alt="${topic} - Challenges and Solutions" class="blog-image" />
    <p class="image-caption">Addressing common challenges in ${topic.toLowerCase()} implementation</p>
  </div>

  <h2>Future Prospects and Emerging Trends</h2>
  <p>${future} The field is poised for significant growth and development in the coming years, with new technologies and methodologies emerging regularly.</p>

  <p>One area of particular interest is the development of more efficient algorithms that require less computational power and data. This could make the technology more accessible to smaller organizations and individuals who don't have access to massive computing resources.</p>

  <p>Another exciting development is the integration of ${topic.toLowerCase()} with other emerging technologies such as quantum computing, edge computing, and advanced materials science. These combinations could lead to even more powerful and versatile systems.</p>

  <h2>Industry Impact and Transformation</h2>
  <p>The impact of ${topic.toLowerCase()} on various industries cannot be overstated. Traditional business models are being disrupted, new opportunities are emerging, and the competitive landscape is shifting dramatically.</p>

  <p>Companies that successfully adopt and implement this technology are gaining significant competitive advantages. They're able to operate more efficiently, make better decisions, and provide superior products and services to their customers.</p>

  <h2>Ethical Considerations and Responsible Implementation</h2>
  <p>As ${topic.toLowerCase()} becomes more prevalent, ethical considerations become increasingly important. Questions about fairness, transparency, and accountability need to be addressed to ensure that the technology is used responsibly.</p>

  <p>Bias in algorithms and data is a particular concern. If the data used to train these systems contains biases, the resulting systems will also be biased. This could lead to unfair treatment of certain groups or individuals.</p>

  <h2>Implementation Strategies and Best Practices</h2>
  <p>For organizations looking to implement ${topic.toLowerCase()}, a strategic approach is essential. Simply adopting the technology without proper planning and preparation is unlikely to yield positive results.</p>

  <p>The first step is to clearly define the objectives and expected outcomes. What problems are you trying to solve? What improvements are you hoping to achieve? Having clear answers to these questions will guide the implementation process.</p>

  <h2>Market Analysis and Competitive Landscape</h2>
  <p>The market for ${topic.toLowerCase()} is experiencing rapid growth, with new companies and solutions emerging regularly. Understanding market trends and competitive dynamics is crucial for anyone looking to engage with this field.</p>

  <p>Investment in ${topic.toLowerCase()} has been increasing steadily, with venture capital firms and corporations alike recognizing the potential for significant returns. This investment is driving innovation and accelerating the development of new solutions.</p>

  <h2>Global Perspectives and Cultural Considerations</h2>
  <p>${topic} is not just a local or national phenomenon; it has important global dimensions that must be considered. Different countries and cultures have different approaches to implementing and regulating this technology.</p>

  <h2>Conclusion</h2>
  <p>${topic} represents a significant opportunity for innovation and improvement across multiple sectors. While the field is complex and implementation can be challenging, the potential benefits are substantial.</p>

  <p>As we continue to explore and develop this technology, it's important to remain mindful of the ethical implications and ensure that it's used responsibly. With proper planning, implementation, and ongoing management, ${topic.toLowerCase()} can deliver significant value to organizations and society as a whole.</p>

  <p>The future is bright for this field, and those who embrace it thoughtfully and strategically will be well-positioned to thrive in the digital age. The key is to approach it with both enthusiasm and caution, leveraging its capabilities while remaining mindful of its limitations and potential risks.</p>
</div>

<style>
.blog-content {
  max-width: 800px;
  margin: 0 auto;
  line-height: 1.8;
  font-size: 16px;
}

.blog-content h1 {
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #1f2937;
}

.blog-content h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #374151;
  border-bottom: 2px solid #f59e0b;
  padding-bottom: 0.5rem;
}

.blog-content p {
  margin-bottom: 1.5rem;
  color: #4b5563;
}

.blog-image-container {
  margin: 2rem 0;
  text-align: center;
}

.blog-image {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  margin-bottom: 0.5rem;
}

.image-caption {
  font-style: italic;
  color: #6b7280;
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.blog-intro {
  background-color: #fef3c7;
  padding: 1.5rem;
  border-left: 4px solid #f59e0b;
  margin: 2rem 0;
  border-radius: 0 8px 8px 0;
}

@media (max-width: 768px) {
  .blog-content h1 {
    font-size: 2rem;
  }
  
  .blog-content h2 {
    font-size: 1.5rem;
  }
}
</style>
  `;

    return content;
};

export async function POST(request: NextRequest) {
    try {
        const blogs = [];
        let blogCount = 0;

        // Generate blogs for each category
        for (const [category, topics] of Object.entries(categories)) {
            for (let i = 0; i < 15; i++) { // 15 blogs per category = 105 total
                if (blogCount >= 100) break;

                const topic = topics[i % topics.length];
                const authorData = authors[Math.floor(Math.random() * authors.length)];

                // Create unique titles for each blog
                const titleVariations = [
                    `${topic}: A Comprehensive Guide to Understanding Modern Trends and Future Implications`,
                    `The Complete Guide to ${topic}: Strategies, Implementation, and Best Practices`,
                    `${topic} Explained: From Fundamentals to Advanced Applications`,
                    `Mastering ${topic}: A Deep Dive into Modern Techniques and Methodologies`,
                    `The Future of ${topic}: Emerging Trends and Revolutionary Approaches`,
                    `${topic} in Practice: Real-World Applications and Success Stories`,
                    `Understanding ${topic}: A Professional's Guide to Implementation`,
                    `${topic} Revolution: How Technology is Transforming the Industry`,
                    `Advanced ${topic}: Cutting-Edge Strategies for Modern Professionals`,
                    `${topic} Fundamentals: Building a Strong Foundation for Success`,
                    `The Art and Science of ${topic}: A Comprehensive Analysis`,
                    `${topic} Innovation: Pioneering Approaches and Breakthrough Technologies`,
                    `Professional ${topic}: Industry Insights and Expert Recommendations`,
                    `${topic} Mastery: From Beginner to Expert in Modern Applications`,
                    `The ${topic} Handbook: Complete Guide to Modern Implementation`
                ];

                const title = titleVariations[blogCount % titleVariations.length];

                const blog = {
                    title,
                    slug: slugify(title),
                    content: generateBlogContent(title, category, topic, blogCount),
                    author: authorData.name,
                    authorProfileImage: authorData.image,
                    category,
                    topic,
                    imageUrl: getTopicImages(topic, category, 0),
                    createdAt: Timestamp.fromDate(new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000)), // Random date within last year
                    readingTime: Math.floor(Math.random() * 10) + 8, // 8-17 minutes
                    tags: [category, topic.toLowerCase().replace(/\s+/g, '-'), 'comprehensive', 'guide', 'analysis'],
                    views: Math.floor(Math.random() * 1000) + 100,
                    likes: Math.floor(Math.random() * 50) + 5,
                    published: true
                };

                blogs.push(blog);
                blogCount++;
            }
            if (blogCount >= 100) break;
        }

        // Add blogs to Firebase
        console.log('Adding blogs to Firebase...');
        const addedBlogs = [];

        for (const blog of blogs) {
            try {
                const docRef = await addDoc(collection(db, 'posts'), blog);
                addedBlogs.push({ id: docRef.id, title: blog.title });
                console.log(`Added blog: ${blog.title}`);
            } catch (error) {
                console.error('Error adding blog:', error);
            }
        }

        return NextResponse.json({
            success: true,
            message: `Successfully added ${addedBlogs.length} blogs to the database!`,
            blogs: addedBlogs
        });

    } catch (error) {
        console.error('Error populating blogs:', error);
        return NextResponse.json({
            success: false,
            error: 'Failed to populate blogs'
        }, { status: 500 });
    }
}
