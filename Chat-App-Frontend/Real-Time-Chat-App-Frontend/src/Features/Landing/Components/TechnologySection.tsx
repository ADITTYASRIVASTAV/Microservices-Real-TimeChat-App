import { motion } from 'framer-motion'
import { Code2, Server, HardDrive } from 'lucide-react'

export const TechnologySection = () => {
  const stack = [
    {
      category: 'Frontend',
      icon: Code2,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
      techs: ['React 19', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Redux Toolkit'],
    },
    {
      category: 'Backend',
      icon: Server,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
      techs: ['Java 21', 'Spring Boot 3', 'Spring Security', 'Spring Cloud Gateway', 'STOMP WebSockets'],
    },
    {
      category: 'Infrastructure & Data',
      icon: HardDrive,
      color: 'text-purple-500 bg-purple-500/10 border-purple-500/20',
      techs: ['Apache Kafka', 'PostgreSQL', 'Docker', 'Redis Cache', 'RESTful APIs'],
    },
  ]

  return (
    <section id="technology" className="py-24 bg-white dark:bg-gray-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            Powered by modern technology.
          </h2>
          <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
            Engineered using industry-standard tools and frameworks for maximum performance and stability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {stack.map((group, idx) => {
            const Icon = group.icon
            return (
              <motion.div
                key={group.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.1 }}
                className="p-6 rounded-2xl bg-gray-50/60 dark:bg-gray-900/60 border border-gray-200/80 dark:border-gray-800/80 shadow-sm"
              >
                <div className={`inline-flex p-3 rounded-xl border ${group.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">{group.category}</h3>

                <div className="flex flex-wrap gap-2">
                  {group.techs.map((tech) => (
                    <span
                      key={tech}
                      className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border border-gray-200 dark:border-gray-700 shadow-2xs"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default TechnologySection
