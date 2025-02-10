export const validateRole = (requiredRole) => {
    return (req, res, next) => {
      const { role } = req.user
  
      if (role !== requiredRole) {
        return res.status(403).json({
          success: false,
          message: `Acción no permitida para el rol ${role}`,
        })
      }
  
      next()
    }
  }