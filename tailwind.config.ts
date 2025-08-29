import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			screens: {
				'xs': '375px',
				'sm': '640px',
				'md': '768px',
				'lg': '1024px',
				'xl': '1280px',
				'2xl': '1536px',
			},
			fontFamily: {
				sans: ["Open Sans", "sans-serif"],
				inter: ["Inter", "sans-serif"],
				montserrat: ["Montserrat", "sans-serif"],
				'open-sans': ["Open Sans", "sans-serif"],
			},
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				tma: {
					// OFFICIAL TMA Brand Colors - STRICT COMPLIANCE
					'primary-blue': 'hsl(var(--tma-primary-blue))',     // #0D47A1
					'secondary-orange': 'hsl(var(--tma-secondary-orange))', // #FF6F00
					'accent-green': 'hsl(var(--tma-accent-green))',     // #2E7D32
					'navy-text': 'hsl(var(--tma-navy-text))',           // #26415A
					'neutral-bg': 'hsl(var(--tma-neutral-bg))',         // #F4F7FB
					
					// Legacy aliases for backward compatibility
					'deep-blue': 'hsl(var(--tma-primary-blue))',
					'bright-orange': 'hsl(var(--tma-secondary-orange))',
					'emerald-green': 'hsl(var(--tma-accent-green))',
					'light-grey': 'hsl(var(--tma-neutral-bg))',
					'charcoal-grey': 'hsl(var(--tma-navy-text))',
					
					// Extended colors using official palette
					'navy': 'hsl(var(--tma-navy-text))',
					'success': 'hsl(var(--tma-accent-green))',
					
					// Backward compatibility aliases
					blue: 'hsl(var(--tma-primary-blue))',
					gray: 'hsl(var(--tma-navy-text))',
					light: 'hsl(var(--tma-neutral-bg))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'slide-progress': {
					'0%': { left: '-40%' },
					'50%': { left: '60%' }, 
					'100%': { left: '100%' }
				},
				'fade-in': {
					'0%': {
						opacity: '0',
						transform: 'translateY(10px)'
					},
					'100%': {
						opacity: '1',
						transform: 'translateY(0)'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'slide-progress': 'slide-progress 1.2s infinite',
				'fade-in': 'fade-in 0.3s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
