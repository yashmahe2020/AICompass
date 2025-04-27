import { Search, Star, MessageSquare, TrendingUp } from "lucide-react"

const features = [
  {
    icon: <Search className="h-8 w-8 text-yellow-400" />,
    title: "Discover AI Tools",
    description: "Find the perfect AI tools for your specific needs with our curated collection.",
  },
  {
    icon: <Star className="h-8 w-8 text-yellow-400" />,
    title: "Expert Reviews",
    description: "Read detailed reviews from AI experts and practitioners in the field.",
  },
  {
    icon: <MessageSquare className="h-8 w-8 text-yellow-400" />,
    title: "Community Insights",
    description: "Learn from real user experiences and recommendations from the community.",
  },
  {
    icon: <TrendingUp className="h-8 w-8 text-yellow-400" />,
    title: "Stay Updated",
    description: "Keep track of the latest AI tools and trends in the rapidly evolving landscape.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-20 bg-black text-white">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-yellow-400">Key Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-900 p-6 rounded-lg border border-gray-800 hover:border-yellow-400/50 transition-all">
              <div className="mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

