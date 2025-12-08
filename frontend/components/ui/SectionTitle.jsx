import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

export default function SectionTitle({ title, subtitle, align = 'center' }) {
  return (
    <Box sx={{ textAlign: align, mb: 5 }}>
      <Typography
        variant="h3"
        component="h2"
        sx={{
          fontWeight: 700,
          color: 'text.primary',
          mb: subtitle ? 1.5 : 0,
          position: 'relative',
          display: 'inline-block',
          '&::after': {
            content: '""',
            position: 'absolute',
            bottom: -12,
            left: align === 'center' ? '50%' : 0,
            transform: align === 'center' ? 'translateX(-50%)' : 'none',
            width: 60,
            height: 4,
            borderRadius: 2,
            bgcolor: 'secondary.main',
          },
        }}
      >
        {title}
      </Typography>
      {subtitle && (
        <Typography
          variant="body1"
          sx={{
            color: 'text.secondary',
            maxWidth: 600,
            mx: align === 'center' ? 'auto' : 0,
            mt: 3,
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  )
}
