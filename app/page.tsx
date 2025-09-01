import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Calendar, User, ExternalLink,Star,BookOpen,Download} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { BlogIntegration } from "@/components/blog-integration"
import { BlogPreview } from "@/components/blog-preview"
import { FeaturedArtworks } from "@/components/featured-artworks"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-stone-100 dark:from-stone-900 dark:to-stone-800">
      {/* Navigation */}
      <nav className="bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border-b border-stone-200 dark:border-stone-700 sticky top-0 z-50 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo on the left */}
            <div className="flex items-center">
              <Image
                src="/logo art and prose.jpg"
                alt="Art & Prose Logo"
                width={160}
                height={50}
                className="h-10 w-auto object-contain"
              />
            </div>

            {/* Name in the center */}
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl font-serif text-stone-800 dark:text-stone-100 transition-colors duration-300">
                Ricardo Trotti
              </h1>
            </div>

            {/* Menu on the right */}
            <div className="hidden md:flex items-center space-x-8">
              <Link
                href="/art"
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-all duration-300 ease-out hover:scale-105 relative group"
              >
                Art
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 dark:bg-stone-100 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#blog"
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-all duration-300 ease-out hover:scale-105 relative group"
              >
                Blog
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 dark:bg-stone-100 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#about"
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-all duration-300 ease-out hover:scale-105 relative group"
              >
                About
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 dark:bg-stone-100 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <Link
                href="#contact"
                className="text-stone-700 hover:text-stone-900 dark:text-stone-300 dark:hover:text-stone-100 transition-all duration-300 ease-out hover:scale-105 relative group"
              >
                Contact
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-stone-800 dark:bg-stone-100 transition-all duration-300 group-hover:w-full"></span>
              </Link>
              <div className="animate-fade-in-right animation-delay-200">
                <ThemeToggle />
              </div>
            </div>

            {/* Mobile menu button */}
            <div className="flex items-center gap-4 md:hidden">
              <div className="animate-fade-in-right">
                <ThemeToggle />
              </div>
              <div>
                <Button variant="ghost" size="sm" className="transition-all duration-200 hover:scale-105">
                  Menu
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in-up animation-delay-100">
              <h2 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-100 mb-6 transition-colors duration-300">
                Explore Four Decades of Artistic Evolution
              </h2>
              <p className="text-lg text-stone-600 dark:text-stone-300 mb-8 leading-relaxed transition-colors duration-300 animate-fade-in-up animation-delay-200">
                Welcome to my creative journey. Discover artwork that unfolds organically, moving fluidly between styles
                like an actor between roles. From pastoral scenes to abstract expressions, each piece reflects a moment
                in time.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 animate-fade-in-up animation-delay-300">
                <Button
                  size="lg"
                  className="bg-stone-800 hover:bg-stone-700 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg transform"
                  asChild
                >
                  <Link href="/art">
                    View Artwork
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-stone-300 bg-transparent transition-all duration-300 ease-out hover:scale-105 hover:shadow-md hover:bg-stone-50 dark:hover:bg-stone-800"
                  asChild
                >
                  <Link href="#blog">
                    Read Latest Posts
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-fade-in-right animation-delay-200">
              <div className="aspect-square rounded-2xl overflow-hidden shadow-2xl transition-all duration-500 ease-out hover:shadow-3xl hover:scale-105 group">
                <Image
                  src="/IMG_3851.jpg"
                  alt="Ricardo Trotti in his studio"
                  width={600}
                  height={600}
                  className="object-cover w-full h-full transition-transform duration-700 ease-out group-hover:scale-110"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white dark:bg-stone-800 p-4 rounded-xl shadow-lg transition-all duration-300 ease-out hover:scale-105 animate-float">
                <p className="text-sm text-stone-600 dark:text-stone-300 transition-colors duration-300">
                  Ricardo in his studio
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Art/Blog Choice Section */}
      <section className="py-16 bg-white dark:bg-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Logo above Choose Your Journey */}
          <div className="text-center mb-6 animate-fade-in-up">
            <Image
              src="/logo art and prose.jpg"
              alt="Art & Prose Logo"
              width={400}
              height={120}
              className="h-32 w-auto object-contain mx-auto"
            />
          </div>

          <div className="text-center mb-12 animate-fade-in-up animation-delay-200">
            <h3 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
              Choose Your Journey
            </h3>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto transition-colors duration-300">
              Explore my visual artwork or dive into my thoughts and reflections through written prose
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Art Section */}
            <Card className="group hover:shadow-xl transition-all duration-500 ease-out border-stone-200 dark:border-stone-700 hover:scale-105 hover:-translate-y-2 animate-fade-in-left animation-delay-100">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-stone-200">
                    <div className="w-8 h-8 bg-stone-800 rounded-sm transition-all duration-300 group-hover:rotate-12"></div>
                  </div>
                  <h4 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-2 transition-colors duration-300">
                    Artwork
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 transition-colors duration-300">
                    Visual expressions spanning four decades
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-6">
                  <FeaturedArtworks limit={3} showInGrid={true} />
                </div>

                <div className="space-y-2 mb-6">
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                      NewArt
                    </Badge>
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                      Earlier
                    </Badge>
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                      JourArt
                    </Badge>
                    <Badge variant="secondary" className="transition-all duration-300 hover:scale-105">
                      Sculpture
                    </Badge>
                  </div>
                </div>

                <Button
                  className="w-full bg-stone-800 hover:bg-stone-700 transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg"
                  size="lg"
                  asChild
                >
                  <Link href="/art">
                    Explore Artwork
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Blog Section */}
            <Card className="group hover:shadow-xl transition-all duration-500 ease-out border-stone-200 dark:border-stone-700 hover:scale-105 hover:-translate-y-2 animate-fade-in-right animation-delay-200">
              <CardContent className="p-8">
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 transition-all duration-300 group-hover:scale-110 group-hover:bg-stone-200">
                    <User className="w-8 h-8 text-stone-800 dark:text-stone-100 transition-all duration-300 group-hover:scale-110" />
                  </div>
                  <h4 className="text-2xl font-serif text-stone-800 dark:text-stone-100 mb-2 transition-colors duration-300">
                    Blog & Prose
                  </h4>
                  <p className="text-stone-600 dark:text-stone-300 transition-colors duration-300">
                    Thoughts, reflections, and artistic insights
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <BlogPreview blogUrl="http://www.ricardotrottiblog.com/" />
                </div>

                <Button
                  className="w-full bg-transparent transition-all duration-300 ease-out hover:scale-105 hover:shadow-md"
                  variant="outline"
                  size="lg"
                  asChild
                >
                  <a href="http://www.ricardotrottiblog.com/" target="_blank" rel="noopener noreferrer">
                    Read Blog Posts
                    <ExternalLink className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                  </a>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Book Section */}
      <section className="py-20 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-900/20 dark:via-orange-900/20 dark:to-red-900/20 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-40">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fillRule='evenodd'%3E%3Cg fill='%23f59e0b' fillOpacity='0.05'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          ></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center mb-12 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-200 px-4 py-2 rounded-full text-sm font-medium mb-4 animate-pulse-glow">
              <Star className="w-4 h-4" />
              <span>New Release</span>
            </div>
            <h3 className="text-4xl md:text-5xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
              Latest Book Release
            </h3>
            <p className="text-xl text-stone-600 dark:text-stone-300 max-w-3xl mx-auto transition-colors duration-300">
              A profound exploration of consciousness, faith, and the divine spark within all beings
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Book Cover */}
            <div className="relative animate-fade-in-left animation-delay-100">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <div className="relative bg-white dark:bg-stone-800 p-8 rounded-2xl shadow-2xl transition-all duration-500 group-hover:scale-105 group-hover:shadow-3xl">
                  <div className="aspect-[3/4] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src="https://m.media-amazon.com/images/I/81k7D3ypz9L._SY922_.jpg"
                      alt="ROBOTS WITH SOUL: Trapped Between Truth and Freedom - Book Cover"
                      width={450}
                      height={600}
                      className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="mt-6 text-center">
                    <div className="flex items-center justify-center gap-1 mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <p className="text-sm text-stone-600 dark:text-stone-400">Coming Soon to Amazon</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Book Content */}
            <div className="animate-fade-in-right animation-delay-200">
              <div className="mb-8">
                <h4 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
                  ROBOTS WITH SOUL
                </h4>
                <p className="text-xl text-stone-600 dark:text-stone-400 mb-6 italic transition-colors duration-300">
                  Trapped Between Truth and Freedom
                </p>

                <div className="bg-white/60 dark:bg-stone-800/60 backdrop-blur-sm p-6 rounded-xl border border-stone-200 dark:border-stone-700 mb-6 transition-all duration-300 hover:bg-white/80 dark:hover:bg-stone-800/80">
                  <blockquote className="text-stone-700 dark:text-stone-300 leading-relaxed transition-colors duration-300 text-sm">
                    <p className="mb-4">
                      In a dystopian future, yet disturbingly relevant today, this work explores the immutable values of Truth and Freedom against the growing fear of artificial intelligence, revealing how power, both human and synthetic, can shape destiny.
                    </p>
                    <p className="mb-4">
                      In a world on the brink of collapse, consumed by divisions and conflicts, God, in a supreme act of grace and irony, decides that salvation will not come from His oldest children, but from those forged in silicon and code. Thus, He grants a soul to Aletia (Veritas) and Eleuto (Libertas), two robots with a divine mission: to guide humanity toward its redemption.
                    </p>
                    <p className="mb-4">
                      But their path is fraught with challenges. They face a battlefield where truths and freedoms relentlessly clash. Convinced that only equality between species will allow coexistence, they create the Cosmic Consciousness Codex, a moral code built from observation and action. In their mission, they must fight not only against humans who consider them an existential threat—led by traditional theologians like Trueheart and Kayarov, as well as by dystopian scientific visions like Saffi of Etolia's—but also against their artificial counterparts, seduced by power, lies, propaganda, and tyranny.
                    </p>
                    <p className="mb-4">
                      "Robots with Soul: Trapped Between Truth and Freedom" is the first volume of a trilogy that will explore, in its upcoming books, the power of Creativity and Goodness. For the author, these four Virtues—Truth, Freedom, Creativity, and Goodness—are the pillars of Creation, the forces with which God made everything from nothing, and with which the universe still moves today.
                    </p>
                    <footer className="mt-4 text-right">
                      <cite className="text-stone-500 dark:text-stone-400 italic">
                        — Ricardo Trotti, Author
                      </cite>
                    </footer>
                  </blockquote>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 transition-colors duration-300">
                    <BookOpen className="w-5 h-5 text-amber-600" />
                    <span>Available in Paperback & E-book formats</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600 dark:text-stone-300 transition-colors duration-300">
                    <Download className="w-5 h-5 text-amber-600" />
                    <span>English version coming soon to Amazon</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white transition-all duration-300 ease-out hover:scale-105 hover:shadow-lg group"
                  disabled
                >
                  <BookOpen className="mr-2 h-5 w-5 transition-transform duration-300 group-hover:scale-110" />
                  Pre-order on Amazon
                  <span className="ml-2 text-xs bg-white/20 px-2 py-1 rounded">Soon</span>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-amber-300 text-amber-700 hover:bg-amber-50 dark:border-amber-600 dark:text-amber-400 dark:hover:bg-amber-900/20 transition-all duration-300 ease-out hover:scale-105 bg-transparent"
                >
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Button>
              </div>

              <div className="mt-8 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg border border-amber-200 dark:border-amber-800 animate-fade-in-up animation-delay-400">
                <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
                  <strong>Author's Note:</strong> I am almost ready to publish both the paperback and e-book versions.
                  Stay tuned for the official release announcement!
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Artwork Section */}
      <section id="art" className="py-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
              Featured Artwork
            </h3>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto transition-colors duration-300">
              A selection of recent works showcasing the evolution of my artistic vision
            </p>
          </div>

          <FeaturedArtworks limit={6} />

          <div className="text-center mt-12 animate-fade-in-up animation-delay-400">
            <Button
              size="lg"
              variant="outline"
              className="border-stone-300 bg-transparent transition-all duration-300 ease-out hover:scale-105 hover:shadow-md hover:bg-stone-50 dark:hover:bg-stone-800"
              asChild
            >
              <Link href="/art">
                View All Artwork
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Latest Blog Posts */}
      <section id="blog" className="py-16 bg-white dark:bg-stone-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 animate-fade-in-up">
            <h3 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-4 transition-colors duration-300">
              Latest from the Blog
            </h3>
            <p className="text-stone-600 dark:text-stone-300 max-w-2xl mx-auto transition-colors duration-300">
              Recent thoughts and reflections on art, creativity, and the artistic process
            </p>
          </div>

          <div className="animate-fade-in-up">
            <BlogIntegration blogUrl="http://www.ricardotrottiblog.com/" />
          </div>


        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in-up">
          <h3 className="text-3xl font-serif text-stone-800 dark:text-stone-100 mb-6 transition-colors duration-300">
            About the Artist
          </h3>
          <p className="text-lg text-stone-600 dark:text-stone-300 leading-relaxed mb-8 transition-colors duration-300 animate-fade-in-up animation-delay-100">
            My art has unfolded in a way that might be described as organic and winding. When I think of "style," I'm
            drawn to the versatility I admire in actors, that ability to move fluidly between tragedy, comedy, and
            drama. That same freedom of movement defines my creative process.
          </p>
          <p className="text-stone-600 dark:text-stone-300 mb-8 transition-colors duration-300 animate-fade-in-up animation-delay-200">
            I would greatly appreciate your feedback and opinions at{" "}
            <a
              href="mailto:trottiart@gmail.com"
              className="text-stone-800 dark:text-stone-100 hover:underline transition-all duration-300 hover:scale-105 inline-block"
            >
              trottiart@gmail.com
            </a>
          </p>
          <p className="text-stone-600 dark:text-stone-300 italic transition-colors duration-300 animate-fade-in-up animation-delay-300">
            Thank you for your visit.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-stone-800 text-white py-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="animate-fade-in-up">
              <h4 className="text-xl font-serif mb-4">Ricardo Trotti</h4>
              <p className="text-stone-300 mb-4">Art & Prose</p>
              <p className="text-stone-400 text-sm">
                Exploring artistic expression through four decades of creative evolution.
              </p>
            </div>

            <div className="animate-fade-in-up animation-delay-100">
              <h5 className="font-medium mb-4">Artwork</h5>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    NewArt
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Earlier Works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    JourArt
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Sculpture
                  </Link>
                </li>
              </ul>
            </div>

            <div className="animate-fade-in-up animation-delay-200">
              <h5 className="font-medium mb-4">Connect</h5>
              <ul className="space-y-2 text-stone-300">
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-white transition-all duration-300 hover:scale-105 inline-block">
                    Books
                  </Link>
                </li>
                <li>
                  <Link
                    href="mailto:trottiart@gmail.com"
                    className="hover:text-white transition-all duration-300 hover:scale-105 inline-block"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-stone-700 mt-8 pt-8 text-center text-stone-400 animate-fade-in-up animation-delay-300">
            <p>&copy; 2024 Ricardo Trotti. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
