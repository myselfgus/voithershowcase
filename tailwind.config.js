/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
  	extend: {
  		fontFamily: {
  			sans: [
  				'Inter',
  				'-apple-system',
  				'BlinkMacSystemFont',
  				'Segoe UI',
  				'Roboto',
  				'sans-serif'
  			],
  			display: [
  				'Inter',
  				'system-ui',
  				'sans-serif'
  			],
  			mono: [
  				'JetBrains Mono',
  				'Fira Code',
  				'Consolas',
  				'monospace'
  			]
  		},
  		fontSize: {
        'h1': ['clamp(2.5rem, 5vw, 4.5rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['clamp(2rem, 4vw, 3rem)', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'body': ['1.125rem', { lineHeight: '1.7' }],
  		},
  		spacing: {
        '40': '10rem',
  			'18': '4.5rem',
  			'72': '18rem',
  			'84': '21rem',
  			'96': '24rem',
  			'128': '32rem'
  		},
  		borderRadius: {
  			'4xl': '2rem',
  			'5xl': '2.5rem',
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			ring: 'hsl(var(--ring))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			input: 'hsl(var(--input))',
        'healthos-porcelain': 'hsl(var(--healthos-porcelain))',
        'healthos-ink': 'hsl(var(--healthos-ink))',
        'healthos-ice': 'hsl(var(--healthos-ice))',
        'healthos-prism-start': 'hsl(var(--healthos-prism-start))',
        'healthos-prism-end': 'hsl(var(--healthos-prism-end))',
  		},
  		boxShadow: {
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
        'neumo-inset': 'inset 5px 5px 10px #d8dade, inset -5px -5px 10px #ffffff',
        'prism-glow': '0 0 20px -5px hsl(var(--healthos-prism-start) / 0.5), 0 0 30px -10px hsl(var(--healthos-prism-end) / 0.4)',
  		},
  		keyframes: {
  			'purposeful-fade-in': {
  				'0%': { opacity: '0', transform: 'translateY(10px)' },
  				'100%': { opacity: '1', transform: 'translateY(0)' }
  			},
  			'accordion-down': {
  				from: { height: '0' },
  				to: { height: 'var(--radix-accordion-content-height)' }
  			},
  			'accordion-up': {
  				from: { height: 'var(--radix-accordion-content-height)' },
  				to: { height: '0' }
  			}
  		},
  		animation: {
        'purposeful': 'purposeful-fade-in 300ms ease-out',
  			'accordion-down': 'accordion-down 0.2s ease-out',
  			'accordion-up': 'accordion-up 0.2s ease-out'
  		},
  		backgroundImage: {
        'gradient-prism': 'linear-gradient(135deg, hsl(var(--healthos-prism-start)) 0%, hsl(var(--healthos-prism-end)) 100%)',
  		}
  	}
  },
  plugins: [require("tailwindcss-animate")]
}