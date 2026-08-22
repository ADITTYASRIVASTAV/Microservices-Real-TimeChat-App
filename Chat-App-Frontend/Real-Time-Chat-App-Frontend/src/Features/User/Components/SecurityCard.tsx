import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Shield, RefreshCw, AlertTriangle, Loader2 } from 'lucide-react'
import { useE2EE } from '@/Features/E2EE/Hooks/useE2EE'

const SecurityCard = () => {
  console.log('SecurityCard rendered')
  const { hasKeys, isRotating, keyVersion, rotateKeys } = useE2EE()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <Card className="mt-6 rounded-2xl border-green-200 dark:border-green-800 shadow-sm bg-green-50/50 dark:bg-green-950/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <Shield className="h-5 w-5 text-green-500" />
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Encryption Keys
            </span>
            <Badge
              className={
                hasKeys
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border-green-200 dark:border-green-800'
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 border-gray-200 dark:border-gray-700'
              }
            >
              {hasKeys ? 'Active' : 'Not Ready'}
            </Badge>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Key Version
            </span>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {keyVersion || 0}
            </span>
          </div>

          <Button
            variant="outline"
            onClick={rotateKeys}
            disabled={isRotating}
            className="w-full border-orange-300 text-orange-600 hover:bg-orange-50 dark:border-orange-800 dark:text-orange-400 dark:hover:bg-orange-900/20"
          >
            {isRotating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Rotating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Rotate Keys
              </>
            )}
          </Button>

          <div className="flex items-start gap-2 text-xs text-yellow-600 dark:text-yellow-400">
            <AlertTriangle className="h-4 w-4 flex-shrink-0 mt-0.5" />
            <p>Rotating keys will make previous messages unreadable.</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SecurityCard