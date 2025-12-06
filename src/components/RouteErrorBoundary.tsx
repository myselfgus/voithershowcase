import { useRouteError, isRouteErrorResponse, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export function RouteErrorBoundary() {
  const error = useRouteError();
  const navigate = useNavigate();

  let errorMessage = 'Ocorreu um erro inesperado.';
  let errorCode = '500';

  if (isRouteErrorResponse(error)) {
    errorCode = String(error.status);
    if (error.status === 404) {
      errorMessage = 'A página que você está procurando não foi encontrada.';
    } else if (error.status === 401) {
      errorMessage = 'Você não tem permissão para acessar esta página.';
    } else if (error.status === 503) {
      errorMessage = 'O serviço está temporariamente indisponível.';
    } else {
      errorMessage = error.statusText || errorMessage;
    }
  } else if (error instanceof Error) {
    errorMessage = error.message;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-healthos-porcelain dark:bg-healthos-ink p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full text-center"
      >
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-24 h-24 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center"
        >
          <span className="text-4xl font-bold text-red-500">{errorCode}</span>
        </motion.div>

        <h1 className="text-2xl font-bold mb-2 text-healthos-ink dark:text-healthos-porcelain">
          Oops! Algo deu errado
        </h1>

        <p className="text-muted-foreground mb-8">
          {errorMessage}
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-lg border border-healthos-ice hover:bg-healthos-ice/20 transition-colors text-healthos-ink dark:text-healthos-porcelain"
          >
            Voltar
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/dashboard')}
            className="px-6 py-2.5 rounded-lg bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white hover:from-violet-600 hover:to-fuchsia-600 transition-colors"
          >
            Ir para o Dashboard
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
